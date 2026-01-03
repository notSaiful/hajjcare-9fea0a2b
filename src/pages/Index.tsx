import { useRef, useEffect } from "react";
import IslamicHeader from "@/components/IslamicHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useHajjChat } from "@/hooks/useHajjChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { messages, isLoading, sendMessage, clearChat } = useHajjChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <IslamicHeader />

      {/* Main Content */}
      <main className="flex-1 pt-14 pb-32">
        {hasMessages ? (
          <div className="relative">
            {/* Clear Chat Button */}
            <div className="sticky top-14 z-40 flex justify-center py-2 bg-background/80 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                New Conversation
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[calc(100vh-180px)]" ref={scrollRef}>
              <div className="container max-w-2xl mx-auto px-4 py-4 space-y-4">
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
