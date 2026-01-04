import { Link, useNavigate } from "react-router-dom";
import { useLanguage, LANGUAGES, Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.jpeg";

export const SimpleHeader = () => {
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img 
            src={logo} 
            alt="Hajj Guide" 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
          />
          <span className="text-base sm:text-lg font-semibold text-foreground truncate">
            {t("hajjGuide")}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Selector - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-9 sm:h-10 px-2 sm:px-3 gap-1.5 sm:gap-2 text-sm"
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

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isRTL ? "start" : "end"} 
              className="w-56 bg-popover border border-border shadow-lg z-[100]"
            >
              <DropdownMenuItem asChild className="h-11 sm:h-12 text-sm sm:text-base">
                <Link to="/prepare" className="cursor-pointer">
                  {t("preparation")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-11 sm:h-12 text-sm sm:text-base">
                <Link to="/rules" className="cursor-pointer">
                  {language === "ar" ? "قواعد السلوك" : language === "ur" ? "قواعد و آداب" : language === "hi" ? "नियम और आचरण" : "Rules & Conduct"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-11 sm:h-12 text-sm sm:text-base">
                <Link to="/family" className="cursor-pointer">
                  {t("familyGroup")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-11 sm:h-12 text-sm sm:text-base">
                <Link to="/family-status" className="cursor-pointer">
                  {t("familyStatus")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-11 sm:h-12 text-sm sm:text-base">
                <Link to="/family-dashboard" className="cursor-pointer">
                  {language === "ar" ? "لوحة حالة العائلة" : language === "ur" ? "فیملی اسٹیٹس ڈیش بورڈ" : language === "hi" ? "परिवार स्थिति डैशबोर्ड" : "Family Dashboard"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem className="h-11 sm:h-12 text-muted-foreground text-sm">
                    <User className="w-4 h-4 mr-2" />
                    {user?.email?.split("@")[0]}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="h-11 sm:h-12 text-destructive text-sm sm:text-base"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("signOut")}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild className="h-11 sm:h-12 text-sm sm:text-base">
                  <Link to="/auth" className="cursor-pointer">
                    {t("signIn")}
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
