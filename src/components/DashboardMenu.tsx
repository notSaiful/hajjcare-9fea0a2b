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
  color: string;
}

const menuItems: MenuItem[] = [
  {
    id: "hajj",
    icon: Landmark,
    label: { en: "Hajj", ar: "الحج", ur: "حج", hi: "हज", tr: "Hac", ru: "Хадж" },
    route: "/prepare",
    color: "teal",
  },
  {
    id: "umrah",
    icon: Moon,
    label: { en: "Umrah", ar: "العمرة", ur: "عمرہ", hi: "उमराह", tr: "Umre", ru: "Умра" },
    route: "/umrah",
    color: "violet",
  },
  {
    id: "map",
    icon: Map,
    label: { en: "Map", ar: "الخريطة", ur: "نقشہ", hi: "नक्शा", tr: "Harita", ru: "Карта" },
    route: "/map",
    color: "sky",
  },
  {
    id: "makkah",
    icon: Building,
    label: { en: "Makkah", ar: "مكة", ur: "مکہ", hi: "मक्का", tr: "Mekke", ru: "Мекка" },
    route: "/makkah-guide",
    color: "amber",
  },
  {
    id: "madinah",
    icon: MapPin,
    label: { en: "Madinah", ar: "المدينة", ur: "مدینہ", hi: "मदीना", tr: "Medine", ru: "Медина" },
    route: "/madinah-guide",
    color: "emerald",
  },
  {
    id: "dua",
    icon: HandHeart,
    label: { en: "Dua", ar: "الدعاء", ur: "دعا", hi: "दुआ", tr: "Dua", ru: "Дуа" },
    route: "/dua",
    color: "rose",
  },
  {
    id: "preparation",
    icon: ClipboardList,
    label: { en: "Preparation", ar: "التحضير", ur: "تیاری", hi: "तैयारी", tr: "Hazırlık", ru: "Подготовка" },
    route: "/preparation",
    color: "indigo",
  },
  {
    id: "rules",
    icon: ScrollText,
    label: { en: "Rules", ar: "القواعد", ur: "قواعد", hi: "नियम", tr: "Kurallar", ru: "Правила" },
    route: "/rules",
    color: "orange",
  },
  {
    id: "health",
    icon: HeartPulse,
    label: { en: "Health", ar: "الصحة", ur: "صحت", hi: "स्वास्थ्य", tr: "Sağlık", ru: "Здоровье" },
    route: "/health",
    color: "red",
  },
  {
    id: "money",
    icon: Banknote,
    label: { en: "Money", ar: "المال", ur: "پیسہ", hi: "पैसा", tr: "Para", ru: "Деньги" },
    route: "/money",
    color: "lime",
  },
  {
    id: "telecom",
    icon: Wifi,
    label: { en: "Telecom", ar: "اتصالات", ur: "ٹیلی کام", hi: "टेलीकॉम", tr: "Telekom", ru: "Телеком" },
    route: "/telecom",
    color: "cyan",
  },
  {
    id: "family",
    icon: Users,
    label: { en: "Family", ar: "العائلة", ur: "فیملی", hi: "परिवार", tr: "Aile", ru: "Семья" },
    route: "/family",
    color: "pink",
  },
  {
    id: "assistant",
    icon: Bot,
    label: { en: "AI Assistant", ar: "المساعد", ur: "اے آئی", hi: "AI सहायक", tr: "AI Asistan", ru: "AI Помощник" },
    route: "/chat",
    color: "fuchsia",
  },
  {
    id: "grievances",
    icon: AlertTriangle,
    label: { en: "Grievances", ar: "الشكاوى", ur: "شکایات", hi: "शिकायतें", tr: "Şikayetler", ru: "Жалобы" },
    route: "/grievances",
    color: "yellow",
  },
  {
    id: "contacts",
    icon: Phone,
    label: { en: "Contacts", ar: "الاتصال", ur: "رابطہ", hi: "संपर्क", tr: "İletişim", ru: "Контакты" },
    route: "/contacts",
    color: "teal",
  },
  {
    id: "help",
    icon: LifeBuoy,
    label: { en: "Help", ar: "مساعدة", ur: "مدد", hi: "मदद", tr: "Yardım", ru: "Помощь" },
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
