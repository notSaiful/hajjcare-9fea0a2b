import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, MapPin, Building, Shield, Sparkles } from "lucide-react";

// Import images
import grandMosqueCover from "@/assets/rules/grand-mosque-cover.jpg";
import madinahCover from "@/assets/rules/madinah-cover.jpg";
import cybersecurityCover from "@/assets/rules/cybersecurity-cover.jpg";

interface GuideCard {
  id: string;
  image: string;
  route: string;
  badge?: {
    en: string;
    ar: string;
    ur: string;
    hi: string;
    ta?: string;
    te?: string;
    mr?: string;
    bn?: string;
    or?: string;
    ml?: string;
    pa?: string;
  };
  title: {
    en: string;
    ar: string;
    ur: string;
    hi: string;
    ta?: string;
    te?: string;
    mr?: string;
    bn?: string;
    or?: string;
    ml?: string;
    pa?: string;
  };
  description: {
    en: string;
    ar: string;
    ur: string;
    hi: string;
    ta?: string;
    te?: string;
    mr?: string;
    bn?: string;
    or?: string;
    ml?: string;
    pa?: string;
  };
  icon: "mosque" | "landmark" | "security";
}

const GUIDE_CARDS: GuideCard[] = [
  {
    id: "grand-mosque",
    image: grandMosqueCover,
    route: "/rules/grand-mosque-guide",
    badge: {
      en: "Essential",
      ar: "أساسي",
      ur: "ضروری",
      hi: "आवश्यक",
      ta: "அத்தியாவசியம்",
      te: "అవసరం",
      mr: "आवश्यक",
      bn: "অপরিহার্য",
      or: "ଆବଶ୍ୟକ",
      ml: "അത്യാവശ്യം",
      pa: "ਜ਼ਰੂਰੀ",
    },
    title: {
      en: "Grand Mosque Guide",
      ar: "دليل المسجد الحرام",
      ur: "مسجد الحرام گائیڈ",
      hi: "मस्जिद अल-हराम गाइड",
      ta: "மஸ்ஜிதுல் ஹராம் வழிகாட்டி",
      te: "మస్జిద్ అల్-హరామ్ గైడ్",
      mr: "मस्जिद अल-हराम मार्गदर्शिका",
      bn: "মসজিদ আল-হারাম গাইড",
      or: "ମସଜିଦ ଅଲ-ହରମ ଗାଇଡ୍",
      ml: "മസ്ജിദുൽ ഹറാം ഗൈഡ്",
      pa: "ਮਸਜਿਦ ਅਲ-ਹਰਮ ਗਾਈਡ",
    },
    description: {
      en: "Navigate Masjid al-Haram with key landmarks, gates, and facilities",
      ar: "تنقل في المسجد الحرام مع المعالم الرئيسية والأبواب والمرافق",
      ur: "مسجد الحرام کے اہم مقامات، دروازے اور سہولیات",
      hi: "मस्जिद अल-हराम के मुख्य स्थल, द्वार और सुविधाएं",
      ta: "மஸ்ஜிதுல் ஹராமின் முக்கிய இடங்கள், வாயில்கள் மற்றும் வசதிகள்",
      te: "మస్జిద్ అల్-హరామ్ ముఖ్య ప్రదేశాలు, గేట్లు మరియు సౌకర్యాలు",
      mr: "मस्जिद अल-हराम मुख्य स्थळे, दरवाजे आणि सुविधा",
      bn: "মসজিদ আল-হারাম মূল স্থান, দরজা এবং সুবিধা",
      or: "ମସଜିଦ ଅଲ-ହରମ ମୁଖ୍ୟ ସ୍ଥାନ, ଦ୍ୱାର ଏବଂ ସୁବିଧା",
      ml: "മസ്ജിദുൽ ഹറാം പ്രധാന സ്ഥലങ്ങൾ, ഗേറ്റുകൾ, സൗകര്യങ്ങൾ",
      pa: "ਮਸਜਿਦ ਅਲ-ਹਰਮ ਦੇ ਮੁੱਖ ਸਥਾਨ, ਦਰਵਾਜ਼ੇ ਅਤੇ ਸਹੂਲਤਾਂ",
    },
    icon: "mosque",
  },
  {
    id: "madinah-landmarks",
    image: madinahCover,
    route: "/rules/madinah-landmarks",
    badge: {
      en: "Recommended",
      ar: "موصى به",
      ur: "تجویز کردہ",
      hi: "अनुशंसित",
      ta: "பரிந்துரைக்கப்படுகிறது",
      te: "సిఫార్సు చేయబడింది",
      mr: "शिफारस केलेले",
      bn: "সুপারিশকৃত",
      or: "ସୁପାରିଶ କରାଯାଇଛି",
      ml: "ശുപാർശ ചെയ്യുന്നു",
      pa: "ਸਿਫਾਰਸ਼ੀ",
    },
    title: {
      en: "Madinah Landmarks",
      ar: "معالم المدينة المنورة",
      ur: "مدینہ منورہ کے مقامات",
      hi: "मदीना के स्थल",
      ta: "மதீனா அடையாளங்கள்",
      te: "మదీనా లాండ్‌మార్క్‌లు",
      mr: "मदीना स्थळे",
      bn: "মদিনার স্থান",
      or: "ମଦୀନା ଲ୍ୟାଣ୍ଡମାର୍କ",
      ml: "മദീന ലാൻഡ്‌മാർക്കുകൾ",
      pa: "ਮਦੀਨਾ ਥਾਂਵਾਂ",
    },
    description: {
      en: "Explore Prophet's Mosque and sacred sites in Madinah",
      ar: "استكشف المسجد النبوي والمواقع المقدسة في المدينة",
      ur: "مسجد نبوی اور مدینہ کے مقدس مقامات",
      hi: "मस्जिद-ए-नबवी और मदीना के पवित्र स्थल",
      ta: "நபிகளாரின் பள்ளிவாசல் மற்றும் மதீனாவின் புனித இடங்கள்",
      te: "ప్రవక్త మస్జిద్ మరియు మదీనా పవిత్ర స్థలాలు",
      mr: "प्रेषित मस्जिद आणि मदीनाची पवित्र स्थळे",
      bn: "মসজিদে নববী এবং মদিনার পবিত্র স্থান",
      or: "ନବୀ ମସଜିଦ ଏବଂ ମଦୀନାର ପବିତ୍ର ସ୍ଥାନ",
      ml: "പ്രവാചക പള്ളിയും മദീനയിലെ പുണ്യസ്ഥലങ്ങളും",
      pa: "ਮਸਜਿਦ-ਏ-ਨਬਵੀ ਅਤੇ ਮਦੀਨਾ ਦੀਆਂ ਪਵਿੱਤਰ ਥਾਵਾਂ",
    },
    icon: "landmark",
  },
  {
    id: "cybersecurity",
    image: cybersecurityCover,
    route: "/rules/cybersecurity-awareness",
    badge: {
      en: "Important",
      ar: "مهم",
      ur: "اہم",
      hi: "महत्वपूर्ण",
      ta: "முக்கியம்",
      te: "ముఖ్యమైనది",
      mr: "महत्त्वाचे",
      bn: "গুরুত্বপূর্ণ",
      or: "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ",
      ml: "പ്രധാനം",
      pa: "ਮਹੱਤਵਪੂਰਨ",
    },
    title: {
      en: "Cybersecurity Awareness",
      ar: "الوعي بالأمن السيبراني",
      ur: "سائبر سیکیورٹی آگاہی",
      hi: "साइबर सुरक्षा जागरूकता",
      ta: "சைபர் பாதுகாப்பு விழிப்புணர்வு",
      te: "సైబర్ భద్రత అవగాహన",
      mr: "सायबर सुरक्षा जागरूकता",
      bn: "সাইবার নিরাপত্তা সচেতনতা",
      or: "ସାଇବର ସୁରକ୍ଷା ସଚେତନତା",
      ml: "സൈബർ സുരക്ഷാ ബോധവൽക്കരണം",
      pa: "ਸਾਈਬਰ ਸੁਰੱਖਿਆ ਜਾਗਰੂਕਤਾ",
    },
    description: {
      en: "Protect yourself from scams, phishing, and secure your data",
      ar: "احمِ نفسك من الاحتيال والتصيد وأمّن بياناتك",
      ur: "دھوکہ دہی اور فشنگ سے بچیں، اپنا ڈیٹا محفوظ رکھیں",
      hi: "धोखाधड़ी और फिशिंग से बचें, अपना डेटा सुरक्षित रखें",
      ta: "மோசடி மற்றும் ஃபிஷிங்கிலிருந்து பாதுகாப்பு, தரவு பாதுகாப்பு",
      te: "మోసాలు మరియు ఫిషింగ్ నుండి రక్షణ, మీ డేటాను భద్రపరచండి",
      mr: "फसवणूक आणि फिशिंगपासून संरक्षण, आपला डेटा सुरक्षित ठेवा",
      bn: "জালিয়াতি এবং ফিশিং থেকে সুরক্ষা, আপনার ডেটা সুরক্ষিত রাখুন",
      or: "ଠକାମି ଏବଂ ଫିସିଂରୁ ସୁରକ୍ଷା, ଆପଣଙ୍କ ଡାଟା ସୁରକ୍�ିତ ରଖନ୍ତୁ",
      ml: "തട്ടിപ്പിൽ നിന്നും ഫിഷിംഗിൽ നിന്നും സംരക്ഷണം, ഡാറ്റ സുരക്ഷിതമാക്കുക",
      pa: "ਧੋਖਾਧੜੀ ਅਤੇ ਫਿਸ਼ਿੰਗ ਤੋਂ ਬਚੋ, ਆਪਣਾ ਡੇਟਾ ਸੁਰੱਖਿਅਤ ਰੱਖੋ",
    },
    icon: "security",
  },
];

