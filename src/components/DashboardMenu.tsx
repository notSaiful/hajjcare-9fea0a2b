import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { menuSections } from "./dashboard/menuData";
import { DashboardSection } from "./dashboard/DashboardSection";

export const DashboardMenu = memo(function DashboardMenu() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleNavigate = useCallback(
    (route: string) => {
      // Haptic feedback
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
        />
      ))}
    </div>
  );
});
