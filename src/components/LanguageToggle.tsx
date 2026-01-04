import { useLanguage, LANGUAGES, Language } from "@/contexts/LanguageContext";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageToggle = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-9 sm:h-10 px-2 sm:px-3 gap-1.5 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLang?.nativeName}</span>
          <span className="sm:hidden">{currentLang?.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isRTL ? "start" : "end"} 
        className="w-48 bg-popover border border-border shadow-lg z-[100]"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="h-11 sm:h-12 text-sm sm:text-base cursor-pointer flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {language === lang.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
