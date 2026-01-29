import { memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuIconProps {
  icon: LucideIcon;
  colorClass: string;
  className?: string;
  isSacred?: boolean;
}

// Spiritual color mapping using soft, calm colors
const colorStyles: Record<string, string> = {
  "icon-teal": "bg-[hsl(168_30%_94%)] text-[hsl(168_42%_28%)] dark:bg-[hsl(168_25%_15%)] dark:text-[hsl(168_35%_55%)]",
  "icon-sage": "bg-[hsl(145_25%_93%)] text-[hsl(145_35%_32%)] dark:bg-[hsl(145_20%_14%)] dark:text-[hsl(145_30%_55%)]",
  "icon-sand": "bg-[hsl(38_35%_93%)] text-[hsl(30_45%_35%)] dark:bg-[hsl(35_25%_14%)] dark:text-[hsl(38_40%_60%)]",
  "icon-gold": "bg-[hsl(42_50%_92%)] text-[hsl(42_65%_38%)] dark:bg-[hsl(42_35%_14%)] dark:text-[hsl(42_55%_55%)]",
  "icon-coral": "bg-[hsl(8_55%_94%)] text-[hsl(8_55%_45%)] dark:bg-[hsl(8_35%_14%)] dark:text-[hsl(8_50%_60%)]",
  "icon-sky": "bg-[hsl(200_45%_93%)] text-[hsl(200_55%_38%)] dark:bg-[hsl(200_30%_14%)] dark:text-[hsl(200_45%_55%)]",
  "icon-olive": "bg-[hsl(80_25%_92%)] text-[hsl(80_35%_32%)] dark:bg-[hsl(80_20%_14%)] dark:text-[hsl(80_30%_55%)]",
  "icon-plum": "bg-[hsl(280_25%_93%)] text-[hsl(280_35%_42%)] dark:bg-[hsl(280_20%_14%)] dark:text-[hsl(280_30%_60%)]",
  "icon-rose": "bg-[hsl(340_35%_94%)] text-[hsl(340_45%_42%)] dark:bg-[hsl(340_25%_14%)] dark:text-[hsl(340_35%_60%)]",
  "icon-emerald": "bg-[hsl(155_35%_92%)] text-[hsl(155_45%_32%)] dark:bg-[hsl(155_25%_14%)] dark:text-[hsl(155_40%_55%)]",
};

// Sacred gold styling for important items
const sacredStyles = "bg-gradient-to-br from-[hsl(42_60%_90%)] to-[hsl(38_55%_85%)] text-[hsl(42_70%_30%)] dark:from-[hsl(42_40%_18%)] dark:to-[hsl(38_35%_14%)] dark:text-[hsl(42_65%_60%)] ring-2 ring-[hsl(42_55%_70%)]/40 dark:ring-[hsl(42_50%_45%)]/30";

export const MenuIcon = memo(function MenuIcon({ 
  icon: Icon, 
  colorClass,
  className,
  isSacred = false
}: MenuIconProps) {
  return (
    <div 
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center",
        "transition-all duration-300",
        "border border-border/30",
        isSacred ? sacredStyles : colorStyles[colorClass] || colorStyles["icon-teal"],
        className
      )}
    >
      <Icon className={cn(
        "w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300",
        isSacred && "drop-shadow-sm"
      )} strokeWidth={1.5} />
    </div>
  );
});
