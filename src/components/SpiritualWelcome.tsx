import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface SpiritualWelcomeProps {
  onContinue?: () => void;
  showContinue?: boolean;
}

// Localized welcome messages
const welcomeMessages: Record<string, { title: string; subtitle: string; continue: string }> = {
  en: {
    title: "Welcome to the Guests of Allah",
    subtitle: "May your journey be blessed and accepted",
    continue: "Begin Your Journey",
  },
  ar: {
    title: "أهلاً بضيوف الرحمن",
    subtitle: "بارك الله رحلتكم وتقبلها",
    continue: "ابدأ رحلتك",
  },
  ur: {
    title: "اللہ کے مہمانوں کو خوش آمدید",
    subtitle: "آپ کا سفر مبارک اور قبول ہو",
    continue: "اپنا سفر شروع کریں",
  },
  hi: {
    title: "अल्लाह के मेहमानों का स्वागत है",
    subtitle: "आपकी यात्रा मुबारक और कबूल हो",
    continue: "अपनी यात्रा शुरू करें",
  },
  ta: {
    title: "அல்லாஹ்வின் விருந்தினர்களை வரவேற்கிறோம்",
    subtitle: "உங்கள் பயணம் ஆசீர்வதிக்கப்பட்டு ஏற்றுக்கொள்ளப்படட்டும்",
    continue: "உங்கள் பயணத்தைத் தொடங்குங்கள்",
  },
  te: {
    title: "అల్లాహ్ అతిథులకు స్వాగతం",
    subtitle: "మీ ప్రయాణం ఆశీర్వదించబడి అంగీకరించబడాలి",
    continue: "మీ ప్రయాణాన్ని ప్రారంభించండి",
  },
  mr: {
    title: "अल्लाहच्या पाहुण्यांचे स्वागत",
    subtitle: "तुमचा प्रवास आशीर्वादित आणि स्वीकारला जावो",
    continue: "तुमचा प्रवास सुरू करा",
  },
  bn: {
    title: "আল্লাহর মেহমানদের স্বাগতম",
    subtitle: "আপনার যাত্রা বরকতময় ও কবুল হোক",
    continue: "আপনার যাত্রা শুরু করুন",
  },
  or: {
    title: "ଆଲ୍ଲାହଙ୍କ ଅତିଥିମାନଙ୍କୁ ସ୍ୱାଗତ",
    subtitle: "ଆପଣଙ୍କ ଯାତ୍ରା ଆଶୀର୍ବାଦିତ ଏବଂ ଗ୍ରହଣୀୟ ହେଉ",
    continue: "ଆପଣଙ୍କ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ",
  },
  ml: {
    title: "അല്ലാഹുവിന്റെ അതിഥികൾക്ക് സ്വാഗതം",
    subtitle: "നിങ്ങളുടെ യാത്ര അനുഗ്രഹിക്കപ്പെടട്ടെ",
    continue: "നിങ്ങളുടെ യാത്ര ആരംഭിക്കുക",
  },
  pa: {
    title: "ਅੱਲਾਹ ਦੇ ਮਹਿਮਾਨਾਂ ਦਾ ਸਵਾਗਤ ਹੈ",
    subtitle: "ਤੁਹਾਡੀ ਯਾਤਰਾ ਮੁਬਾਰਕ ਅਤੇ ਕਬੂਲ ਹੋਵੇ",
    continue: "ਆਪਣੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ",
  },
};

