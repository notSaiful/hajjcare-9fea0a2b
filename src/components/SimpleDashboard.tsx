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
    <div className="grid grid-cols-2 gap-3.5 p-4">
      {dashboardItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigate(item.route)}
          className={cn(
            "h-[70px] rounded-lg",
            "flex items-center justify-center gap-2.5",
            "text-lg font-bold",
            "border-0 cursor-pointer",
            "active:opacity-85 touch-manipulation select-none",
            "transition-opacity duration-150",
            item.variant === "primary" && "bg-[#0033CC] text-white",
            item.variant === "danger" && "bg-[#D32F2F] text-white"
          )}
        >
          <span className="text-lg">{item.emoji}</span>
          <span className="text-lg">
            {item.label[language] || item.label.en}
          </span>
        </button>
      ))}
    </div>
  );
});
