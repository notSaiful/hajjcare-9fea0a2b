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

// 3D Green themed variants with depth and shadows
const colorVariants: Record<string, string> = {
  primary: "bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 text-white border-emerald-700 shadow-[0_4px_0_0_rgb(5,150,105),0_6px_10px_rgba(0,0,0,0.2)]",
  safe: "bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white border-green-700 shadow-[0_4px_0_0_rgb(22,101,52),0_6px_10px_rgba(0,0,0,0.2)]",
  muted: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 text-white border-gray-700 shadow-[0_4px_0_0_rgb(75,85,99),0_6px_10px_rgba(0,0,0,0.2)]",
  teal: "bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 text-white border-teal-700 shadow-[0_4px_0_0_rgb(15,118,110),0_6px_10px_rgba(0,0,0,0.2)]",
  amber: "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white border-amber-700 shadow-[0_4px_0_0_rgb(180,83,9),0_6px_10px_rgba(0,0,0,0.2)]",
  rose: "bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 text-white border-rose-700 shadow-[0_4px_0_0_rgb(159,18,57),0_6px_10px_rgba(0,0,0,0.2)]",
  violet: "bg-gradient-to-br from-violet-400 via-violet-500 to-violet-600 text-white border-violet-700 shadow-[0_4px_0_0_rgb(109,40,217),0_6px_10px_rgba(0,0,0,0.2)]",
  emerald: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white border-emerald-700 shadow-[0_4px_0_0_rgb(5,150,105),0_6px_10px_rgba(0,0,0,0.2)]",
  sky: "bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 text-white border-sky-700 shadow-[0_4px_0_0_rgb(3,105,161),0_6px_10px_rgba(0,0,0,0.2)]",
  orange: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white border-orange-700 shadow-[0_4px_0_0_rgb(194,65,12),0_6px_10px_rgba(0,0,0,0.2)]",
  pink: "bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 text-white border-pink-700 shadow-[0_4px_0_0_rgb(157,23,77),0_6px_10px_rgba(0,0,0,0.2)]",
  indigo: "bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 text-white border-indigo-700 shadow-[0_4px_0_0_rgb(67,56,202),0_6px_10px_rgba(0,0,0,0.2)]",
  lime: "bg-gradient-to-br from-lime-400 via-lime-500 to-lime-600 text-white border-lime-700 shadow-[0_4px_0_0_rgb(77,124,15),0_6px_10px_rgba(0,0,0,0.2)]",
  cyan: "bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 text-white border-cyan-700 shadow-[0_4px_0_0_rgb(14,116,144),0_6px_10px_rgba(0,0,0,0.2)]",
  fuchsia: "bg-gradient-to-br from-fuchsia-400 via-fuchsia-500 to-fuchsia-600 text-white border-fuchsia-700 shadow-[0_4px_0_0_rgb(162,28,175),0_6px_10px_rgba(0,0,0,0.2)]",
  yellow: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white border-yellow-700 shadow-[0_4px_0_0_rgb(161,98,7),0_6px_10px_rgba(0,0,0,0.2)]",
  red: "bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white border-red-700 shadow-[0_4px_0_0_rgb(185,28,28),0_6px_10px_rgba(0,0,0,0.2)]",
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
    "flex-shrink-0 rounded-full flex items-center justify-center border-2 transition-all duration-200",
    "hover:translate-y-[-2px] hover:shadow-[0_6px_0_0_currentColor,0_8px_12px_rgba(0,0,0,0.25)]",
    "active:translate-y-[2px] active:shadow-[0_1px_0_0_currentColor,0_2px_4px_rgba(0,0,0,0.2)]",
    sizeClasses[size]
  );

  const variantClasses = isCompleted
    ? "bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white border-green-700 shadow-[0_4px_0_0_rgb(22,101,52),0_6px_10px_rgba(0,0,0,0.2)]"
    : colorVariants[variant] || colorVariants.primary;

  return (
    <div className={cn(baseClasses, variantClasses, className)}>
      {isCompleted ? (
        <Check className={cn(iconSizeClasses[size], "drop-shadow-sm")} />
      ) : Icon ? (
        <Icon className={cn(iconSizeClasses[size], "transition-transform duration-300 drop-shadow-sm")} />
      ) : number !== undefined ? (
        <span className={cn(numberSizeClasses[size], "drop-shadow-sm")}>{number}</span>
      ) : null}
    </div>
  );
}