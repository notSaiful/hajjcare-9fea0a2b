import { memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuIconProps {
  icon: LucideIcon;
  colorClass: string;
  className?: string;
  isSacred?: boolean;
}

// Vivid, saturated gradient icons for extreme sunlight legibility
const colorStyles: Record<string, string> = {
  "icon-teal": "icon-vivid-teal",
  "icon-sage": "icon-vivid-sage",
  "icon-sand": "icon-vivid-sand",
  "icon-gold": "icon-vivid-gold",
  "icon-coral": "icon-vivid-coral",
  "icon-sky": "icon-vivid-sky",
  "icon-olive": "icon-vivid-olive",
  "icon-plum": "icon-vivid-plum",
  "icon-rose": "icon-vivid-rose",
  "icon-emerald": "icon-vivid-emerald",
};

// Sacred gold styling for Hajj/Makkah/Madinah
const sacredStyles = "bg-gradient-to-br from-[hsl(42_65%_52%)] to-[hsl(38_60%_42%)] text-[hsl(42_80%_97%)] ring-2 ring-[hsl(42_55%_60%)]/50 shadow-[0_4px_16px_-3px_hsl(42_60%_45%/0.45)]";

export const MenuIcon = memo(function MenuIcon({ 
  icon: Icon, 
  colorClass,
  className,
  isSacred = false
}: MenuIconProps) {
  return (
    <div 
      className={cn(
        "w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center",
        "transition-all duration-300",
        isSacred ? sacredStyles : colorStyles[colorClass] || "icon-vivid-teal",
        className
      )}
    >
      <Icon className={cn(
        "w-5.5 h-5.5 sm:w-6 sm:h-6 transition-transform duration-300",
        isSacred && "drop-shadow-sm"
      )} strokeWidth={2} />
    </div>
  );
});
