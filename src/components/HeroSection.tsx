import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Bot, Shield, MapPin, BookOpen, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const headlines: Record<string, { main: string; sub: string }> = {
  en: { main: "Your Trusted AI Companion for Hajj & Umrah", sub: "Guidance • Safety • Tracking • Duas • Emergency Help" },
  ar: { main: "رفيقك الذكي الموثوق للحج والعمرة", sub: "إرشاد • أمان • تتبع • دعاء • مساعدة طوارئ" },
  ur: { main: "حج اور عمرہ کے لیے آپ کا قابل اعتماد AI ساتھی", sub: "رہنمائی • حفاظت • ٹریکنگ • دعائیں • ایمرجنسی مدد" },
  hi: { main: "हज और उमराह के लिए आपका भरोसेमंद AI साथी", sub: "मार्गदर्शन • सुरक्षा • ट्रैकिंग • दुआएं • आपातकालीन सहायता" },
  ta: { main: "ஹஜ் & உம்ராவுக்கான உங்கள் நம்பகமான AI துணை", sub: "வழிகாட்டுதல் • பாதுகாப்பு • கண்காணிப்பு • துஆக்கள் • அவசர உதவி" },
  te: { main: "హజ్ & ఉమ్రా కోసం మీ నమ్మకమైన AI సహచరుడు", sub: "మార్గదర్శకత్వం • భద్రత • ట్రాకింగ్ • దుఆలు • ఎమర్జెన్సీ సహాయం" },
  mr: { main: "हज आणि उमराहसाठी तुमचा विश्वासार्ह AI साथी", sub: "मार्गदर्शन • सुरक्षा • ट्रॅकिंग • दुआ • आपत्कालीन मदत" },
  bn: { main: "হজ ও উমরাহর জন্য আপনার বিশ্বস্ত AI সঙ্গী", sub: "গাইডেন্স • নিরাপত্তা • ট্র্যাকিং • দোয়া • জরুরি সাহায্য" },
  or: { main: "ହଜ ଏବଂ ଉମରାହ ପାଇଁ ଆପଣଙ୍କ ବିଶ୍ୱସ୍ତ AI ସାଥୀ", sub: "ମାର୍ଗଦର୍ଶନ • ସୁରକ୍ଷା • ଟ୍ରାକିଂ • ଦୁଆ • ଜରୁରୀ ସାହାଯ୍ୟ" },
  ml: { main: "ഹജ്ജ് & ഉംറയ്ക്കുള്ള നിങ്ങളുടെ വിശ്വസ്ത AI സഹചാരി", sub: "മാർഗദർശനം • സുരക്ഷ • ട്രാക്കിംഗ് • ദുആകൾ • അടിയന്തര സഹായം" },
  pa: { main: "ਹੱਜ ਅਤੇ ਉਮਰਾਹ ਲਈ ਤੁਹਾਡਾ ਭਰੋਸੇਮੰਦ AI ਸਾਥੀ", sub: "ਮਾਰਗਦਰਸ਼ਨ • ਸੁਰੱਖਿਆ • ਟ੍ਰੈਕਿੰਗ • ਦੁਆਵਾਂ • ਐਮਰਜੈਂਸੀ ਮਦਦ" },
};

const quickFeatures = [
  { icon: BookOpen, labelKey: "guidance" },
  { icon: Shield, labelKey: "safety" },
  { icon: MapPin, labelKey: "tracking" },
  { icon: Bot, labelKey: "ai" },
  { icon: Phone, labelKey: "emergency" },
];

const featureLabels: Record<string, Record<string, string>> = {
  guidance: { en: "Guidance", ar: "إرشاد", ur: "رہنمائی", hi: "मार्गदर्शन", ta: "வழிகாட்டுதல்", te: "మార్గదర్శనం", mr: "मार्गदर्शन", bn: "গাইডেন্স", or: "ମାର୍ଗଦର୍ଶନ", ml: "മാർഗദർശനം", pa: "ਮਾਰਗਦਰਸ਼ਨ" },
  safety: { en: "Safety", ar: "أمان", ur: "حفاظت", hi: "सुरक्षा", ta: "பாதுகாப்பு", te: "భద్రత", mr: "सुरक्षा", bn: "নিরাপত্তা", or: "ସୁରକ୍ଷା", ml: "സുരക്ഷ", pa: "ਸੁਰੱਖਿਆ" },
  tracking: { en: "Tracking", ar: "تتبع", ur: "ٹریکنگ", hi: "ट्रैकिंग", ta: "கண்காணிப்பு", te: "ట్రాకింగ్", mr: "ट्रॅकिंग", bn: "ট্র্যাকিং", or: "ଟ୍ରାକିଂ", ml: "ട്രാക്കിംഗ്", pa: "ਟ੍ਰੈਕਿੰਗ" },
  ai: { en: "AI Help", ar: "مساعد ذكي", ur: "AI مدد", hi: "AI सहायता", ta: "AI உதவி", te: "AI సహాయం", mr: "AI मदत", bn: "AI সহায়তা", or: "AI ସାହାଯ୍ୟ", ml: "AI സഹായം", pa: "AI ਮਦਦ" },
  emergency: { en: "Emergency", ar: "طوارئ", ur: "ایمرجنسی", hi: "आपातकालीन", ta: "அவசரம்", te: "ఎమర్జెన్సీ", mr: "आपत्कालीन", bn: "জরুরি", or: "ଜରୁରୀ", ml: "അടിയന്തരം", pa: "ਐਮਰਜੈਂਸੀ" },
};

