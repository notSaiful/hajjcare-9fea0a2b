import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconCircle } from "@/components/IconCircle";
import { getPrefetchProps } from "@/hooks/useRoutePrefetch";
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
  UtensilsCrossed,
  Flower2,
  Share2,
  Video,
  HeartHandshake,
  UserSearch,
  Gift,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: Record<string, string>;
  route: string;
  color: string;
}

interface MenuSection {
  id: string;
  title: Record<string, string>;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  // SECTION A – BEFORE HAJJ
  {
    id: "before-hajj",
    title: { en: "Before Hajj", ar: "قبل الحج", ur: "حج سے پہلے", hi: "हज से पहले", ta: "ஹஜ்ஜுக்கு முன்", te: "హజ్ కు ముందు", mr: "हज आधी", bn: "হজের আগে", or: "ହଜ ପୂର୍ବରୁ", ml: "ഹജ്ജിന് മുമ്പ്", pa: "ਹੱਜ ਤੋਂ ਪਹਿਲਾਂ" },
    items: [
      {
        id: "pre-hajj",
        icon: Plane,
        label: { en: "Pre-Hajj India", ar: "قبل الحج", ur: "حج سے پہلے", hi: "हज से पहले", ta: "ஹஜ்ஜுக்கு முன்", te: "హజ్ కు ముందు", mr: "हज आधी", bn: "হজের আগে", or: "ହଜ ପୂର୍ବରୁ", ml: "ഹജ്ജിന് മുമ്പ്", pa: "ਹੱਜ ਤੋਂ ਪਹਿਲਾਂ" },
        route: "/pre-hajj-india",
        color: "emerald",
      },
      {
        id: "preparation",
        icon: ClipboardList,
        label: { en: "Preparation", ar: "التحضير", ur: "تیاری", hi: "तैयारी", ta: "தயாரிப்பு", te: "తయారీ", mr: "तयारी", bn: "প্রস্তুতি", or: "ପ୍ରସ୍ତୁତି", ml: "തയ്യാറെടുപ്പ്", pa: "ਤਿਆਰੀ" },
        route: "/preparation",
        color: "teal",
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
        color: "sky",
      },
      {
        id: "map",
        icon: Map,
        label: { en: "Map", ar: "الخريطة", ur: "نقشہ", hi: "नक्शा", ta: "வரைபடம்", te: "మ్యాప్", mr: "नकाशा", bn: "মানচিত্র", or: "ମାନଚିତ୍ର", ml: "മാപ്പ്", pa: "ਨਕਸ਼ਾ" },
        route: "/map",
        color: "indigo",
      },
      {
        id: "family",
        icon: MapPin,
        label: { en: "Family", ar: "العائلة", ur: "خاندان", hi: "परिवार", ta: "குடும்பம்", te: "కుటుంబం", mr: "कुटुंब", bn: "পরিবার", or: "ପରିବାର", ml: "കുടുംബം", pa: "ਪਰਿਵਾਰ" },
        route: "/family",
        color: "blue",
      },
    ],
  },
  // SECTION B – CORE JOURNEY
  {
    id: "core-journey",
    title: { en: "Core Journey", ar: "الرحلة الأساسية", ur: "اصل سفر", hi: "मुख्य यात्रा", ta: "முக்கிய பயணம்", te: "ప్రధాన ప్రయాణం", mr: "मुख्य प्रवास", bn: "মূল যাত্রা", or: "ମୁଖ୍ୟ ଯାତ୍ରା", ml: "പ്രധാന യാത്ര", pa: "ਮੁੱਖ ਯਾਤਰਾ" },
    items: [
      {
        id: "hajj",
        icon: Landmark,
        label: { en: "Hajj", ar: "الحج", ur: "حج", hi: "हज", ta: "ஹஜ்", te: "హజ్", mr: "हज", bn: "হজ", or: "ହଜ୍ଜ", ml: "ഹജ്ജ്", pa: "ਹੱਜ" },
        route: "/prepare",
        color: "emerald",
      },
      {
        id: "umrah",
        icon: Moon,
        label: { en: "Umrah", ar: "العمرة", ur: "عمرہ", hi: "उमराह", ta: "உம்ரா", te: "ఉమ్రా", mr: "उमराह", bn: "উমরাহ", or: "ଉମରାହ", ml: "ഉംറ", pa: "ਉਮਰਾਹ" },
        route: "/umrah",
        color: "violet",
      },
      {
        id: "makkah",
        icon: Building,
        label: { en: "Makkah", ar: "مكة", ur: "مکہ", hi: "मक्का", ta: "மக்கா", te: "మక్కా", mr: "मक्का", bn: "মক্কা", or: "ମକ୍କା", ml: "മക്ക", pa: "ਮੱਕਾ" },
        route: "/makkah-guide",
        color: "orange",
      },
      {
        id: "madinah",
        icon: MapPin,
        label: { en: "Madinah", ar: "المدينة", ur: "مدینہ", hi: "मदीना", ta: "மதீனா", te: "మదీనా", mr: "मदीना", bn: "মদিনা", or: "ମଦୀନା", ml: "മദീന", pa: "ਮਦੀਨਾ" },
        route: "/madinah-guide",
        color: "teal",
      },
      {
        id: "dua",
        icon: HandHeart,
        label: { en: "Dua", ar: "الدعاء", ur: "دعا", hi: "दुआ", ta: "துஆ", te: "దుఆ", mr: "दुआ", bn: "দোয়া", or: "ଦୁଆ", ml: "ദുആ", pa: "ਦੁਆ" },
        route: "/dua",
        color: "rose",
      },
      {
        id: "qurbani",
        icon: Sword,
        label: { en: "Qurbani", ar: "قربانی", ur: "قربانی", hi: "कुर्बानी", ta: "குர்பானி", te: "ఖుర్బానీ", mr: "कुर्बानी", bn: "কোরবানি", or: "କୁର୍ବାନୀ", ml: "ഖുർബാനി", pa: "ਕੁਰਬਾਨੀ" },
        route: "/qurbani",
        color: "orange",
      },
      {
        id: "women",
        icon: Flower2,
        label: { en: "Women", ar: "النساء", ur: "خواتین", hi: "महिलाएं", ta: "பெண்கள்", te: "మహిళలు", mr: "महिला", bn: "মহিলা", or: "ମହିଳା", ml: "സ്ത്രീകൾ", pa: "ਔਰਤਾਂ" },
        route: "/women",
        color: "pink",
      },
      {
        id: "services",
        icon: HeartHandshake,
        label: { en: "Services", ar: "الخدمات", ur: "خدمات", hi: "सेवाएं", ta: "சேவைகள்", te: "సేవలు", mr: "सेवा", bn: "সেবা", or: "ସେବା", ml: "സേവനങ്ങൾ", pa: "ਸੇਵਾਵਾਂ" },
        route: "/govt-services",
        color: "cyan",
      },
    ],
  },
  // SECTION C – SPECIAL
  {
    id: "special",
    title: { en: "Special", ar: "خاص", ur: "خاص", hi: "विशेष", ta: "சிறப்பு", te: "ప్రత్యేక", mr: "विशेष", bn: "বিশেষ", or: "ବିଶେଷ", ml: "പ്രത്യേക", pa: "ਵਿਸ਼ੇਸ਼" },
    items: [
      {
        id: "food",
        icon: UtensilsCrossed,
        label: { en: "Food", ar: "الطعام", ur: "کھانا", hi: "भोजन", ta: "உணவு", te: "ఆహారం", mr: "अन्न", bn: "খাবার", or: "ଖାଦ୍ୟ", ml: "ഭക്ഷണം", pa: "ਭੋਜਨ" },
        route: "/food",
        color: "amber",
      },
      {
        id: "socials",
        icon: Share2,
        label: { en: "Socials", ar: "التواصل", ur: "سوشل میڈیا", hi: "सोशल", ta: "சமூகம்", te: "సోషల్స్", mr: "सोशल", bn: "সোশ্যাল", or: "ସୋସିଆଲ", ml: "സോഷ്യൽ", pa: "ਸੋਸ਼ਲ" },
        route: "/socials",
        color: "blue",
      },
      {
        id: "video-call",
        icon: Video,
        label: { en: "Video Call", ar: "مكالمة فيديو", ur: "ویڈیو کال", hi: "वीडियो कॉल", ta: "வீடியோ அழைப்பு", te: "వీడియో కాల్", mr: "व्हिडिओ कॉल", bn: "ভিডিও কল", or: "ଭିଡିଓ କଲ", ml: "വീഡിയോ കോൾ", pa: "ਵੀਡੀਓ ਕਾਲ" },
        route: "/video-call",
        color: "violet",
      },
      {
        id: "inspector",
        icon: UserSearch,
        label: { en: "Inspector", ar: "المفتش", ur: "انسپکٹر", hi: "इंस्पेक्टर", ta: "ஆய்வாளர்", te: "ఇన్‌స్పెక్టర్", mr: "इन्स्पेक्टर", bn: "ইন্সপেক্টর", or: "ଇନ୍ସପେକ୍ଟର", ml: "ഇൻസ്‌പെക്ടർ", pa: "ਇੰਸਪੈਕਟਰ" },
        route: "/inspector",
        color: "indigo",
      },
      {
        id: "haji-attention",
        icon: GraduationCap,
        label: { en: "SHI Training", ar: "تدريب المفتشين", ur: "ایس ایچ آئی ٹریننگ", hi: "SHI प्रशिक्षण", ta: "SHI பயிற்சி", te: "SHI శిక్షణ", mr: "SHI प्रशिक्षण", bn: "SHI প্রশিক্ষণ", or: "SHI ତାଲିମ", ml: "SHI പരിശീലനം", pa: "SHI ਸਿਖਲਾਈ" },
        route: "/shi-training",
        color: "rose",
      },
    ],
  },
  // SECTION D – HELP
  {
    id: "help-section",
    title: { en: "Help", ar: "مساعدة", ur: "مدد", hi: "मदद", ta: "உதவி", te: "సహాయం", mr: "मदत", bn: "সাহায্য", or: "ସାହାଯ୍ୟ", ml: "സഹായം", pa: "ਮਦਦ" },
    items: [
      {
        id: "help",
        icon: LifeBuoy,
        label: { en: "Help", ar: "مساعدة", ur: "مدد", hi: "मदद", ta: "உதவி", te: "సహాయం", mr: "मदत", bn: "সাহায্য", or: "ସାହାଯ୍ୟ", ml: "സഹായം", pa: "ਮਦਦ" },
        route: "/help",
        color: "teal",
      },
      {
        id: "grievances",
        icon: AlertTriangle,
        label: { en: "Grievances", ar: "الشكاوى", ur: "شکایات", hi: "शिकायतें", ta: "புகார்கள்", te: "ఫిర్యాదులు", mr: "तक्रारी", bn: "অভিযোগ", or: "ଅଭିଯୋଗ", ml: "പരാതികൾ", pa: "ਸ਼ਿਕਾਇਤਾਂ" },
        route: "/grievances",
        color: "amber",
      },
      {
        id: "contacts",
        icon: Phone,
        label: { en: "Directory", ar: "الدليل", ur: "ڈائریکٹری", hi: "डायरेक्टरी", ta: "அடைவு", te: "డైరెక్టరీ", mr: "डायरेक्टरी", bn: "ডিরেক্টরি", or: "ଡିରେକ୍ଟୋରୀ", ml: "ഡയറക്ടറി", pa: "ਡਾਇਰੈਕਟਰੀ" },
        route: "/haj-directory",
        color: "emerald",
      },
      {
        id: "haj-inspectors",
        icon: ClipboardCheck,
        label: { en: "Haj Inspectors", ar: "مفتشو الحج", ur: "حج انسپکٹرز", hi: "हज इंस्पेक्टर", ta: "ஹஜ் ஆய்வாளர்", te: "హజ్ ఇన్‌స్పెక్టర్లు", mr: "हज इन्स्पेक्टर", bn: "হজ ইন্সপেক্টর", or: "ହଜ ଇନ୍ସପେକ୍ଟର", ml: "ഹജ്ജ് ഇൻസ്‌പെക്ടർമാർ", pa: "ਹੱਜ ਇੰਸਪੈਕਟਰ" },
        route: "/haj-inspectors",
        color: "indigo",
      },
      {
        id: "assistant",
        icon: Bot,
        label: { en: "AI Assistant", ar: "المساعد", ur: "اے آئی", hi: "AI सहायक", ta: "AI உதவி", te: "AI సహాయం", mr: "AI मदत", bn: "AI সহায়ক", or: "AI ସହାୟକ", ml: "AI സഹായി", pa: "AI ਸਹਾਇਕ" },
        route: "/chat",
        color: "violet",
      },
    ],
  },
  // SECTION E – AFTER
  {
    id: "after-hajj",
    title: { en: "After Hajj", ar: "بعد الحج", ur: "حج کے بعد", hi: "हज के बाद", ta: "ஹஜ்ஜுக்கு பின்", te: "హజ్ తర్వాత", mr: "हज नंतर", bn: "হজের পর", or: "ହଜ ପରେ", ml: "ഹജ്ജിന് ശേഷം", pa: "ਹੱਜ ਤੋਂ ਬਾਅਦ" },
    items: [
      {
        id: "post-hajj",
        icon: Star,
        label: { en: "Haj Mabroor", ar: "حج مبرور", ur: "حج مبرور", hi: "हज मबरूर", ta: "ஹஜ் மப்ரூர்", te: "హజ్ మబ్రూర్", mr: "हज मबरूर", bn: "হজ মাবরুর", or: "ହଜ ମବ୍ରୁର", ml: "ഹജ്ജ് മബ്റൂർ", pa: "ਹੱਜ ਮਬਰੂਰ" },
        route: "/post-hajj",
        color: "indigo",
      },
      {
        id: "free-umrah",
        icon: Gift,
        label: { en: "Free Umrah", ar: "عمرة مجانية", ur: "مفت عمرہ", hi: "मुफ्त उमराह", ta: "இலவச உம்ரா", te: "ఉచిత ఉమ్రా", mr: "मोफत उमराह", bn: "বিনামূল্যে উমরাহ", or: "ମାଗଣା ଉମରାହ", ml: "സൗജന്യ ഉംറ", pa: "ਮੁਫ਼ਤ ਉਮਰਾਹ" },
        route: "/free-umrah",
        color: "emerald",
      },
    ],
  },
];

