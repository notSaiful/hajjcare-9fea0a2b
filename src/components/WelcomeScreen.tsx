import { Compass } from "lucide-react";
import QuickActions from "./QuickActions";

interface WelcomeScreenProps {
  onQuickAction: (question: string) => void;
}

const WelcomeScreen = ({ onQuickAction }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 islamic-pattern opacity-30 pointer-events-none" />
      
      {/* Logo */}
      <div className="relative mb-6 animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-glow">
          <Compass className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-islamic-gold flex items-center justify-center">
          <span className="text-xs font-bold text-foreground">AI</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="font-arabic text-3xl font-bold text-foreground mb-2 animate-fade-up" style={{ animationDelay: "100ms" }}>
        السلام عليكم
      </h2>
      <p className="text-lg text-muted-foreground mb-2 animate-fade-up" style={{ animationDelay: "150ms" }}>
        Welcome, Dear Pilgrim
      </p>
      
      {/* Subtitle */}
      <p className="text-sm text-muted-foreground max-w-xs mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
        I'm your Hajj guide. Ask me anything about the rituals, duas, or practical guidance for your blessed journey.
      </p>

      {/* Decorative Line */}
      <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: "250ms" }}>
        <div className="w-12 h-px bg-border" />
        <div className="w-2 h-2 rotate-45 bg-islamic-gold" />
        <div className="w-12 h-px bg-border" />
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-sm animate-fade-up" style={{ animationDelay: "300ms" }}>
        <p className="text-xs text-muted-foreground mb-3 font-medium">
          Quick Questions • أسئلة سريعة
        </p>
        <QuickActions onSelect={onQuickAction} />
      </div>
    </div>
  );
};

export default WelcomeScreen;
