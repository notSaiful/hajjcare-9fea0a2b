import { useState, useRef, useCallback, useEffect } from "react";
import Vapi from "@vapi-ai/web";

// VAPI web call hook — VAPI owns STT (Deepgram) + LLM (GPT-4o) + transport + barge-in;
// the assistant's TTS leg is Rumik `muga` via the custom-voice proxy edge function
// (supabase/functions/voice-tts). This hook only drives the browser side: start/end
// the call, surface speaking/listening/transcript state.
//
// Ported from the Agentive website useVapiCall hook, with role labels adapted to
// "HajjCare" / "You" and startCall taking the public config fetched from the
// vapi-config edge function (auth-gated) right before starting.

type CallStatus = "idle" | "connecting" | "active" | "ended" | "error";

interface UseVapiCallReturn {
  status: CallStatus;
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  startCall: (publicKey: string, assistantId: string) => void;
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

export function useVapiCall(): UseVapiCallReturn {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vapiRef = useRef<Vapi | null>(null);
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

  const startCall = useCallback(
    (publicKey: string, assistantId: string) => {
      if (status === "connecting" || status === "active") return;

      setError(null);
      setStatus("connecting");
      setTranscript("");
      convoRef.current = [];

      try {
        const vapi = new Vapi(publicKey);
        vapiRef.current = vapi;

        vapi.on("call-start", () => {
          setStatus("active");
          setIsListening(true);
        });

        vapi.on("call-end", () => {
          setStatus("ended");
          setIsSpeaking(false);
          setIsListening(false);
        });

        vapi.on("speech-start", () => {
          setIsSpeaking(true);
          setIsListening(false);
        });

        vapi.on("speech-end", () => {
          setIsSpeaking(false);
          setIsListening(true);
        });

        vapi.on("message", (message: VapiTranscriptMessage) => {
          const isTranscript =
            message.type === "transcript" ||
            message.type === "transcript[transcriptType='final']";
          if (!isTranscript || !message.transcript) return;

          const role: ConvoEntry["role"] = message.role === "assistant" ? "HajjCare" : "You";
          const text: string = message.transcript;
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
          renderConvo();
        });

        vapi.on("error", (err: Error) => {
          console.error("VAPI error:", err);
          setError(err.message);
          setStatus("error");
        });

        vapi.start(assistantId);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error starting call";
        setError(message);
        setStatus("error");
      }
    },
    [status, renderConvo]
  );

  const endCall = useCallback(() => {
    vapiRef.current?.stop();
    setStatus("ended");
    setIsSpeaking(false);
    setIsListening(false);
  }, []);

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
      vapiRef.current?.stop();
    };
  }, []);

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