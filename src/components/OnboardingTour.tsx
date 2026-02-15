import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Heart,
  CheckCircle2,
  Plane,
  Stethoscope,
  Users,
  BookOpen,
} from "lucide-react";

const TOUR_STORAGE_KEY = "hajjcare_onboarding_complete";

type LocalizedText = Record<string, string>;

type QAStep = {
  icon: React.ReactNode;
  color: string;
  questionKey: LocalizedText;
  options: {
    labelKey: LocalizedText;
    value: string;
    tipKey: LocalizedText;
  }[];
};

type WelcomeStep = {
  type: "welcome";
  icon: React.ReactNode;
  color: string;
  titleKey: LocalizedText;
  descKey: LocalizedText;
};

type ResultStep = {
  type: "result";
  icon: React.ReactNode;
  color: string;
};

type TourStep = QAStep | WelcomeStep | ResultStep;

const isWelcome = (s: TourStep): s is WelcomeStep => "type" in s && s.type === "welcome";
const isResult = (s: TourStep): s is ResultStep => "type" in s && s.type === "result";

const L = (en: string, ar: string, ur: string, hi: string, ta?: string, te?: string, mr?: string, bn?: string, or_?: string, ml?: string, pa?: string): LocalizedText => ({
  en, ar, ur, hi,
  ta: ta || en, te: te || en, mr: mr || en, bn: bn || en,
  or: or_ || en, ml: ml || en, pa: pa || en,
});

