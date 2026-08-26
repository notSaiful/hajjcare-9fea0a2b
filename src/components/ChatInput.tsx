import { useState, KeyboardEvent, useCallback } from "react";
import { Send, Loader2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  languageCode?: string;
}

const ChatInput = ({ onSend, isLoading, disabled, languageCode }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const { t, isRTL } = useLanguage();
  const appendTranscript = useCallback((transcript: string) => setInput((current) => `${current}${current ? " " : ""}${transcript}`), []);
  const { start: startListening, stop: stopListening, isListening, isSupported: sttSupported, error: sttError } = useSpeechRecognition(languageCode || "en", appendTranscript);

  const handleSend = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-3 sm:p-4 safe-area-bottom">
      <div className="container max-w-3xl mx-auto">
        <div className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("askPlaceholder")}
              className="min-h-[44px] sm:min-h-[48px] max-h-28 sm:max-h-32 resize-none bg-card border-border rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm placeholder:text-muted-foreground focus-visible:ring-primary"
              disabled={isLoading || disabled}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
          <Button
            type="button"
            variant={isListening ? "default" : "outline"}
            onClick={isListening ? stopListening : () => void startListening()}
            disabled={isLoading || disabled}
            size="icon"
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full flex-shrink-0"
            aria-label={isListening ? "Stop voice typing" : "Start voice typing"}
            title={sttError || (sttSupported ? "Voice typing" : "Voice typing unavailable; use the Voice tab")}
          >
            {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || disabled}
            size="icon"
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated transition-all duration-200 hover:scale-105 flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-1.5 sm:mt-2">
          {sttError || t("consultScholar")}
        </p>
      </div>
    </div>
  );
};
export default ChatInput;
