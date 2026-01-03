import { Compass, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

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
              {t("hajjGuide")}
            </h1>
            <p className="text-xs text-primary-foreground/70">
              {t("yourAIGuide")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/map">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-xs">{t("liveMap")}</span>
            </Button>
          </Link>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default IslamicHeader;
