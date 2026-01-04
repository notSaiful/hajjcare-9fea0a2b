import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-agent-token`;

export const VoiceAssistant = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      toast({
        title: isRTL ? "متصل" : "Connected",
        description: isRTL ? "يمكنك التحدث الآن" : "You can speak now",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "حدث خطأ في الاتصال" : "Connection error occurred",
        variant: "destructive",
      });
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get signed URL from edge function
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get conversation token");
      }

      const data = await response.json();

      if (!data.signed_url) {
        throw new Error("No signed URL received");
      }

      // Start the conversation with WebSocket
      await conversation.startSession({
        signedUrl: data.signed_url,
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في بدء المحادثة الصوتية" : "Failed to start voice conversation",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, isRTL, toast]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Status indicator */}
      {isConnected && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-up">
          {conversation.isSpeaking ? (
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
          : (isRTL ? "اسأل صوتياً" : "Ask by voice")
        }
      </span>
    </div>
  );
};
