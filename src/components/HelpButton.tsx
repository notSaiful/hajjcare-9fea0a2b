import { useCallback } from "react";
import { useVapiCall } from "@/hooks/useVapiCall";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// VAPI voice agent — STT (Deepgram) + LLM (GPT-4o) + barge-in by VAPI; the
// assistant speaks in Rumik `muga` via the custom-voice TTS proxy edge function.
// Replaces the previous ElevenLabs useConversation integration.

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vapi-config`;

export const HelpButton = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const { status, startCall, endCall } = useVapiCall();

  const startHelp = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({
          title: t("helpError"),
          description: "Please sign in to use voice help",
          variant: "destructive",
        });
        return;
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to connect");
      const { publicKey, assistantId } = await response.json();
      if (!publicKey || !assistantId) throw new Error("Connection failed");

      startCall(publicKey, assistantId);
    } catch (error) {
      console.error("Help connection failed:", error);
      toast({
        title: t("helpError"),
        description: t("helpTryAgain"),
        variant: "destructive",
      });
    }
  }, [t, toast, startCall]);

  const stopHelp = useCallback(() => {
    endCall();
  }, [endCall]);

  const isConnecting = status === "connecting";
  const isConnected = status === "active";

  return (
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
  );
};