const labels = {
  en: { title: "Visual Guides", viewAll: "View All" },
  ar: { title: "الأدلة المرئية", viewAll: "عرض الكل" },
  ur: { title: "تصویری گائیڈز", viewAll: "سب دیکھیں" },
  hi: { title: "दृश्य मार्गदर्शिकाएं", viewAll: "सभी देखें" },
  ta: { title: "காட்சி வழிகாட்டிகள்", viewAll: "அனைத்தையும் காண்க" },
  te: { title: "దృశ్య గైడ్‌లు", viewAll: "అన్నీ చూడండి" },
  mr: { title: "दृश्य मार्गदर्शक", viewAll: "सर्व पहा" },
  bn: { title: "ভিজ্যুয়াল গাইড", viewAll: "সব দেখুন" },
  or: { title: "ଭିଜୁଆଲ ଗାଇଡ", viewAll: "ସବୁ ଦେଖନ୍ତୁ" },
  ml: { title: "വിഷ്വൽ ഗൈഡുകൾ", viewAll: "എല്ലാം കാണുക" },
  pa: { title: "ਵਿਜ਼ੁਅਲ ਗਾਈਡ", viewAll: "ਸਭ ਦੇਖੋ" },
};

const getIcon = (type: GuideCard["icon"]) => {
  switch (type) {
    case "mosque":
      return <Building className="w-4 h-4" />;
    case "landmark":
      return <MapPin className="w-4 h-4" />;
    case "security":
      return <Shield className="w-4 h-4" />;
  }
};

