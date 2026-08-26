import { useCallback, useEffect, useRef, useState } from "react";
import { useVapiCall } from "@/hooks/useVapiCall";
import { useLanguage } from "@/contexts/LanguageContext";
import { getZoyaLanguage, ZOYA_LANGUAGES } from "@/lib/zoyaLanguages";
import { getMicrophonePermissionMessage, isMicrophonePermissionDenied } from "@/lib/microphonePermission";
import { getMicrophonePermissionState, requestMicrophonePermission } from "@/lib/nativeMicrophonePermission";
import { openNativeAppSettings } from "@/lib/medianAppSettings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";

// VAPI voice agent — STT (Deepgram) + LLM (GPT-4o) + barge-in handled by VAPI;
// the assistant speaks using its Vapi-managed voice.
// Replaces the previous ElevenLabs useConversation integration.

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vapi-config`;
const CONFIG_TIMEOUT_MS = 12_000;

async function fetchVoiceConfig() {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), CONFIG_TIMEOUT_MS);
    try {
      console.info("[zoya-voice]", { event: "voice_config_request", attempt: attempt + 1 });
      const response = await fetch(FUNCTION_URL, { method: "POST", signal: controller.signal });
      if (response.status === 404) throw new Error("Voice service is not deployed yet. Please contact HajCare support.");
      if (response.status === 503) throw new Error("Voice service is temporarily unavailable. Please try again shortly.");
      if (response.status === 403) throw new Error("Voice calls are not available from this website address.");
      if (!response.ok) throw new Error(`Voice service request failed (HTTP ${response.status}).`);
      const config = await response.json();
      if (!config.publicKey || !config.assistantId) throw new Error("Voice service returned an incomplete configuration.");
      console.info("[zoya-voice]", { event: "voice_config_received" });
      return config as { publicKey: string; assistantId: string };
    } catch (error) {
      lastError = error instanceof DOMException && error.name === "AbortError"
        ? new Error("Voice service did not respond within 12 seconds.")
        : error instanceof Error ? error : new Error("Voice service request failed.");
      // Only retry transient connectivity failures; a missing deployment or
      // rejected origin must be reported immediately and accurately.
      if (attempt === 1 || /deployed|HTTP 4|website address/i.test(lastError.message)) throw lastError;
      console.warn("[zoya-voice]", { event: "voice_config_retry", error: lastError.message });
    } finally {
      window.clearTimeout(timeout);
    }
  }
  throw lastError || new Error("Voice service request failed.");
}

interface VoiceAssistantProps {
  /** Use the full-width CTA in contextual surfaces such as the Ayesha card. */
  variant?: "icon" | "cta";
  /** Optional Vapi greeting for a contextual explanation before questions begin. */
  firstMessage?: string;
  /** Replaces the generic CTA label when this assistant is used for a specific task. */
  ctaLabel?: string;
}

type PermissionDialog = "retry" | "settings" | null;

const permissionCopy = {
  en: {
    retryTitle: "Microphone access is needed for voice questions",
    retryDescription: "Zoya needs your microphone only while you are speaking. Allow access to ask a question by voice, or continue using text.",
    settingsTitle: "Enable microphone in Settings",
    settingsDescription: "Microphone access is still unavailable. Open HajCare AI settings and allow Microphone, then return and try again.",
    retry: "Grant Microphone Access",
    settings: "Open Settings",
    continue: "Continue without voice",
  },
  hi: {
    retryTitle: "वॉइस प्रश्नों के लिए माइक्रोफ़ोन अनुमति चाहिए",
    retryDescription: "Zoya को केवल आपके बोलते समय माइक्रोफ़ोन चाहिए। आवाज़ से प्रश्न पूछने के लिए अनुमति दें या टेक्स्ट से जारी रखें।",
    settingsTitle: "Settings में माइक्रोफ़ोन चालू करें",
    settingsDescription: "माइक्रोफ़ोन अनुमति अभी भी उपलब्ध नहीं है। HajCare AI Settings खोलें, Microphone की अनुमति दें, फिर वापस आकर कोशिश करें।",
    retry: "माइक्रोफ़ोन अनुमति दें",
    settings: "Settings खोलें",
    continue: "वॉइस के बिना जारी रखें",
  },
  ur: {
    retryTitle: "صوتی سوالات کے لیے مائیکروفون کی اجازت درکار ہے",
    retryDescription: "زویا کو صرف آپ کے بولنے کے دوران مائیکروفون چاہیے۔ آواز سے سوال کرنے کے لیے اجازت دیں یا متن کے ساتھ جاری رکھیں۔",
    settingsTitle: "Settings میں مائیکروفون فعال کریں",
    settingsDescription: "مائیکروفون کی اجازت ابھی دستیاب نہیں ہے۔ HajCare AI Settings کھولیں، Microphone کی اجازت دیں، پھر واپس آ کر کوشش کریں۔",
    retry: "مائیکروفون کی اجازت دیں",
    settings: "Settings کھولیں",
    continue: "وائس کے بغیر جاری رکھیں",
  },
} as const;

export const VoiceAssistant = ({ variant = "icon", firstMessage, ctaLabel }: VoiceAssistantProps) => {
  const { isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [preferredLanguageCode, setPreferredLanguageCode] = useState(() => getZoyaLanguage(language).code);
  const [permissionDialog, setPermissionDialog] = useState<PermissionDialog>(null);
  const [isRequestingMicrophone, setIsRequestingMicrophone] = useState(false);
  const retryAfterPermissionRef = useRef(false);
  const microphoneGrantedRef = useRef(false);
  const permissionDialogShownRef = useRef(false);

  const { status, isSpeaking, transcript, startCall, endCall, error } = useVapiCall();

  useEffect(() => {
    if (!error) return;
    toast({
      title: isRTL ? "خطأ" : "Voice call failed",
      description: error,
      variant: "destructive",
    });
  }, [error, isRTL, toast]);

  useEffect(() => {
    setPreferredLanguageCode(getZoyaLanguage(language).code);
  }, [language]);

  const preferredLanguage = getZoyaLanguage(preferredLanguageCode);

  const startConversation = useCallback(async () => {
    if (isRequestingMicrophone) return;

    try {
      setIsRequestingMicrophone(true);
      setPermissionDialog(null);
      // Never create a Vapi/WebRTC call before the Android/WebView microphone
      // permission request and capture probe have both succeeded.
      if (!microphoneGrantedRef.current) {
        await requestMicrophonePermission();
        microphoneGrantedRef.current = true;
        permissionDialogShownRef.current = false;
        console.info("[zoya-voice]", { event: "microphone_ready" });
      }
    } catch (error) {
      console.error("[zoya-voice] microphone permission failed", error);
      microphoneGrantedRef.current = false;
      if (isMicrophonePermissionDenied(error)) {
        // A native state of `denied` is the only case that needs Settings.
        // Unknown/prompt states get one in-app grant action, never an endless
        // dialog loop or a duplicate destructive toast.
        const state = await getMicrophonePermissionState();
        retryAfterPermissionRef.current = state === "denied";
        if (!permissionDialogShownRef.current) {
          permissionDialogShownRef.current = true;
          setPermissionDialog(state === "denied" ? "settings" : "retry");
        }
        return;
      }
      toast({
        title: isRTL ? "خطأ" : "Microphone unavailable",
        description: getMicrophonePermissionMessage(error, language),
        variant: "destructive",
      });
      return;
    }

    try {
      // Fetch the public VAPI config. The VAPI public key and assistant ID are
      // intended for browser use; all provider secrets stay on the server.
      const { publicKey, assistantId } = await fetchVoiceConfig();

      await startCall(publicKey, assistantId, {
        ...(firstMessage ? {
          firstMessage,
          firstMessageMode: "assistant-speaks-first" as const,
          firstMessageInterruptionsEnabled: true,
        } : {}),
        variableValues: {
          preferredLanguage: preferredLanguage.name,
          preferredLanguageCode: preferredLanguage.code,
          preferredLanguageLocale: preferredLanguage.locale,
        },
      });
    } catch (error) {
      // Vapi/network failures must never be reclassified as a microphone
      // denial. Reopening the permission sheet here was the source of the
      // Android "blocked" loop after an Allow decision.
      console.error("[zoya-voice] voice initialization failed", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: getMicrophonePermissionMessage(error, language),
        variant: "destructive",
      });
    } finally {
      setIsRequestingMicrophone(false);
    }
  }, [firstMessage, isRequestingMicrophone, language, isRTL, preferredLanguage.code, preferredLanguage.locale, preferredLanguage.name, toast, startCall]);

  // If the user enables the permission in Android/browser Settings and comes
  // back to HajCare, continue directly into voice mode. This removes the
  // former "grant → return → tap Retry" loop while still avoiding retries on
  // a deliberately denied permission.
  useEffect(() => {
    const retryAfterReturningFromSettings = async () => {
      if (
        document.visibilityState !== "visible" ||
        !retryAfterPermissionRef.current ||
        isRequestingMicrophone
      ) return;
      const state = await getMicrophonePermissionState();
      if (state !== "granted") return;
      retryAfterPermissionRef.current = false;
      microphoneGrantedRef.current = false;
      permissionDialogShownRef.current = false;
      setPermissionDialog(null);
      void startConversation();
    };
    window.addEventListener("focus", retryAfterReturningFromSettings);
    document.addEventListener("visibilitychange", retryAfterReturningFromSettings);
    return () => {
      window.removeEventListener("focus", retryAfterReturningFromSettings);
      document.removeEventListener("visibilitychange", retryAfterReturningFromSettings);
    };
  }, [isRequestingMicrophone, startConversation]);

  const stopConversation = useCallback(() => {
    endCall();
  }, [endCall]);

  const isConnecting = status === "connecting" || isRequestingMicrophone;
  const isConnected = status === "active";
  const dialogText = permissionCopy[language === "hi" || language === "ur" ? language : "en"];

  const openSettings = useCallback(async () => {
    retryAfterPermissionRef.current = true;
    await openNativeAppSettings();
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      {!isConnected && (
        <div className="w-full text-left">
          <label htmlFor="zoya-voice-language" className="mb-1.5 block text-xs font-semibold text-foreground">
            Zoya's speaking language
          </label>
          <Select value={preferredLanguageCode} onValueChange={setPreferredLanguageCode} disabled={isConnecting}>
            <SelectTrigger id="zoya-voice-language" aria-label="Choose Zoya's speaking language" className="h-10 rounded-xl border-primary/20 bg-white/80 text-sm dark:bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {ZOYA_LANGUAGES.map((voiceLanguage) => (
                <SelectItem key={voiceLanguage.code} value={voiceLanguage.code} dir={voiceLanguage.dir}>
                  {voiceLanguage.name} · {voiceLanguage.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-[11px] leading-4 text-muted-foreground">
            Zoya will reply in your selected language. Recognition quality can vary by device, network, and language.
          </p>
        </div>
      )}
      {/* Status indicator */}
      {isConnected && (
        <div role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-up">
          {isSpeaking ? (
            <>
              <Volume2 className="w-4 h-4 text-primary animate-pulse" />
              <span>{isRTL ? "المساعد يتحدث..." : "Assistant speaking..."}</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{isRTL ? "جاهز للاستماع" : "Listening..."}</span>
            </>
          )}
        </div>
      )}

      {/* Main button */}
      <Button
        onClick={isConnected ? stopConversation : startConversation}
        disabled={isConnecting}
        aria-label={
          isConnecting
            ? (isRTL ? "جاری کنکشن" : "Connecting to voice assistant")
            : isConnected
            ? (isRTL ? "آواز کی گفتگو ختم کریں" : "End voice conversation")
            : (ctaLabel || (isRTL ? "آواز کے ذریعے سوال کریں" : "Ask the voice assistant"))
        }
        aria-pressed={isConnected}
        size={variant === "cta" ? "default" : "lg"}
        variant={isConnected ? "destructive" : "default"}
        className={
          variant === "cta"
            ? `w-full rounded-xl bg-primary px-4 font-semibold shadow-md transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isConnected ? "animate-pulse" : ""
              }`
            : `rounded-full h-16 w-16 shadow-elevated ${
                isConnected ? "animate-pulse" : ""
              }`
        }
      >
        {isConnecting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isConnected ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
        {variant === "cta" && (
          <span>
            {isConnecting
              ? (isRTL ? "جاری کنکشن..." : "Connecting...")
              : isConnected
              ? (isRTL ? "آواز کی گفتگو ختم کریں" : "End voice conversation")
              : (ctaLabel || (isRTL ? "آواز کے ذریعے پوچھیں" : "Ask by Voice"))}
          </span>
        )}
      </Button>

      {/* Label */}
      <span className="text-xs text-muted-foreground">
        {isConnecting
          ? (isRTL ? "جاري الاتصال..." : "Connecting...")
          : isConnected
          ? (isRTL ? "اضغط للإنهاء" : "Tap to end")
          : (isRTL ? "اسأل صوتياً" : "Ask by voice")}
      </span>

      {transcript && (
        <div
          role="log"
          aria-live="polite"
          aria-label={isRTL ? "صوتی گفتگو کا متن" : "Voice conversation transcript"}
          className="w-full max-w-md max-h-40 overflow-y-auto rounded-xl border border-border bg-muted/30 px-3 py-2 text-left text-xs leading-relaxed text-foreground whitespace-pre-wrap"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {transcript}
        </div>
      )}

      <AlertDialog open={permissionDialog !== null} onOpenChange={(open) => !open && setPermissionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {permissionDialog === "settings" ? dialogText.settingsTitle : dialogText.retryTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {permissionDialog === "settings" ? dialogText.settingsDescription : dialogText.retryDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dialogText.continue}</AlertDialogCancel>
            {permissionDialog === "settings" ? (
              <AlertDialogAction onClick={() => void openSettings()}>{dialogText.settings}</AlertDialogAction>
            ) : (
              <AlertDialogAction onClick={() => void startConversation()}>{dialogText.retry}</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
