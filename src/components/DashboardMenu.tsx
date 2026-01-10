import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconCircle } from "@/components/IconCircle";
import {
  Landmark,
  Moon,
  Building,
  MapPin,
  Users,
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
} from "lucide-react";

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: Record<string, string>;
  route: string;
}

const menuItems: MenuItem[] = [
  {
    id: "hajj",
    icon: Landmark,
    label: { en: "Hajj", ar: "الحج", ur: "حج", hi: "हज", tr: "Hac", ru: "Хадж" },
    route: "/prepare",
  },
  {
    id: "umrah",
    icon: Moon,
    label: { en: "Umrah", ar: "العمرة", ur: "عمرہ", hi: "उमरा", tr: "Umre", ru: "Умра" },
    route: "/umrah",
  },
  {
    id: "map",
    icon: Map,
    label: { en: "Map", ar: "الخريطة", ur: "نقشہ", hi: "नक्शा", tr: "Harita", ru: "Карта" },
    route: "/map",
  },
  {
    id: "makkah",
    icon: Building,
    label: { en: "Makkah", ar: "مكة", ur: "مکہ", hi: "मक्का", tr: "Mekke", ru: "Мекка" },
    route: "/makkah-guide",
  },
  {
    id: "madinah",
    icon: MapPin,
    label: { en: "Madinah", ar: "المدينة", ur: "مدینہ", hi: "मदीना", tr: "Medine", ru: "Медина" },
    route: "/madinah-guide",
  },
  {
    id: "dua",
    icon: HandHeart,
    label: { en: "Dua", ar: "الدعاء", ur: "دعا", hi: "दुआ", tr: "Dua", ru: "Дуа" },
    route: "/dua",
  },
  {
    id: "preparation",
    icon: ClipboardList,
    label: { en: "Preparation", ar: "التحضير", ur: "تیاری", hi: "तैयारी", tr: "Hazırlık", ru: "Подготовка" },
    route: "/preparation",
  },
  {
    id: "rules",
    icon: ScrollText,
    label: { en: "Rules", ar: "القواعد", ur: "قواعد", hi: "नियम", tr: "Kurallar", ru: "Правила" },
    route: "/rules",
  },
  {
    id: "health",
    icon: HeartPulse,
    label: { en: "Health", ar: "الصحة", ur: "صحت", hi: "स्वास्थ्य", tr: "Sağlık", ru: "Здоровье" },
    route: "/health",
  },
  {
    id: "money",
    icon: Banknote,
    label: { en: "Money", ar: "المال", ur: "پیسہ", hi: "धन", tr: "Para", ru: "Деньги" },
    route: "/money",
  },
  {
    id: "telecom",
    icon: Wifi,
    label: { en: "Telecom", ar: "اتصالات", ur: "ٹیلی کام", hi: "टेलीकॉम", tr: "Telekom", ru: "Телеком" },
    route: "/telecom",
  },
  {
    id: "family",
    icon: Users,
    label: { en: "Family", ar: "العائلة", ur: "فیملی", hi: "परिवार", tr: "Aile", ru: "Семья" },
    route: "/family",
  },
  {
    id: "assistant",
    icon: Bot,
    label: { en: "AI Assistant", ar: "المساعد", ur: "اے آئی", hi: "AI सहायक", tr: "AI Asistan", ru: "AI Помощник" },
    route: "/chat",
  },
  {
    id: "grievances",
    icon: AlertTriangle,
    label: { en: "Grievances", ar: "الشكاوى", ur: "شکایات", hi: "शिकायतें", tr: "Şikayetler", ru: "Жалобы" },
    route: "/grievances",
  },
  {
    id: "contacts",
    icon: Phone,
    label: { en: "Contacts", ar: "الاتصال", ur: "رابطہ", hi: "संपर्क", tr: "İletişim", ru: "Контакты" },
    route: "/contacts",
  },
  {
    id: "help",
    icon: LifeBuoy,
    label: { en: "Help", ar: "مساعدة", ur: "مدد", hi: "सहायता", tr: "Yardım", ru: "Помощь" },
    route: "/help",
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
          className="flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md group animate-fade-up"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <IconCircle 
            icon={item.icon} 
            size="md"
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight line-clamp-2">
            {item.label[language] || item.label.en}
          </span>
        </button>
      ))}
    </div>
  );
}