const tourSteps: TourStep[] = [
  // Step 0: Welcome
  {
    type: "welcome",
    icon: <Sparkles className="w-10 h-10" />,
    color: "from-emerald-500 to-teal-600",
    titleKey: L(
      "Welcome to HajjCare AI",
      "مرحباً بك في حج كير",
      "حج کیئر میں خوش آمدید",
      "हज केयर AI में आपका स्वागत है",
      "ஹஜ்கேர் AIக்கு வரவேற்கிறோம்",
      "హజ్‌కేర్ AIకి స్వాగతం",
      "हज केअर AI मध्ये स्वागत",
      "হজকেয়ার AI-তে স্বাগতম",
      "ହଜକେୟାର AIରେ ସ୍ୱାଗତ",
      "ഹജ്ജ്‌കെയർ AIലേക്ക് സ്വാഗതം",
      "ਹੱਜ ਕੇਅਰ AI ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ"
    ),
    descKey: L(
      "Let us personalize your experience! Answer a few quick questions so we can guide you better on your blessed journey.",
      "دعنا نخصص تجربتك! أجب على بعض الأسئلة السريعة لنرشدك بشكل أفضل.",
      "آئیے آپ کا تجربہ ذاتی بنائیں! چند فوری سوالات کے جواب دیں تاکہ ہم آپ کی بہتر رہنمائی کر سکیں۔",
      "आइए आपका अनुभव निजीकृत करें! कुछ त्वरित सवालों के जवाब दें ताकि हम आपकी बेहतर मार्गदर्शना कर सकें।",
      "உங்கள் அனுபவத்தை தனிப்பயனாக்குவோம்! சில கேள்விகளுக்கு பதிலளியுங்கள்.",
      "మీ అనుభవాన్ని వ్యక్తిగతీకరించుకుందాం! కొన్ని ప్రశ్నలకు సమాధానమివ్వండి.",
      "तुमचा अनुभव वैयक्तिक करूया! काही प्रश्नांची उत्तरे द्या.",
      "আপনার অভিজ্ঞতা ব্যক্তিগত করি! কয়েকটি প্রশ্নের উত্তর দিন।",
      "ଆପଣଙ୍କ ଅଭିଜ୍ଞତା ବ୍ୟକ୍ତିଗତ କରିବା! କିଛି ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ।",
      "നിങ്ങളുടെ അനുഭവം വ്യക്തിഗതമാക്കാം! കുറച്ച് ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകൂ.",
      "ਆਓ ਤੁਹਾਡਾ ਤਜਰਬਾ ਨਿੱਜੀ ਬਣਾਈਏ! ਕੁਝ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ।"
    ),
  },
  // Q1: First Hajj?
  {
    icon: <Plane className="w-10 h-10" />,
    color: "from-blue-500 to-indigo-600",
    questionKey: L(
      "Is this your first Hajj?",
      "هل هذا حجك الأول؟",
      "کیا یہ آپ کا پہلا حج ہے؟",
      "क्या यह आपका पहला हज है?",
      "இது உங்கள் முதல் ஹஜ்ஜா?",
      "ఇది మీ మొదటి హజ్‌నా?",
      "हा तुमचा पहिला हज आहे का?",
      "এটি কি আপনার প্রথম হজ?",
      "ଏହା ଆପଣଙ୍କ ପ୍ରଥମ ହଜ କି?",
      "ഇത് നിങ്ങളുടെ ആദ്യ ഹജ്ജാണോ?",
      "ਕੀ ਇਹ ਤੁਹਾਡਾ ਪਹਿਲਾ ਹੱਜ ਹੈ?"
    ),
    options: [
      {
        value: "first",
        labelKey: L("Yes, first time! ✨", "نعم، أول مرة! ✨", "ہاں، پہلی بار! ✨", "हां, पहली बार! ✨"),
        tipKey: L(
          "We'll highlight all the step-by-step ritual guides for you. Check 'Hajj Guide' from the dashboard!",
          "سنبرز لك جميع الأدلة خطوة بخطوة. تحقق من 'دليل الحج' من لوحة التحكم!",
          "ہم آپ کے لیے تمام مرحلہ وار گائیڈز نمایاں کریں گے۔ ڈیش بورڈ سے 'حج گائیڈ' دیکھیں!",
          "हम आपके लिए सभी चरण-दर-चरण गाइड हाइलाइट करेंगे। डैशबोर्ड से 'हज गाइड' देखें!"
        ),
      },
      {
        value: "experienced",
        labelKey: L("No, done before 🕋", "لا، حججت سابقاً 🕋", "نہیں، پہلے کر چکا ہوں 🕋", "नहीं, पहले कर चुका हूं 🕋"),
        tipKey: L(
          "Great! You can use the AI assistant for quick fatwa lookups and updated Saudi regulations.",
          "رائع! يمكنك استخدام المساعد الذكي للبحث السريع عن الفتاوى واللوائح السعودية المحدثة.",
          "بہت اچھا! آپ AI اسسٹنٹ کو فتوی تلاش اور سعودی قوانین کے لیے استعمال کر سکتے ہیں۔",
          "बहुत अच्छा! आप AI सहायक का उपयोग फतवा खोज और अपडेटेड सऊदी नियमों के लिए कर सकते हैं।"
        ),
      },
    ],
  },
  // Q2: Documents ready?
  {
    icon: <CheckCircle2 className="w-10 h-10" />,
    color: "from-amber-500 to-orange-600",
    questionKey: L(
      "Are your travel documents ready?",
      "هل وثائق سفرك جاهزة؟",
      "کیا آپ کے سفری دستاویزات تیار ہیں؟",
      "क्या आपके यात्रा दस्तावेज़ तैयार हैं?",
      "உங்கள் பயண ஆவணங்கள் தயாரா?",
      "మీ ప్రయాణ పత్రాలు సిద్ధంగా ఉన్నాయా?",
      "तुमची प्रवासी कागदपत्रे तयार आहेत का?",
      "আপনার ভ্রমণ নথি প্রস্তুত আছে কি?",
      "ଆପଣଙ୍କ ଯାତ୍ରା ଦଲିଲ ପ୍ରସ୍ତୁତ ଅଛି କି?",
      "നിങ്ങളുടെ യാത്രാ രേഖകൾ തയ്യാറാണോ?",
      "ਕੀ ਤੁਹਾਡੇ ਯਾਤਰਾ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਹਨ?"
    ),
    options: [
      {
        value: "ready",
        labelKey: L("Yes, all ready! ✅", "نعم، كلها جاهزة! ✅", "ہاں، سب تیار! ✅", "हां, सब तैयार! ✅"),
        tipKey: L(
          "Excellent! Keep digital copies in the app. Check 'Pre-Hajj India' guide for last-minute reminders.",
          "ممتاز! احتفظ بنسخ رقمية. راجع دليل 'ما قبل الحج' للتذكيرات الأخيرة.",
          "بہترین! ڈیجیٹل کاپیاں رکھیں۔ آخری لمحے کی یاد دہانیوں کے لیے 'پری-حج' گائیڈ دیکھیں۔",
          "उत्कृष्ट! डिजिटल कॉपी रखें। अंतिम समय की याद के लिए 'प्री-हज इंडिया' गाइड देखें।"
        ),
      },
      {
        value: "not_ready",
        labelKey: L("Not yet 📋", "ليس بعد 📋", "ابھی نہیں 📋", "अभी नहीं 📋"),
        tipKey: L(
          "No worries! Go to 'Preparation Guide' for a complete checklist of passport, visa, vaccination, and more.",
          "لا تقلق! اذهب إلى 'دليل التحضير' للحصول على قائمة كاملة بالجواز والتأشيرة والتطعيمات.",
          "فکر نہ کریں! پاسپورٹ، ویزا، ویکسینیشن کی مکمل چیک لسٹ کے لیے 'تیاری گائیڈ' دیکھیں۔",
          "चिंता न करें! पासपोर्ट, वीज़ा, टीकाकरण की पूरी चेकलिस्ट के लिए 'तैयारी गाइड' देखें।"
        ),
      },
    ],
  },
  // Q3: Health concerns?
  {
    icon: <Stethoscope className="w-10 h-10" />,
    color: "from-rose-500 to-pink-600",
    questionKey: L(
      "Do you have any health conditions?",
      "هل لديك أي حالات صحية؟",
      "کیا آپ کو کوئی صحت کا مسئلہ ہے؟",
      "क्या आपको कोई स्वास्थ्य समस्या है?",
      "உங்களுக்கு ஏதேனும் உடல்நல நிலை உள்ளதா?",
      "మీకు ఏదైనా ఆరోగ్య సమస్యలు ఉన్నాయా?",
      "तुम्हाला काही आरोग्य समस्या आहे का?",
      "আপনার কি কোনো স্বাস্থ্য সমস্যা আছে?",
      "ଆପଣଙ୍କର କୌଣସି ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ଅଛି କି?",
      "നിങ്ങൾക്ക് എന്തെങ്കിലും ആരോഗ്യ പ്രശ്നങ്ങൾ ഉണ്ടോ?",
      "ਕੀ ਤੁਹਾਨੂੰ ਕੋਈ ਸਿਹਤ ਸਮੱਸਿਆ ਹੈ?"
    ),
    options: [
      {
        value: "yes_health",
        labelKey: L("Yes, I need guidance 🏥", "نعم، أحتاج إرشاد 🏥", "ہاں، مجھے رہنمائی چاہیے 🏥", "हां, मुझे मार्गदर्शन चाहिए 🏥"),
        tipKey: L(
          "Check the 'Health Guide' for medicine tips, heat safety, and emergency contacts. You can also use 'Health Help' for AI triage.",
          "راجع 'دليل الصحة' للنصائح الطبية وسلامة الحرارة وأرقام الطوارئ. يمكنك أيضاً استخدام 'مساعدة صحية' للفرز الذكي.",
          "دوائی کے مشورے، گرمی سے حفاظت کے لیے 'صحت گائیڈ' دیکھیں۔ AI ٹرائیج کے لیے 'صحت مدد' استعمال کریں۔",
          "दवा सुझाव, गर्मी से सुरक्षा के लिए 'स्वास्थ्य गाइड' देखें। AI ट्रायज के लिए 'स्वास्थ्य सहायता' उपयोग करें।"
        ),
      },
      {
        value: "no_health",
        labelKey: L("No, I'm healthy 💪", "لا، أنا بصحة جيدة 💪", "نہیں، میں صحت مند ہوں 💪", "नहीं, मैं स्वस्थ हूं 💪"),
        tipKey: L(
          "Alhamdulillah! Still check 'Health Guide' for hydration & heat tips — Saudi summer can be intense!",
          "الحمد لله! لا تنس مراجعة 'دليل الصحة' لنصائح الترطيب والحرارة — صيف السعودية حار جداً!",
          "الحمد للہ! پھر بھی پانی اور گرمی کے مشورے کے لیے 'صحت گائیڈ' دیکھیں — سعودی گرمی شدید ہو سکتی ہے!",
          "अल्हम्दुलिल्लाह! फिर भी पानी और गर्मी के सुझावों के लिए 'स्वास्थ्य गाइड' देखें — सऊदी गर्मी तीव्र होती है!"
        ),
      },
    ],
  },
  // Q4: Traveling with family?
  {
    icon: <Users className="w-10 h-10" />,
    color: "from-purple-500 to-violet-600",
    questionKey: L(
      "Are you traveling with family?",
      "هل تسافر مع العائلة؟",
      "کیا آپ خاندان کے ساتھ سفر کر رہے ہیں؟",
      "क्या आप परिवार के साथ यात्रा कर रहे हैं?",
      "நீங்கள் குடும்பத்துடன் பயணம் செய்கிறீர்களா?",
      "మీరు కుటుంబంతో ప్రయాణిస్తున్నారా?",
      "तुम्ही कुटुंबासह प्रवास करत आहात का?",
      "আপনি কি পরিবারের সাথে ভ্রমণ করছেন?",
      "ଆପଣ ପରିବାର ସହ ଯାତ୍ରା କରୁଛନ୍ତି କି?",
      "നിങ്ങൾ കുടുംബവുമായി യാത്ര ചെയ്യുന്നുണ്ടോ?",
      "ਕੀ ਤੁਸੀਂ ਪਰਿਵਾਰ ਨਾਲ ਯਾਤਰਾ ਕਰ ਰਹੇ ਹੋ?"
    ),
    options: [
      {
        value: "with_family",
        labelKey: L("Yes, with family 👨‍👩‍👧‍👦", "نعم، مع العائلة 👨‍👩‍👧‍👦", "ہاں، خاندان کے ساتھ 👨‍👩‍👧‍👦", "हां, परिवार के साथ 👨‍👩‍👧‍👦"),
        tipKey: L(
          "Set up 'Sukoon Family Tracking' from the home screen to stay connected! Share locations and see everyone's status in real-time.",
          "الصفحة الرئيسية من 'تتبع عائلة سكون' أنشئ للبقاء على اتصال! شارك المواقع وتابع حالة الجميع مباشرة.",
          "جڑے رہنے کے لیے ہوم اسکرین سے 'سکون فیملی ٹریکنگ' سیٹ اپ کریں! مقامات شیئر کریں اور سب کی حالت دیکھیں۔",
          "जुड़े रहने के लिए होम स्क्रीन से 'सुकून फैमिली ट्रैकिंग' सेट करें! स्थान साझा करें और सबकी स्थिति देखें।"
        ),
      },
      {
        value: "alone",
        labelKey: L("No, traveling alone 🧳", "لا، أسافر وحدي 🧳", "نہیں، اکیلے سفر 🧳", "नहीं, अकेले यात्रा 🧳"),
        tipKey: L(
          "Stay safe! Save emergency contacts via 'Contact Numbers' and use the SOS button if you ever need help.",
          "ابق آمناً! احفظ أرقام الطوارئ عبر 'أرقام الاتصال' واستخدم زر الطوارئ عند الحاجة.",
          "محفوظ رہیں! 'رابطہ نمبر' کے ذریعے ایمرجنسی نمبر محفوظ کریں اور مدد کے لیے SOS بٹن استعمال کریں۔",
          "सुरक्षित रहें! 'संपर्क नंबर' से इमरजेंसी नंबर सेव करें और मदद के लिए SOS बटन उपयोग करें।"
        ),
      },
    ],
  },
  // Final: Result
  {
    type: "result",
    icon: <Heart className="w-10 h-10" />,
    color: "from-emerald-500 to-teal-600",
  },
];

