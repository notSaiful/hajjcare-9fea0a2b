import { Compass } from "lucide-react";
import QuickActions from "./QuickActions";
import { useLanguage } from "@/contexts/LanguageContext";

interface WelcomeScreenProps {
  onQuickAction: (question: string) => void;
}

const WelcomeScreen = ({ onQuickAction }: WelcomeScreenProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center px-4 py-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 islamic-pattern opacity-30 pointer-events-none" />
      
      {/* Logo */}
      <div className="relative mb-4 animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-glow">
          <Compass className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-islamic-gold flex items-center justify-center">
          <span className="text-[10px] font-bold text-foreground">AI</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="font-arabic text-2xl font-bold text-foreground mb-1 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {t("assalamuAlaikum")}
      </h2>
      <p className="text-base text-muted-foreground mb-1 animate-fade-up" style={{ animationDelay: "150ms" }}>
        {t("welcomePilgrim")}
      </p>
      
      {/* Subtitle */}
      <p className="text-xs text-muted-foreground max-w-xs mb-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
        {t("welcomeSubtitle")}
      </p>

      {/* Decorative Line */}
      <div className="flex items-center gap-3 mb-4 animate-fade-up" style={{ animationDelay: "250ms" }}>
        <div className="w-12 h-px bg-border" />
        <div className="w-2 h-2 rotate-45 bg-islamic-gold" />
        <div className="w-12 h-px bg-border" />
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-sm animate-fade-up" style={{ animationDelay: "300ms" }}>
        <p className="text-xs text-muted-foreground mb-3 font-medium">
          {t("quickQuestions")}
        </p>
        <QuickActions onSelect={onQuickAction} />
      </div>
    </div>
  );
};

export default WelcomeScreen;
