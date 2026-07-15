import { useCallback } from "react";
import { useVapiCall } from "@/hooks/useVapiCall";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// VAPI voice agent — STT (Deepgram) + LLM (GPT-4o) + barge-in handled by VAPI;
// the assistant speaks in Rumik `muga` via the custom-voice TTS proxy edge function.
// Replaces the previous ElevenLabs useConversation integration.

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vapi-config`;

export const VoiceAssistant = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  const { status, isSpeaking, startCall, endCall } = useVapiCall();

  const startConversation = useCallback(async () => {
    try {
      // Auth gate — match the existing voice flow.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({
          title: isRTL ? "خطأ" : "Error",
          description: isRTL ? "يرجى تسجيل الدخول أولاً" : "Please sign in first",
          variant: "destructive",
        });
        return;
      }

      // Microphone permission (VAPI needs the mic).
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Fetch the public VAPI config (auth-gated edge function).
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to get voice config");
      const { publicKey, assistantId } = await response.json();
      if (!publicKey || !assistantId) throw new Error("Voice not configured");

      startCall(publicKey, assistantId);
    } catch (error) {
      console.error("Failed to start voice conversation:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في بدء المحادثة الصوتية" : "Failed to start voice conversation",
        variant: "destructive",
      });
    }
  }, [isRTL, toast, startCall]);

  const stopConversation = useCallback(() => {
    endCall();
  }, [endCall]);

  const isConnecting = status === "connecting";
  const isConnected = status === "active";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Status indicator */}
      {isConnected && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-up">
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
        size="lg"
        variant={isConnected ? "destructive" : "default"}
        className={`rounded-full h-16 w-16 shadow-elevated ${
          isConnected ? "animate-pulse" : ""
        }`}
      >
        {isConnecting ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isConnected ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
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
    </div>
  );
};