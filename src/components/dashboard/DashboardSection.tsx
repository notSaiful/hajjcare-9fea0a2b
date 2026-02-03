import { memo } from "react";
import { MenuSection } from "./menuData";
import { DashboardMenuItem } from "./DashboardMenuItem";

interface DashboardSectionProps {
  section: MenuSection;
  language: string;
  onNavigate: (route: string) => void;
}

export const DashboardSection = memo(function DashboardSection({
  section,
  language,
  onNavigate,
}: DashboardSectionProps) {
  return (
    <div className="space-y-4">
      {/* Section Header - Clean, subtle with decorative line */}
      <div className="flex items-center gap-3 px-1">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {section.title[language] || section.title.en}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-border/60 to-transparent" />
      </div>

      {/* Section Grid - 2 columns, generous spacing */}
      <div className="grid grid-cols-2 gap-4">
        {section.items.map((item) => (
          <DashboardMenuItem
            key={item.id}
            item={item}
            language={language}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
});
