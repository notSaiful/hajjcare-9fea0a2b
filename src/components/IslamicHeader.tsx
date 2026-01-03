import { Compass } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const IslamicHeader = () => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm shadow-soft">
      <div className="container flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
            <Compass className="w-5 h-5 text-islamic-gold" />
          </div>
          <div>
            <h1 className="font-arabic text-lg font-bold text-primary-foreground leading-tight">
              {t("دليل الحج", "Hajj Guide")}
            </h1>
            <p className="text-xs text-primary-foreground/70">
              {t("مرشدك الذكي", "Your AI Guide")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <div className="font-arabic text-islamic-gold text-sm">
            {t("بسم الله", "Bismillah")}
          </div>
        </div>
      </div>
    </header>
  );
};

export default IslamicHeader;
