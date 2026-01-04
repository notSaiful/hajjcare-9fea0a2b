import { useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
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
    // In real app, this would trigger actual emergency protocols
    console.log("Emergency triggered");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* 1. Current Status - Most prominent */}
        <div className="animate-fade-in">
          <StatusBadge status={status} className="w-full" />
        </div>

        {/* 2. What To Do Now - Context-aware directive */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <WhatToDoCard 
            status={guidance.status}
            statusLabel={guidance.statusLabel}
            instruction={guidance.instruction}
            safety={guidance.safety}
            isFailsafe={guidance.isFailsafe}
            lastUpdated={guidance.lastUpdated}
            onRefresh={refreshGuidance}
          />
        </div>

        {/* 3. One-Tap Help - Voice first */}
        <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <HelpButton />
        </div>

        {/* 4. Emergency Button - Prominent but not alarming */}
        <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <EmergencyButton onConfirm={handleEmergency} />
        </div>

        {/* 5. Guidance Settings - Collapsible */}
        <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <GuidanceSettings />
        </div>

        {/* Auth prompt if not logged in */}
        {!isAuthenticated && (
          <div className="text-center pt-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <button 
              onClick={() => navigate("/auth")}
              className="text-sm text-primary underline"
            >
              {t("signIn")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
