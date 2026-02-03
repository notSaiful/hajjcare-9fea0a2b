import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Bot, Users, Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "@/components/NavLink";

// Localized labels for bottom nav
const labels = {
  home: {
    en: "Home",
    ar: "الرئيسية",
    ur: "ہوم",
    hi: "होम",
    ta: "முகப்பு",
    te: "హోమ్",
    mr: "मुख्यपृष्ठ",
    bn: "হোম",
    or: "ହୋମ",
    ml: "ഹോം",
    pa: "ਹੋਮ",
  },
  journey: {
    en: "Journey",
    ar: "الرحلة",
    ur: "سفر",
    hi: "यात्रा",
    ta: "பயணம்",
    te: "ప్రయాణం",
    mr: "प्रवास",
    bn: "যাত্রা",
    or: "ଯାତ୍ରା",
    ml: "യാത്ര",
    pa: "ਯਾਤਰਾ",
  },
  help: {
    en: "AI Help",
    ar: "المساعد",
    ur: "مدد",
    hi: "AI मदद",
    ta: "AI உதவி",
    te: "AI సహాయం",
    mr: "AI मदत",
    bn: "AI সাহায্য",
    or: "AI ସାହାଯ୍ୟ",
    ml: "AI സഹായം",
    pa: "AI ਮਦਦ",
  },
  family: {
    en: "Family",
    ar: "العائلة",
    ur: "خاندان",
    hi: "परिवार",
    ta: "குடும்பம்",
    te: "కుటుంబం",
    mr: "कुटुंब",
    bn: "পরিবার",
    or: "ପରିବାର",
    ml: "കുടുംബം",
    pa: "ਪਰਿਵਾਰ",
  },
  more: {
    en: "More",
    ar: "المزيد",
    ur: "مزید",
    hi: "अधिक",
    ta: "மேலும்",
    te: "మరిన్ని",
    mr: "अधिक",
    bn: "আরও",
    or: "ଅଧିକ",
    ml: "കൂടുതൽ",
    pa: "ਹੋਰ",
  },
  moreTitle: {
    en: "More Options",
    ar: "خيارات إضافية",
    ur: "مزید اختیارات",
    hi: "अधिक विकल्प",
    ta: "மேலும் விருப்பங்கள்",
    te: "మరిన్ని ఎంపికలు",
    mr: "अधिक पर्याय",
    bn: "আরও বিকল্প",
    or: "ଅଧିକ ବିକଳ୍ପ",
    ml: "കൂടുതൽ ഓപ്ഷനുകൾ",
    pa: "ਹੋਰ ਵਿਕਲਪ",
  },
};

