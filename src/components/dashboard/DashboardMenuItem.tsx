import { memo, useCallback } from "react";
import { MenuItem } from "./menuData";
import { getPrefetchProps } from "@/hooks/useRoutePrefetch";
import { cn } from "@/lib/utils";

interface DashboardMenuItemProps {
  item: MenuItem;
  language: string;
  onNavigate: (route: string) => void;
}

export const DashboardMenuItem = memo(function DashboardMenuItem({
  item,
  language,
  onNavigate,
}: DashboardMenuItemProps) {
  const prefetchProps = getPrefetchProps(item.route);
  const isPriority = item.priority;
  const Icon = item.icon;
  const label = item.label[language] || item.label.en;

  const handleClick = useCallback(() => {
    onNavigate(item.route);
  }, [item.route, onNavigate]);

  return (
    <button
      onClick={handleClick}
      {...prefetchProps}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl",
        "bg-card border border-border/60 transition-all duration-300 touch-manipulation",
        "hover:shadow-elevated hover:border-border active:scale-[0.98]",
        "min-h-[120px] sm:min-h-[130px]", // Large touch targets for elderly
        isPriority && [
          "border-[hsl(var(--sacred-gold))]/25",
          "bg-gradient-to-br from-[hsl(var(--sacred-gold-soft))] to-card",
          "hover:border-[hsl(var(--sacred-gold))]/40",
          "hover:shadow-[0_8px_24px_-6px_hsl(var(--sacred-gold)/0.15)]"
        ]
      )}
      aria-label={label}
    >
      {/* Icon Container - Larger, cleaner */}
      <div
        className={cn(
          "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center",
          "transition-all duration-300",
          isPriority
            ? "bg-[hsl(var(--sacred-gold))]/12 ring-1 ring-[hsl(var(--sacred-gold))]/20"
            : "bg-primary/8"
        )}
      >
        <Icon
          className={cn(
            "w-7 h-7 sm:w-8 sm:h-8",
            isPriority ? "text-[hsl(var(--sacred-gold))]" : "text-primary"
          )}
          strokeWidth={1.5}
        />
      </div>

      {/* Label - Larger, more readable */}
      <span className="text-sm sm:text-base font-medium text-center leading-snug text-foreground">
        {label}
      </span>
    </button>
  );
});