// Result screen content
const resultTitle = L(
  "You're All Set! 🕋",
  "أنت جاهز! 🕋",
  "آپ تیار ہیں! 🕋",
  "आप तैयार हैं! 🕋",
  "நீங்கள் தயார்! 🕋",
  "మీరు సిద్ధంగా ఉన్నారు! 🕋",
  "तुम्ही तयार आहात! 🕋",
  "আপনি প্রস্তুত! 🕋",
  "ଆପଣ ପ୍ରସ୍ତୁତ! 🕋",
  "നിങ്ങൾ തയ്യാർ! 🕋",
  "ਤੁਸੀਂ ਤਿਆਰ ਹੋ! 🕋"
);

const resultDesc = L(
  "Based on your answers, we've personalized your experience. May Allah accept your Hajj — Labbaik Allahumma Labbaik!",
  "بناءً على إجاباتك، خصصنا تجربتك. تقبل الله حجك — لبيك اللهم لبيك!",
  "آپ کے جوابات کی بنیاد پر ہم نے آپ کا تجربہ ذاتی بنایا۔ اللہ آپ کا حج قبول فرمائے — لبیک اللہم لبیک!",
  "आपके जवाबों के आधार पर हमने आपका अनुभव निजीकृत किया। अल्लाह आपका हज कबूल करे — लब्बैक अल्लाहुम्मा लब्बैक!",
  "உங்கள் பதில்கள் அடிப்படையில் அனுபவத்தை தனிப்பயனாக்கினோம்। லப்பைக் அல்லாஹும்ம லப்பைக்!",
  "మీ సమాధానాల ఆధారంగా అనుభవాన్ని వ్యక్తిగతీకరించాము. లబ్బైక్ అల్లాహుమ్మ లబ్బైక్!",
  "तुमच्या उत्तरांवर आधारित अनुभव वैयक्तिक केला. लब्बैक अल्लाहुम्मा लब्बैक!",
  "আপনার উত্তরের ভিত্তিতে অভিজ্ঞতা ব্যক্তিগত করেছি। লাব্বাইক আল্লাহুম্মা লাব্বাইক!",
  "ଆପଣଙ୍କ ଉତ୍ତର ଆଧାରରେ ଅଭିଜ୍ଞତା ବ୍ୟକ୍ତିଗତ କରାଯାଇଛି। ଲାବ୍ବାଇକ ଆଲ୍ଲାହୁମ୍ମା ଲାବ୍ବାଇକ!",
  "നിങ്ങളുടെ ഉത്തരങ്ങൾ അടിസ്ഥാനമാക്കി അനുഭവം വ്യക്തിഗതമാക്കി. ലബ്ബൈക് അല്ലാഹുമ്മ ലബ്ബൈക്!",
  "ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ ਤੇ ਤਜਰਬਾ ਨਿੱਜੀ ਬਣਾਇਆ। ਲੱਬੈਕ ਅੱਲਾਹੁੰਮਾ ਲੱਬੈਕ!"
);