// More menu sections
const moreMenuSections = {
  preparation: {
    title: {
      en: "Preparation",
      ar: "التحضير",
      ur: "تیاری",
      hi: "तैयारी",
      ta: "தயாரிப்பு",
      te: "తయారీ",
      mr: "तयारी",
      bn: "প্রস্তুতি",
      or: "ପ୍ରସ୍ତୁତି",
      ml: "തയ്യാറെടുപ്പ്",
      pa: "ਤਿਆਰੀ",
    },
    items: [
      { route: "/pre-hajj-india", label: { en: "Pre-Hajj Checklist", ar: "قائمة ما قبل الحج", ur: "حج سے پہلے چیک لسٹ", hi: "प्री-हज चेकलिस्ट", ta: "முன் ஹஜ் சரிபார்ப்பு", te: "ప్రీ-హజ్ చెక్‌లిస్ట్", mr: "प्री-हज चेकलिस्ट", bn: "প্রি-হজ চেকলিস্ট", or: "ପ୍ରି-ହଜ ଚେକ୍‌ଲିଷ୍ଟ", ml: "പ്രീ-ഹജ്ജ് ചെക്ക്‌ലിസ്റ്റ്", pa: "ਪ੍ਰੀ-ਹੱਜ ਚੈੱਕਲਿਸਟ" } },
      { route: "/preparation", label: { en: "What to Pack", ar: "ماذا تحزم", ur: "کیا لے کر جائیں", hi: "क्या पैक करें", ta: "என்ன எடுக்க வேண்டும்", te: "ఏమి తీసుకెళ్లాలి", mr: "काय पॅक करावे", bn: "কী প্যাক করবেন", or: "କ'ଣ ପ୍ୟାକ କରିବେ", ml: "എന്ത് പായ്ക്ക് ചെയ്യണം", pa: "ਕੀ ਪੈਕ ਕਰਨਾ ਹੈ" } },
      { route: "/rules", label: { en: "Important Rules", ar: "قواعد مهمة", ur: "اہم قواعد", hi: "महत्वपूर्ण नियम", ta: "முக்கிய விதிகள்", te: "ముఖ్యమైన నియమాలు", mr: "महत्त्वाचे नियम", bn: "গুরুত্বপূর্ণ নিয়ম", or: "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ନିୟମ", ml: "പ്രധാന നിയമങ്ങൾ", pa: "ਮਹੱਤਵਪੂਰਨ ਨਿਯਮ" } },
      { route: "/shi-training", label: { en: "Training Materials", ar: "مواد التدريب", ur: "تربیتی مواد", hi: "प्रशिक्षण सामग्री", ta: "பயிற்சி பொருட்கள்", te: "శిక్షణ సామగ్రి", mr: "प्रशिक्षण साहित्य", bn: "প্রশিক্ষণ উপকরণ", or: "ତାଲିମ ସାମଗ୍ରୀ", ml: "പരിശീലന സാമഗ്രികൾ", pa: "ਸਿਖਲਾਈ ਸਮੱਗਰੀ" } },
    ],
  },
  practical: {
    title: {
      en: "Practical Guides",
      ar: "أدلة عملية",
      ur: "عملی رہنمائی",
      hi: "व्यावहारिक मार्गदर्शिकाएँ",
      ta: "நடைமுறை வழிகாட்டிகள்",
      te: "ఆచరణాత్మక గైడ్లు",
      mr: "व्यावहारिक मार्गदर्शक",
      bn: "ব্যবহারিক গাইড",
      or: "ବ୍ୟବହାରିକ ଗାଇଡ୍",
      ml: "പ്രായോഗിക ഗൈഡുകൾ",
      pa: "ਵਿਹਾਰਕ ਗਾਈਡਾਂ",
    },
    items: [
      { route: "/health", label: { en: "Health Tips", ar: "نصائح صحية", ur: "صحت کے نکات", hi: "स्वास्थ्य सुझाव", ta: "உடல்நல குறிப்புகள்", te: "ఆరోగ్య చిట్కాలు", mr: "आरोग्य टिप्स", bn: "স্বাস্থ্য টিপস", or: "ସ୍ୱାସ୍ଥ୍ୟ ଟିପ୍ସ", ml: "ആരോഗ്യ ടിപ്സ്", pa: "ਸਿਹਤ ਸੁਝਾਅ" } },
      { route: "/money", label: { en: "Money & Currency", ar: "المال والعملة", ur: "پیسہ اور کرنسی", hi: "पैसा और मुद्रा", ta: "பணம் & நாணயம்", te: "డబ్బు & కరెన్సీ", mr: "पैसे आणि चलन", bn: "টাকা ও মুদ্রা", or: "ପଇସା ଓ ମୁଦ୍ରା", ml: "പണം & കറൻസി", pa: "ਪੈਸਾ ਅਤੇ ਕਰੰਸੀ" } },
      { route: "/telecom", label: { en: "SIM & Connectivity", ar: "الشريحة والاتصال", ur: "سم اور کنیکٹیویٹی", hi: "सिम और कनेक्टिविटी", ta: "சிம் & இணைப்பு", te: "సిమ్ & కనెక్టివిటీ", mr: "सिम आणि कनेक्टिव्हिटी", bn: "সিম ও সংযোগ", or: "ସିମ ଓ ସଂଯୋଗ", ml: "സിം & കണക്റ്റിവിറ്റി", pa: "ਸਿਮ ਅਤੇ ਕਨੈਕਟੀਵਿਟੀ" } },
      { route: "/food", label: { en: "Food Guide", ar: "دليل الطعام", ur: "کھانے کی گائیڈ", hi: "भोजन गाइड", ta: "உணவு வழிகாட்டி", te: "ఆహార గైడ్", mr: "अन्न मार्गदर्शक", bn: "খাবার গাইড", or: "ଖାଦ୍ୟ ଗାଇଡ୍", ml: "ഭക്ഷണ ഗൈഡ്", pa: "ਭੋਜਨ ਗਾਈਡ" } },
      { route: "/map", label: { en: "Maps & Navigation", ar: "الخرائط والملاحة", ur: "نقشے اور نیویگیشن", hi: "नक्शे और नेविगेशन", ta: "வரைபடங்கள் & வழிசெலுத்தல்", te: "మ్యాప్‌లు & నావిగేషన్", mr: "नकाशे आणि नेव्हिगेशन", bn: "মানচিত্র ও নেভিগেশন", or: "ମାନଚିତ୍ର ଓ ନେଭିଗେସନ", ml: "മാപ്പുകൾ & നാവിഗേഷൻ", pa: "ਨਕਸ਼ੇ ਅਤੇ ਨੈਵੀਗੇਸ਼ਨ" } },
    ],
  },
  special: {
    title: {
      en: "Special Needs",
      ar: "احتياجات خاصة",
      ur: "خصوصی ضروریات",
      hi: "विशेष आवश्यकताएं",
      ta: "சிறப்புத் தேவைகள்",
      te: "ప్రత్యేక అవసరాలు",
      mr: "विशेष गरजा",
      bn: "বিশেষ প্রয়োজন",
      or: "ବିଶେଷ ଆବଶ୍ୟକତା",
      ml: "പ്രത്യേക ആവശ്യങ്ങൾ",
      pa: "ਵਿਸ਼ੇਸ਼ ਲੋੜਾਂ",
    },
    items: [
      { route: "/women", label: { en: "Women's Guide", ar: "دليل النساء", ur: "خواتین کی گائیڈ", hi: "महिलाओं की गाइड", ta: "பெண்கள் வழிகாட்டி", te: "మహిళల గైడ్", mr: "महिला मार्गदर्शक", bn: "মহিলাদের গাইড", or: "ମହିଳା ଗାଇଡ୍", ml: "സ്ത്രീകളുടെ ഗൈഡ്", pa: "ਔਰਤਾਂ ਦੀ ਗਾਈਡ" } },
      { route: "/qurbani", label: { en: "Qurbani Info", ar: "معلومات الأضحية", ur: "قربانی کی معلومات", hi: "कुर्बानी जानकारी", ta: "குர்பானி தகவல்", te: "ఖుర్బానీ సమాచారం", mr: "कुर्बानी माहिती", bn: "কোরবানি তথ্য", or: "କୁର୍ବାନୀ ସୂଚନା", ml: "ഖുർബാനി വിവരങ്ങൾ", pa: "ਕੁਰਬਾਨੀ ਜਾਣਕਾਰੀ" } },
      { route: "/post-hajj", label: { en: "After Hajj", ar: "بعد الحج", ur: "حج کے بعد", hi: "हज के बाद", ta: "ஹஜ் பிறகு", te: "హజ్ తర్వాత", mr: "हज नंतर", bn: "হজের পর", or: "ହଜ ପରେ", ml: "ഹജ്ജിന് ശേഷം", pa: "ਹੱਜ ਤੋਂ ਬਾਅਦ" } },
    ],
  },
  support: {
    title: {
      en: "Help & Support",
      ar: "المساعدة والدعم",
      ur: "مدد اور سپورٹ",
      hi: "सहायता और समर्थन",
      ta: "உதவி & ஆதரவு",
      te: "సహాయం & మద్దతు",
      mr: "मदत आणि समर्थन",
      bn: "সাহায্য ও সমর্থন",
      or: "ସାହାଯ୍ୟ ଓ ସମର୍ଥନ",
      ml: "സഹായം & പിന്തുണ",
      pa: "ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ",
    },
    items: [
      { route: "/grievances", label: { en: "Report an Issue", ar: "الإبلاغ عن مشكلة", ur: "مسئلہ رپورٹ کریں", hi: "समस्या रिपोर्ट करें", ta: "சிக்கலைப் புகாரளிக்கவும்", te: "సమస్య నివేదించండి", mr: "समस्या नोंदवा", bn: "সমস্যা রিপোর্ট করুন", or: "ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ", ml: "പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക", pa: "ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰੋ" } },
      { route: "/contacts", label: { en: "Emergency Contacts", ar: "أرقام الطوارئ", ur: "ایمرجنسی نمبر", hi: "आपातकालीन संपर्क", ta: "அவசர தொடர்புகள்", te: "అత్యవసర సంప్రదింపులు", mr: "आपत्कालीन संपर्क", bn: "জরুরি যোগাযোগ", or: "ଜରୁରୀ ସମ୍ପର୍କ", ml: "അടിയന്തര കോൺടാക്റ്റുകൾ", pa: "ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ" } },
      { route: "/help", label: { en: "Medical Help", ar: "مساعدة طبية", ur: "طبی مدد", hi: "चिकित्सा सहायता", ta: "மருத்துவ உதவி", te: "వైద్య సహాయం", mr: "वैद्यकीय मदत", bn: "চিকিৎসা সহায়তা", or: "ଚିକିତ୍ସା ସାହାଯ୍ୟ", ml: "മെഡിക്കൽ സഹായം", pa: "ਡਾਕਟਰੀ ਮਦਦ" } },
      { route: "/haj-directory", label: { en: "Haj Mission Directory", ar: "دليل بعثة الحج", ur: "حج مشن ڈائریکٹری", hi: "हज मिशन डायरेक्टरी", ta: "ஹஜ் மிஷன் கோப்பகம்", te: "హజ్ మిషన్ డైరెక్టరీ", mr: "हज मिशन निर्देशिका", bn: "হজ মিশন ডিরেক্টরি", or: "ହଜ ମିଶନ ଡିରେକ୍ଟୋରୀ", ml: "ഹജ്ജ് മിഷൻ ഡയറക്ടറി", pa: "ਹੱਜ ਮਿਸ਼ਨ ਡਾਇਰੈਕਟਰੀ" } },
      { route: "/govt-services", label: { en: "Govt Services", ar: "الخدمات الحكومية", ur: "سرکاری خدمات", hi: "सरकारी सेवाएं", ta: "அரசு சேவைகள்", te: "ప్రభుత్వ సేవలు", mr: "सरकारी सेवा", bn: "সরকারি সেবা", or: "ସରକାରୀ ସେବା", ml: "സർക്കാർ സേവനങ്ങൾ", pa: "ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ" } },
    ],
  },
  social: {
    title: {
      en: "Connect",
      ar: "تواصل",
      ur: "جڑیں",
      hi: "जुड़ें",
      ta: "இணைக்கவும்",
      te: "కనెక్ట్",
      mr: "कनेक्ट",
      bn: "সংযোগ",
      or: "ସଂଯୋଗ",
      ml: "കണക്ട്",
      pa: "ਜੁੜੋ",
    },
    items: [
      { route: "/socials", label: { en: "Social Groups", ar: "مجموعات التواصل", ur: "سوشل گروپس", hi: "सोशल ग्रुप्स", ta: "சமூக குழுக்கள்", te: "సోషల్ గ్రూప్స్", mr: "सोशल ग्रुप्स", bn: "সোশ্যাল গ্রুপস", or: "ସୋସିଆଲ ଗ୍ରୁପ୍ସ", ml: "സോഷ്യൽ ഗ്രൂപ്പുകൾ", pa: "ਸੋਸ਼ਲ ਗਰੁੱਪਸ" } },
      { route: "/video-call", label: { en: "Video Call", ar: "مكالمة فيديو", ur: "ویڈیو کال", hi: "वीडियो कॉल", ta: "வீடியோ அழைப்பு", te: "వీడియో కాల్", mr: "व्हिडिओ कॉल", bn: "ভিডিও কল", or: "ଭିଡିଓ କଲ", ml: "വീഡിയോ കോൾ", pa: "ਵੀਡੀਓ ਕਾਲ" } },
      { route: "/about-us", label: { en: "About HajjCare", ar: "عن حج كير", ur: "حج کیئر کے بارے میں", hi: "HajjCare के बारे में", ta: "HajjCare பற்றி", te: "HajjCare గురించి", mr: "HajjCare बद्दल", bn: "HajjCare সম্পর্কে", or: "HajjCare ବିଷୟରେ", ml: "HajjCare-നെ കുറിച്ച്", pa: "HajjCare ਬਾਰੇ" } },
      { route: "/contact-us", label: { en: "Contact Us", ar: "اتصل بنا", ur: "ہم سے رابطہ کریں", hi: "संपर्क करें", ta: "தொடர்பு கொள்ளவும்", te: "మమ్మల్ని సంప్రదించండి", mr: "संपर्क साधा", bn: "যোগাযোগ করুন", or: "ସମ୍ପର୍କ କରନ୍ତୁ", ml: "ബന്ധപ്പെടുക", pa: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ" } },
    ],
  },
};

interface NavItem {
  icon: typeof Home;
  label: Record<string, string>;
  route: string;
  isSheet?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: labels.home, route: "/" },
  { icon: Compass, label: labels.journey, route: "/prepare" },
  { icon: Bot, label: labels.help, route: "/chat" },
  { icon: Users, label: labels.family, route: "/family" },
  { icon: Menu, label: labels.more, route: "", isSheet: true },
];

const MoreSheet = memo(function MoreSheet({ language, isRTL }: { language: string; isRTL: boolean }) {
  const getText = (obj: Record<string, string>) => obj[language] || obj.en;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="flex flex-col items-center justify-center gap-1 w-full min-h-[60px] text-muted-foreground hover:text-foreground transition-all duration-200 touch-manipulation"
          aria-label={getText(labels.more)}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-colors">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium">{getText(labels.more)}</span>
        </button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className="w-[85vw] max-w-sm p-0 border-l border-border/40">
        <SheetHeader className="p-5 pb-3 border-b border-border/40">
          <SheetTitle className="text-lg font-semibold text-foreground">
            {getText(labels.moreTitle)}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-5 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            {Object.values(moreMenuSections).map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                  {getText(section.title)}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.route}
                      to={item.route}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/60 transition-colors touch-manipulation"
                      activeClassName="bg-primary/10 text-primary"
                    >
                      {getText(item.label)}
                    </NavLink>
                  ))}
                </div>
                {idx < Object.values(moreMenuSections).length - 1 && (
                  <div className="mt-5 h-px bg-border/40" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
});