export const HeroSection = memo(function HeroSection() {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const h = headlines[language] || headlines.en;

  return (
    <section className="hero-gradient relative overflow-hidden rounded-3xl mx-3 sm:mx-0" dir={isRTL ? "rtl" : "ltr"}>
      {/* Subtle Islamic geometric pattern overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-[0.07] pointer-events-none" />

      {/* Soft glowing light rays from top-center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(42_60%_70%/0.25)_0%,_transparent_65%)]" />
      </div>

      {/* Light rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[2px] h-32 bg-gradient-to-b from-[hsl(42_60%_75%/0.5)] to-transparent rotate-[-12deg] blur-[1px]" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[2px] h-32 bg-gradient-to-b from-[hsl(42_60%_75%/0.5)] to-transparent rotate-[12deg] blur-[1px]" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-[hsl(42_60%_75%/0.3)] to-transparent rotate-[-25deg] blur-[1px]" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-[hsl(42_60%_75%/0.3)] to-transparent rotate-[25deg] blur-[1px]" />
      </div>

      {/* Kaaba silhouette SVG */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-50">
        <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Kaaba body */}
          <rect x="35" y="35" width="70" height="65" rx="2" stroke="hsl(42 50% 75%)" strokeWidth="1.5" fill="none" opacity="0.7" />
          {/* Kiswah golden band */}
          <line x1="35" y1="52" x2="105" y2="52" stroke="hsl(42 60% 70%)" strokeWidth="2.5" opacity="0.9" />
          {/* Door */}
          <rect x="58" y="62" width="18" height="30" rx="8" stroke="hsl(42 50% 70%)" strokeWidth="1" fill="none" opacity="0.5" />
          {/* Crowd silhouettes - subtle dots */}
          <circle cx="30" cy="105" r="3" fill="hsl(42 40% 70%)" opacity="0.15" />
          <circle cx="40" cy="108" r="2.5" fill="hsl(42 40% 70%)" opacity="0.12" />
          <circle cx="50" cy="106" r="3" fill="hsl(42 40% 70%)" opacity="0.15" />
          <circle cx="60" cy="109" r="2" fill="hsl(42 40% 70%)" opacity="0.1" />
          <circle cx="70" cy="107" r="3" fill="hsl(42 40% 70%)" opacity="0.14" />
          <circle cx="80" cy="108" r="2.5" fill="hsl(42 40% 70%)" opacity="0.12" />
          <circle cx="90" cy="106" r="3" fill="hsl(42 40% 70%)" opacity="0.15" />
          <circle cx="100" cy="108" r="2" fill="hsl(42 40% 70%)" opacity="0.1" />
          <circle cx="110" cy="105" r="3" fill="hsl(42 40% 70%)" opacity="0.13" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8 pt-36 pb-8">
        {/* Bismillah */}
        <p className="font-arabic text-base sm:text-lg text-[hsl(42_50%_80%)] mb-5 opacity-90 animate-fade-in" dir="rtl">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>

        {/* App name */}
        <div className="mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-[hsl(160_40%_85%)]">Haj</span>
            <span className="text-[hsl(42_55%_72%)]">Care</span>
            <span className="text-[hsl(200_50%_80%)] ml-1.5 text-2xl sm:text-3xl font-medium">AI</span>
          </h1>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 mb-5 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-[hsl(42_50%_65%/0.6)]" />
          <div className="w-2 h-2 rotate-45 bg-[hsl(42_55%_65%)] opacity-80" />
          <div className="w-10 h-px bg-gradient-to-l from-transparent to-[hsl(42_50%_65%/0.6)]" />
        </div>

        {/* Main headline */}
        <h2 className="text-lg sm:text-xl font-semibold text-[hsl(45_25%_92%)] max-w-sm leading-relaxed mb-3 animate-fade-up" style={{ animationDelay: "200ms" }}>
          {h.main}
        </h2>

        {/* Subtitle chips */}
        <p className="text-xs sm:text-sm text-[hsl(180_20%_75%)] mb-6 animate-fade-up" style={{ animationDelay: "250ms" }}>
          {h.sub}
        </p>

        {/* Quick feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          {quickFeatures.map((f) => (
            <div
              key={f.labelKey}
              className="hero-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            >
              <f.icon className="w-3.5 h-3.5" />
              <span>{(featureLabels[f.labelKey]?.[language]) || featureLabels[f.labelKey]?.en}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/chat")}
          className="hero-cta-button h-14 px-8 text-base font-semibold rounded-2xl shadow-lg animate-fade-up"
          style={{ animationDelay: "350ms" }}
        >
          <Bot className="w-5 h-5 mr-2" />
          {language === "ar" ? "ابدأ رحلتك" : language === "ur" ? "اپنا سفر شروع کریں" : language === "hi" ? "अपनी यात्रा शुरू करें" : "Start Your Journey"}
        </Button>
      </div>

      {/* Bottom mosque silhouette */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 400 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="xMidYMax slice">
          <path
            d="M0 50 L0 35 L25 35 L28 18 L31 35 L70 35 L70 28 Q85 10 100 28 L100 35 L140 35 L143 12 L146 35 L180 35 L180 28 Q200 5 220 28 L220 35 L260 35 L260 28 Q275 10 290 28 L290 35 L330 35 L333 15 L336 35 L375 35 L375 50 L400 50 Z"
            fill="hsl(160 35% 12%)"
            opacity="0.5"
          />
          <ellipse cx="85" cy="24" rx="14" ry="6" fill="hsl(42 45% 50%)" opacity="0.12" />
          <ellipse cx="200" cy="20" rx="18" ry="8" fill="hsl(42 45% 50%)" opacity="0.15" />
          <ellipse cx="275" cy="24" rx="14" ry="6" fill="hsl(42 45% 50%)" opacity="0.12" />
        </svg>
      </div>
    </section>
  );
});

export default HeroSection;
