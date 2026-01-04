import { Link, useNavigate } from "react-router-dom";
import { useLanguage, LANGUAGES, Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "@/assets/logo.jpeg";

export const SimpleHeader = () => {
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Hajj Guide" 
            className="w-10 h-10 rounded-full"
          />
          <span className="text-lg font-semibold text-foreground">
            {t("hajjGuide")}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
            <SelectTrigger className="w-auto h-10 px-3 bg-muted border-0 text-foreground">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="cursor-pointer h-12">
                  <span className="font-medium">{lang.nativeName}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
              <DropdownMenuItem asChild className="h-12 text-base">
                <Link to="/prepare" className="cursor-pointer">
                  {t("preparation")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-12 text-base">
                <Link to="/rules" className="cursor-pointer">
                  {language === "ar" ? "قواعد السلوك" : language === "ur" ? "قواعد و آداب" : language === "hi" ? "नियम और आचरण" : "Rules & Conduct"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-12 text-base">
                <Link to="/family" className="cursor-pointer">
                  {t("familyGroup")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-12 text-base">
                <Link to="/family-status" className="cursor-pointer">
                  {t("familyStatus")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="h-12 text-base">
                <Link to="/family-dashboard" className="cursor-pointer">
                  {language === "ar" ? "لوحة حالة العائلة" : language === "ur" ? "فیملی اسٹیٹس ڈیش بورڈ" : language === "hi" ? "परिवार स्थिति डैशबोर्ड" : "Family Dashboard"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem className="h-12 text-muted-foreground">
                    <User className="w-4 h-4 mr-2" />
                    {user?.email?.split("@")[0]}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="h-12 text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("signOut")}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild className="h-12 text-base">
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