export const BottomNavigation = memo(function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();

  const getText = (obj: Record<string, string>) => obj[language] || obj.en;

  const isActive = (route: string) => {
    if (route === "/") return location.pathname === "/";
    if (route === "/prepare") {
      return ["/prepare", "/umrah", "/makkah-guide", "/madinah-guide", "/dua"].some((r) =>
        location.pathname.startsWith(r)
      );
    }
    return location.pathname.startsWith(route);
  };

  const handleNavigation = (route: string) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
    navigate(route);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border-t border-border/40 shadow-[0_-2px_12px_-4px_hsl(var(--foreground)/0.06)] safe-area-bottom"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          if (item.isSheet) {
            return (
              <div key="more" className="flex-1">
                <MoreSheet language={language} isRTL={isRTL} />
              </div>
            );
          }

          const active = isActive(item.route);
          const Icon = item.icon;

          return (
            <button
              key={item.route}
              onClick={() => handleNavigation(item.route)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 min-h-[60px] transition-all duration-200 touch-manipulation",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={getText(item.label)}
              aria-current={active ? "page" : undefined}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                active ? "bg-primary/10" : "hover:bg-muted/50"
              )}>
                <Icon className={cn("w-5 h-5", active && "stroke-[2.25px]")} />
              </div>
              <span className={cn("text-[11px]", active ? "font-semibold" : "font-medium")}>
                {getText(item.label)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});
