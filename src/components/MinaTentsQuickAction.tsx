import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tent, Hash, ArrowRight, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MINA_MAKTABS } from "@/data/minaTentLocations";
import { getMinaTentsLabels } from "@/data/minaTentsContent";
import { normalizeNumerals } from "@/lib/minaSearch";

/**
 * Mina Tent Locations quick-action card on Home page.
 * - Browse all maktabs
 * - Direct maktab number entry → /mina-tents/:id
 */
export const MinaTentsQuickAction = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [num, setNum] = useState("");

  const labels = getMinaTentsLabels(language);
  const t = {
    title: labels.qaTitle,
    subtitle: labels.qaSubtitle,
    placeholder: labels.qaPlaceholder,
    find: labels.qaOpen,
    browse: labels.qaBrowse(MINA_MAKTABS.length),
  };

  const handleFind = () => {
    const n = normalizeNumerals(num.trim());
    if (!n) {
      navigate("/mina-tents");
      return;
    }
    const exists = MINA_MAKTABS.some((m) => String(m.maktab) === n);
    navigate(exists ? `/mina-tents/${n}` : `/mina-tents`);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-soft space-y-3" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-islamic-gold/15 flex items-center justify-center shrink-0">
          <Tent className="w-6 h-6 text-islamic-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base leading-tight">{t.title}</h3>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t.placeholder}
            value={num}
            onChange={(e) => setNum(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFind()}
            className="pl-9 rounded-xl h-12 text-base font-medium bg-background"
            min={1}
            max={35}
            aria-label={t.placeholder}
          />
        </div>
        <Button
          onClick={handleFind}
          size="lg"
          className="rounded-xl h-12 px-4 gap-1.5 font-semibold"
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">{t.find}</span>
        </Button>
      </div>

      <button
        onClick={() => navigate("/mina-tents")}
        className="w-full flex items-center justify-center gap-1 text-xs text-primary hover:underline font-medium py-1.5"
      >
        {t.browse}
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
