import { lazy, Suspense } from "react";
import { SEO } from "@/components/SEO";

import { SimpleHeader } from "@/components/SimpleHeader";
import { HeroSection } from "@/components/HeroSection";
import { AyeshaAssistantCard } from "@/components/AyeshaAssistantCard";
import { WhatsNewBanner } from "@/components/WhatsNewBanner";
import { DashboardMenu } from "@/components/DashboardMenu";
import { EmergencyMarqueeBar } from "@/components/EmergencyMarqueeBar";
import { StaffMenu } from "@/components/dashboard/StaffMenu";
import { StaffAccessHint } from "@/components/dashboard/StaffAccessHint";

import { useLanguage } from "@/contexts/LanguageContext";
import { useAppAnalytics } from "@/hooks/useAppAnalytics";

// Lazy-load below-fold and non-critical components to reduce TTI
const SukoonFamilyFeature = lazy(() => import("@/components/SukoonFamilyFeature"));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));
const OnboardingTour = lazy(() => import("@/components/OnboardingTour").then(m => ({ default: m.OnboardingTour })));


const HomePage = () => {
  const { t, isRTL, language } = useLanguage();
  useAppAnalytics();

  return (
    <>
      <SEO title="HajCare AI Dashboard" description="Your personal Hajj dashboard — guidance, building locator, Tawaf counter, circulars and AI support, all in one place." path="/home" type="website" jsonLd={{"@context":"https://schema.org","@type":"WebPage","headline":"HajCare AI Dashboard","description":"Your personal Hajj dashboard — guidance, building locator, Tawaf counter, circulars and AI support, all in one place.","url":"https://hajjcare.in/home"}} />
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Persistent emergency contacts ticker — always visible at top */}
      <EmergencyMarqueeBar />

      {/* Header */}
      <SimpleHeader />

      {/* Main Content */}
      <main className="relative z-10 container max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <HeroSection />

          {/* Public Vapi entry point, immediately following Start Your Journey. */}
          <AyeshaAssistantCard />

          {/* What's new since July 1 — links to full changelog */}
          <WhatsNewBanner />

          {/* Staff-only tools (Inspector / Admin / Coordinator) */}
          <StaffMenu />

          {/* Hint shown to signed-in non-staff explaining required role */}
          <StaffAccessHint />

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


        </div>
      </main>

      {/* Footer - lazy loaded */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Onboarding Tour for first-time users */}
      <Suspense fallback={null}>
        <OnboardingTour />
      </Suspense>
    </div>
  </>

  );
};

export default HomePage;
