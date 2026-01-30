import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SimpleDashboard } from "@/components/SimpleDashboard";

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0033CC]" />
          <p className="text-sm text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="text-center py-4 px-4 border-b-2 border-[#0033CC]">
        <h1 className="text-2xl font-extrabold text-black flex items-center justify-center gap-2">
          <span>🕋</span>
          {titleLabels[language as keyof typeof titleLabels] || titleLabels.en}
        </h1>
        <p className="text-base font-semibold text-black">
          {subtitleLabels[language as keyof typeof subtitleLabels] || subtitleLabels.en}
        </p>
      </header>

      {/* Main Dashboard */}
      <main className="flex-1">
        <SimpleDashboard />
      </main>

      {/* Sign-in prompt */}
      {!isAuthenticated && (
        <div className="text-center pb-4">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm text-[#0033CC] font-semibold underline underline-offset-4"
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