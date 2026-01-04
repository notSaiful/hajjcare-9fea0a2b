import { Check, AlertCircle, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type StatusType = "safe" | "assistance" | "emergency";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  safe: {
    icon: Check,
    labelKey: "statusSafe" as const,
    bgClass: "bg-status-safe-bg",
    textClass: "text-status-safe",
    borderClass: "border-status-safe/30",
  },
  assistance: {
    icon: AlertCircle,
    labelKey: "statusAssistance" as const,
    bgClass: "bg-status-assistance-bg",
    textClass: "text-status-assistance",
    borderClass: "border-status-assistance/30",
  },
  emergency: {
    icon: Phone,
    labelKey: "statusEmergency" as const,
    bgClass: "bg-status-emergency-bg",
    textClass: "text-status-emergency",
    borderClass: "border-status-emergency/30",
  },
};

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const { t } = useLanguage();
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-center justify-center gap-2.5 sm:gap-3 
        px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2
        ${config.bgClass} ${config.textClass} ${config.borderClass}
        ${status === "safe" ? "pulse-status" : ""}
        ${className}
      `}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" strokeWidth={2.5} />
      <span className="text-base sm:text-lg font-semibold">{t(config.labelKey)}</span>
    </div>
  );
};
