import { useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Footer } from "@/components/Footer";
import { DashboardMenu } from "@/components/DashboardMenu";
import SukoonFamilyFeature from "@/components/SukoonFamilyFeature";
import { WelcomePromoDialog } from "@/components/WelcomePromoDialog";
import { HeroSection } from "@/components/HeroSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Loader2 } from "lucide-react";

const HomePage = () => {
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const dashRef = useScrollReveal();
  const sukoonRef = useScrollReveal(0.1, "0px 0px -60px 0px");
  const authRef = useScrollReveal(0.1);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-fade-in">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <SimpleHeader />

      {/* Main Content */}
      <main className="relative z-10 container max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <HeroSection />

          {/* Dashboard Menu with Bismillah */}
          <section ref={dashRef}>
            <DashboardMenu />
          </section>

          {/* Sukoon Family Tracking */}
          <section ref={sukoonRef}>
            <SukoonFamilyFeature />
          </section>

          {/* Auth prompt */}
          {!isAuthenticated && (
            <section ref={authRef} className="text-center pt-2">
              <button
                onClick={() => navigate("/auth")}
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors duration-300"
              >
                {t("signIn")}
              </button>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Welcome Promo Dialog */}
      <WelcomePromoDialog />
    </div>
  );
};

export default HomePage;
