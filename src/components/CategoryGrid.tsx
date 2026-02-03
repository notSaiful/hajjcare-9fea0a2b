import { LucideIcon } from "lucide-react";
import { IconCircle } from "@/components/IconCircle";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  icon: LucideIcon;
  label: string | Record<string, string>;
  color?: string;
  description?: string | Record<string, string>;
}

interface CategoryGridProps {
  items: CategoryItem[];
  onSelect: (id: string) => void;
  columns?: 2 | 3 | 4;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const columnClasses = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
};

export function CategoryGrid({
  items,
  onSelect,
  columns = 4,
  size = "sm",
  className,
}: CategoryGridProps) {
  const { language } = useLanguage();

  const getLabel = (label: string | Record<string, string>) =>
    typeof label === "string" ? label : label[language] || label.en || "";

  return (
    <div className={cn("grid gap-3", columnClasses[columns], className)}>
      {items.map((item) => (
        <Card
          key={item.id}
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] border-2 border-border/50 hover:border-primary/30"
          onClick={() => onSelect(item.id)}
        >
          <CardContent className="p-4 flex flex-col items-center text-center gap-3">
            <IconCircle
              icon={item.icon}
              size={size}
              variant={(item.color as any) || "primary"}
            />
            <span className="text-sm font-medium text-foreground leading-tight">
              {getLabel(item.label)}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
