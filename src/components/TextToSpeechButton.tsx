import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useLanguage } from "@/contexts/LanguageContext";

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "ghost" | "outline" | "secondary";
  showLabel?: boolean;
}

const LABELS = {
  listen: { en: "Listen", ar: "استمع", ur: "سنیں", hi: "सुनें", ta: "கேள்", te: "వినండి", mr: "ऐका", bn: "শুনুন", or: "ଶୁଣନ୍ତୁ", ml: "കേൾക്കുക", pa: "ਸੁਣੋ" },
  stop: { en: "Stop", ar: "إيقاف", ur: "رکیں", hi: "रोकें", ta: "நிறுத்து", te: "ఆపు", mr: "थांबा", bn: "থামান", or: "ବନ୍ଦ କରନ୍ତୁ", ml: "നിർത്തുക", pa: "ਰੋਕੋ" },
};

export const TextToSpeechButton = ({ 
  text, 
  className = "", 
  size = "default",
  variant = "outline",
  showLabel = true 
}: TextToSpeechButtonProps) => {
  const { language } = useLanguage();
  const { speak, isSpeaking, isSupported } = useTextToSpeech();

  if (!isSupported) return null;

  const label = isSpeaking 
    ? (LABELS.stop[language as keyof typeof LABELS.stop] || LABELS.stop.en)
    : (LABELS.listen[language as keyof typeof LABELS.listen] || LABELS.listen.en);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => speak(text)}
      className={`gap-2 ${isSpeaking ? "bg-primary text-primary-foreground" : ""} ${className}`}
      aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      {showLabel && <span>{label}</span>}
    </Button>
  );
};
