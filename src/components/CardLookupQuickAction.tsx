import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Search, HandHelping, ScanLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { normalizeNumerals } from "@/lib/minaSearch";

/**
 * "Nusuk / HCOI Card mila?" smart lookup on Home.
 *
 * Universal entry: a pilgrim or finder types the card number / cover # / Nusuk ID
 * and we route intelligently:
 *   - 1–35           → /mina-tents/:n          (Maktab number)
 *   - 101–1880       → /hajj-buildings?building=n  (Makkah building / Rubath)
 *   - else (alpha-numeric Nusuk / HCOI cover #) → /lost-and-found prefilled
 *
 * Secondary CTA: "Yeh card kisi ka mila hai" → directly opens Lost & Found
 * report flow with the card ID prefilled, so the finder can register it for
 * the owner / family to discover.
 */
export const CardLookupQuickAction = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [value, setValue] = useState("");

  const lang = (["hi", "ur", "ar", "bn", "ta", "te", "ml", "mr", "kn", "or"].includes(language)
    ? language
    : "en") as
    | "en" | "hi" | "ur" | "ar"
    | "bn" | "ta" | "te" | "ml" | "mr" | "kn" | "or";

  const T = {
    en: {
      badge: "Nusuk / HCOI",
      title: "Found a card? Search by card number",
      subtitle: "Nusuk ID, HCOI cover #, Maktab or Building number — we'll route you to the right place.",
      placeholder: "Card / cover / building number",
      lookup: "Search",
      report: "I found someone's card — report it",
    },
    hi: {
      badge: "नुसुक / HCOI",
      title: "कार्ड मिला? कार्ड नंबर से सर्च करें",
      subtitle: "नुसुक आईडी, HCOI कवर नंबर, मकतब या बिल्डिंग नंबर — हम सही जगह ले जाएंगे।",
      placeholder: "कार्ड / कवर / बिल्डिंग नंबर",
      lookup: "खोजें",
      report: "किसी का कार्ड मिला है — रिपोर्ट करें",
    },
    ur: {
      badge: "نسک / HCOI",
      title: "کارڈ ملا؟ کارڈ نمبر سے تلاش کریں",
      subtitle: "نسک آئی ڈی، HCOI کور نمبر، مکتب یا بلڈنگ نمبر — ہم درست جگہ لے جائیں گے۔",
      placeholder: "کارڈ / کور / بلڈنگ نمبر",
      lookup: "تلاش کریں",
      report: "کسی کا کارڈ ملا ہے — رپورٹ کریں",
    },
    ar: {
      badge: "نسك / HCOI",
      title: "وجدت بطاقة؟ ابحث برقم البطاقة",
      subtitle: "معرّف نسك أو رقم غلاف HCOI أو رقم المكتب أو المبنى — سننقلك للمكان المناسب.",
      placeholder: "رقم البطاقة / الغلاف / المبنى",
      lookup: "بحث",
      report: "وجدت بطاقة شخص — أبلغ عنها",
    },
    bn: {
      badge: "নুসুক / HCOI",
      title: "কার্ড পেয়েছেন? কার্ড নম্বর দিয়ে খুঁজুন",
      subtitle: "নুসুক আইডি, HCOI কভার নং, মাকতাব বা বিল্ডিং নম্বর।",
      placeholder: "কার্ড / কভার / বিল্ডিং নম্বর",
      lookup: "খুঁজুন",
      report: "কারো কার্ড পেয়েছি — রিপোর্ট করুন",
    },
    ta: {
      badge: "நுசுக் / HCOI",
      title: "கார்டு கிடைத்ததா? கார்டு எண்ணை தேடுங்கள்",
      subtitle: "நுசுக் ID, HCOI கவர் எண், மக்தப் அல்லது கட்டிட எண்.",
      placeholder: "கார்டு / கவர் / கட்டிட எண்",
      lookup: "தேடு",
      report: "ஒருவரின் கார்டு கிடைத்தது — பதிவு செய்",
    },
    te: {
      badge: "నుసుక్ / HCOI",
      title: "కార్డు దొరికిందా? కార్డు నంబర్‌తో శోధించండి",
      subtitle: "నుసుక్ ID, HCOI కవర్ #, మక్తబ్ లేదా బిల్డింగ్ నంబర్.",
      placeholder: "కార్డు / కవర్ / బిల్డింగ్ నంబర్",
      lookup: "శోధించు",
      report: "ఎవరిదైనా కార్డు దొరికింది — నివేదించండి",
    },
    ml: {
      badge: "നുസുക് / HCOI",
      title: "കാർഡ് കിട്ടിയോ? കാർഡ് നമ്പർ കൊണ്ട് തിരയുക",
      subtitle: "നുസുക് ID, HCOI കവർ #, മക്തബ് അല്ലെങ്കിൽ കെട്ടിട നമ്പർ.",
      placeholder: "കാർഡ് / കവർ / കെട്ടിട നമ്പർ",
      lookup: "തിരയുക",
      report: "ഒരാളുടെ കാർഡ് കിട്ടി — റിപ്പോർട്ട് ചെയ്യുക",
    },
    mr: {
      badge: "नुसुक / HCOI",
      title: "कार्ड सापडले? कार्ड क्रमांकाने शोधा",
      subtitle: "नुसुक आयडी, HCOI कव्हर क्र., मक्तब किंवा इमारत क्रमांक.",
      placeholder: "कार्ड / कव्हर / इमारत क्रमांक",
      lookup: "शोधा",
      report: "कुणाचे कार्ड सापडले — नोंदवा",
    },
    kn: {
      badge: "ನುಸುಕ್ / HCOI",
      title: "ಕಾರ್ಡ್ ಸಿಕ್ಕಿತೆ? ಕಾರ್ಡ್ ಸಂಖ್ಯೆಯಿಂದ ಹುಡುಕಿ",
      subtitle: "ನುಸುಕ್ ID, HCOI ಕವರ್ #, ಮಕ್ತಬ್ ಅಥವಾ ಕಟ್ಟಡ ಸಂಖ್ಯೆ.",
      placeholder: "ಕಾರ್ಡ್ / ಕವರ್ / ಕಟ್ಟಡ ಸಂಖ್ಯೆ",
      lookup: "ಹುಡುಕು",
      report: "ಯಾರೋ ಕಾರ್ಡ್ ಸಿಕ್ಕಿದೆ — ವರದಿ ಮಾಡಿ",
    },
    or: {
      badge: "ନୁସୁକ୍ / HCOI",
      title: "କାର୍ଡ ମିଳିଲା? କାର୍ଡ ନମ୍ବର ସହ ଖୋଜନ୍ତୁ",
      subtitle: "ନୁସୁକ୍ ID, HCOI କଭର #, ମକ୍ତବ୍ କିମ୍ବା ବିଲ୍ଡିଂ ନମ୍ବର।",
      placeholder: "କାର୍ଡ / କଭର / ବିଲ୍ଡିଂ ନମ୍ବର",
      lookup: "ଖୋଜନ୍ତୁ",
      report: "କାହାର କାର୍ଡ ମିଳିଛି — ରିପୋର୍ଟ କରନ୍ତୁ",
    },
  }[lang];

  const routeFor = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return "/lost-and-found";
    const normalized = normalizeNumerals(trimmed);
    // Pure-digit lookup → Maktab or Building
    if (/^\d+$/.test(normalized)) {
      const n = parseInt(normalized, 10);
      if (n >= 1 && n <= 35) return `/mina-tents/${n}`;
      if (n >= 101 && n <= 1880) return `/hajj-buildings?building=${n}`;
    }
    // Anything else (Nusuk QR/alphanumeric, HCOI cover with letters, etc.)
    return `/lost-and-found?q=${encodeURIComponent(trimmed)}`;
  };

  const handleLookup = () => navigate(routeFor(value));

  const handleReportFound = () => {
    const trimmed = value.trim();
    const qs = new URLSearchParams({ type: "item", action: "report" });
    if (trimmed) qs.set("card", trimmed);
    navigate(`/lost-and-found?${qs.toString()}`);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border-2 border-islamic-gold/30 bg-gradient-to-br from-islamic-gold/10 via-islamic-gold/5 to-transparent p-5 shadow-sm"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-islamic-gold/10 blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl bg-islamic-gold/15 flex items-center justify-center shrink-0">
          <CreditCard className="w-6 h-6 text-islamic-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-islamic-gold/15 text-islamic-gold px-2 py-0.5 rounded-full">
            {T.badge}
          </span>
          <h2 className="text-base sm:text-lg font-bold leading-tight mt-0.5">
            {T.title}
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
        {T.subtitle}
      </p>

      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            inputMode="text"
            autoComplete="off"
            placeholder={T.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            className="pl-9 rounded-xl h-12 text-base font-medium bg-background"
            aria-label={T.placeholder}
            maxLength={64}
          />
        </div>
        <Button
          onClick={handleLookup}
          size="lg"
          className="rounded-xl h-12 px-4 gap-1.5 font-semibold"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">{T.lookup}</span>
        </Button>
      </div>

      <button
        onClick={handleReportFound}
        className="w-full flex items-center justify-center gap-1.5 text-xs text-primary hover:underline font-medium py-1.5"
      >
        <HandHelping className="w-3.5 h-3.5" />
        {T.report}
      </button>
    </div>
  );
};

export default CardLookupQuickAction;
