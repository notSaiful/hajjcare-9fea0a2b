import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-8 px-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
    >
      <Languages className="w-4 h-4 mr-1" />
      <span className="text-xs font-medium">
        {language === "ar" ? "EN" : "عربي"}
      </span>
    </Button>
  );
};

export default LanguageToggle;
