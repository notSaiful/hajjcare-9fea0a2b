import { LucideIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconCircleProps {
  icon?: LucideIcon;
  number?: number | string;
  isCompleted?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "safe" | "muted" | "teal" | "amber" | "rose" | "violet" | "emerald" | "sky" | "orange" | "pink" | "indigo" | "lime" | "cyan" | "fuchsia" | "yellow" | "red";
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

const colorVariants: Record<string, string> = {
  primary: "bg-primary/15 text-primary border-primary/30",
  safe: "bg-status-safe/15 text-status-safe border-status-safe/30",
  muted: "bg-muted text-muted-foreground border-muted",
  teal: "bg-teal-500/15 text-teal-600 border-teal-500/30",
  amber: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  rose: "bg-rose-500/15 text-rose-600 border-rose-500/30",
  violet: "bg-violet-500/15 text-violet-600 border-violet-500/30",
  emerald: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  sky: "bg-sky-500/15 text-sky-600 border-sky-500/30",
  orange: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  pink: "bg-pink-500/15 text-pink-600 border-pink-500/30",
  indigo: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30",
  lime: "bg-lime-500/15 text-lime-600 border-lime-500/30",
  cyan: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-600 border-fuchsia-500/30",
  yellow: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  red: "bg-red-500/15 text-red-600 border-red-500/30",
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
    "hover:scale-110 hover:shadow-lg hover:rotate-3",
    sizeClasses[size]
  );

  const variantClasses = isCompleted
    ? "bg-status-safe text-white border-status-safe/30"
    : colorVariants[variant] || colorVariants.primary;

  return (
    <div className={cn(baseClasses, variantClasses, className)}>
      {isCompleted ? (
        <Check className={iconSizeClasses[size]} />
      ) : Icon ? (
        <Icon className={cn(iconSizeClasses[size], "transition-transform duration-300")} />
      ) : number !== undefined ? (
        <span className={numberSizeClasses[size]}>{number}</span>
      ) : null}
    </div>
  );
}
