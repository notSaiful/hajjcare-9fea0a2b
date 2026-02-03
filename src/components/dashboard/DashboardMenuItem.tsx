import { memo, useCallback } from "react";
import { MenuItem } from "./menuData";
import { MenuIcon } from "./MenuIcon";
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
        "flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl",
        "bg-card border transition-all duration-200 touch-manipulation",
        "hover:shadow-md active:scale-[0.98]",
        "min-h-[100px] sm:min-h-[110px]", // Larger touch targets for elderly
        isPriority
          ? "border-[hsl(42,60%,50%)]/30 bg-gradient-to-br from-[hsl(42,60%,97%)] to-[hsl(38,55%,94%)] dark:from-[hsl(42,30%,12%)] dark:to-[hsl(38,25%,10%)] hover:shadow-[0_4px_12px_hsl(42,60%,50%,0.15)]"
          : "border-border/50 hover:border-border"
      )}
      aria-label={label}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center",
          "transition-transform duration-200",
          isPriority
            ? "bg-[hsl(42,60%,50%)]/15 ring-2 ring-[hsl(42,60%,50%)]/20"
            : "bg-primary/10"
        )}
      >
        <Icon
          className={cn(
            "w-6 h-6 sm:w-7 sm:h-7",
            isPriority ? "text-[hsl(42,60%,45%)]" : "text-primary"
          )}
          strokeWidth={1.75}
        />
      </div>

      {/* Label */}
      <span
        className={cn(
          "text-sm sm:text-base font-medium text-center leading-tight",
          isPriority ? "text-foreground" : "text-foreground/90"
        )}
      >
        {label}
      </span>
    </button>
  );
});
