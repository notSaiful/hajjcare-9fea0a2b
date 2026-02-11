import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { menuSections } from "./dashboard/menuData";
import { DashboardSection } from "./dashboard/DashboardSection";
import { usePendingLinkCount } from "@/hooks/usePendingLinkCount";

export const DashboardMenu = memo(function DashboardMenu() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const pendingLinks = usePendingLinkCount();

  const badges = useMemo<Record<string, number>>(() => {
    const b: Record<string, number> = {};
    if (pendingLinks > 0) b.family = pendingLinks;
    return b;
  }, [pendingLinks]);

  const handleNavigate = useCallback(
    (route: string) => {
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
      navigate(route);
    },
    [navigate]
  );

  return (
    <div className="space-y-6">
      {menuSections.map((section) => (
        <DashboardSection
          key={section.id}
          section={section}
          language={language}
          onNavigate={handleNavigate}
          badges={badges}
        />
      ))}
    </div>
  );
});
