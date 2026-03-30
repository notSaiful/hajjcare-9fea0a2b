import { lazy, Suspense } from "react";

import { SimpleHeader } from "@/components/SimpleHeader";
import { HeroSection } from "@/components/HeroSection";
import { DashboardMenu } from "@/components/DashboardMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppAnalytics } from "@/hooks/useAppAnalytics";

// Lazy-load below-fold and non-critical components to reduce TTI
const SukoonFamilyFeature = lazy(() => import("@/components/SukoonFamilyFeature"));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));
const WelcomePromoDialog = lazy(() => import("@/components/WelcomePromoDialog").then(m => ({ default: m.WelcomePromoDialog })));
const OnboardingTour = lazy(() => import("@/components/OnboardingTour").then(m => ({ default: m.OnboardingTour })));
const LocationPermissionFlow = lazy(() => import("@/components/LocationPermissionFlow").then(m => ({ default: m.LocationPermissionFlow })));
const LocationReminderBanner = lazy(() => import("@/components/LocationReminderBanner").then(m => ({ default: m.LocationReminderBanner })));
const HajjCountdown = lazy(() => import("@/components/HajjCountdown").then(m => ({ default: m.HajjCountdown })));
const AppDownloadStats = lazy(() => import("@/components/AppDownloadStats").then(m => ({ default: m.AppDownloadStats })));

const HomePage = () => {
  const { t, isRTL, language } = useLanguage();
  useAppAnalytics();

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <SimpleHeader />

      {/* Main Content */}
      <main className="relative z-10 container max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <HeroSection />

          {/* Hajj Countdown */}
          <Suspense fallback={null}>
            <section className="animate-fade-up" style={{ animationDelay: "40ms" }}>
              <HajjCountdown />
            </section>
          </Suspense>

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

          {/* App Download Stats */}
          <Suspense fallback={null}>
            <section className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <AppDownloadStats />
            </section>
          </Suspense>

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

      {/* Onboarding Tour for first-time users */}
      <Suspense fallback={null}>
        <OnboardingTour />
      </Suspense>
    </div>
  );
};

export default HomePage;
