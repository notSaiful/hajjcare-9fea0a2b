import { memo, useCallback } from "react";
import { MenuItem } from "./menuData";
import { MenuIcon } from "./MenuIcon";
import { getPrefetchProps } from "@/hooks/useRoutePrefetch";
import { cn } from "@/lib/utils";

interface DashboardMenuItemProps {
  item: MenuItem;
  language: string;
  onNavigate: (route: string) => void;
  badge?: number;
}

// Sacred items that receive gold accent treatment
const SACRED_ITEMS = new Set(["hajj", "makkah", "madinah"]);

export const DashboardMenuItem = memo(function DashboardMenuItem({
  item,
  language,
  onNavigate,
  badge,
}: DashboardMenuItemProps) {
  const prefetchProps = getPrefetchProps(item.route);
  const isSacred = SACRED_ITEMS.has(item.id);

  const handleClick = useCallback(() => {
    onNavigate(item.route);
  }, [item.route, onNavigate]);

  return (
    <button
      onClick={handleClick}
      {...prefetchProps}
      className={cn(
        "relative flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl",
        "bg-card/60 border border-border/30",
        "transition-all duration-300 ease-out",
        "group active:scale-[0.97] touch-manipulation select-none",
        // Hover states
        "hover:bg-card hover:border-border/60 hover:shadow-soft",
        "hover:-translate-y-0.5",
        // Sacred items get enhanced styling
        isSacred && [
          "ring-1 ring-[hsl(42_50%_70%)]/20 dark:ring-[hsl(42_45%_50%)]/15",
          "hover:ring-[hsl(42_55%_65%)]/40 dark:hover:ring-[hsl(42_50%_55%)]/30",
          "hover:shadow-[0_4px_20px_-4px_hsl(42_60%_50%/0.15)]",
          "dark:hover:shadow-[0_4px_20px_-4px_hsl(42_50%_40%/0.2)]"
        ]
      )}
    >
      {badge != null && badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1 shadow-sm animate-fade-in">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
      <MenuIcon
        icon={item.icon}
        colorClass={item.colorClass}
        isSacred={isSacred}
        className={cn(
          "transition-all duration-300 ease-out",
          "group-hover:scale-105",
          isSacred && "group-hover:scale-110 group-hover:rotate-1"
        )}
      />
      <span className={cn(
        "text-xs sm:text-sm font-medium text-foreground/90",
        "text-center leading-tight line-clamp-2 min-h-[2.5rem]",
        "flex items-center transition-colors duration-200",
        isSacred && "group-hover:text-[hsl(42_65%_35%)] dark:group-hover:text-[hsl(42_55%_65%)]"
      )}>
        {item.label[language] || item.label.en}
      </span>
    </button>
  );
});
