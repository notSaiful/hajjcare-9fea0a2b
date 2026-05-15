import { Link } from "react-router-dom";
import { LifeBuoy, ArrowRight, Navigation, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getReturnToCampLabels } from "@/data/returnToCampContent";

export const ReturnToCampQuickAction = () => {
  const { language, isRTL } = useLanguage();
  const t = getReturnToCampLabels(language);

  return (
    <Link
      to="/return-to-camp"
      className="block focus:outline-none focus:ring-4 focus:ring-destructive/40 rounded-2xl"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={t.qaCta}
    >
      <div
        className="
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br from-destructive/10 via-card to-islamic-gold/10
          border-2 border-destructive/40
          shadow-soft hover:shadow-md active:scale-[0.99]
          transition-all p-4 sm:p-5
        "
      >
        {/* Emergency badge */}
        <div className="absolute top-3 end-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse" />
            {t.qaBadge}
          </span>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-destructive/15 flex items-center justify-center shrink-0 ring-2 ring-destructive/20">
            <LifeBuoy className="w-8 h-8 text-destructive" />
          </div>
          <div className="flex-1 min-w-0 pe-12">
            <h3 className="font-bold text-lg sm:text-xl leading-tight text-foreground">
              {t.qaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-snug">
              {t.qaSubtitle}
            </p>
          </div>
        </div>

        {/* Mini action chips for quick visual recognition */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
            <Navigation className="w-3 h-3" /> {t.navigateToCamp}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-semibold">
            <Phone className="w-3 h-3" /> {t.callGroupLeader}
          </span>
          <span className={`ms-auto inline-flex items-center gap-1 text-primary text-xs font-bold ${isRTL ? "" : ""}`}>
            {t.qaCta}
            <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </span>
        </div>
      </div>
    </Link>
  );
};
