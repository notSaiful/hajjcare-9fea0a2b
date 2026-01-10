import { LucideIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconCircleProps {
  icon?: LucideIcon;
  number?: number | string;
  isCompleted?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "safe" | "muted";
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10 sm:w-12 sm:h-12",
  md: "w-14 h-14 sm:w-16 sm:h-16",
  lg: "w-16 h-16 sm:w-20 sm:h-20",
};

const iconSizeClasses = {
  sm: "w-5 h-5 sm:w-6 sm:h-6",
  md: "w-6 h-6 sm:w-7 sm:h-7",
  lg: "w-8 h-8 sm:w-10 sm:h-10",
};

const numberSizeClasses = {
  sm: "text-sm sm:text-base font-semibold",
  md: "text-lg sm:text-xl font-bold",
  lg: "text-xl sm:text-2xl font-bold",
};

export function IconCircle({
  icon: Icon,
  number,
  isCompleted = false,
  size = "md",
  variant = "primary",
  className,
}: IconCircleProps) {
  const baseClasses = cn(
    "flex-shrink-0 rounded-full flex items-center justify-center shadow-soft border-2 transition-all duration-300",
    "hover:scale-105 hover:shadow-md",
    sizeClasses[size]
  );

  const variantClasses = isCompleted
    ? "bg-status-safe text-white border-status-safe/30"
    : variant === "primary"
    ? "bg-primary/10 text-primary border-primary/20"
    : variant === "safe"
    ? "bg-status-safe/10 text-status-safe border-status-safe/20"
    : "bg-muted text-muted-foreground border-muted";

  return (
    <div className={cn(baseClasses, variantClasses, className)}>
      {isCompleted ? (
        <Check className={iconSizeClasses[size]} />
      ) : Icon ? (
        <Icon className={iconSizeClasses[size]} />
      ) : number !== undefined ? (
        <span className={numberSizeClasses[size]}>{number}</span>
      ) : null}
    </div>
  );
}
