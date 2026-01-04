import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Loader2 } from "lucide-react";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-agent-token`;

export const HelpButton = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: t("helpConnected"),
        description: t("helpSpeakNow"),
      });
    },
    onDisconnect: () => {},
    onError: (error) => {
      console.error("Help error:", error);
      toast({
        title: t("helpError"),
        description: t("helpTryAgain"),
        variant: "destructive",
      });
    },
  });

  const startHelp = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });

      if (!response.ok) throw new Error("Failed to connect");

      const data = await response.json();
      if (!data.signed_url) throw new Error("Connection failed");

      await conversation.startSession({ signedUrl: data.signed_url });
    } catch (error) {
      console.error("Help connection failed:", error);
      toast({
        title: t("helpError"),
        description: t("helpTryAgain"),
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, t, toast]);

  const stopHelp = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";

  return (
    <Button
      onClick={isConnected ? stopHelp : startHelp}
      disabled={isConnecting}
      size="lg"
      variant={isConnected ? "secondary" : "default"}
      className={`
        w-full h-12 sm:h-14 rounded-xl text-base sm:text-lg font-semibold
        flex items-center justify-center gap-2.5 sm:gap-3
        ${isConnected ? "bg-secondary" : "bg-primary hover:bg-primary/90"}
      `}
    >
      {isConnecting ? (
        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
      ) : isConnected ? (
        <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
      ) : (
        <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
      )}
      <span>
        {isConnecting
          ? t("helpConnecting")
          : isConnected
          ? t("helpEndCall")
          : t("needHelp")
        }
      </span>
    </Button>
  );
};
