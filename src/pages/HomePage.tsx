import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { WhatToDoCard } from "@/components/WhatToDoCard";
import { HelpButton } from "@/components/HelpButton";
import { EmergencyButton } from "@/components/EmergencyButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useHajjLocation } from "@/hooks/useHajjLocation";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { Loader2 } from "lucide-react";

type PilgrimStatus = "safe" | "assistance" | "emergency";

const HomePage = () => {
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { stage, stageInfo } = useHajjLocation();
  const { group, updateLocation } = useFamilyGroup();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<PilgrimStatus>("safe");
  const [currentInstruction, setCurrentInstruction] = useState("");

  // Get context-aware instruction based on location/stage
  useEffect(() => {
    const instructions: Record<string, Record<string, string>> = {
      makkah: {
        en: "You are in Makkah. Stay hydrated and rest before rituals begin.",
        ar: "أنت في مكة. حافظ على الترطيب واسترح قبل بدء المناسك.",
        hi: "आप मक्का में हैं। अनुष्ठान शुरू होने से पहले हाइड्रेटेड रहें और आराम करें।",
        ur: "آپ مکہ میں ہیں۔ مناسک شروع ہونے سے پہلے پانی پیتے رہیں اور آرام کریں۔",
        tr: "Mekke'desiniz. Ritüeller başlamadan önce bol su için ve dinlenin.",
        ru: "Вы в Мекке. Пейте воду и отдыхайте перед ритуалами.",
      },
      mina: {
        en: "You are in Mina. Remain in your tent. Movement updates will be announced.",
        ar: "أنت في منى. ابق في خيمتك. سيتم الإعلان عن تحديثات الحركة.",
        hi: "आप मीना में हैं। अपने तंबू में रहें। आवाजाही के अपडेट की घोषणा की जाएगी।",
        ur: "آپ منیٰ میں ہیں۔ اپنے خیمے میں رہیں۔ نقل و حرکت کی تازہ کاری کا اعلان کیا جائے گا۔",
        tr: "Mina'dasınız. Çadırınızda kalın. Hareket güncellemeleri duyurulacak.",
        ru: "Вы в Мина. Оставайтесь в палатке. О движении будет объявлено.",
      },
      arafat: {
        en: "You are at Arafat. This is the most important day. Make dua and stay in shade.",
        ar: "أنت في عرفات. هذا أهم يوم. ادعُ الله وابق في الظل.",
        hi: "आप अरफात में हैं। यह सबसे महत्वपूर्ण दिन है। दुआ करें और छाया में रहें।",
        ur: "آپ عرفات میں ہیں۔ یہ سب سے اہم دن ہے۔ دعا کریں اور سائے میں رہیں۔",
        tr: "Arafat'tasınız. Bu en önemli gün. Dua edin ve gölgede kalın.",
        ru: "Вы на Арафате. Это самый важный день. Молитесь и оставайтесь в тени.",
      },
      muzdalifah: {
        en: "You are at Muzdalifah. Rest here tonight. Collect pebbles for Jamarat.",
        ar: "أنت في مزدلفة. استرح هنا الليلة. اجمع الحصى للجمرات.",
        hi: "आप मुज़दलिफ़ा में हैं। आज रात यहाँ आराम करें। जमरात के लिए कंकड़ इकट्ठा करें।",
        ur: "آپ مزدلفہ میں ہیں۔ آج رات یہاں آرام کریں۔ جمرات کے لیے کنکریاں جمع کریں۔",
        tr: "Müzdelife'desiniz. Bu gece burada dinlenin. Cemarat için taş toplayın.",
        ru: "Вы в Муздалифе. Отдохните здесь ночью. Соберите камешки для Джамарата.",
      },
    };

    const stageKey = stage || "makkah";
    const langKey = language as string;
    setCurrentInstruction(
      instructions[stageKey]?.[langKey] || 
      instructions[stageKey]?.en ||
      instructions.makkah[langKey] ||
      instructions.makkah.en
    );
  }, [stage, language]);

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
          <WhatToDoCard instruction={currentInstruction} />
        </div>

        {/* 3. One-Tap Help - Voice first */}
        <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <HelpButton />
        </div>

        {/* 4. Emergency Button - Prominent but not alarming */}
        <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <EmergencyButton onConfirm={handleEmergency} />
        </div>

        {/* Auth prompt if not logged in */}
        {!isAuthenticated && (
          <div className="text-center pt-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
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