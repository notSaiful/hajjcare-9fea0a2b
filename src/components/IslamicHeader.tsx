import { MapPin, Users, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpeg";

const IslamicHeader = () => {
  const { t } = useLanguage();
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm shadow-soft">
      <div className="container flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Hajj Guide" className="w-10 h-10 rounded-full border-2 border-islamic-gold/50" />
          <div>
            <h1 className="font-arabic text-lg font-bold text-primary-foreground leading-tight">
              {t("hajjGuide")}
            </h1>
            <p className="text-xs text-primary-foreground/70">
              {t("yourAIGuide")}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/family">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Users className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <MapPin className="w-4 h-4" />
            </Button>
          </Link>
          <LanguageToggle />
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default IslamicHeader;