const replayTip = L(
  "You can replay this tour anytime from the sidebar!",
  "يمكنك إعادة هذه الجولة في أي وقت من القائمة الجانبية!",
  "آپ سائیڈبار سے کبھی بھی یہ ٹور دوبارہ دیکھ سکتے ہیں!",
  "आप साइडबार से कभी भी यह टूर दोबारा देख सकते हैं!",
);

export const resetOnboardingTour = () => {
  localStorage.removeItem(TOUR_STORAGE_KEY);
};

export const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const hasCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!hasCompleted && isAuthenticated) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setStep(0);
    setAnswers({});
  }, []);

  const handleNext = useCallback(() => {
    if (step < tourSteps.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleClose();
    }
  }, [step, handleClose]);

  const handlePrev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const handleAnswer = useCallback((optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [step]: optionIndex }));
  }, [step]);

  // Replay event
  useEffect(() => {
    const handler = () => {
      setStep(0);
      setAnswers({});
      setIsOpen(true);
    };
    window.addEventListener("hajjcare:replay-tour", handler);
    return () => window.removeEventListener("hajjcare:replay-tour", handler);
  }, []);

  const current = tourSteps[step];
  const lang = language as string;
  const isRTL = ["ar", "ur"].includes(lang);
  const isLast = step === tourSteps.length - 1;
  const t = (obj: LocalizedText) => obj[lang] || obj.en;

  const nextLabel = L("Next", "التالي", "اگلا", "अगला");
  const prevLabel = L("Back", "رجوع", "پیچھے", "पीछे");
  const doneLabel = L("Start Exploring!", "ابدأ الاستكشاف!", "دریافت شروع کریں!", "खोजना शुरू करें!");
  const skipLabel = L("Skip", "تخطي", "چھوڑیں", "छोड़ें");
  const beginLabel = L("Let's Begin!", "لنبدأ!", "شروع کریں!", "शुरू करें!");

  // Check if current Q has been answered
  const currentAnswer = answers[step];
  const isQA = !isWelcome(current) && !isResult(current);
  const qaStep = isQA ? (current as QAStep) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent
        className="max-w-[92vw] sm:max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl gap-0 [&>button]:hidden"
      >
        <div dir={isRTL ? "rtl" : "ltr"}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Icon header */}
          <div className={`bg-gradient-to-br ${current.color} p-8 flex flex-col items-center justify-center text-white`}>
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 animate-scale-in">
              {current.icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center leading-tight">
              {isWelcome(current)
                ? t(current.titleKey)
                : isResult(current)
                  ? t(resultTitle)
                  : t((current as QAStep).questionKey)}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Welcome step */}
            {isWelcome(current) && (
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed text-center">
                {t(current.descKey)}
              </p>
            )}

            {/* Q&A step */}
            {qaStep && (
              <div className="space-y-3">
                {qaStep.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-start p-4 rounded-xl border-2 transition-all duration-200 text-base font-medium ${
                      currentAnswer === i
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}

                {/* Show personalized tip when answered */}
                {currentAnswer !== undefined && (
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center animate-fade-in">
                    <p className="text-sm font-medium text-primary">
                      💡 {t(qaStep.options[currentAnswer].tipKey)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Result step */}
            {isResult(current) && (
              <>
                <p className="text-base sm:text-lg text-foreground/80 leading-relaxed text-center">
                  {t(resultDesc)}
                </p>

                {/* Show summary of tips based on answers */}
                <div className="space-y-2">
                  {Object.entries(answers).map(([stepIdx, optIdx]) => {
                    const s = tourSteps[Number(stepIdx)] as QAStep;
                    if (!s || !s.options) return null;
                    const opt = s.options[optIdx];
                    return (
                      <div key={stepIdx} className="flex items-start gap-2 bg-muted/40 rounded-lg p-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground/70">{t(opt.tipKey)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                  <p className="text-sm font-medium text-primary">
                    💡 {t(replayTip)}
                  </p>
                </div>
              </>
            )}

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === step
                      ? "w-8 h-2.5 bg-primary"
                      : i < step
                        ? "w-2.5 h-2.5 bg-primary/50"
                        : "w-2.5 h-2.5 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 pt-2">
              {step > 0 ? (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="flex-1 h-12 text-base rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t(prevLabel)}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="flex-1 h-12 text-base rounded-xl text-muted-foreground"
                >
                  {t(skipLabel)}
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={isQA && currentAnswer === undefined}
                className={`flex-1 h-12 text-base rounded-xl bg-gradient-to-r ${current.color} text-white hover:opacity-90 disabled:opacity-50`}
              >
                {isLast
                  ? t(doneLabel)
                  : step === 0
                    ? t(beginLabel)
                    : t(nextLabel)}
                {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
