import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "ar" | "ur" | "hi" | "tr" | "ru";

export const LANGUAGES: { code: Language; name: string; nativeName: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "ur", name: "Urdu", nativeName: "اردو", dir: "rtl" },
  { code: "hi", name: "Hindi", nativeName: "ہندی", dir: "rtl" },
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
  | "inviteLinkCopied"
  // New government-grade keys
  | "currentStatus"
  | "statusSafe"
  | "statusAssistance"
  | "statusEmergency"
  | "whatToDoNow"
  | "needHelp"
  | "helpConnecting"
  | "helpConnected"
  | "helpSpeakNow"
  | "helpEndCall"
  | "helpError"
  | "helpTryAgain"
  | "emergency"
  | "emergencyConfirmTitle"
  | "emergencyConfirmDesc"
  | "emergencyConfirm"
  | "preparation"
  | "signIn"
  | "signOut"
  | "noUpdateMeansNormal"
  | "familyStatus"
  | "lastUpdate"
  | "preparationProgress"
  | "stepComplete"
  | "stepPending";

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
    currentStatus: "Current Status",
    statusSafe: "You are Safe",
    statusAssistance: "Assistance Active",
    statusEmergency: "Emergency Being Managed",
    whatToDoNow: "What to do now",
    needHelp: "Need Help",
    helpConnecting: "Connecting...",
    helpConnected: "Connected",
    helpSpeakNow: "You can speak now",
    helpEndCall: "End Call",
    helpError: "Connection Error",
    helpTryAgain: "Please try again",
    emergency: "Emergency",
    emergencyConfirmTitle: "Confirm Emergency",
    emergencyConfirmDesc: "This will alert emergency services. Only use for real emergencies.",
    emergencyConfirm: "Yes, I Need Emergency Help",
    preparation: "Preparation",
    signIn: "Sign In",
    signOut: "Sign Out",
    noUpdateMeansNormal: "No update means everything is normal",
    familyStatus: "Family Status",
    lastUpdate: "Last update",
    preparationProgress: "Preparation Progress",
    stepComplete: "Complete",
    stepPending: "Pending",
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
    currentStatus: "الحالة الحالية",
    statusSafe: "أنت بأمان",
    statusAssistance: "المساعدة جارية",
    statusEmergency: "جاري التعامل مع الطوارئ",
    whatToDoNow: "ما يجب فعله الآن",
    needHelp: "أحتاج مساعدة",
    helpConnecting: "جاري الاتصال...",
    helpConnected: "تم الاتصال",
    helpSpeakNow: "يمكنك التحدث الآن",
    helpEndCall: "إنهاء المكالمة",
    helpError: "خطأ في الاتصال",
    helpTryAgain: "يرجى المحاولة مجدداً",
    emergency: "طوارئ",
    emergencyConfirmTitle: "تأكيد الطوارئ",
    emergencyConfirmDesc: "سيتم تنبيه خدمات الطوارئ. استخدم فقط للحالات الحقيقية.",
    emergencyConfirm: "نعم، أحتاج مساعدة طارئة",
    preparation: "التحضير",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    noUpdateMeansNormal: "عدم وجود تحديث يعني أن كل شيء طبيعي",
    familyStatus: "حالة العائلة",
    lastUpdate: "آخر تحديث",
    preparationProgress: "تقدم التحضير",
    stepComplete: "مكتمل",
    stepPending: "قيد الانتظار",
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
    currentStatus: "موجودہ حالت",
    statusSafe: "آپ محفوظ ہیں",
    statusAssistance: "مدد جاری ہے",
    statusEmergency: "ایمرجنسی کا انتظام ہو رہا ہے",
    whatToDoNow: "اب کیا کریں",
    needHelp: "مدد چاہیے",
    helpConnecting: "جڑ رہا ہے...",
    helpConnected: "جڑ گیا",
    helpSpeakNow: "اب بولیں",
    helpEndCall: "کال ختم کریں",
    helpError: "کنکشن میں خرابی",
    helpTryAgain: "دوبارہ کوشش کریں",
    emergency: "ایمرجنسی",
    emergencyConfirmTitle: "ایمرجنسی کی تصدیق",
    emergencyConfirmDesc: "ایمرجنسی سروسز کو الرٹ کیا جائے گا۔ صرف اصل ایمرجنسی کے لیے استعمال کریں۔",
    emergencyConfirm: "ہاں، مجھے فوری مدد چاہیے",
    preparation: "تیاری",
    signIn: "سائن ان",
    signOut: "سائن آؤٹ",
    noUpdateMeansNormal: "کوئی اپڈیٹ نہ ہونے کا مطلب سب ٹھیک ہے",
    familyStatus: "خاندان کی حالت",
    lastUpdate: "آخری اپڈیٹ",
    preparationProgress: "تیاری کی پیشرفت",
    stepComplete: "مکمل",
    stepPending: "زیر التواء",
  },
  hi: {
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
    currentStatus: "موجودہ حالت",
    statusSafe: "آپ محفوظ ہیں",
    statusAssistance: "مدد جاری ہے",
    statusEmergency: "ایمرجنسی کا انتظام ہو رہا ہے",
    whatToDoNow: "اب کیا کریں",
    needHelp: "مدد چاہیے",
    helpConnecting: "جڑ رہا ہے...",
    helpConnected: "جڑ گیا",
    helpSpeakNow: "اب بولیں",
    helpEndCall: "کال ختم کریں",
    helpError: "کنکشن میں خرابی",
    helpTryAgain: "دوبارہ کوشش کریں",
    emergency: "ایمرجنسی",
    emergencyConfirmTitle: "ایمرجنسی کی تصدیق",
    emergencyConfirmDesc: "ایمرجنسی سروسز کو الرٹ کیا جائے گا۔ صرف اصل ایمرجنسی کے لیے استعمال کریں۔",
    emergencyConfirm: "ہاں، مجھے فوری مدد چاہیے",
    preparation: "تیاری",
    signIn: "سائن ان",
    signOut: "سائن آؤٹ",
    noUpdateMeansNormal: "کوئی اپڈیٹ نہ ہونے کا مطلب سب ٹھیک ہے",
    familyStatus: "خاندان کی حالت",
    lastUpdate: "آخری اپڈیٹ",
    preparationProgress: "تیاری کی پیشرفت",
    stepComplete: "مکمل",
    stepPending: "زیر التواء",
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
    currentStatus: "Mevcut Durum",
    statusSafe: "Güvendesiniz",
    statusAssistance: "Yardım Aktif",
    statusEmergency: "Acil Durum Yönetiliyor",
    whatToDoNow: "Şimdi ne yapmalı",
    needHelp: "Yardım Lazım",
    helpConnecting: "Bağlanıyor...",
    helpConnected: "Bağlandı",
    helpSpeakNow: "Şimdi konuşabilirsiniz",
    helpEndCall: "Aramayı Bitir",
    helpError: "Bağlantı Hatası",
    helpTryAgain: "Lütfen tekrar deneyin",
    emergency: "Acil Durum",
    emergencyConfirmTitle: "Acil Durumu Onayla",
    emergencyConfirmDesc: "Acil servisler uyarılacak. Sadece gerçek acil durumlar için kullanın.",
    emergencyConfirm: "Evet, Acil Yardım Lazım",
    preparation: "Hazırlık",
    signIn: "Giriş Yap",
    signOut: "Çıkış Yap",
    noUpdateMeansNormal: "Güncelleme olmaması her şeyin yolunda olduğu anlamına gelir",
    familyStatus: "Aile Durumu",
    lastUpdate: "Son güncelleme",
    preparationProgress: "Hazırlık İlerlemesi",
    stepComplete: "Tamamlandı",
    stepPending: "Beklemede",
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
    currentStatus: "Текущий статус",
    statusSafe: "Вы в безопасности",
    statusAssistance: "Помощь активна",
    statusEmergency: "Экстренная ситуация управляется",
    whatToDoNow: "Что делать сейчас",
    needHelp: "Нужна помощь",
    helpConnecting: "Подключение...",
    helpConnected: "Подключено",
    helpSpeakNow: "Говорите сейчас",
    helpEndCall: "Завершить звонок",
    helpError: "Ошибка подключения",
    helpTryAgain: "Попробуйте снова",
    emergency: "Экстренная ситуация",
    emergencyConfirmTitle: "Подтвердите экстренную ситуацию",
    emergencyConfirmDesc: "Экстренные службы будут уведомлены. Используйте только для реальных экстренных ситуаций.",
    emergencyConfirm: "Да, мне нужна экстренная помощь",
    preparation: "Подготовка",
    signIn: "Войти",
    signOut: "Выйти",
    noUpdateMeansNormal: "Отсутствие обновлений означает, что все в порядке",
    familyStatus: "Статус семьи",
    lastUpdate: "Последнее обновление",
    preparationProgress: "Прогресс подготовки",
    stepComplete: "Завершено",
    stepPending: "Ожидается",
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
  const [language, setLanguage] = useState<Language>("en");

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
