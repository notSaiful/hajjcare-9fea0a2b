import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Footer } from "@/components/Footer";
import { SimpleDashboard } from "@/components/SimpleDashboard";
import kaabaGreenDome from "@/assets/kaaba-green-dome-new.jpeg";

const HomePage = () => {
  const { isRTL, language } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const titleLabels = {
    en: "HAJ CARE AI",
    ar: "رعاية الحج",
    ur: "حج کیئر",
    hi: "हज केयर",
    ta: "ஹஜ் கேர்",
    te: "హజ్ కేర్",
    mr: "हज केअर",
    bn: "হজ কেয়ার",
    or: "ହଜ କେୟାର",
    ml: "ഹജ്ജ് കെയർ",
    pa: "ਹੱਜ ਕੇਅਰ",
  };

  const subtitleLabels = {
    en: "Serving the Guests of Allah",
    ar: "خدمة ضيوف الرحمن",
    ur: "اللہ کے مہمانوں کی خدمت",
    hi: "अल्लाह के मेहमानों की सेवा",
    ta: "அல்லாஹ்வின் விருந்தினர்களுக்கு சேவை",
    te: "అల్లాహ్ అతిథులకు సేవ",
    mr: "अल्लाहच्या पाहुण्यांची सेवा",
    bn: "আল্লাহর মেহমানদের সেবা",
    or: "ଆଲ୍ଲାହଙ୍କ ଅତିଥିମାନଙ୍କ ସେବା",
    ml: "അല്ലാഹുവിന്റെ അതിഥികളെ സേവിക്കുന്നു",
    pa: "ਅੱਲਾਹ ਦੇ ਮਹਿਮਾਨਾਂ ਦੀ ਸੇਵਾ",
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AmbientBackground variant="minimal" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-fade-in">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <AmbientBackground variant="minimal" />

      {/* Header */}
      <header className="relative z-10 text-center py-6 px-4 border-b border-border/30">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">🕋</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {titleLabels[language as keyof typeof titleLabels] || titleLabels.en}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {subtitleLabels[language as keyof typeof subtitleLabels] || subtitleLabels.en}
        </p>
      </header>

      {/* Main Dashboard */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          <SimpleDashboard />
        </div>
      </main>

      {/* Sign-in prompt */}
      {!isAuthenticated && (
        <div className="relative z-10 text-center pb-6">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;