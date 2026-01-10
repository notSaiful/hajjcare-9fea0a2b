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
  CalendarClock,
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
    label: { en: "Hajj", ar: "الحج", ur: "حج", hi: "حج", tr: "Hac", ru: "Хадж" },
    route: "/prepare",
    color: "teal",
  },
  {
    id: "umrah",
    icon: Moon,
    label: { en: "Umrah", ar: "العمرة", ur: "عمرہ", hi: "عمرہ", tr: "Umre", ru: "Умра" },
    route: "/umrah",
    color: "violet",
  },
  {
    id: "map",
    icon: Map,
    label: { en: "Map", ar: "الخريطة", ur: "نقشہ", hi: "نقشہ", tr: "Harita", ru: "Карта" },
    route: "/map",
    color: "sky",
  },
  {
    id: "makkah",
    icon: Building,
    label: { en: "Makkah", ar: "مكة", ur: "مکہ", hi: "مکہ", tr: "Mekke", ru: "Мекка" },
    route: "/makkah-guide",
    color: "amber",
  },
  {
    id: "madinah",
    icon: MapPin,
    label: { en: "Madinah", ar: "المدينة", ur: "مدینہ", hi: "مدینہ", tr: "Medine", ru: "Медина" },
    route: "/madinah-guide",
    color: "emerald",
  },
  {
    id: "dua",
    icon: HandHeart,
    label: { en: "Dua", ar: "الدعاء", ur: "دعا", hi: "دعا", tr: "Dua", ru: "Дуа" },
    route: "/dua",
    color: "rose",
  },
  {
    id: "preparation",
    icon: ClipboardList,
    label: { en: "Preparation", ar: "التحضير", ur: "تیاری", hi: "تیاری", tr: "Hazırlık", ru: "Подготовка" },
    route: "/preparation",
    color: "indigo",
  },
  {
    id: "rules",
    icon: ScrollText,
    label: { en: "Rules", ar: "القواعد", ur: "قواعد", hi: "قواعد", tr: "Kurallar", ru: "Правила" },
    route: "/rules",
    color: "orange",
  },
  {
    id: "health",
    icon: HeartPulse,
    label: { en: "Health", ar: "الصحة", ur: "صحت", hi: "صحت", tr: "Sağlık", ru: "Здоровье" },
    route: "/health",
    color: "red",
  },
  {
    id: "money",
    icon: Banknote,
    label: { en: "Money", ar: "المال", ur: "پیسہ", hi: "پیسہ", tr: "Para", ru: "Деньги" },
    route: "/money",
    color: "lime",
  },
  {
    id: "telecom",
    icon: Wifi,
    label: { en: "Telecom", ar: "اتصالات", ur: "ٹیلی کام", hi: "ٹیلی کام", tr: "Telekom", ru: "Телеком" },
    route: "/telecom",
    color: "cyan",
  },
  {
    id: "family",
    icon: Users,
    label: { en: "Family", ar: "العائلة", ur: "فیملی", hi: "فیملی", tr: "Aile", ru: "Семья" },
    route: "/family",
    color: "pink",
  },
  {
    id: "assistant",
    icon: Bot,
    label: { en: "AI Assistant", ar: "المساعد", ur: "اے آئی", hi: "اے آئی", tr: "AI Asistan", ru: "AI Помощник" },
    route: "/chat",
    color: "fuchsia",
  },
  {
    id: "grievances",
    icon: AlertTriangle,
    label: { en: "Grievances", ar: "الشكاوى", ur: "شکایات", hi: "شکایات", tr: "Şikayetler", ru: "Жалобы" },
    route: "/grievances",
    color: "yellow",
  },
  {
    id: "contacts",
    icon: Phone,
    label: { en: "Contacts", ar: "الاتصال", ur: "رابطہ", hi: "رابطہ", tr: "İletişim", ru: "Контакты" },
    route: "/contacts",
    color: "teal",
  },
  {
    id: "meeting",
    icon: CalendarClock,
    label: { en: "Meeting", ar: "الاجتماع", ur: "میٹنگ", hi: "میٹنگ", tr: "Toplantı", ru: "Встреча" },
    route: "/meeting",
    color: "violet",
  },
  {
    id: "help",
    icon: LifeBuoy,
    label: { en: "Help", ar: "مساعدة", ur: "مدد", hi: "مدد", tr: "Yardım", ru: "Помощь" },
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
