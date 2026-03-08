import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { HeroSection } from "@/components/HeroSection";
import { DashboardMenu } from "@/components/DashboardMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";

// Lazy-load below-fold and non-critical components to reduce TTI
const SukoonFamilyFeature = lazy(() => import("@/components/SukoonFamilyFeature"));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));
const WelcomePromoDialog = lazy(() => import("@/components/WelcomePromoDialog").then(m => ({ default: m.WelcomePromoDialog })));
const OnboardingTour = lazy(() => import("@/components/OnboardingTour").then(m => ({ default: m.OnboardingTour })));
const LocationPermissionFlow = lazy(() => import("@/components/LocationPermissionFlow").then(m => ({ default: m.LocationPermissionFlow })));
const LocationReminderBanner = lazy(() => import("@/components/LocationReminderBanner").then(m => ({ default: m.LocationReminderBanner })));
const HajjCountdown = lazy(() => import("@/components/HajjCountdown").then(m => ({ default: m.HajjCountdown })));

const HomePage = () => {
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();

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
          <section className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            <DashboardMenu />
          </section>

          {/* Sukoon Family Tracking - lazy loaded */}
          <Suspense fallback={null}>
            <section className="animate-fade-up" style={{ animationDelay: "160ms" }}>
              <SukoonFamilyFeature />
            </section>
          </Suspense>

          {/* Auth prompt - only show after auth resolves */}
          {!authLoading && !isAuthenticated && (
            <section
              className="text-center pt-2 animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
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

      {/* Footer - lazy loaded */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Location reminder banner - non-intrusive */}
      <Suspense fallback={null}>
        <LocationReminderBanner />
      </Suspense>
    </div>
  );
};

export default HomePage;
