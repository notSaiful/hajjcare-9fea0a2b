import { useRef, useEffect } from "react";
import IslamicHeader from "@/components/IslamicHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import HajjMap from "@/components/HajjMap";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { EmergencySOS } from "@/components/EmergencySOS";
import { useHajjChat } from "@/hooks/useHajjChat";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { useHajjLocation } from "@/hooks/useHajjLocation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { messages, isLoading, sendMessage, clearChat } = useHajjChat();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { group, updateLocation } = useFamilyGroup();
  const { lat, lng, stage } = useHajjLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update family group with location
  useEffect(() => {
    if (group && lat && lng && isAuthenticated) {
      updateLocation(lat, lng, stage);
    }
  }, [group, lat, lng, stage, updateLocation, isAuthenticated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <IslamicHeader />

      {/* Main Content */}
      <main className="flex-1 pt-14 pb-28 sm:pb-32">
        {hasMessages ? (
          <div className="relative">
            {/* Map Card and Emergency SOS */}
            <div className="container max-w-3xl mx-auto px-3 sm:px-4 py-2 space-y-3">
              <HajjMap />
              <EmergencySOS />
            </div>

            {/* Clear Chat Button */}
            <div className="sticky top-14 z-40 flex justify-center py-2 bg-background/80 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-xs text-muted-foreground hover:text-foreground h-8 sm:h-9"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                {t("newConversation")}
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[calc(100vh-280px)] sm:h-[calc(100vh-320px)]" ref={scrollRef}>
              <div className="container max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    isStreaming={
                      isLoading &&
                      index === messages.length - 1 &&
                      message.role === "assistant"
                    }
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Floating Voice Button */}
            <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-30">
              <VoiceAssistant />
            </div>
          </div>
        ) : (
          <WelcomeScreen onQuickAction={sendMessage} />
        )}
      </main>

      {/* Input */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Index;
