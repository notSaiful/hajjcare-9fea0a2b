import { memo, useCallback } from "react";
import { MenuItem } from "./menuData";
import { MenuIcon } from "./MenuIcon";
import { getPrefetchProps } from "@/hooks/useRoutePrefetch";

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

  const handleClick = useCallback(() => {
    onNavigate(item.route);
  }, [item.route, onNavigate]);

  return (
    <button
      onClick={handleClick}
      {...prefetchProps}
      className="flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl 
                 bg-card/60 hover:bg-card border border-border/30 
                 hover:border-border/60 transition-all duration-200 
                 hover:shadow-soft group active:scale-[0.98] 
                 touch-manipulation select-none"
    >
      <MenuIcon
        icon={item.icon}
        colorClass={item.colorClass}
        className="group-hover:scale-105 transition-transform duration-200"
      />
      <span className="text-xs sm:text-sm font-medium text-foreground/90 
                       text-center leading-tight line-clamp-2 min-h-[2.5rem] 
                       flex items-center">
        {item.label[language] || item.label.en}
      </span>
    </button>
  );
});
