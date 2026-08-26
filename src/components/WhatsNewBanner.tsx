import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhatsNewBanner = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="animate-fade-up"
      style={{ animationDelay: "40ms" }}
    >
      <Link
        to="/changelog"
        className="group flex items-center gap-3 sm:gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3.5 sm:py-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={t("whatsNewSinceJuly1")}
      >
        <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-medium text-foreground leading-snug">
            {t("whatsNewSinceJuly1")}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 text-xs sm:text-sm font-medium text-primary">
          <span className="hidden sm:inline">{t("seeFullChangelog")}</span>
          <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </div>
      </Link>
    </div>
  );
};

export default WhatsNewBanner;
