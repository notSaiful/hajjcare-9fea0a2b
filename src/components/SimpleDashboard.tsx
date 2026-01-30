import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { 
  Landmark, 
  MapPin, 
  Compass, 
  AlertTriangle, 
  BookOpen, 
  Headphones,
  LucideIcon
} from "lucide-react";

interface DashboardItem {
  id: string;
  icon: LucideIcon;
  emoji: string;
  label: Record<string, string>;
  route: string;
  variant: "primary" | "danger";
}

const dashboardItems: DashboardItem[] = [
  {
    id: "hajj-guide",
    icon: Landmark,
    emoji: "🕋",
    label: {
      en: "Hajj Guide",
      ar: "دليل الحج",
      ur: "حج گائیڈ",
      hi: "हज गाइड",
      ta: "ஹஜ் வழிகாட்டி",
      te: "హజ్ గైడ్",
      mr: "हज मार्गदर्शक",
      bn: "হজ গাইড",
      or: "ହଜ ଗାଇଡ",
      ml: "ഹജ്ജ് ഗൈഡ്",
      pa: "ਹੱਜ ਗਾਈਡ",
    },
    route: "/prepare",
    variant: "primary",
  },
  {
    id: "live-location",
    icon: MapPin,
    emoji: "📍",
    label: {
      en: "Live Location",
      ar: "الموقع المباشر",
      ur: "براہ راست مقام",
      hi: "लाइव लोकेशन",
      ta: "நேரடி இருப்பிடம்",
      te: "లైవ్ లొకేషన్",
      mr: "लाइव्ह लोकेशन",
      bn: "লাইভ লোকেশন",
      or: "ଲାଇଭ୍ ଲୋକେସନ୍",
      ml: "ലൈവ് ലൊക്കേഷൻ",
      pa: "ਲਾਈਵ ਲੋਕੇਸ਼ਨ",
    },
    route: "/family",
    variant: "primary",
  },
  {
    id: "navigation",
    icon: Compass,
    emoji: "🧭",
    label: {
      en: "Navigation",
      ar: "الملاحة",
      ur: "نیویگیشن",
      hi: "नेविगेशन",
      ta: "வழிசெலுத்தல்",
      te: "నావిగేషన్",
      mr: "नेव्हिगेशन",
      bn: "নেভিগেশন",
      or: "ନେଭିଗେସନ୍",
      ml: "നാവിഗേഷൻ",
      pa: "ਨੈਵੀਗੇਸ਼ਨ",
    },
    route: "/map",
    variant: "primary",
  },
  {
    id: "emergency",
    icon: AlertTriangle,
    emoji: "🚨",
    label: {
      en: "Emergency Help",
      ar: "مساعدة طوارئ",
      ur: "ایمرجنسی مدد",
      hi: "आपातकालीन मदद",
      ta: "அவசர உதவி",
      te: "అత్యవసర సహాయం",
      mr: "आणीबाणी मदत",
      bn: "জরুরি সাহায্য",
      or: "ଜରୁରୀ ସାହାଯ୍ୟ",
      ml: "അടിയന്തര സഹായം",
      pa: "ਐਮਰਜੈਂਸੀ ਮਦਦ",
    },
    route: "/help",
    variant: "danger",
  },
  {
    id: "duas",
    icon: BookOpen,
    emoji: "📖",
    label: {
      en: "Duas",
      ar: "الأدعية",
      ur: "دعائیں",
      hi: "दुआएं",
      ta: "துஆக்கள்",
      te: "దుఆలు",
      mr: "दुआ",
      bn: "দোয়া",
      or: "ଦୁଆ",
      ml: "ദുആകൾ",
      pa: "ਦੁਆਵਾਂ",
    },
    route: "/dua",
    variant: "primary",
  },
  {
    id: "helpdesk",
    icon: Headphones,
    emoji: "☎",
    label: {
      en: "Help Desk",
      ar: "مكتب المساعدة",
      ur: "ہیلپ ڈیسک",
      hi: "हेल्प डेस्क",
      ta: "உதவி மேசை",
      te: "హెల్ప్ డెస్క్",
      mr: "हेल्प डेस्क",
      bn: "হেল্প ডেস্ক",
      or: "ହେଲ୍ପ ଡେସ୍କ",
      ml: "ഹെൽപ്പ് ഡെസ്ക്",
      pa: "ਹੈਲਪ ਡੈਸਕ",
    },
    route: "/haj-directory",
    variant: "primary",
  },
];

export const SimpleDashboard = memo(function SimpleDashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleNavigate = useCallback(
    (route: string) => {
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
      navigate(route);
    },
    [navigate]
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {dashboardItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigate(item.route)}
          className={cn(
            "flex flex-col items-center justify-center gap-3 p-6 rounded-xl",
            "border-2 transition-all duration-200 ease-out",
            "active:scale-[0.97] touch-manipulation select-none",
            "min-h-[120px]",
            item.variant === "primary" && [
              "bg-card border-border",
              "hover:border-primary/50 hover:shadow-md",
            ],
            item.variant === "danger" && [
              "bg-[hsl(var(--status-emergency-bg))] border-[hsl(var(--status-emergency))]",
              "hover:shadow-md",
            ]
          )}
        >
          <span className="text-4xl">{item.emoji}</span>
          <span
            className={cn(
              "text-base font-semibold text-center leading-tight",
              item.variant === "danger" 
                ? "text-[hsl(var(--status-emergency))]" 
                : "text-foreground"
            )}
          >
            {item.label[language] || item.label.en}
          </span>
        </button>
      ))}
    </div>
  );
});