const getBadgeVariant = (id: string) => {
  switch (id) {
    case "grand-mosque":
      return "bg-primary/90 text-primary-foreground border-primary";
    case "madinah-landmarks":
      return "bg-accent/90 text-accent-foreground border-accent";
    case "cybersecurity":
      return "bg-destructive/90 text-destructive-foreground border-destructive";
    default:
      return "bg-primary/90 text-primary-foreground";
  }
};

export const BeforeHajjGuides = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const l = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-foreground">{l.title}</h2>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid gap-4">
        {GUIDE_CARDS.map((card) => (
          <Card
            key={card.id}
            className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-border/50"
            onClick={() => navigate(card.route)}
          >
            <div className="flex">
              {/* Image Section */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title[language as keyof typeof card.title] || card.title.en}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
                
                {/* Badge on image */}
                {card.badge && (
                  <div className="absolute top-2 left-2">
                    <Badge 
                      className={`${getBadgeVariant(card.id)} text-[10px] px-1.5 py-0.5 font-medium shadow-sm animate-pulse`}
                    >
                      {card.badge[language as keyof typeof card.badge] || card.badge.en}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                <div>
                  {/* Title with icon */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary">{getIcon(card.icon)}</span>
                    <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {card.title[language as keyof typeof card.title] || card.title.en}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {card.description[language as keyof typeof card.description] || card.description.en}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="flex justify-end mt-2">
                  {isRTL ? (
                    <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
