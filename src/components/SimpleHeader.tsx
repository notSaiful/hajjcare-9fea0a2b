import { Link } from "react-router-dom";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, Globe, Check, Sun, SunDim } from "lucide-react";
import { SunlightModeToggle } from "@/components/SunlightModeToggle";
import { LargeTextToggle } from "@/components/LargeTextToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/hajcare-ai-icon.jpg";

export const SimpleHeader = () => {
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { isAuthenticated, signOut, user } = useAuthContext();

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Logo & Title */}
        <Link to="/" className="flex items-center gap-3 min-w-0 group">
          <div className="relative">
            <img 
              src={logo} 
              alt="HajCare AI"
              width={44}
              height={44}
              sizes="44px"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex-shrink-0 shadow-soft transition-transform duration-300 group-hover:scale-105"
            />
            {/* Subtle glow */}
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-md -z-10" />
          </div>
          <span className="text-lg sm:text-xl font-semibold text-foreground truncate tracking-tight">
            HajCare AI
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sunlight Mode Toggle */}
          <SunlightModeToggle className="hidden sm:flex" />
          {/* Large Text Toggle for elderly */}
          <LargeTextToggle />
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                aria-label="Select language"
                className="h-10 sm:h-11 px-3 sm:px-4 gap-2 text-sm rounded-xl hover:bg-muted/80 transition-colors duration-300"
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="hidden sm:inline font-medium">{currentLang?.nativeName}</span>
                <span className="sm:hidden font-medium">{currentLang?.code.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isRTL ? "start" : "end"} 
              className="max-h-[min(70vh,34rem)] w-52 overflow-y-auto bg-popover/95 backdrop-blur-md border border-border/50 shadow-elevated rounded-xl z-[100] p-1"
            >
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="h-12 sm:h-13 text-sm sm:text-base cursor-pointer flex items-center justify-between rounded-lg px-3 transition-colors duration-200"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{lang.name}</span>
                  </div>
                  {language === lang.code && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Open navigation menu"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-muted/80 transition-colors duration-300"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isRTL ? "start" : "end"} 
              className="w-60 bg-popover/95 backdrop-blur-md border border-border/50 shadow-elevated rounded-xl z-[100] p-1"
            >
              {/* Sunlight Mode - visible on mobile */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  const root = document.documentElement;
                  root.classList.toggle("sunlight");
                  if (root.classList.contains("sunlight")) root.classList.remove("dark");
                }}
                className="h-12 text-sm sm:text-base rounded-lg px-3 sm:hidden cursor-pointer"
              >
                <Sun className="w-4 h-4 mr-2 text-accent" />
                ☀️ Sunlight Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 sm:hidden" />
              <DropdownMenuItem asChild className="h-12 text-sm sm:text-base rounded-lg px-3">
                <Link to="/prepare" className="cursor-pointer">
                  {t("preparation")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-12 text-sm sm:text-base rounded-lg px-3">
                <Link to="/rules" className="cursor-pointer">
                  {language === "ar" ? "قواعد السلوك" : language === "ur" ? "قواعد و آداب" : language === "hi" ? "नियम और आचरण" : "Rules & Conduct"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-12 text-sm sm:text-base rounded-lg px-3">
                <Link to="/sukoon-tracking" className="cursor-pointer">
                  {language === "ar" ? "نظام سكون للتتبع" : language === "ur" ? "سکون ٹریکنگ سسٹم" : language === "hi" ? "सुकून ट्रैकिंग सिस्टम" : "Sukoon Tracking System"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem className="h-12 text-muted-foreground text-sm rounded-lg px-3">
                    <User className="w-4 h-4 mr-2" />
                    {user?.email?.split("@")[0]}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="h-12 text-destructive text-sm sm:text-base rounded-lg px-3"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("signOut")}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild className="h-12 text-sm sm:text-base rounded-lg px-3">
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
