import { memo } from "react";
import { MenuSection } from "./menuData";
import { DashboardMenuItem } from "./DashboardMenuItem";

interface DashboardSectionProps {
  section: MenuSection;
  language: string;
  onNavigate: (route: string) => void;
  badges?: Record<string, number>;
}

export const DashboardSection = memo(function DashboardSection({
  section,
  language,
  onNavigate,
  badges,
}: DashboardSectionProps) {
  return (
    <div className="space-y-3">
      {/* Section Header */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
        {section.title[language] || section.title.en}
      </h3>

      {/* Section Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {section.items.map((item) => (
          <DashboardMenuItem
            key={item.id}
            item={item}
            language={language}
            onNavigate={onNavigate}
            badge={badges?.[item.id]}
          />
        ))}
      </div>
    </div>
  );
});
