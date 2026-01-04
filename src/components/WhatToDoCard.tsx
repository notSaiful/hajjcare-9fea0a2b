import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Volume2, VolumeX, RotateCcw, Clock } from "lucide-react";

interface WhatToDoCardProps {
  status: string;
  statusLabel: string;
  instruction: string;
  safety?: string;
  isFailsafe?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  className?: string;
}

export const WhatToDoCard = ({ 
  status,
  statusLabel,
  instruction, 
  safety,
  isFailsafe = false,
  lastUpdated,
  onRefresh,
  className = "" 
}: WhatToDoCardProps) => {
  const { t, isRTL, language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case "WAIT": return "bg-status-assistance/10 text-status-assistance border-status-assistance/30";
      case "MOVE": return "bg-status-safe/10 text-status-safe border-status-safe/30";
      case "PREPARE": return "bg-primary/10 text-primary border-primary/30";
      case "ASSISTANCE": return "bg-status-emergency/10 text-status-emergency border-status-emergency/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  // Voice playback using Web Speech API
  const speakInstruction = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const textToSpeak = safety ? `${instruction}. ${safety}` : instruction;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Set language based on app language
      const langMap: Record<string, string> = {
        en: "en-US",
        ar: "ar-SA",
        ur: "ur-PK",
        hi: "hi-IN",
        tr: "tr-TR",
        ru: "ru-RU",
      };
      utterance.lang = langMap[language] || "en-US";
      utterance.rate = 0.85; // Slightly slower for clarity
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language, { 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  return (
    <Card className={`bg-card shadow-card border-2 border-border ${className}`}>
      <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm font-bold ${getStatusColor()}`}>
            <span>{statusLabel}</span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Voice button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={speakInstruction}
              className="h-9 w-9 sm:h-10 sm:w-10"
              aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              ) : (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              )}
            </Button>

            {/* Refresh button */}
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                className="h-9 w-9 sm:h-10 sm:w-10"
                aria-label="Refresh"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Instruction */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 text-primary ${isRTL ? "rtl-flip" : ""}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 sm:mb-2">
              {t("whatToDoNow")}
            </p>
            <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
              {instruction}
            </p>
          </div>
        </div>

        {/* Safety Reminder */}
        {safety && (
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3 ml-12 sm:ml-14">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {safety}
            </p>
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground ml-12 sm:ml-14">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>{formatTime(lastUpdated)}</span>
          </div>
        )}

        {/* Failsafe indicator (subtle) */}
        {isFailsafe && (
          <p className="text-[10px] sm:text-xs text-muted-foreground/60 text-center mt-2">
            {language === "ar" ? "اتبع الإرشادات الرسمية" : 
             language === "ur" ? "سرکاری ہدایات پر عمل کریں" :
             language === "hi" ? "आधिकारिक निर्देशों का पालन करें" :
             "Following official guidance"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