export const SpiritualWelcome = memo(function SpiritualWelcome({
  onContinue,
  showContinue = true,
}: SpiritualWelcomeProps) {
  const { language, isRTL } = useLanguage();
  const messages = welcomeMessages[language] || welcomeMessages.en;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[hsl(155_25%_8%)] via-[hsl(155_20%_12%)] to-[hsl(155_18%_10%)]"
    >
      {/* Subtle radial glow from top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,_hsl(42_40%_25%/0.15)_0%,_transparent_70%)] pointer-events-none" />
      
      {/* Light rays emanating from center */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1 h-48 bg-gradient-to-b from-[hsl(42_50%_60%/0.1)] to-transparent rotate-[-15deg] blur-sm" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1 h-48 bg-gradient-to-b from-[hsl(42_50%_60%/0.1)] to-transparent rotate-[15deg] blur-sm" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-0.5 h-40 bg-gradient-to-b from-[hsl(42_50%_60%/0.08)] to-transparent rotate-[-30deg] blur-sm" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-0.5 h-40 bg-gradient-to-b from-[hsl(42_50%_60%/0.08)] to-transparent rotate-[30deg] blur-sm" />
      </div>

      {/* Abstract Kaaba silhouette */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 pointer-events-none opacity-40">
        <svg
          width="120"
          height="100"
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[hsl(42_45%_55%)]"
        >
          {/* Kaaba outline */}
          <rect
            x="30"
            y="30"
            width="60"
            height="55"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          {/* Kiswah band */}
          <line
            x1="30"
            y1="45"
            x2="90"
            y2="45"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.8"
          />
          {/* Door hint */}
          <rect
            x="52"
            y="55"
            width="16"
            height="25"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Mosque silhouette at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 400 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto text-[hsl(155_20%_15%)]"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Mosque dome and minarets silhouette */}
          <path
            d="M0 80 L0 50 L30 50 L35 30 L40 50 L80 50 L80 40 Q100 15 120 40 L120 50 L160 50 L165 20 L170 50 L200 50 L200 40 Q220 10 240 40 L240 50 L280 50 L280 40 Q300 15 320 40 L320 50 L360 50 L365 25 L370 50 L400 50 L400 80 Z"
            fill="currentColor"
            opacity="0.4"
          />
          {/* Subtle gold accents on domes */}
          <ellipse cx="100" cy="35" rx="18" ry="8" fill="hsl(42 40% 40%)" opacity="0.15" />
          <ellipse cx="220" cy="30" rx="22" ry="10" fill="hsl(42 40% 40%)" opacity="0.2" />
          <ellipse cx="300" cy="35" rx="18" ry="8" fill="hsl(42 40% 40%)" opacity="0.15" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md">
        {/* Bismillah */}
        <p className="font-arabic text-lg sm:text-xl text-[hsl(42_45%_65%)] mb-6 opacity-80 animate-fade-in">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>

        {/* App name with gold accent */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-[hsl(155_30%_75%)]">Hajj</span>
            <span className="text-[hsl(42_50%_60%)]">Care</span>
            <span className="text-[hsl(155_25%_60%)] ml-1.5 text-2xl sm:text-3xl font-medium">AI</span>
          </h1>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: "250ms" }}>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[hsl(42_40%_50%/0.5)] to-[hsl(42_40%_50%/0.3)]" />
          <div className="w-2 h-2 rotate-45 bg-[hsl(42_50%_55%)] opacity-70" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent via-[hsl(42_40%_50%/0.5)] to-[hsl(42_40%_50%/0.3)]" />
        </div>

        {/* Main welcome message */}
        <h2
          className={cn(
            "text-xl sm:text-2xl font-semibold mb-4 leading-relaxed animate-fade-in",
            "text-[hsl(45_30%_88%)]",
            isRTL ? "font-arabic" : ""
          )}
          style={{ animationDelay: "350ms" }}
        >
          {messages.title}
        </h2>

        {/* Subtitle */}
        <p
          className="text-sm sm:text-base text-[hsl(155_20%_65%)] mb-10 animate-fade-in"
          style={{ animationDelay: "450ms" }}
        >
          {messages.subtitle}
        </p>

        {/* Continue button */}
        {showContinue && onContinue && (
          <button
            onClick={onContinue}
            className={cn(
              "px-8 py-3.5 rounded-full font-medium text-sm sm:text-base",
              "bg-gradient-to-r from-[hsl(42_45%_45%)] to-[hsl(38_50%_40%)]",
              "text-[hsl(42_30%_95%)] shadow-lg",
              "hover:from-[hsl(42_50%_50%)] hover:to-[hsl(38_55%_45%)]",
              "hover:shadow-[0_8px_30px_-8px_hsl(42_50%_40%/0.4)]",
              "active:scale-[0.98] transition-all duration-300",
              "animate-fade-in"
            )}
            style={{ animationDelay: "550ms" }}
          >
            {messages.continue}
          </button>
        )}

        {/* Trust indicators */}
        <div
          className="mt-12 flex items-center gap-6 text-[hsl(155_15%_50%)] text-xs animate-fade-in"
          style={{ animationDelay: "650ms" }}
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Trusted</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[hsl(42_40%_50%)/0.5]" />
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span>Care</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[hsl(42_40%_50%)/0.5]" />
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            <span>Guidance</span>
          </div>
        </div>
      </div>

      {/* Subtle corner ornaments */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-[hsl(42_40%_50%)/0.2] rounded-tl-lg pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-[hsl(42_40%_50%)/0.2] rounded-tr-lg pointer-events-none" />
    </div>
  );
});

export default SpiritualWelcome;
