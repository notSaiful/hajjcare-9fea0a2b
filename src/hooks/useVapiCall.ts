import { useState, useRef, useCallback, useEffect } from "react";
import VapiSdk from "@vapi-ai/web";
import type { AssistantOverrides } from "@vapi-ai/web";

// VAPI web call hook — VAPI owns STT (Deepgram) + LLM (GPT-4o) + transport + barge-in;
// the assistant's TTS leg is managed by Vapi. This hook only drives the browser side: start/end
// the call, surface speaking/listening/transcript state.
//
// Ported from the Agentive website useVapiCall hook, with role labels adapted to
// "HajjCare" / "You" and startCall taking the public config fetched from the
// vapi-config edge function (origin-restricted, no sign-in required) right before starting.

type CallStatus = "idle" | "connecting" | "active" | "ended" | "error";
const MAX_TRANSCRIPT_ENTRIES = 100;
const MAX_TRANSCRIPT_ENTRY_LENGTH = 2_000;
const VOICE_CONNECT_TIMEOUT_MS = 30_000;

const voiceLog = (event: string, details: Record<string, unknown> = {}) =>
  console.info("[zoya-voice]", { event, at: new Date().toISOString(), ...details });

interface UseVapiCallReturn {
  status: CallStatus;
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  startCall: (publicKey: string, assistantId: string, assistantOverrides?: AssistantOverrides) => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  error: string | null;
}

interface ConvoEntry {
  role: "HajjCare" | "You";
  text: string;
  final: boolean;
}

// Minimal typing for VAPI message payloads (the SDK emits loosely-typed events).
interface VapiTranscriptMessage {
  type?: string;
  role?: string;
  transcript?: string;
  transcriptType?: string;
}

interface VapiFailureEvent {
  error?: unknown;
  message?: unknown;
  errorMsg?: unknown;
  context?: unknown;
  status?: unknown;
}

// @vapi-ai/web is published as CommonJS. Vite 8's Rolldown pipeline can expose
// its default export as either the constructor itself or `{ default: constructor
// }`, depending on dependency pre-bundling. Normalize both shapes so a browser
// call never fails before it reaches VAPI.
const VapiConstructor = (
  typeof VapiSdk === "function"
    ? VapiSdk
    : (VapiSdk as unknown as { default?: typeof VapiSdk }).default
) as typeof VapiSdk | undefined;

export function getVapiErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  if (error && typeof error === "object") {
    const payload = error as VapiFailureEvent;
    if (typeof payload.message === "string" && payload.message) return payload.message;
    if (typeof payload.errorMsg === "string" && payload.errorMsg) return payload.errorMsg;
    if (typeof payload.error === "string" && payload.error) return payload.error;
    if (payload.error && typeof payload.error === "object") {
      const nested = payload.error as VapiFailureEvent;
      if (typeof nested.message === "string" && nested.message) return nested.message;
      if (typeof nested.errorMsg === "string" && nested.errorMsg) return nested.errorMsg;
      if (typeof nested.error === "string" && nested.error) return nested.error;
    }
    if (payload.context && typeof payload.context === "object") {
      const context = payload.context as VapiFailureEvent;
      if (typeof context.message === "string" && context.message) return context.message;
      if (typeof context.errorMsg === "string" && context.errorMsg) return context.errorMsg;
    }
    if (typeof payload.status === "number") return `Voice provider request failed (status ${payload.status}).`;
  }
  return "Voice provider did not return an error detail. Please try again.";
}

