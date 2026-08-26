import { memo, useCallback } from "react";
import { MenuItem } from "./menuData";
import { MenuIcon } from "./MenuIcon";
import { getPrefetchProps } from "@/hooks/useRoutePrefetch";
import { cn } from "@/lib/utils";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";

interface DashboardMenuItemProps {
  item: MenuItem;
  language: string;
  onNavigate: (route: string) => void;
  badge?: number;
  enableSpeech?: boolean;
}

// Sacred items that receive gold accent treatment
const SACRED_ITEMS = new Set(["hajj", "makkah", "madinah"]);

export const DashboardMenuItem = memo(function DashboardMenuItem({
  item,
  language,
  onNavigate,
  badge,
  enableSpeech = false,
}: DashboardMenuItemProps) {
  const prefetchProps = getPrefetchProps(item.route);
  const isSacred = SACRED_ITEMS.has(item.id);

  const handleClick = useCallback(() => {
    onNavigate(item.route);
  }, [item.route, onNavigate]);

  const label = item.label[language] || item.label.en;

  return (
    <div
      className={cn(
        "relative min-h-28 rounded-xl sm:min-h-32",
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
      <button
        type="button"
        onClick={handleClick}
        {...prefetchProps}
        className={cn(
          "group flex min-h-28 w-full flex-col items-center justify-center gap-2 p-3 sm:min-h-32 sm:p-4",
          "transition-all duration-300 ease-out",
          "active:scale-[0.97] touch-manipulation select-none",
        )}
      >
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
          {label}
        </span>
      </button>
      {enableSpeech && (
        <TextToSpeechButton
          text={label}
          languageCode={language}
          size="icon"
          variant="ghost"
          showLabel={false}
          className="absolute end-1 top-1 h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
        />
      )}
    </div>
  );
});
