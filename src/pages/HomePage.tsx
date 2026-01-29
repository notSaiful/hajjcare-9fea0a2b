import { useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Footer } from "@/components/Footer";
import { DashboardMenu } from "@/components/DashboardMenu";
import SukoonFamilyFeature from "@/components/SukoonFamilyFeature";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import kaabaGreenDome from "@/assets/kaaba-green-dome-new.jpeg";

const HomePage = () => {
  const {
    t,
    isRTL,
    language
  } = useLanguage();
  const {
    isAuthenticated,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const welcomeLabels = {
    en: "Welcome to the Guests of Allah",
    ar: "مرحباً بضيوف الرحمن",
    ur: "اللہ کے مہمانوں کو خوش آمدید",
    hi: "अल्लाह के मेहमानों का स्वागत है",
    ta: "அல்லாஹ்வின் விருந்தினர்களுக்கு வரவேற்பு",
    te: "అల్లాహ్ అతిథులకు స్వాగతం",
    mr: "अल्लाहच्या पाहुण्यांचे स्वागत",
    bn: "আল্লাহর মেহমানদের স্বাগতম",
    or: "ଆଲ୍ଲାହଙ୍କ ଅତିଥିମାନଙ୍କୁ ସ୍ୱାଗତ",
    ml: "അല്ലാഹുവിന്റെ അതിഥികൾക്ക് സ്വാഗതം",
    pa: "ਅੱਲਾਹ ਦੇ ਮਹਿਮਾਨਾਂ ਨੂੰ ਜੀ ਆਇਆਂ"
  };
  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <AmbientBackground variant="minimal" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-fade-in">Loading...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Ambient Background - subtle, calming */}
      <AmbientBackground />

      {/* Header */}
      <SimpleHeader />

      {/* Main Content - Dashboard */}
      <main className="relative z-10 container max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-5 sm:space-y-6">
          
          {/* Kaaba & Green Dome Image + Welcome Title */}
          <section className="text-center animate-fade-up" style={{
          animationDelay: "0ms"
        }}>
            <div className="h-20 sm:h-28 overflow-hidden mx-auto mb-3 flex items-start justify-center">
              <img src={kaabaGreenDome} alt="Kaaba & Green Dome" className="h-24 sm:h-32 w-auto object-cover object-top" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {welcomeLabels[language as keyof typeof welcomeLabels] || welcomeLabels.en}
            </h1>
          </section>


          {/* 2. Dashboard Menu - 16 Icons with Bismillah header */}
          <section className="animate-fade-up" style={{
          animationDelay: "80ms"
        }}>
            {/* Bismillah header */}
            <div className="text-center mb-4 sm:mb-5">
              <p className="text-lg sm:text-xl font-semibold text-primary" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
            </div>
            <DashboardMenu />
          </section>

          {/* Sukoon Family Tracking Feature */}
          <section className="animate-fade-up" style={{
          animationDelay: "160ms"
        }}>
            <SukoonFamilyFeature />
          </section>




          {/* Auth prompt if not logged in */}
          {!isAuthenticated && <section className="text-center pt-2 animate-fade-up" style={{
          animationDelay: "240ms"
        }}>
              <button onClick={() => navigate("/auth")} className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors duration-300">
                {t("signIn")}
              </button>
            </section>}
        </div>

        {/* Bottom spacing for iOS safe area */}
        
      </main>

      {/* Footer */}
      <Footer />
    </div>;
};
export default HomePage;