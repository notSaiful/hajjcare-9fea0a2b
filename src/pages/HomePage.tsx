import { useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { AmbientBackground } from "@/components/AmbientBackground";
import { StatusBadge } from "@/components/StatusBadge";
import { WhatToDoCard } from "@/components/WhatToDoCard";
import { HelpButton } from "@/components/HelpButton";
import { EmergencyButton } from "@/components/EmergencyButton";
import { DashboardMenu } from "@/components/DashboardMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentGuidance } from "@/hooks/useCurrentGuidance";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import kaabaGreenDome from "@/assets/kaaba-green-dome.jpeg";

type PilgrimStatus = "safe" | "assistance" | "emergency";

const HomePage = () => {
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { guidance, refreshGuidance } = useCurrentGuidance();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<PilgrimStatus>("safe");

  const handleEmergency = () => {
    setStatus("emergency");
    console.log("Emergency triggered");
  };

  const welcomeLabels = {
    en: "Welcome to HajCare AI",
    ar: "مرحباً بكم في حج كير",
    ur: "حج کیئر میں خوش آمدید",
    hi: "हजकेयर में आपका स्वागत है",
    tr: "HajCare AI'ye Hoş Geldiniz",
    ru: "Добро пожаловать в HajCare AI",
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
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Ambient Background - subtle, calming */}
      <AmbientBackground />

      {/* Header */}
      <SimpleHeader />

      {/* Main Content - Dashboard */}
      <main className="relative z-10 container max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-5 sm:space-y-6">
          
          {/* Kaaba & Green Dome Image + Welcome Title */}
          <section className="text-center animate-fade-up" style={{ animationDelay: "0ms" }}>
            <div className="h-20 sm:h-28 overflow-hidden mx-auto mb-3 flex items-start justify-center">
              <img 
                src={kaabaGreenDome} 
                alt="Kaaba & Green Dome" 
                className="h-24 sm:h-32 w-auto object-cover object-top"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {welcomeLabels[language as keyof typeof welcomeLabels] || welcomeLabels.en}
            </h1>
          </section>

          {/* 1. Current Status - Most prominent, calming */}
          <section className="animate-fade-up" style={{ animationDelay: "40ms" }}>
            <StatusBadge status={status} className="w-full" />
          </section>

          {/* 2. Dashboard Menu - 16 Icons */}
          <section className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            <DashboardMenu />
          </section>

          {/* 3. What To Do Now - Context-aware directive */}
          <section className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <WhatToDoCard 
              status={guidance.status}
              statusLabel={guidance.statusLabel}
              instruction={guidance.instruction}
              safety={guidance.safety}
              isFailsafe={guidance.isFailsafe}
              lastUpdated={guidance.lastUpdated}
              onRefresh={refreshGuidance}
            />
          </section>

          {/* 4. One-Tap Help - Voice first, accessible */}
          <section className="animate-fade-up" style={{ animationDelay: "160ms" }}>
            <HelpButton />
          </section>

          {/* 5. Emergency Button - Visible, serious, never flashy */}
          <section className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <EmergencyButton onConfirm={handleEmergency} />
          </section>

          {/* Auth prompt if not logged in */}
          {!isAuthenticated && (
            <section className="text-center pt-2 animate-fade-up" style={{ animationDelay: "240ms" }}>
              <button 
                onClick={() => navigate("/auth")}
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors duration-300"
              >
                {t("signIn")}
              </button>
            </section>
          )}
        </div>

        {/* Bottom spacing for iOS safe area */}
        <div className="h-8 sm:h-12" />
      </main>
    </div>
  );
};

export default HomePage;
