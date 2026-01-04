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
    containerClass: "status-safe",
    iconBgClass: "bg-[hsl(var(--status-safe)/0.15)]",
  },
  assistance: {
    icon: AlertCircle,
    labelKey: "statusAssistance" as const,
    containerClass: "status-assistance",
    iconBgClass: "bg-[hsl(var(--status-assistance)/0.15)]",
  },
  emergency: {
    icon: Phone,
    labelKey: "statusEmergency" as const,
    containerClass: "status-emergency",
    iconBgClass: "bg-[hsl(var(--status-emergency)/0.15)]",
  },
};

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const { t } = useLanguage();
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`
        relative overflow-hidden
        flex items-center justify-center gap-3 sm:gap-4
        px-6 sm:px-8 py-4 sm:py-5
        rounded-2xl border
        ${config.containerClass}
        ${status === "safe" ? "pulse-status" : ""}
        transition-all duration-500 ease-out
        ${className}
      `}
    >
      {/* Icon with soft background */}
      <div className={`
        flex items-center justify-center
        w-10 h-10 sm:w-12 sm:h-12
        rounded-xl
        ${config.iconBgClass}
      `}>
        <Icon 
          className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" 
          strokeWidth={2} 
        />
      </div>
      
      {/* Status text */}
      <div className="flex flex-col items-start">
        <span className="text-xs sm:text-sm font-medium opacity-70 uppercase tracking-wide">
          {t("currentStatus")}
        </span>
        <span className="text-lg sm:text-xl font-semibold tracking-tight">
          {t(config.labelKey)}
        </span>
      </div>

      {/* Subtle shimmer overlay for safe status */}
      {status === "safe" && (
        <div 
          className="absolute inset-0 shimmer-sacred pointer-events-none"
          style={{ opacity: 0.3 }}
        />
      )}
    </div>
  );
};
