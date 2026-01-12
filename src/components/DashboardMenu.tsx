import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconCircle } from "@/components/IconCircle";
import {
  Landmark,
  Moon,
  Building,
  MapPin,
  Sword,
  Map,
  HandHeart,
  ClipboardList,
  HeartPulse,
  Banknote,
  Wifi,
  AlertTriangle,
  Phone,
  Bot,
  ScrollText,
  LifeBuoy,
  LucideIcon,
  Plane,
  Star,
} from "lucide-react";

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: Record<string, string>;
  route: string;
  color: string;
}

const menuItems: MenuItem[] = [
  {
    id: "hajj",
    icon: Landmark,
    label: { en: "Hajj", ar: "الحج", ur: "حج", hi: "हज", ta: "ஹஜ்", te: "హజ్", mr: "हज", bn: "হজ", or: "ହଜ୍ଜ", ml: "ഹജ്ജ്", pa: "ਹੱਜ" },
    route: "/prepare",
    color: "teal",
  },
  {
    id: "umrah",
    icon: Moon,
    label: { en: "Umrah", ar: "العمرة", ur: "عمرہ", hi: "उमराह", ta: "உம்ரா", te: "ఉమ్రా", mr: "उमराह", bn: "উমরাহ", or: "ଉମରାହ", ml: "ഉംറ", pa: "ਉਮਰਾਹ" },
    route: "/umrah",
    color: "violet",
  },
  {
    id: "map",
    icon: Map,
    label: { en: "Map", ar: "الخريطة", ur: "نقشہ", hi: "नक्शा", ta: "வரைபடம்", te: "మ్యాప్", mr: "नकाशा", bn: "মানচিত্র", or: "ମାନଚିତ୍ର", ml: "മാപ്പ്", pa: "ਨਕਸ਼ਾ" },
    route: "/map",
    color: "sky",
  },
  {
    id: "makkah",
    icon: Building,
    label: { en: "Makkah", ar: "مكة", ur: "مکہ", hi: "मक्का", ta: "மக்கா", te: "మక్కా", mr: "मक्का", bn: "মক্কা", or: "ମକ୍କା", ml: "മക്ക", pa: "ਮੱਕਾ" },
    route: "/makkah-guide",
    color: "amber",
  },
  {
    id: "madinah",
    icon: MapPin,
    label: { en: "Madinah", ar: "المدينة", ur: "مدینہ", hi: "मदीना", ta: "மதீனா", te: "మదీనా", mr: "मदीना", bn: "মদিনা", or: "ମଦୀନା", ml: "മദീന", pa: "ਮਦੀਨਾ" },
    route: "/madinah-guide",
    color: "emerald",
  },
  {
    id: "dua",
    icon: HandHeart,
    label: { en: "Dua", ar: "الدعاء", ur: "دعا", hi: "दुआ", ta: "துஆ", te: "దుఆ", mr: "दुआ", bn: "দোয়া", or: "ଦୁଆ", ml: "ദുആ", pa: "ਦੁਆ" },
    route: "/dua",
    color: "rose",
  },
  {
    id: "preparation",
    icon: ClipboardList,
    label: { en: "Preparation", ar: "التحضير", ur: "تیاری", hi: "तैयारी", ta: "தயாரிப்பு", te: "తయారీ", mr: "तयारी", bn: "প্রস্তুতি", or: "ପ୍ରସ୍ତୁତି", ml: "തയ്യാറെടുപ്പ്", pa: "ਤਿਆਰੀ" },
    route: "/preparation",
    color: "indigo",
  },
  {
    id: "rules",
    icon: ScrollText,
    label: { en: "Rules", ar: "القواعد", ur: "قواعد", hi: "नियम", ta: "விதிகள்", te: "నియమాలు", mr: "नियम", bn: "নিয়ম", or: "ନିୟମ", ml: "നിയമങ്ങൾ", pa: "ਨਿਯਮ" },
    route: "/rules",
    color: "orange",
  },
  {
    id: "health",
    icon: HeartPulse,
    label: { en: "Health", ar: "الصحة", ur: "صحت", hi: "स्वास्थ्य", ta: "உடல்நலம்", te: "ఆరోగ్యం", mr: "आरोग्य", bn: "স্বাস্থ্য", or: "ସ୍ୱାସ୍ଥ୍ୟ", ml: "ആരോഗ്യം", pa: "ਸਿਹਤ" },
    route: "/health",
    color: "red",
  },
  {
    id: "money",
    icon: Banknote,
    label: { en: "Money", ar: "المال", ur: "پیسہ", hi: "पैसा", ta: "பணம்", te: "డబ్బు", mr: "पैसे", bn: "টাকা", or: "ପଇସା", ml: "പണം", pa: "ਪੈਸਾ" },
    route: "/money",
    color: "lime",
  },
  {
    id: "telecom",
    icon: Wifi,
    label: { en: "Telecom", ar: "اتصالات", ur: "ٹیلی کام", hi: "टेलीकॉम", ta: "டெலிகாம்", te: "టెలికాం", mr: "टेलिकॉम", bn: "টেলিকম", or: "ଟେଲିକମ", ml: "ടെലികോം", pa: "ਟੈਲੀਕਾਮ" },
    route: "/telecom",
    color: "cyan",
  },
  {
    id: "qurbani",
    icon: Sword,
    label: { en: "Qurbani", ar: "قربانی", ur: "قربانی", hi: "कुर्बानी", ta: "குர்பானி", te: "ఖుర్బానీ", mr: "कुर्बानी", bn: "কোরবানি", or: "କୁର୍ବାନୀ", ml: "ഖുർബാനി", pa: "ਕੁਰਬਾਨੀ" },
    route: "/family",
    color: "pink",
  },
  {
    id: "assistant",
    icon: Bot,
    label: { en: "AI Assistant", ar: "المساعد", ur: "اے آئی", hi: "AI सहायक", ta: "AI உதவி", te: "AI సహాయం", mr: "AI मदत", bn: "AI সহায়ক", or: "AI ସହାୟକ", ml: "AI സഹായി", pa: "AI ਸਹਾਇਕ" },
    route: "/chat",
    color: "fuchsia",
  },
  {
    id: "grievances",
    icon: AlertTriangle,
    label: { en: "Grievances", ar: "الشكاوى", ur: "شکایات", hi: "शिकायतें", ta: "புகார்கள்", te: "ఫిర్యాదులు", mr: "तक्रारी", bn: "অভিযোগ", or: "ଅଭିଯୋଗ", ml: "പരാതികൾ", pa: "ਸ਼ਿਕਾਇਤਾਂ" },
    route: "/grievances",
    color: "yellow",
  },
  {
    id: "contacts",
    icon: Phone,
    label: { en: "Directory", ar: "الدليل", ur: "ڈائریکٹری", hi: "डायरेक्टरी", ta: "அடைவு", te: "డైరెక్టరీ", mr: "डायरेक्टरी", bn: "ডিরেক্টরি", or: "ଡିରେକ୍ଟୋରୀ", ml: "ഡയറക്ടറി", pa: "ਡਾਇਰੈਕਟਰੀ" },
    route: "/haj-directory",
    color: "teal",
  },
  {
    id: "pre-hajj",
    icon: Plane,
    label: { en: "Pre-Hajj India", ar: "قبل الحج", ur: "حج سے پہلے", hi: "हज से पहले", ta: "ஹஜ்ஜுக்கு முன்", te: "హజ్ కు ముందు", mr: "हज आधी", bn: "হজের আগে", or: "ହଜ ପୂର୍ବରୁ", ml: "ഹജ്ജിന് മുമ്പ്", pa: "ਹੱਜ ਤੋਂ ਪਹਿਲਾਂ" },
    route: "/pre-hajj-india",
    color: "indigo",
  },
  {
    id: "post-hajj",
    icon: Star,
    label: { en: "Haj Mabroor", ar: "حج مبرور", ur: "حج مبرور", hi: "हज मबरूर", ta: "ஹஜ் மப்ரூர்", te: "హజ్ మబ్రూర్", mr: "हज मबरूर", bn: "হজ মাবরুর", or: "ହଜ ମବ୍ରୁର", ml: "ഹജ്ജ് മബ്റൂർ", pa: "ਹੱਜ ਮਬਰੂਰ" },
    route: "/post-hajj",
    color: "amber",
  },
  {
    id: "help",
    icon: LifeBuoy,
    label: { en: "Help", ar: "مساعدة", ur: "مدد", hi: "मदद", ta: "உதவி", te: "సహాయం", mr: "मदत", bn: "সাহায্য", or: "ସାହାଯ୍ୟ", ml: "സഹായം", pa: "ਮਦਦ" },
    route: "/help",
    color: "emerald",
  },
];

export function DashboardMenu() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {menuItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => navigate(item.route)}
          className="flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group animate-fade-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <IconCircle 
            icon={item.icon} 
            size="md"
            variant={item.color as any}
            className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
          />
          <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight line-clamp-2">
            {item.label[language] || item.label.en}
          </span>
        </button>
      ))}
    </div>
  );
}
