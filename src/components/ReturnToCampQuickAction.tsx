import { Link } from "react-router-dom";
import { LifeBuoy, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getReturnToCampLabels } from "@/data/returnToCampContent";

export const ReturnToCampQuickAction = () => {
  const { language, isRTL } = useLanguage();
  const t = getReturnToCampLabels(language);

  return (
    <Link
      to="/return-to-camp"
      className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-card border-2 border-islamic-gold/40 rounded-2xl p-4 sm:p-5 shadow-soft transition-all hover:shadow-md active:scale-[0.99]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-islamic-gold/15 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-7 h-7 text-islamic-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight">{t.qaTitle}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{t.qaSubtitle}</p>
          </div>
          <ArrowRight className={`w-5 h-5 text-primary shrink-0 ${isRTL ? "rotate-180" : ""}`} />
        </div>
      </div>
    </Link>
  );
};
