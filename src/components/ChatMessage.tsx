import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const GREETING: Record<string, string> = {
  en: "Assalamu Alaikum. ",
  ar: "السلام عليكم. ",
  ur: "السلام علیکم۔ ",
  hi: "अस्सलामु अलैकुम। ",
  ta: "அஸ்ஸலாமு அலைக்கும். ",
  te: "అస్సలాము అలైకుం. ",
  mr: "अस्सलामु अलैकुम. ",
  bn: "আসসালামু আলাইকুম। ",
  or: "ଅସ୍ସଲାମୁ ଅଲାଇକୁମ। ",
  ml: "അസ്സലാമു അലൈക്കും. ",
  pa: "ਅੱਸਲਾਮੁ ਅਲੈਕੁਮ। ",
  tr: "Esselamu Aleykum. ",
  ru: "Ассаламу Алейкум. ",
};

const ChatMessage = ({ role, content, isStreaming }: ChatMessageProps) => {
  const isUser = role === "user";
  const { language } = useLanguage();

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-islamic-gold/20 text-islamic-gold"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-soft",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-card text-card-foreground rounded-tl-sm border border-border"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse-soft rounded-sm" />
          )}
        </p>
        {!isUser && !isStreaming && content && (
          <div className="mt-2 flex justify-end">
            <TextToSpeechButton
              text={`${GREETING[language] || GREETING.en}${content}`}
              size="icon"
              variant="ghost"
              showLabel={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