// Memoized menu item for performance
const MenuItem = memo(function MenuItem({ 
  item, 
  language, 
  itemIndex,
  onNavigate 
}: { 
  item: MenuItem; 
  language: string; 
  itemIndex: number;
  onNavigate: (route: string) => void;
}) {
  const prefetchProps = getPrefetchProps(item.route);
  
  const handleClick = useCallback(() => {
    onNavigate(item.route);
  }, [item.route, onNavigate]);
  
  return (
    <button
      onClick={handleClick}
      {...prefetchProps}
      className="flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 group active:scale-95 active:opacity-90 touch-manipulation select-none"
      style={{ 
        animationDelay: `${Math.min(itemIndex * 30, 300)}ms`,
        animationFillMode: 'backwards'
      }}
    >
      <IconCircle 
        icon={item.icon} 
        size="md"
        variant={item.color as any}
        className="group-hover:scale-105 transition-transform duration-150"
      />
      <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight line-clamp-2">
        {item.label[language] || item.label.en}
      </span>
    </button>
  );
});

export const DashboardMenu = memo(function DashboardMenu() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleNavigate = useCallback((route: string) => {
    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
    navigate(route);
  }, [navigate]);

  let globalIndex = 0;

  return (
    <div className="space-y-6">
      {menuSections.map((section) => (
        <div key={section.id} className="space-y-3">
          {/* Section Header */}
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            {section.title[language] || section.title.en}
          </h3>
          
          {/* Section Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {section.items.map((item) => {
              const itemIndex = globalIndex++;
              return (
                <MenuItem
                  key={item.id}
                  item={item}
                  language={language}
                  itemIndex={itemIndex}
                  onNavigate={handleNavigate}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
});