import { useLanguage } from "@/contexts/LanguageContext";
import { 
  STATUS_CONTENT, 
  CALMING_MESSAGE, 
  DASHBOARD_LABELS,
  PilgrimStatus 
} from "@/data/familyDashboardContent";
import { Circle, Shield } from "lucide-react";

interface FamilyStatusCardProps {
  status: PilgrimStatus;
  pilgrimName: string;
}

/**
 * Family Status Card - "No News = All Is Well" Protocol
 * 
 * This component follows strict silence-based reassurance rules:
 * - NO timestamps (creates refresh anxiety)
 * - NO loading indicators
 * - NO activity animations
 * - NO refresh buttons
 * - One signal, one message, calm presentation
 */
export const FamilyStatusCard = ({ 
  status, 
  pilgrimName, 
}: FamilyStatusCardProps) => {
  const { language, isRTL } = useLanguage();
  
  const statusContent = STATUS_CONTENT[language][status];
  const calmingMessage = CALMING_MESSAGE[language];
  const labels = DASHBOARD_LABELS[language];

  const getStatusColorClasses = (color: "green" | "yellow" | "red") => {
    switch (color) {
      case "green":
        return {
          bg: "bg-status-safe-bg",
          border: "border-status-safe/30",
          icon: "text-status-safe",
          glow: "shadow-[0_0_40px_rgba(34,197,94,0.15)]",
        };
      case "yellow":
        return {
          bg: "bg-status-assistance-bg",
          border: "border-status-assistance/30",
          icon: "text-status-assistance",
          glow: "shadow-[0_0_40px_rgba(234,179,8,0.15)]",
        };
      case "red":
        return {
          bg: "bg-status-emergency-bg",
          border: "border-status-emergency/30",
          icon: "text-status-emergency",
          glow: "shadow-[0_0_40px_rgba(239,68,68,0.15)]",
        };
    }
  };

  const colors = getStatusColorClasses(statusContent.color);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[60vh] px-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Status Card - Static, calm, no activity indicators */}
      <div 
        className={`
          w-full max-w-md p-8 rounded-3xl border-2
          ${colors.bg} ${colors.border} ${colors.glow}
          flex flex-col items-center gap-6
        `}
      >
        {/* Status Icon - Static, no animations */}
        <div className="relative">
          <Circle 
            className={`w-24 h-24 ${colors.icon}`} 
            fill="currentColor"
            strokeWidth={0}
          />
        </div>

        {/* Status Label */}
        <h2 className="text-2xl font-bold text-foreground text-center">
          {statusContent.label}
        </h2>

        {/* Pilgrim Name */}
        <p className="text-lg text-muted-foreground text-center">
          {labels.pilgrimName}: <span className="font-medium text-foreground">{pilgrimName}</span>
        </p>

        {/* Status Description */}
        <p className="text-center text-muted-foreground leading-relaxed">
          {statusContent.description}
        </p>

        {/* NO TIMESTAMP - Silence protocol */}
      </div>

      {/* Permanent Calming Message - ALWAYS visible, NEVER hidden */}
      <div className="mt-8 w-full max-w-md">
        <div className="flex items-start gap-3 p-5 bg-primary/5 rounded-xl border border-primary/20">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-base font-medium text-foreground leading-snug">
              {calmingMessage.main}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {calmingMessage.secondary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
