import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Hash, ArrowRight, Building } from "lucide-react";

/**
 * Prominent home-page quick action: "Find My Makkah Building".
 * - Big tap target (elderly-friendly)
 * - Direct number entry → routes to /hajj-buildings?building=NNN (auto-search)
 * - "Open Buildings Page" CTA for browsing
 */
export const FindBuildingQuickAction = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [num, setNum] = useState("");

  const lang = (["hi", "ur", "ar"].includes(language) ? language : "en") as
    | "en" | "hi" | "ur" | "ar";

  const t = {
    en: {
      title: "Find Your Makkah Building",
      subtitle: "Enter your building number to get the exact Google Maps location",
      placeholder: "Building number (101–1880)",
      find: "Find Location",
      browse: "Browse all zones & Rubaths",
      badge: "Hajj 2026",
    },
    hi: {
      title: "अपनी मक्का बिल्डिंग खोजें",
      subtitle: "बिल्डिंग नंबर डालें — गूगल मैप पर सटीक लोकेशन मिलेगी",
      placeholder: "बिल्डिंग नंबर (101–1880)",
      find: "लोकेशन खोजें",
      browse: "सभी ज़ोन और रुबाथ देखें",
      badge: "हज 2026",
    },
    ur: {
      title: "اپنی مکہ بلڈنگ تلاش کریں",
      subtitle: "بلڈنگ نمبر درج کریں — گوگل میپ پر درست لوکیشن ملے گی",
      placeholder: "بلڈنگ نمبر (101–1880)",
      find: "لوکیشن تلاش کریں",
      browse: "تمام زون اور رباط دیکھیں",
      badge: "حج 2026",
    },
    ar: {
      title: "ابحث عن مبنى مكة الخاص بك",
      subtitle: "أدخل رقم المبنى للحصول على الموقع الدقيق على خرائط جوجل",
      placeholder: "رقم المبنى (101–1880)",
      find: "ابحث عن الموقع",
      browse: "تصفح جميع المناطق والأربطة",
      badge: "حج 2026",
    },
  }[lang];

  const handleFind = () => {
    const trimmed = num.trim();
    if (trimmed) {
      navigate(`/hajj-buildings?building=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/hajj-buildings");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 shadow-sm">
      {/* Decorative pin */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Building className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {t.badge}
          </span>
          <h2 className="text-base sm:text-lg font-bold leading-tight mt-0.5">
            {t.title}
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
        {t.subtitle}
      </p>

      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="number"
            inputMode="numeric"
            placeholder={t.placeholder}
            value={num}
            onChange={(e) => setNum(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFind()}
            className="pl-9 rounded-xl h-12 text-base font-medium bg-background"
            min={101}
            max={1880}
            aria-label={t.placeholder}
          />
        </div>
        <Button
          onClick={handleFind}
          size="lg"
          className="rounded-xl h-12 px-4 gap-1.5 font-semibold"
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">{t.find}</span>
        </Button>
      </div>

      <button
        onClick={() => navigate("/hajj-buildings")}
        className="w-full flex items-center justify-center gap-1 text-xs text-primary hover:underline font-medium py-1.5"
      >
        {t.browse}
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