export function useVapiCall(): UseVapiCallReturn {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vapiRef = useRef<InstanceType<typeof VapiSdk> | null>(null);
  const connectTimeoutRef = useRef<number | null>(null);
  // Tracked as role-tagged entries so partial transcript fragments update in-place
  // (VAPI emits many partials per utterance then one final — append-only would repeat).
  const convoRef = useRef<ConvoEntry[]>([]);

  const renderConvo = useCallback(() => {
    setTranscript(
      convoRef.current
        .filter((e) => e.text.trim().length > 0)
        .map((e) => `${e.role}: ${e.text}`)
        .join("\n")
    );
  }, []);

  const clearConnectTimeout = useCallback(() => {
    if (connectTimeoutRef.current !== null) {
      window.clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
  }, []);

  const startCall = useCallback(
    async (publicKey: string, assistantId: string, assistantOverrides?: AssistantOverrides) => {
      if (status === "connecting" || status === "active") return;

      setError(null);
      setStatus("connecting");
      voiceLog("voice_initializing");
      setTranscript("");
      convoRef.current = [];

      try {
        if (typeof VapiConstructor !== "function") {
          throw new Error("Voice call library failed to load. Please refresh and try again.");
        }

        // A previous Vapi instance can retain Daily/WebRTC resources after a failed
        // or manually-ended call. Dispose it before creating a fresh connection.
        if (vapiRef.current) {
          vapiRef.current.removeAllListeners();
          void vapiRef.current.stop();
          vapiRef.current = null;
        }

        // Daily/WebRTC needs to explicitly include the microphone prompt on
        // mobile WebViews. Android's native WebChromeClient then grants the
        // capture request without reloading or interrupting this call.
        const vapi = new VapiConstructor(publicKey, undefined, {
          alwaysIncludeMicInPermissionPrompt: true,
        });
        vapiRef.current = vapi;

        const fail = (err: unknown) => {
          if (vapiRef.current !== vapi) return;
          clearConnectTimeout();
          const message = getVapiErrorMessage(err);
          console.error("[zoya-voice] provider_error", err);
          setError(message);
          setStatus("error");
          setIsSpeaking(false);
          setIsListening(false);
          setIsMuted(false);
          vapiRef.current = null;
          vapi.removeAllListeners();
          void vapi.stop();
        };

        connectTimeoutRef.current = window.setTimeout(() => {
          fail(new Error("Voice connection timed out after 30 seconds. Please check your internet connection and try again."));
        }, VOICE_CONNECT_TIMEOUT_MS);

        vapi.on("call-start", () => {
          clearConnectTimeout();
          voiceLog("voice_connected");
          setStatus("active");
          setIsListening(true);
        });

        vapi.on("call-end", () => {
          if (vapiRef.current !== vapi) return;
          clearConnectTimeout();
          voiceLog("conversation_finished");
          setStatus("ended");
          setIsSpeaking(false);
          setIsListening(false);
          setIsMuted(false);
          vapiRef.current = null;
        });

        vapi.on("speech-start", () => {
          voiceLog("microphone_audio_received");
          setIsSpeaking(true);
          setIsListening(false);
        });

        vapi.on("speech-end", () => {
          voiceLog("speech_to_text_completed");
          setIsSpeaking(false);
          setIsListening(true);
        });

        vapi.on("message", (message: VapiTranscriptMessage) => {
          const isTranscript =
            message.type === "transcript" ||
            message.type === "transcript[transcriptType='final']";
          if (!isTranscript || !message.transcript) return;
          voiceLog(message.role === "assistant" ? "ai_response_received" : "transcript_received", { final: message.transcriptType === "final" });

          const role: ConvoEntry["role"] = message.role === "assistant" ? "HajjCare" : "You";
          const text = message.transcript.slice(0, MAX_TRANSCRIPT_ENTRY_LENGTH);
          const isFinal =
            message.transcriptType === "final" ||
            message.type === "transcript[transcriptType='final']";

          const convo = convoRef.current;
          const last = convo[convo.length - 1];

          if (isFinal) {
            if (last && last.role === role && !last.final) {
              last.text = text;
              last.final = true;
            } else {
              convo.push({ role, text, final: true });
            }
          } else {
            if (last && last.role === role && !last.final) {
              last.text = text;
            } else {
              convo.push({ role, text, final: false });
            }
          }
          if (convo.length > MAX_TRANSCRIPT_ENTRIES) {
            convo.splice(0, convo.length - MAX_TRANSCRIPT_ENTRIES);
          }
          renderConvo();
        });

        vapi.on("error", fail);
        // Some SDK versions put the useful reason on the event itself rather
        // than `event.error`; retain it so users and logs get an actionable
        // provider response instead of a misleading generic failure.
        vapi.on("call-start-failed", (event) => fail(event?.error ?? event));

        await vapi.start(assistantId, assistantOverrides);
      } catch (err) {
        clearConnectTimeout();
        const message = getVapiErrorMessage(err);
        console.error("[zoya-voice] voice_initialization_failed", err);
        setError(message);
        setStatus("error");
        setIsSpeaking(false);
        setIsListening(false);
        setIsMuted(false);
        vapiRef.current?.removeAllListeners();
        void vapiRef.current?.stop();
        vapiRef.current = null;
      }
    },
    [status, renderConvo, clearConnectTimeout]
  );

  const endCall = useCallback(() => {
    clearConnectTimeout();
    const vapi = vapiRef.current;
    vapiRef.current = null;
    vapi?.removeAllListeners();
    void vapi?.stop();
    setStatus("ended");
    setIsSpeaking(false);
    setIsListening(false);
    setIsMuted(false);
  }, [clearConnectTimeout]);

  const toggleMute = useCallback(() => {
    const vapi = vapiRef.current;
    if (vapi) {
      const next = !vapi.isMuted();
      vapi.setMuted(next);
      setIsMuted(next);
    }
  }, []);

  useEffect(() => {
    return () => {
      const vapi = vapiRef.current;
      clearConnectTimeout();
      vapiRef.current = null;
      vapi?.removeAllListeners();
      void vapi?.stop();
    };
  }, [clearConnectTimeout]);

  return {
    status,
    isSpeaking,
    isListening,
    transcript,
    startCall,
    endCall,
    toggleMute,
    isMuted,
    error,
  };
}
