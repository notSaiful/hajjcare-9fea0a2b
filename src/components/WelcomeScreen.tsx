import QuickActions from "./QuickActions";
import { useLanguage } from "@/contexts/LanguageContext";
import { VoiceAssistant } from "./VoiceAssistant";
import logo from "@/assets/logo.jpeg";

interface WelcomeScreenProps {
  onQuickAction: (question: string) => void;
}

const WelcomeScreen = ({ onQuickAction }: WelcomeScreenProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center px-3 sm:px-4 py-4 sm:py-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 islamic-pattern opacity-30 pointer-events-none" />
      
      {/* Logo */}
      <div className="relative mb-3 sm:mb-4 animate-fade-up">
        <img src={logo} alt="Hajj Guide" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-glow border-2 border-islamic-gold/30" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-islamic-gold flex items-center justify-center shadow-sm">
          <span className="text-[9px] sm:text-[10px] font-bold text-foreground">AI</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="font-arabic text-xl sm:text-2xl font-bold text-foreground mb-1 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {t("assalamuAlaikum")}
      </h2>
      <p className="text-sm sm:text-base text-muted-foreground mb-1 animate-fade-up" style={{ animationDelay: "150ms" }}>
        {t("welcomePilgrim")}
      </p>
      
      {/* Subtitle */}
      <p className="text-[11px] sm:text-xs text-muted-foreground max-w-xs mb-3 sm:mb-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
        {t("welcomeSubtitle")}
      </p>

      {/* Voice Assistant */}
      <div className="mb-4 sm:mb-6 animate-fade-up" style={{ animationDelay: "225ms" }}>
        <VoiceAssistant />
      </div>

      {/* Decorative Line */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 animate-fade-up" style={{ animationDelay: "250ms" }}>
        <div className="w-10 sm:w-12 h-px bg-border" />
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-islamic-gold" />
        <div className="w-10 sm:w-12 h-px bg-border" />
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-sm animate-fade-up" style={{ animationDelay: "300ms" }}>
        <p className="text-[11px] sm:text-xs text-muted-foreground mb-2.5 sm:mb-3 font-medium">
          {t("quickQuestions")}
        </p>
        <QuickActions onSelect={onQuickAction} />
      </div>
    </div>
  );
};
export default WelcomeScreen;
