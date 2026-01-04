import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "ar" | "ur" | "hi" | "tr" | "ru";

export const LANGUAGES: { code: Language; name: string; nativeName: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "ur", name: "Urdu", nativeName: "اردو", dir: "rtl" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", dir: "ltr" },
];

type TranslationKey = 
  | "hajjGuide"
  | "yourAIGuide"
  | "bismillah"
  | "assalamuAlaikum"
  | "welcomePilgrim"
  | "welcomeSubtitle"
  | "quickQuestions"
  | "tawafSteps"
  | "hajjDuas"
  | "ihramRules"
  | "dayOfArafat"
  | "askPlaceholder"
  | "consultScholar"
  | "newConversation"
  | "yourLocation"
  | "nextStep"
  | "tips"
  | "tryAgain"
  | "unableToLoadMap"
  | "liveMap"
  | "backToChat"
  | "hajjLocations"
  | "familyGroup"
  | "create"
  | "join"
  | "yourName"
  | "groupName"
  | "inviteCode"
  | "cancel"
  | "members"
  | "you"
  | "copied"
  | "inviteLinkCopied";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    hajjGuide: "Hajj Guide",
    yourAIGuide: "Your AI Guide",
    bismillah: "Bismillah",
    assalamuAlaikum: "Assalamu Alaikum",
    welcomePilgrim: "Welcome, Dear Pilgrim",
    welcomeSubtitle: "I'm your Hajj guide. Ask me about rituals, duas, or practical guidance.",
    quickQuestions: "Quick Questions",
    tawafSteps: "Tawaf Steps",
    hajjDuas: "Hajj Duas",
    ihramRules: "Ihram Rules",
    dayOfArafat: "Day of Arafat",
    askPlaceholder: "Ask about Hajj rituals...",
    consultScholar: "Consult a qualified scholar for religious rulings",
    newConversation: "New Conversation",
    yourLocation: "Your Location",
    nextStep: "Next Step",
    tips: "Tips",
    tryAgain: "Try Again",
    unableToLoadMap: "Unable to load map",
    liveMap: "Live Map",
    backToChat: "Back to Chat",
    hajjLocations: "Hajj Locations",
    familyGroup: "Family Group",
    create: "Create",
    join: "Join",
    yourName: "Your name",
    groupName: "Group name",
    inviteCode: "Invite code",
    cancel: "Cancel",
    members: "Members",
    you: "you",
    copied: "Copied!",
    inviteLinkCopied: "Invite link copied to clipboard",
  },
  ar: {
    hajjGuide: "دليل الحج",
    yourAIGuide: "مرشدك الذكي",
    bismillah: "بسم الله",
    assalamuAlaikum: "السلام عليكم",
    welcomePilgrim: "أهلاً بك أيها الحاج الكريم",
    welcomeSubtitle: "أنا مرشدك للحج. اسألني عن المناسك أو الأدعية أو أي إرشادات عملية.",
    quickQuestions: "أسئلة سريعة",
    tawafSteps: "خطوات الطواف",
    hajjDuas: "أدعية الحج",
    ihramRules: "محظورات الإحرام",
    dayOfArafat: "يوم عرفة",
    askPlaceholder: "اسأل عن مناسك الحج...",
    consultScholar: "للاستشارات الفقهية راجع عالماً متخصصاً",
    newConversation: "محادثة جديدة",
    yourLocation: "موقعك الحالي",
    nextStep: "الخطوة التالية",
    tips: "نصائح",
    tryAgain: "حاول مجدداً",
    unableToLoadMap: "تعذر تحميل الخريطة",
    liveMap: "الخريطة المباشرة",
    backToChat: "العودة للمحادثة",
    hajjLocations: "مواقع الحج",
    familyGroup: "مجموعة العائلة",
    create: "إنشاء",
    join: "انضمام",
    yourName: "اسمك",
    groupName: "اسم المجموعة",
    inviteCode: "رمز الدعوة",
    cancel: "إلغاء",
    members: "الأعضاء",
    you: "أنت",
    copied: "تم النسخ!",
    inviteLinkCopied: "تم نسخ رابط الدعوة",
  },
  ur: {
    hajjGuide: "حج گائیڈ",
    yourAIGuide: "آپ کا AI گائیڈ",
    bismillah: "بسم اللہ",
    assalamuAlaikum: "السلام علیکم",
    welcomePilgrim: "خوش آمدید، عزیز حاجی",
    welcomeSubtitle: "میں آپ کا حج گائیڈ ہوں۔ مناسک، دعاؤں یا عملی رہنمائی کے بارے میں پوچھیں۔",
    quickQuestions: "فوری سوالات",
    tawafSteps: "طواف کے مراحل",
    hajjDuas: "حج کی دعائیں",
    ihramRules: "احرام کے قواعد",
    dayOfArafat: "یوم عرفہ",
    askPlaceholder: "حج کے مناسک کے بارے میں پوچھیں...",
    consultScholar: "مذہبی فیصلوں کے لیے کسی عالم سے رجوع کریں",
    newConversation: "نئی گفتگو",
    yourLocation: "آپ کا مقام",
    nextStep: "اگلا قدم",
    tips: "تجاویز",
    tryAgain: "دوبارہ کوشش کریں",
    unableToLoadMap: "نقشہ لوڈ نہیں ہو سکا",
    liveMap: "براہ راست نقشہ",
    backToChat: "چیٹ پر واپس",
    hajjLocations: "حج کے مقامات",
    familyGroup: "خاندانی گروپ",
    create: "بنائیں",
    join: "شامل ہوں",
    yourName: "آپ کا نام",
    groupName: "گروپ کا نام",
    inviteCode: "دعوتی کوڈ",
    cancel: "منسوخ",
    members: "ممبران",
    you: "آپ",
    copied: "کاپی ہوگیا!",
    inviteLinkCopied: "دعوتی لنک کاپی ہوگیا",
  },
  hi: {
    hajjGuide: "हज गाइड",
    yourAIGuide: "आपका AI गाइड",
    bismillah: "बिस्मिल्लाह",
    assalamuAlaikum: "अस्सलामु अलैकुम",
    welcomePilgrim: "स्वागत है, प्रिय हाजी",
    welcomeSubtitle: "मैं आपका हज गाइड हूं। रीतियों, दुआओं या व्यावहारिक मार्गदर्शन के बारे में पूछें।",
    quickQuestions: "त्वरित प्रश्न",
    tawafSteps: "तवाफ के चरण",
    hajjDuas: "हज की दुआएं",
    ihramRules: "इहराम के नियम",
    dayOfArafat: "अरफात का दिन",
    askPlaceholder: "हज के बारे में पूछें...",
    consultScholar: "धार्मिक निर्णयों के लिए किसी विद्वान से परामर्श करें",
    newConversation: "नई बातचीत",
    yourLocation: "आपका स्थान",
    nextStep: "अगला कदम",
    tips: "सुझाव",
    tryAgain: "पुनः प्रयास करें",
    unableToLoadMap: "मानचित्र लोड नहीं हो सका",
    liveMap: "लाइव मैप",
    backToChat: "चैट पर वापस",
    hajjLocations: "हज स्थान",
    familyGroup: "परिवार समूह",
    create: "बनाएं",
    join: "जुड़ें",
    yourName: "आपका नाम",
    groupName: "समूह का नाम",
    inviteCode: "आमंत्रण कोड",
    cancel: "रद्द करें",
    members: "सदस्य",
    you: "आप",
    copied: "कॉपी किया!",
    inviteLinkCopied: "आमंत्रण लिंक कॉपी किया गया",
  },
  tr: {
    hajjGuide: "Hac Rehberi",
    yourAIGuide: "AI Rehberiniz",
    bismillah: "Bismillah",
    assalamuAlaikum: "Selamün Aleyküm",
    welcomePilgrim: "Hoş geldiniz, Değerli Hacı",
    welcomeSubtitle: "Ben hac rehberinizim. Ritüeller, dualar veya pratik rehberlik hakkında sorun.",
    quickQuestions: "Hızlı Sorular",
    tawafSteps: "Tavaf Adımları",
    hajjDuas: "Hac Duaları",
    ihramRules: "İhram Kuralları",
    dayOfArafat: "Arefe Günü",
    askPlaceholder: "Hac hakkında sorun...",
    consultScholar: "Dini hükümler için bir alime danışın",
    newConversation: "Yeni Konuşma",
    yourLocation: "Konumunuz",
    nextStep: "Sonraki Adım",
    tips: "İpuçları",
    tryAgain: "Tekrar Dene",
    unableToLoadMap: "Harita yüklenemedi",
    liveMap: "Canlı Harita",
    backToChat: "Sohbete Dön",
    hajjLocations: "Hac Mekanları",
    familyGroup: "Aile Grubu",
    create: "Oluştur",
    join: "Katıl",
    yourName: "Adınız",
    groupName: "Grup adı",
    inviteCode: "Davet kodu",
    cancel: "İptal",
    members: "Üyeler",
    you: "siz",
    copied: "Kopyalandı!",
    inviteLinkCopied: "Davet linki kopyalandı",
  },
  ru: {
    hajjGuide: "Гид по Хаджу",
    yourAIGuide: "Ваш AI-гид",
    bismillah: "Бисмиллях",
    assalamuAlaikum: "Ассаляму Алейкум",
    welcomePilgrim: "Добро пожаловать, уважаемый паломник",
    welcomeSubtitle: "Я ваш гид по хаджу. Спрашивайте о ритуалах, молитвах или практических советах.",
    quickQuestions: "Быстрые вопросы",
    tawafSteps: "Шаги Тавафа",
    hajjDuas: "Молитвы Хаджа",
    ihramRules: "Правила Ихрама",
    dayOfArafat: "День Арафа",
    askPlaceholder: "Спросите о хадже...",
    consultScholar: "Для религиозных решений обратитесь к ученому",
    newConversation: "Новый разговор",
    yourLocation: "Ваше местоположение",
    nextStep: "Следующий шаг",
    tips: "Советы",
    tryAgain: "Повторить",
    unableToLoadMap: "Не удалось загрузить карту",
    liveMap: "Живая карта",
    backToChat: "Вернуться к чату",
    hajjLocations: "Места Хаджа",
    familyGroup: "Семейная группа",
    create: "Создать",
    join: "Присоединиться",
    yourName: "Ваше имя",
    groupName: "Название группы",
    inviteCode: "Код приглашения",
    cancel: "Отмена",
    members: "Участники",
    you: "вы",
    copied: "Скопировано!",
    inviteLinkCopied: "Ссылка скопирована",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ar");

  const t = (key: TranslationKey) => translations[language][key] || translations.en[key];
  const currentLang = LANGUAGES.find(l => l.code === language)!;
  const dir = currentLang.dir;
  const isRTL = dir === "rtl";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
