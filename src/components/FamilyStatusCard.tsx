import { useLanguage } from "@/contexts/LanguageContext";
import { 
  STATUS_CONTENT, 
  CALMING_MESSAGE, 
  DASHBOARD_LABELS,
  PilgrimStatus 
} from "@/data/familyDashboardContent";
import { Circle, Info } from "lucide-react";

interface FamilyStatusCardProps {
  status: PilgrimStatus;
  pilgrimName: string;
  lastUpdated?: string;
}

export const FamilyStatusCard = ({ 
  status, 
  pilgrimName, 
  lastUpdated 
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

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], { 
      month: "short",
      day: "numeric",
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[60vh] px-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Status Card - Large, centered, calm */}
      <div 
        className={`
          w-full max-w-md p-8 rounded-3xl border-2
          ${colors.bg} ${colors.border} ${colors.glow}
          flex flex-col items-center gap-6
          transition-all duration-500 ease-in-out
        `}
      >
        {/* Status Icon - Large, pulsing for normal */}
        <div className={`relative ${status === "normal" ? "animate-pulse" : ""}`}>
          <Circle 
            className={`w-24 h-24 ${colors.icon}`} 
            fill="currentColor"
            strokeWidth={0}
          />
          <div 
            className={`
              absolute inset-0 w-24 h-24 rounded-full
              ${colors.icon} opacity-20
              ${status === "normal" ? "animate-ping" : ""}
            `}
            style={{ animationDuration: "3s" }}
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

        {/* Last Updated - subtle */}
        {lastUpdated && (
          <p className="text-sm text-muted-foreground/70">
            {labels.lastUpdated}: {formatTime(lastUpdated)}
          </p>
        )}
      </div>

      {/* Permanent Calming Message - Always visible */}
      <div className="mt-8 w-full max-w-md">
        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {calmingMessage.main}
            </p>
            <p className="text-xs text-muted-foreground">
              {calmingMessage.secondary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
