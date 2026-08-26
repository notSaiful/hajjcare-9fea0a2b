import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Volume2, VolumeX, RotateCcw } from "lucide-react";

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

  // Get status color - calm, purposeful colors
  const getStatusStyles = () => {
    switch (status) {
      case "WAIT": 
        return {
          badge: "bg-[hsl(var(--status-assistance)/0.12)] text-[hsl(var(--status-assistance))] border-[hsl(var(--status-assistance)/0.2)]",
          icon: "bg-[hsl(var(--status-assistance)/0.1)]",
          iconColor: "text-[hsl(var(--status-assistance))]"
        };
      case "MOVE": 
        return {
          badge: "bg-[hsl(var(--status-safe)/0.12)] text-[hsl(var(--status-safe))] border-[hsl(var(--status-safe)/0.2)]",
          icon: "bg-[hsl(var(--status-safe)/0.1)]",
          iconColor: "text-[hsl(var(--status-safe))]"
        };
      case "PREPARE": 
        return {
          badge: "bg-[hsl(var(--primary)/0.1)] text-primary border-primary/20",
          icon: "bg-primary/10",
          iconColor: "text-primary"
        };
      case "ASSISTANCE": 
        return {
          badge: "bg-[hsl(var(--status-emergency)/0.1)] text-[hsl(var(--status-emergency))] border-[hsl(var(--status-emergency)/0.2)]",
          icon: "bg-[hsl(var(--status-emergency)/0.08)]",
          iconColor: "text-[hsl(var(--status-emergency))]"
        };
      default: 
        return {
          badge: "bg-muted text-muted-foreground border-border",
          icon: "bg-primary/10",
          iconColor: "text-primary"
        };
    }
  };

  const styles = getStatusStyles();

  // Voice playback using Web Speech API
  const speakInstruction = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const textToSpeak = safety ? `${instruction}. ${safety}` : instruction;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      const langMap: Record<string, string> = {
        en: "en-US",
        ar: "ar-SA",
        ur: "ur-PK",
        hi: "hi-IN",
        tr: "tr-TR",
        ru: "ru-RU",
      };
      utterance.lang = langMap[language] || "en-US";
      utterance.rate = 0.85;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className={`
      relative overflow-hidden
      bg-card border border-border
      rounded-2xl
      transition-all duration-500 ease-out
      ${className}
    `}
    style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <CardContent className="p-5 sm:p-6 space-y-4 sm:space-y-5">
        {/* Header: Status Badge + Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className={`
            inline-flex items-center gap-2 
            px-3 sm:px-4 py-1.5 sm:py-2 
            rounded-full border
            text-xs sm:text-sm font-semibold
            tracking-wide
            ${styles.badge}
          `}>
            <span>{statusLabel}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Voice button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={speakInstruction}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-muted/80 transition-colors duration-300"
              aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
            >
              {isSpeaking ? (
                <VolumeX className="w-5 h-5 text-primary" />
              ) : (
                <Volume2 className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>

            {/* Refresh button */}
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-muted/80 transition-colors duration-300"
                aria-label="Refresh"
              >
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Instruction */}
        <div className="flex items-start gap-4">
          <div className={`
            flex-shrink-0 
            w-11 h-11 sm:w-12 sm:h-12 
            rounded-xl 
            ${styles.icon}
            flex items-center justify-center
            transition-colors duration-300
          `}>
            <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.iconColor} ${isRTL ? "rtl-flip" : ""}`} />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
              {t("whatToDoNow")}
            </p>
            <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
              {instruction}
            </p>
          </div>
        </div>

        {/* Safety Reminder */}
        {safety && (
          <div className="bg-muted/40 rounded-xl p-3 sm:p-4 ml-14 sm:ml-16 border border-border/50">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {safety}
            </p>
          </div>
        )}

        {/* Failsafe indicator (subtle) */}
        {isFailsafe && (
          <p className="text-[10px] sm:text-xs text-muted-foreground/50 text-center pt-1">
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
