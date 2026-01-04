import { useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { AmbientBackground } from "@/components/AmbientBackground";
import { StatusBadge } from "@/components/StatusBadge";
import { WhatToDoCard } from "@/components/WhatToDoCard";
import { HelpButton } from "@/components/HelpButton";
import { EmergencyButton } from "@/components/EmergencyButton";
import { GuidanceSettings } from "@/components/GuidanceSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentGuidance } from "@/hooks/useCurrentGuidance";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type PilgrimStatus = "safe" | "assistance" | "emergency";

const HomePage = () => {
  const { t, isRTL } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { guidance, refreshGuidance } = useCurrentGuidance();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<PilgrimStatus>("safe");

  const handleEmergency = () => {
    setStatus("emergency");
    console.log("Emergency triggered");
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

      {/* Main Content - Calm Control Panel */}
      <main className="relative z-10 container max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-5 sm:space-y-6">
          
          {/* 1. Current Status - Most prominent, calming */}
          <section className="animate-fade-up" style={{ animationDelay: "0ms" }}>
            <StatusBadge status={status} className="w-full" />
          </section>

          {/* 2. What To Do Now - Context-aware directive */}
          <section className="animate-fade-up" style={{ animationDelay: "80ms" }}>
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

          {/* 3. One-Tap Help - Voice first, accessible */}
          <section className="animate-fade-up" style={{ animationDelay: "160ms" }}>
            <HelpButton />
          </section>

          {/* 4. Emergency Button - Visible, serious, never flashy */}
          <section className="animate-fade-up" style={{ animationDelay: "240ms" }}>
            <EmergencyButton onConfirm={handleEmergency} />
          </section>

          {/* 5. Guidance Settings - Collapsible, secondary */}
          <section className="animate-fade-up" style={{ animationDelay: "320ms" }}>
            <GuidanceSettings />
          </section>

          {/* Auth prompt if not logged in */}
          {!isAuthenticated && (
            <section className="text-center pt-2 animate-fade-up" style={{ animationDelay: "400ms" }}>
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
