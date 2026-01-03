import { useState, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const { t, isArabic } = useLanguage();

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
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-area-bottom">
      <div className="container max-w-2xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("اسأل عن مناسك الحج...", "Ask about Hajj rituals...")}
              className="min-h-[48px] max-h-32 resize-none bg-card border-border rounded-2xl pr-4 pl-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:ring-primary"
              disabled={isLoading || disabled}
              dir={isArabic ? "rtl" : "ltr"}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || disabled}
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated transition-all duration-200 hover:scale-105"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {t("للاستشارات الفقهية راجع عالماً متخصصاً", "Consult a qualified scholar for religious rulings")}
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
