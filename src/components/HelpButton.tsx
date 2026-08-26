import { useCallback, useEffect, useState } from "react";
import { useVapiCall } from "@/hooks/useVapiCall";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getMicrophonePermissionMessage } from "@/lib/microphonePermission";
import { isMicrophonePermissionDenied } from "@/lib/microphonePermission";
import { getMicrophonePermissionState, requestMicrophonePermission } from "@/lib/nativeMicrophonePermission";
import { MicrophonePermissionHelp } from "@/components/MicrophonePermissionHelp";
import { openNativeAppSettings } from "@/lib/medianAppSettings";
import { Mic, MicOff, Loader2 } from "lucide-react";

// VAPI voice agent — STT (Deepgram) + LLM (GPT-4o) + barge-in by VAPI; the
// assistant speaks using its Vapi-managed voice.
// Replaces the previous ElevenLabs useConversation integration.

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vapi-config`;

export const HelpButton = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [microphoneDenied, setMicrophoneDenied] = useState(false);
  const { status, startCall, endCall, error } = useVapiCall();

  useEffect(() => {
    if (!error) return;
    toast({ title: t("helpError"), description: error, variant: "destructive" });
  }, [error, t, toast]);

  const startHelp = useCallback(async () => {
    try {
      setMicrophoneDenied(false);
      // Keep this entry point identical to Zoya's main voice CTA. In a native
      // wrapper, this first asks Android/iOS for microphone access before Vapi
      // creates its WebRTC call; directly calling getUserMedia bypassed that
      // native permission gate in the Support flow.
      await requestMicrophonePermission();

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
      });
      if (response.status === 503) {
        throw new Error("Voice service is temporarily unavailable. Please try again shortly.");
      }
      if (response.status === 403) {
        throw new Error("Voice calls are not available from this website address.");
      }
      if (!response.ok) throw new Error("Unable to connect to the voice service. Please try again.");
      const { publicKey, assistantId } = await response.json();
      if (!publicKey || !assistantId) throw new Error("Connection failed");

      await startCall(publicKey, assistantId);
    } catch (error) {
      console.error("Help connection failed:", error);
      if (isMicrophonePermissionDenied(error)) {
        // Keep the initial permission prompt available. Only open Settings
        // when the platform explicitly reports that microphone access is
        // denied and therefore cannot be requested again in-app.
        const permanentlyDenied = await getMicrophonePermissionState() === "denied";
        setMicrophoneDenied(permanentlyDenied);
        if (permanentlyDenied) void openNativeAppSettings();
      }
      toast({
        title: t("helpError"),
        description: getMicrophonePermissionMessage(error, language),
        variant: "destructive",
      });
    }
  }, [language, t, toast, startCall]);

  const stopHelp = useCallback(() => {
    endCall();
  }, [endCall]);

  const isConnecting = status === "connecting";
  const isConnected = status === "active";

  return (
    <div className="space-y-3">
      <Button
      onClick={isConnected ? stopHelp : startHelp}
      disabled={isConnecting}
      size="lg"
      variant={isConnected ? "secondary" : "default"}
      className={`
        relative overflow-hidden
        w-full h-14 sm:h-16 rounded-2xl
        text-base sm:text-lg font-semibold
        flex items-center justify-center gap-3
        transition-all duration-300 ease-out
        ${isConnected
          ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          : "bg-primary hover:bg-primary/90 text-primary-foreground"
        }
      `}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Icon container */}
      <div className={`
        w-10 h-10 sm:w-11 sm:h-11 rounded-xl
        flex items-center justify-center
        ${isConnected ? "bg-secondary-foreground/10" : "bg-primary-foreground/15"}
      `}>
        {isConnecting ? (
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
        ) : isConnected ? (
          <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </div>

      <span>
        {isConnecting
          ? t("helpConnecting")
          : isConnected
          ? t("helpEndCall")
          : t("needHelp")}
      </span>

      {/* Subtle pulse when connected */}
      {isConnected && (
        <div className="absolute inset-0 rounded-2xl animate-[pulse_2s_ease-in-out_infinite] bg-secondary-foreground/5 pointer-events-none" />
      )}
      </Button>
      {microphoneDenied && <MicrophonePermissionHelp language={language} />}
    </div>
  );
};
