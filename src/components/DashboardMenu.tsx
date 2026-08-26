import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { menuSections } from "./dashboard/menuData";
import { DashboardSection } from "./dashboard/DashboardSection";
import { usePendingLinkCount } from "@/hooks/usePendingLinkCount";
import { useStartHereTranslations } from "@/hooks/useStartHereTranslations";

const ESSENTIAL_ITEM_IDS = new Set([
  "pre-hajj", "rules", "hajj-training-videos", "assistant", "directory", "circulars",
]);
const START_HERE_ORDER = ["circulars"];

const menuCopy: Record<string, { essentials: string; explore: string }> = {
  en: { essentials: "Start here", explore: "Explore all guidance and tools" },
  hi: { essentials: "यहाँ से शुरू करें", explore: "सभी मार्गदर्शन और उपकरण देखें" },
  ur: { essentials: "یہاں سے شروع کریں", explore: "تمام رہنمائی اور آلات دیکھیں" },
  ar: { essentials: "ابدأ من هنا", explore: "استكشف كل الإرشادات والأدوات" },
};

export const DashboardMenu = memo(function DashboardMenu() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const pendingLinks = usePendingLinkCount();

  const badges = useMemo<Record<string, number>>(() => {
    const b: Record<string, number> = {};
    if (pendingLinks > 0) b.family = pendingLinks;
    return b;
  }, [pendingLinks]);

  const { essentialItems, additionalSections } = useMemo(() => {
    const items = menuSections.flatMap((section) => section.items);
    return {
      essentialItems: items
        .filter((item) => ESSENTIAL_ITEM_IDS.has(item.id))
        .sort((a, b) => {
          const aIndex = START_HERE_ORDER.indexOf(a.id);
          const bIndex = START_HERE_ORDER.indexOf(b.id);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        }),
      additionalSections: menuSections
        .map((section) => ({ ...section, items: section.items.filter((item) => !ESSENTIAL_ITEM_IDS.has(item.id) && item.id !== "shi-dashboard-demo") }))
        .filter((section) => section.items.length > 0),
    };
  }, []);
  const copy = menuCopy[language] || menuCopy.en;
  const startHere = useStartHereTranslations(essentialItems, language, copy.essentials);

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
      <div className="space-y-2">
        <DashboardSection
          section={{ id: "essentials", title: { en: "Start here", [language]: startHere.translatedTitle }, items: startHere.translatedItems }}
          language={language}
          onNavigate={handleNavigate}
          badges={badges}
          enableSpeech
        />
        {startHere.state === "translating" && (
          <p className="px-1 text-xs text-muted-foreground" role="status">Translating Start Here guidance…</p>
        )}
        {startHere.usedFallback && (
          <p className="px-1 text-xs text-muted-foreground" role="status">
            A safe translation was not available for every item, so the original wording is shown.
          </p>
        )}
      </div>
      <details className="group rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-card to-amber-50/70 px-3 py-1 shadow-sm transition-colors open:bg-primary/10 open:pb-4 dark:to-amber-950/20">
        <summary className="min-h-14 cursor-pointer list-none rounded-xl px-2 py-3 text-sm font-bold text-primary marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <span className="flex items-center justify-between gap-4">
            {copy.explore}
            <span aria-hidden className="text-lg transition-transform group-open:rotate-45">+</span>
          </span>
        </summary>
        <div className="space-y-6 pt-3">
          {additionalSections.map((section) => (
        <DashboardSection
          key={section.id}
          section={section}
          language={language}
          onNavigate={handleNavigate}
          badges={badges}
        />
          ))}
        </div>
      </details>
    </div>
  );
});
