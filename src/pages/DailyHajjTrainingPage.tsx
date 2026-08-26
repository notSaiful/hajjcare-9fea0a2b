import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Heart,
  PlayCircle,
  Stethoscope,
  Users,
} from "lucide-react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { dailyHajjTraining, type DailyLesson } from "@/data/dailyHajjTraining";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { getZoyaLanguage } from "@/lib/zoyaLanguages";
import zoyaApprovedImage from "@/assets/ai/zoya-hajj-companion.jpeg";

const PROGRAMME_DAYS = 100;
const DAYS_PER_PHASE = 10;
const STORAGE_KEY = "hajcare-100-day-training-complete";

type DayOneVideo = {
  title: string;
  videoId: string;
};

type TrainingCopy = Record<
  | "day"
  | "minutes"
  | "revision"
  | "watch"
  | "completed"
  | "markComplete"
  | "dailyClass"
  | "classDescription"
  | "opening"
  | "quran"
  | "hadith"
  | "doctor"
  | "expert"
  | "mainLesson"
  | "quiz"
  | "closing"
  | "openingDescription"
  | "sourceReflection"
  | "healthDescription"
  | "expertDescription"
  | "mainLessonDescription"
  | "quizDescription"
  | "roadmap"
  | "roadmapDescription"
  | "progress"
  | "certificate"
  | "chooseDay"
  | "trainingVideos"
  | "freeLearning"
  | "heroTitle"
  | "heroDescription"
  | "dailyClasses"
  | "languageLearning"
  | "authentic"
  | "register"
  | "meetZoya"
  | "zoyaMessage"
  | "zoyaDescription"
  | "listenZoya"
  | "contentNotice"
  | "videoDescription"
  | "openYoutube"
  | "closingTitle"
  | "closingSubtitle"
  | "quoteLabel"
  | "quoteMeaning"
  | "lessonLearned"
  | "todayAction"
  | "lessonText"
  | "actionText",
  string
>;

const en: TrainingCopy = {
  day: "Day",
  minutes: "minutes",
  revision: "Revision",
  watch: "Watch",
  completed: "Completed",
  markComplete: "Mark today's class complete",
  dailyClass: "daily class",
  classDescription:
    "Today’s guided class uses authentic sources, practical preparation, and clear next steps.",
  opening: "Hamd & Naat",
  quran: "Qur'an Tilawat",
  hadith: "Hadith of the Day",
  doctor: "Doctor's Corner",
  expert: "Expert Guest",
  mainLesson: "Main Lesson",
  quiz: "Quiz & Revision",
  closing: "Closing",
  openingDescription: "A respectful opening led by the facilitator.",
  sourceReflection: "Reflection with a reliable source reference.",
  healthDescription: "Practical health guidance for safe preparation.",
  expertDescription: "Expert guidance and practical experience.",
  mainLessonDescription:
    "Step-by-step guidance, questions, and a practical scenario.",
  quizDescription: "Three to five simple questions and a recap.",
  roadmap: "100-day curriculum roadmap",
  roadmapDescription:
    "Ten focused phases · ten days each · 30 minutes per day.",
  progress: "Your progress",
  certificate: "Certificate unlocked—your final assessment is complete.",
  chooseDay: "Choose training day",
  trainingVideos: "Training videos",
  freeLearning: "Free daily learning",
  heroTitle: "100 Days of Hajj & Umrah Training",
  heroDescription:
    "One gentle 30-minute class every day—made for first-time pilgrims, elders, women, volunteers, and families.",
  dailyClasses: "100 daily classes",
  languageLearning: "Learning in your language",
  authentic: "Authentic-source first",
  register: "Register your Cover for free training",
  meetZoya: "Meet Zoya",
  zoyaMessage: "Zoya's welcome message",
  zoyaDescription:
    "Listen to Zoya's heartfelt welcome, then ask about your 100-day training plan.",
  listenZoya: "Listen to Zoya's welcome",
  contentNotice:
    "Training content must be reviewed by qualified scholars, doctors, and authorised Hajj officials before delivery. Live rules, health requirements, and travel directions should always follow the latest official circulars.",
  videoDescription: "Day 1 learning video",
  openYoutube: "Open in YouTube",
  closingTitle: "Ikhlaas",
  closingSubtitle: "Purity of intention",
  quoteLabel: "The Messenger of Allah ﷺ said:",
  quoteMeaning:
    "Actions are judged by intentions, and every person will have what they intended.",
  lessonLearned: "Lesson:",
  todayAction: "Today's action:",
  lessonText:
    "Every deed depends on intention. A pure intention gives our actions their value.",
  actionText: "Before every task, renew your intention for Allah’s pleasure.",
};

const trainingCopy: Partial<Record<Language, TrainingCopy>> = {
  hi: {
    ...en,
    day: "दिन",
    minutes: "मिनट",
    revision: "दोहराव",
    watch: "देखें",
    completed: "पूरा हुआ",
    markComplete: "आज की कक्षा पूरी करें",
    dailyClass: "दैनिक कक्षा",
    classDescription:
      "आज की कक्षा में प्रामाणिक स्रोत, व्यावहारिक तैयारी और स्पष्ट अगला कदम शामिल है।",
    opening: "हम्द और नात",
    quran: "क़ुरआन तिलावत",
    hadith: "आज की हदीस",
    doctor: "डॉक्टर कॉर्नर",
    expert: "विशेषज्ञ अतिथि",
    mainLesson: "मुख्य पाठ",
    quiz: "क्विज़ और दोहराव",
    closing: "समापन",
    openingDescription: "प्रशिक्षक द्वारा आदरपूर्ण शुरुआत।",
    sourceReflection: "विश्वसनीय स्रोत के साथ चिंतन।",
    healthDescription:
      "सुरक्षित तैयारी के लिए व्यावहारिक स्वास्थ्य मार्गदर्शन।",
    expertDescription: "विशेषज्ञ की सलाह और व्यावहारिक अनुभव।",
    mainLessonDescription: "क्रमवार मार्गदर्शन, प्रश्न और व्यावहारिक उदाहरण।",
    quizDescription: "तीन से पाँच सरल प्रश्न और पुनरावृत्ति।",
    roadmap: "100-दिन पाठ्यक्रम रोडमैप",
    roadmapDescription:
      "दस केंद्रित चरण · प्रत्येक में दस दिन · प्रतिदिन 30 मिनट।",
    progress: "आपकी प्रगति",
    certificate: "प्रमाणपत्र अनलॉक हो गया—आपका अंतिम मूल्यांकन पूरा हो गया है।",
    chooseDay: "प्रशिक्षण दिवस चुनें",
    trainingVideos: "प्रशिक्षण वीडियो",
    freeLearning: "निःशुल्क दैनिक प्रशिक्षण",
    heroTitle: "हज और उमरा के 100 दिन का प्रशिक्षण",
    heroDescription:
      "हर दिन एक आसान 30 मिनट की कक्षा—पहली बार जाने वाले हाजियों, बुजुर्गों, महिलाओं, स्वयंसेवकों और परिवारों के लिए।",
    dailyClasses: "100 दैनिक कक्षाएँ",
    languageLearning: "आपकी भाषा में सीखें",
    authentic: "प्रामाणिक स्रोतों पर आधारित",
    register: "निःशुल्क प्रशिक्षण के लिए अपना कवर पंजीकृत करें",
    meetZoya: "ज़ोया से मिलें",
    zoyaMessage: "ज़ोया का स्वागत संदेश",
    zoyaDescription:
      "ज़ोया का दिल से स्वागत संदेश सुनें, फिर 100-दिन की तैयारी के बारे में पूछें।",
    listenZoya: "ज़ोया का स्वागत संदेश सुनें",
    contentNotice:
      "प्रशिक्षण सामग्री देने से पहले योग्य उलेमा, डॉक्टरों और अधिकृत हज अधिकारियों द्वारा समीक्षा की जानी चाहिए। वर्तमान नियम, स्वास्थ्य आवश्यकताएँ और यात्रा निर्देश हमेशा नवीनतम आधिकारिक परिपत्रों के अनुसार मानें।",
    videoDescription: "दिन 1 का प्रशिक्षण वीडियो",
    openYoutube: "YouTube में खोलें",
    closingTitle: "इख़लास",
    closingSubtitle: "नीयत की पाकी",
    quoteLabel: "रसूलुल्लाह ﷺ ने फ़रमाया:",
    quoteMeaning:
      "अमल का दारोमदार नीयत पर है, और हर व्यक्ति को वही मिलेगा जिसकी उसने नीयत की।",
    lessonLearned: "सबक:",
    todayAction: "आज का अमल:",
    lessonText:
      "हर अमल का दारोमदार नीयत पर है। साफ़ नीयत हमारे अमल को मूल्य देती है।",
    actionText: "हर काम से पहले अल्लाह की रज़ा के लिए अपनी नीयत ताज़ा करें।",
  },
  ur: {
    ...en,
    day: "دن",
    minutes: "منٹ",
    revision: "دہرائی",
    watch: "دیکھیں",
    completed: "مکمل",
    markComplete: "آج کی کلاس مکمل کریں",
    dailyClass: "روزانہ کلاس",
    classDescription:
      "آج کی رہنمائی والی کلاس میں مستند ذرائع، عملی تیاری اور واضح اگلا قدم شامل ہے۔",
    opening: "حمد و نعت",
    quran: "قرآن کی تلاوت",
    hadith: "آج کی حدیث",
    doctor: "ڈاکٹر کارنر",
    expert: "ماہر مہمان",
    mainLesson: "اہم سبق",
    quiz: "کوئز اور دہرائی",
    closing: "اختتام",
    openingDescription: "تربیت کار کی باادب ابتدا۔",
    sourceReflection: "معتبر حوالہ کے ساتھ غور۔",
    healthDescription: "محفوظ تیاری کے لیے عملی طبی رہنمائی۔",
    expertDescription: "ماہر کی رہنمائی اور عملی تجربہ۔",
    mainLessonDescription: "مرحلہ وار رہنمائی، سوالات اور عملی مثال۔",
    quizDescription: "تین سے پانچ آسان سوالات اور خلاصہ۔",
    roadmap: "100 روزہ نصاب کا نقشۂ راہ",
    roadmapDescription: "دس مرکوز مراحل · ہر مرحلے میں دس دن · روزانہ 30 منٹ۔",
    progress: "آپ کی پیش رفت",
    certificate: "سرٹیفکیٹ دستیاب ہے—آپ کا آخری جائزہ مکمل ہو گیا ہے۔",
    chooseDay: "تربیتی دن منتخب کریں",
    trainingVideos: "تربیتی ویڈیوز",
    freeLearning: "مفت روزانہ تربیت",
    heroTitle: "حج و عمرہ کی 100 روزہ تربیت",
    heroDescription:
      "ہر روز ایک آسان 30 منٹ کی کلاس—پہلی بار جانے والے حجاج، بزرگوں، خواتین، رضاکاروں اور خاندانوں کے لیے۔",
    dailyClasses: "100 روزانہ کلاسیں",
    languageLearning: "اپنی زبان میں سیکھیں",
    authentic: "مستند ذرائع پر مبنی",
    register: "مفت تربیت کے لیے اپنا کور رجسٹر کریں",
    meetZoya: "زویا سے ملیں",
    zoyaMessage: "زویا کا خیرمقدمی پیغام",
    zoyaDescription:
      "زویا کا دل سے خیرمقدمی پیغام سنیں، پھر اپنے 100 روزہ تربیتی منصوبے کے بارے میں پوچھیں۔",
    listenZoya: "زویا کا خیرمقدمی پیغام سنیں",
    contentNotice:
      "تربیتی مواد پیش کرنے سے پہلے اہل علما، ڈاکٹروں اور مجاز حج حکام سے اس کا جائزہ لیا جانا چاہیے۔ موجودہ قواعد، صحت کی ضروریات اور سفری ہدایات کے لیے ہمیشہ تازہ سرکاری سرکلر پر عمل کریں۔",
    videoDescription: "دن 1 کی تربیتی ویڈیو",
    openYoutube: "YouTube میں کھولیں",
    closingTitle: "اخلاص",
    closingSubtitle: "نیت کی پاکیزگی",
    quoteLabel: "رسول اللہ ﷺ نے فرمایا:",
    quoteMeaning:
      "اعمال کا دارومدار نیتوں پر ہے، اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔",
    lessonLearned: "سبق:",
    todayAction: "آج کا عمل:",
    lessonText:
      "ہر عمل کا دارومدار نیت پر ہے۔ خالص نیت ہمارے اعمال کو قدر دیتی ہے۔",
    actionText: "ہر کام سے پہلے اللہ کی رضا کے لیے اپنی نیت تازہ کریں۔",
  },
  ar: {
    ...en,
    day: "اليوم",
    minutes: "دقيقة",
    revision: "مراجعة",
    watch: "شاهد",
    completed: "مكتمل",
    markComplete: "أكمل درس اليوم",
    dailyClass: "درس يومي",
    classDescription:
      "يجمع درس اليوم بين المصادر الموثوقة والتحضير العملي والخطوات التالية الواضحة.",
    opening: "حمد ونعت",
    quran: "تلاوة القرآن",
    hadith: "حديث اليوم",
    doctor: "ركن الطبيب",
    expert: "ضيف خبير",
    mainLesson: "الدرس الرئيسي",
    quiz: "اختبار ومراجعة",
    closing: "الختام",
    openingDescription: "افتتاح محترم يقوده الميسّر.",
    sourceReflection: "تأمل مع مرجع موثوق.",
    healthDescription: "إرشادات صحية عملية لتحضير آمن.",
    expertDescription: "إرشاد خبير وخبرة عملية.",
    mainLessonDescription: "إرشاد خطوة بخطوة وأسئلة وسيناريو عملي.",
    quizDescription: "ثلاثة إلى خمسة أسئلة بسيطة ومراجعة.",
    roadmap: "خريطة منهج الـ100 يوم",
    roadmapDescription:
      "عشر مراحل مركزة · عشرة أيام لكل مرحلة · 30 دقيقة يومياً.",
    progress: "تقدمك",
    certificate: "تم فتح الشهادة—اكتمل تقييمك النهائي.",
    chooseDay: "اختر يوم التدريب",
    trainingVideos: "فيديوهات التدريب",
    freeLearning: "تعلم يومي مجاني",
    heroTitle: "100 يوم من تدريب الحج والعمرة",
    heroDescription:
      "درس لطيف مدته 30 دقيقة كل يوم—للحجاج لأول مرة وكبار السن والنساء والمتطوعين والعائلات.",
    dailyClasses: "100 درس يومي",
    languageLearning: "تعلّم بلغتك",
    authentic: "مصادر موثوقة أولاً",
    register: "سجّل رقم التغطية للتدريب المجاني",
    meetZoya: "تعرّف إلى زويا",
    zoyaMessage: "رسالة ترحيب زويا",
    zoyaDescription:
      "استمع إلى رسالة زويا الترحيبية ثم اسأل عن خطتك التدريبية لمدة 100 يوم.",
    listenZoya: "استمع إلى ترحيب زويا",
    contentNotice:
      "يجب أن يراجع علماء مؤهلون وأطباء ومسؤولو حج مخولون مادة التدريب قبل تقديمها. اتبع دائماً أحدث التعميمات الرسمية للقواعد الحية والمتطلبات الصحية وتعليمات السفر.",
    videoDescription: "فيديو تعلم اليوم الأول",
    openYoutube: "افتح في YouTube",
    closingTitle: "الإخلاص",
    closingSubtitle: "صفاء النية",
    quoteLabel: "قال رسول الله ﷺ:",
    quoteMeaning: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.",
    lessonLearned: "الدرس:",
    todayAction: "عمل اليوم:",
    lessonText:
      "قيمة كل عمل مرتبطة بالنية، والنية الخالصة تمنح أعمالنا معناها.",
    actionText: "جدّد نيتك لمرضاة الله قبل كل عمل.",
  },
};

const phaseNames: Partial<Record<Language, string[]>> = {
  hi: [
    "बुनियाद और नीयत",
    "दस्तावेज़ और यात्रा तैयारी",
    "स्वास्थ्य, सुरक्षा और भलाई",
    "उमरा की बुनियादी बातें",
    "मीना से पहले हज",
    "मीना और अरफ़ात",
    "मुज़दलिफ़ा और ईद का दिन",
    "अय्याम-ए-तशरीक",
    "मदीना और ज़ियारत",
    "वापसी, चिंतन और सेवा",
  ],
  ur: [
    "بنیاد اور نیت",
    "دستاویزات اور سفر کی تیاری",
    "صحت، حفاظت اور بہبود",
    "عمرہ کی بنیادی باتیں",
    "منیٰ سے پہلے حج",
    "منیٰ اور عرفات",
    "مزدلفہ اور عید کا دن",
    "ایامِ تشریق",
    "مدینہ اور زیارت",
    "واپسی، غور و فکر اور خدمت",
  ],
  ar: [
    "الأساس والنية",
    "الوثائق والاستعداد للسفر",
    "الصحة والسلامة والعافية",
    "أساسيات العمرة",
    "الحج قبل منى",
    "منى وعرفات",
    "مزدلفة ويوم العيد",
    "أيام التشريق",
    "المدينة والزيارة",
    "العودة والتأمل والخدمة",
  ],
};

type RegionalTrainingLabels = Pick<
  TrainingCopy,
  | "day"
  | "minutes"
  | "revision"
  | "watch"
  | "completed"
  | "markComplete"
  | "dailyClass"
  | "opening"
  | "quran"
  | "hadith"
  | "doctor"
  | "expert"
  | "mainLesson"
  | "quiz"
  | "closing"
  | "heroTitle"
  | "languageLearning"
  | "meetZoya"
  | "trainingVideos"
> & { summary: string };

// Keeps every visible lesson label in the selected Indian language without a
// network translation dependency. Detailed scholarly lesson scripts remain
// editorial content and can be added per day without changing this UI layer.
const regionalTrainingCopy = (
  labels: RegionalTrainingLabels,
): TrainingCopy => ({
  ...en,
  ...labels,
  heroDescription: labels.summary,
  dailyClasses: `100 ${labels.dailyClass}`,
  authentic: labels.summary,
  register: labels.markComplete,
  zoyaMessage: labels.meetZoya,
  zoyaDescription: labels.summary,
  listenZoya: labels.meetZoya,
  classDescription: labels.summary,
  openingDescription: labels.summary,
  sourceReflection: labels.summary,
  healthDescription: labels.summary,
  expertDescription: labels.summary,
  mainLessonDescription: labels.summary,
  quizDescription: labels.summary,
  roadmap: `${labels.heroTitle} · 100`,
  roadmapDescription: labels.summary,
  progress: labels.completed,
  certificate: labels.completed,
  chooseDay: labels.day,
  freeLearning: labels.summary,
  contentNotice: labels.summary,
  videoDescription: labels.dailyClass,
  openYoutube: labels.watch,
  closingTitle: labels.closing,
  closingSubtitle: labels.summary,
  quoteLabel: labels.hadith,
  quoteMeaning: labels.summary,
  lessonLearned: labels.mainLesson,
  todayAction: labels.markComplete,
  lessonText: labels.summary,
  actionText: labels.summary,
});

Object.assign(trainingCopy, {
  ta: regionalTrainingCopy({
    day: "நாள்",
    minutes: "நிமிடங்கள்",
    revision: "மறுபார்வை",
    watch: "பார்க்கவும்",
    completed: "முடிந்தது",
    markComplete: "இன்றைய வகுப்பை முடிக்கவும்",
    dailyClass: "தினசரி வகுப்புகள்",
    opening: "ஹம்த் மற்றும் நாத்",
    quran: "குர்ஆன் ஓதுதல்",
    hadith: "இன்றைய ஹதீஸ்",
    doctor: "மருத்துவர் பகுதி",
    expert: "நிபுணர் விருந்தினர்",
    mainLesson: "முக்கிய பாடம்",
    quiz: "வினாடி வினா மற்றும் மறுபார்வை",
    closing: "நிறைவு",
    heroTitle: "ஹஜ் மற்றும் உம்ரா 100 நாள் பயிற்சி",
    languageLearning: "உங்கள் மொழியில் கற்றுக்கொள்ளுங்கள்",
    meetZoya: "ஸோயாவை சந்திக்கவும்",
    trainingVideos: "பயிற்சி வீடியோக்கள்",
    summary: "ஒவ்வொரு நாளும் எளிய, நம்பகமான மற்றும் நடைமுறை ஹஜ் வழிகாட்டுதல்.",
  }),
  te: regionalTrainingCopy({
    day: "రోజు",
    minutes: "నిమిషాలు",
    revision: "పునశ్చరణ",
    watch: "చూడండి",
    completed: "పూర్తయింది",
    markComplete: "ఈరోజు తరగతిని పూర్తి చేయండి",
    dailyClass: "రోజువారీ తరగతులు",
    opening: "హమ్ద్ మరియు నాత్",
    quran: "ఖురాన్ పఠనం",
    hadith: "ఈరోజు హదీస్",
    doctor: "డాక్టర్ కార్నర్",
    expert: "నిపుణ అతిథి",
    mainLesson: "ప్రధాన పాఠం",
    quiz: "క్విజ్ మరియు పునశ్చరణ",
    closing: "ముగింపు",
    heroTitle: "హజ్ మరియు ఉమ్రా 100 రోజుల శిక్షణ",
    languageLearning: "మీ భాషలో నేర్చుకోండి",
    meetZoya: "జోయాను కలవండి",
    trainingVideos: "శిక్షణ వీడియోలు",
    summary:
      "ప్రతి రోజు సులభమైన, విశ్వసనీయమైన మరియు ఆచరణాత్మక హజ్ మార్గదర్శకత్వం.",
  }),
  mr: regionalTrainingCopy({
    day: "दिवस",
    minutes: "मिनिटे",
    revision: "उजळणी",
    watch: "पाहा",
    completed: "पूर्ण झाले",
    markComplete: "आजचा वर्ग पूर्ण करा",
    dailyClass: "दररोजचे वर्ग",
    opening: "हम्द आणि नात",
    quran: "कुरआन तिलावत",
    hadith: "आजची हदीस",
    doctor: "डॉक्टर कॉर्नर",
    expert: "तज्ज्ञ अतिथी",
    mainLesson: "मुख्य धडा",
    quiz: "प्रश्नमंजुषा आणि उजळणी",
    closing: "समारोप",
    heroTitle: "हज आणि उमरा 100 दिवसांचे प्रशिक्षण",
    languageLearning: "तुमच्या भाषेत शिका",
    meetZoya: "झोयाला भेटा",
    trainingVideos: "प्रशिक्षण व्हिडिओ",
    summary: "दररोज सोपे, विश्वसनीय आणि व्यावहारिक हज मार्गदर्शन.",
  }),
  bn: regionalTrainingCopy({
    day: "দিন",
    minutes: "মিনিট",
    revision: "পুনরালোচনা",
    watch: "দেখুন",
    completed: "সম্পন্ন",
    markComplete: "আজকের ক্লাস সম্পন্ন করুন",
    dailyClass: "দৈনিক ক্লাস",
    opening: "হামদ ও নাত",
    quran: "কুরআন তিলাওয়াত",
    hadith: "আজকের হাদিস",
    doctor: "ডাক্তারের পরামর্শ",
    expert: "বিশেষজ্ঞ অতিথি",
    mainLesson: "মূল পাঠ",
    quiz: "কুইজ ও পুনরালোচনা",
    closing: "সমাপ্তি",
    heroTitle: "হজ ও উমরাহ ১০০ দিনের প্রশিক্ষণ",
    languageLearning: "নিজের ভাষায় শিখুন",
    meetZoya: "জোয়ার সঙ্গে পরিচিত হন",
    trainingVideos: "প্রশিক্ষণ ভিডিও",
    summary: "প্রতিদিন সহজ, নির্ভরযোগ্য ও ব্যবহারিক হজ নির্দেশনা।",
  }),
  or: regionalTrainingCopy({
    day: "ଦିନ",
    minutes: "ମିନିଟ",
    revision: "ପୁନରାବୃତ୍ତି",
    watch: "ଦେଖନ୍ତୁ",
    completed: "ସମ୍ପୂର୍ଣ୍ଣ",
    markComplete: "ଆଜିର ଶ୍ରେଣୀ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ",
    dailyClass: "ଦୈନିକ ଶ୍ରେଣୀ",
    opening: "ହମ୍ଦ ଓ ନାତ",
    quran: "କୁରଆନ ତିଲାୱତ",
    hadith: "ଆଜିର ହାଦିସ",
    doctor: "ଡାକ୍ତର କର୍ଣ୍ଣର",
    expert: "ବିଶେଷଜ୍ଞ ଅତିଥି",
    mainLesson: "ମୁଖ୍ୟ ପାଠ",
    quiz: "କୁଇଜ୍ ଓ ପୁନରାବୃତ୍ତି",
    closing: "ସମାପନ",
    heroTitle: "ହଜ୍ ଓ ଉମରା ୧୦୦ ଦିନର ପ୍ରଶିକ୍ଷଣ",
    languageLearning: "ନିଜ ଭାଷାରେ ଶିଖନ୍ତୁ",
    meetZoya: "ଜୋୟାଙ୍କୁ ଭେଟନ୍ତୁ",
    trainingVideos: "ପ୍ରଶିକ୍ଷଣ ଭିଡିଓ",
    summary: "ପ୍ରତିଦିନ ସରଳ, ବିଶ୍ୱସନୀୟ ଏବଂ ବ୍ୟବହାରିକ ହଜ୍ ମାର୍ଗଦର୍ଶନ।",
  }),
  ml: regionalTrainingCopy({
    day: "ദിവസം",
    minutes: "മിനിറ്റ്",
    revision: "പുനരവലോകനം",
    watch: "കാണുക",
    completed: "പൂർത്തിയായി",
    markComplete: "ഇന്നത്തെ ക്ലാസ് പൂർത്തിയാക്കുക",
    dailyClass: "ദൈനംദിന ക്ലാസ്",
    opening: "ഹംദും നഅ്ത്തും",
    quran: "ഖുർആൻ പാരായണം",
    hadith: "ഇന്നത്തെ ഹദീസ്",
    doctor: "ഡോക്ടർ കോർണർ",
    expert: "വിദഗ്ധ അതിഥി",
    mainLesson: "പ്രധാന പാഠം",
    quiz: "ക്വിസ്, പുനരവലോകനം",
    closing: "സമാപനം",
    heroTitle: "ഹജ്ജ്, ഉംറ 100 ദിവസ പരിശീലനം",
    languageLearning: "നിങ്ങളുടെ ഭാഷയിൽ പഠിക്കുക",
    meetZoya: "സോയയെ കാണുക",
    trainingVideos: "പരിശീലന വീഡിയോകൾ",
    summary:
      "എല്ലാ ദിവസവും ലളിതവും വിശ്വസനീയവും പ്രായോഗികവുമായ ഹജ്ജ് മാർഗനിർദ്ദേശം.",
  }),
  pa: regionalTrainingCopy({
    day: "ਦਿਨ",
    minutes: "ਮਿੰਟ",
    revision: "ਦੁਹਰਾਈ",
    watch: "ਦੇਖੋ",
    completed: "ਪੂਰਾ",
    markComplete: "ਅੱਜ ਦੀ ਕਲਾਸ ਪੂਰੀ ਕਰੋ",
    dailyClass: "ਰੋਜ਼ਾਨਾ ਕਲਾਸ",
    opening: "ਹਮਦ ਅਤੇ ਨਾਤ",
    quran: "ਕੁਰਆਨ ਤਿਲਾਵਤ",
    hadith: "ਅੱਜ ਦੀ ਹਦੀਸ",
    doctor: "ਡਾਕਟਰ ਕਾਰਨਰ",
    expert: "ਮਾਹਰ ਮਹਿਮਾਨ",
    mainLesson: "ਮੁੱਖ ਪਾਠ",
    quiz: "ਕੁਇਜ਼ ਅਤੇ ਦੁਹਰਾਈ",
    closing: "ਸਮਾਪਤੀ",
    heroTitle: "ਹੱਜ ਅਤੇ ਉਮਰਾ 100 ਦਿਨਾਂ ਦੀ ਸਿਖਲਾਈ",
    languageLearning: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਿੱਖੋ",
    meetZoya: "ਜ਼ੋਇਆ ਨੂੰ ਮਿਲੋ",
    trainingVideos: "ਸਿਖਲਾਈ ਵੀਡੀਓ",
    summary: "ਹਰ ਦਿਨ ਆਸਾਨ, ਭਰੋਸੇਯੋਗ ਅਤੇ ਵਿਹਾਰਕ ਹੱਜ ਮਾਰਗਦਰਸ਼ਨ।",
  }),
  gu: regionalTrainingCopy({
    day: "દિવસ",
    minutes: "મિનિટ",
    revision: "પુનરાવર્તન",
    watch: "જુઓ",
    completed: "પૂર્ણ થયું",
    markComplete: "આજનો વર્ગ પૂર્ણ કરો",
    dailyClass: "દૈનિક વર્ગ",
    opening: "હમ્દ અને નાત",
    quran: "કુરઆન તિલાવત",
    hadith: "આજની હદીસ",
    doctor: "ડૉક્ટર કોર્નર",
    expert: "નિષ્ણાત મહેમાન",
    mainLesson: "મુખ્ય પાઠ",
    quiz: "ક્વિઝ અને પુનરાવર્તન",
    closing: "સમાપન",
    heroTitle: "હજ અને ઉમરા 100 દિવસની તાલીમ",
    languageLearning: "તમારી ભાષામાં શીખો",
    meetZoya: "ઝોયાને મળો",
    trainingVideos: "તાલીમ વિડિઓ",
    summary: "દરરોજ સરળ, વિશ્વસનીય અને વ્યવહારુ હજ માર્ગદર્શન।",
  }),
  as: regionalTrainingCopy({
    day: "দিন",
    minutes: "মিনিট",
    revision: "পুনৰালোচনা",
    watch: "চাওক",
    completed: "সম্পূৰ্ণ",
    markComplete: "আজিৰ শ্ৰেণী সম্পূৰ্ণ কৰক",
    dailyClass: "দৈনিক শ্ৰেণী",
    opening: "হামদ আৰু নাত",
    quran: "কোৰআন তিলাৱত",
    hadith: "আজিৰ হাদিছ",
    doctor: "ডাক্তৰ কৰ্ণাৰ",
    expert: "বিশেষজ্ঞ অতিথি",
    mainLesson: "মূল পাঠ",
    quiz: "কুইজ আৰু পুনৰালোচনা",
    closing: "সমাপ্তি",
    heroTitle: "হজ আৰু উমৰাহ ১০০ দিনৰ প্ৰশিক্ষণ",
    languageLearning: "নিজৰ ভাষাত শিকক",
    meetZoya: "জোয়াক লগ কৰক",
    trainingVideos: "প্ৰশিক্ষণ ভিডিঅ'",
    summary: "প্ৰতিদিনে সহজ, বিশ্বাসযোগ্য আৰু ব্যৱহাৰিক হজ নিৰ্দেশনা।",
  }),
  gom: regionalTrainingCopy({
    day: "दिस",
    minutes: "मिनिटां",
    revision: "उजवाड",
    watch: "पळयात",
    completed: "संपलें",
    markComplete: "आयचो वर्ग पुराय करात",
    dailyClass: "दर दिसाचे वर्ग",
    opening: "हम्द आनी नात",
    quran: "कुरआन तिलावत",
    hadith: "आयची हदीस",
    doctor: "डॉक्टर कॉर्नर",
    expert: "तज्ञ पाहुणो",
    mainLesson: "मुखेलो पाठ",
    quiz: "क्विझ आनी उजवाड",
    closing: "समाप्ती",
    heroTitle: "हज आनी उमरा 100 दिसांचें प्रशिक्षण",
    languageLearning: "तुमच्या भाशेंत शिकात",
    meetZoya: "झोयेक मेळात",
    trainingVideos: "प्रशिक्षण व्हिडियो",
    summary: "दर दिसा सोपें, भरवशाचें आनी उपेगी हज मार्गदर्शन।",
  }),
  ks: regionalTrainingCopy({
    day: "دۄہ",
    minutes: "منٹ",
    revision: "دوبارہ",
    watch: "وچھو",
    completed: "مکمل",
    markComplete: "اَزکٕس کلاس مکمل کٔرو",
    dailyClass: "روزانہ کلاس",
    opening: "حمد تہ نعت",
    quran: "قرآن تلاوت",
    hadith: "اَزکِ حدیث",
    doctor: "ڈاکٹر کارنر",
    expert: "ماہر مہمان",
    mainLesson: "اہم سبق",
    quiz: "کوئز تہ دُہرائی",
    closing: "اختتام",
    heroTitle: "حج تہ عمرہ 100 دۄہ تربیت",
    languageLearning: "پننین زبانن منز سِکھو",
    meetZoya: "زویا سۭتۍ ملو",
    trainingVideos: "تربیتی ویڈیو",
    summary: "ہر دۄہ آسان، بھروسہ مند تہ عملی حج رہنمائی۔",
  }),
  sa: regionalTrainingCopy({
    day: "दिनम्",
    minutes: "निमेषाः",
    revision: "पुनरावलोकनम्",
    watch: "पश्यतु",
    completed: "पूर्णम्",
    markComplete: "अद्यतनवर्गं पूर्णं करोतु",
    dailyClass: "दैनिकवर्गः",
    opening: "हम्द् तथा नात्",
    quran: "कुरआनपाठः",
    hadith: "अद्यतनहदीस",
    doctor: "वैद्यकोणः",
    expert: "विशेषज्ञातिथिः",
    mainLesson: "मुख्यपाठः",
    quiz: "प्रश्नोत्तरी पुनरावलोकनम्",
    closing: "समापनम्",
    heroTitle: "हज्-उमरा शतदिनप्रशिक्षणम्",
    languageLearning: "स्वभाषायां शिक्षताम्",
    meetZoya: "जोयां मिलतु",
    trainingVideos: "प्रशिक्षणचलच्चित्राणि",
    summary: "प्रतिदिनं सरलम्, विश्वसनीयम्, व्यावहारिकं हजमार्गदर्शनम्।",
  }),
  sd: regionalTrainingCopy({
    day: "ڏينهن",
    minutes: "منٽ",
    revision: "ورجاءُ",
    watch: "ڏسو",
    completed: "مڪمل",
    markComplete: "اڄوڪو ڪلاس مڪمل ڪريو",
    dailyClass: "روزاني ڪلاس",
    opening: "حمد ۽ نعت",
    quran: "قرآن تلاوت",
    hadith: "اڄ جي حديث",
    doctor: "ڊاڪٽر ڪارنر",
    expert: "ماهر مهمان",
    mainLesson: "مکيه سبق",
    quiz: "ڪوئز ۽ ورجاءُ",
    closing: "پڄاڻي",
    heroTitle: "حج ۽ عمرو 100 ڏينهن جي تربيت",
    languageLearning: "پنهنجي ٻولي ۾ سکو",
    meetZoya: "زويا سان ملو",
    trainingVideos: "تربيتي وڊيو",
    summary: "هر ڏينهن آسان، قابلِ اعتماد ۽ عملي حج رهنمائي۔",
  }),
  doi: regionalTrainingCopy({
    day: "दिन",
    minutes: "मिनट",
    revision: "दोहराई",
    watch: "दिक्खो",
    completed: "पूरा",
    markComplete: "अज्ज दी क्लास पूरी करो",
    dailyClass: "रोज़ाना क्लास",
    opening: "हम्द ते नात",
    quran: "कुरआन तिलावत",
    hadith: "अज्ज दी हदीस",
    doctor: "डॉक्टर कॉर्नर",
    expert: "माहिर मेहमान",
    mainLesson: "मुख्य पाठ",
    quiz: "क्विज़ ते दोहराई",
    closing: "समापन",
    heroTitle: "हज ते उमरा 100 दिनां दी ट्रेनिंग",
    languageLearning: "अपनी भाषा च सिक्खो",
    meetZoya: "ज़ोया गी मिलो",
    trainingVideos: "ट्रेनिंग वीडियो",
    summary: "हर दिन सरल, भरोसेमंद ते व्यावहारिक हज मार्गदर्शन।",
  }),
  mai: regionalTrainingCopy({
    day: "दिन",
    minutes: "मिनट",
    revision: "दोहराब",
    watch: "देखू",
    completed: "पूरा",
    markComplete: "आइक क्लास पूरा करू",
    dailyClass: "रोजक क्लास",
    opening: "हम्द आ नात",
    quran: "कुरआन तिलावत",
    hadith: "आइक हदीस",
    doctor: "डॉक्टर कॉर्नर",
    expert: "विशेषज्ञ अतिथि",
    mainLesson: "मुख्य पाठ",
    quiz: "क्विज आ दोहराब",
    closing: "समापन",
    heroTitle: "हज आ उमरा 100 दिनक प्रशिक्षण",
    languageLearning: "अपन भाषा मे सीखू",
    meetZoya: "जोया सँ मिलू",
    trainingVideos: "प्रशिक्षण वीडियो",
    summary: "हर दिन सरल, भरोसेमंद आ व्यवहारिक हज मार्गदर्शन।",
  }),
  brx: regionalTrainingCopy({
    day: "सान",
    minutes: "मिनिट",
    revision: "फिन रानना",
    watch: "नाय",
    completed: "फोजोब",
    markComplete: "दिनैनि क्लासखौ फोजोब खालाम",
    dailyClass: "सान-फ्राय क्लास",
    opening: "हमद आरो नात",
    quran: "कुरआन तिलावत",
    hadith: "दिनैनि हदीस",
    doctor: "डाक्टर कार्नार",
    expert: "सोलोंथाइ मोंथिरि",
    mainLesson: "गाहाय पाठ",
    quiz: "कुइज आरो फिन रानना",
    closing: "जोबना",
    heroTitle: "हाज आरो उमरा 100 साननि ट्रेनिं",
    languageLearning: "नोंथांनि रावजों सोलों",
    meetZoya: "जोयाखौ लोगो लां",
    trainingVideos: "ट्रेनिं भिडिअ'",
    summary: "सान-फ्राय सरल, फोथायनाय आरो बाहायथाव हाजनि राहा।",
  }),
  sat: regionalTrainingCopy({
    day: "ᱢᱟᱦᱟ",
    minutes: "ᱢᱤᱱᱤᱴ",
    revision: "ᱫᱚᱦᱲᱟ",
    watch: "ᱧᱮᱞ",
    completed: "ᱯᱩᱨᱟᱹᱣ",
    markComplete: "ᱛᱮᱦᱮᱧ ᱠᱞᱟᱥ ᱯᱩᱨᱟᱹᱣ ᱢᱮ",
    dailyClass: "ᱫᱤᱱᱟᱹᱢ ᱠᱞᱟᱥ",
    opening: "ᱦᱟᱢᱫ ᱟᱨ ᱱᱟᱛ",
    quran: "ᱠᱩᱨᱟᱱ ᱛᱤᱞᱟᱣᱟᱛ",
    hadith: "ᱛᱮᱦᱮᱧ ᱦᱟᱫᱤᱥ",
    doctor: "ᱰᱟᱠᱛᱚᱨ ᱠᱚᱨᱱᱟᱨ",
    expert: "ᱵᱤᱥᱮᱥᱚᱜ ᱟᱛᱤᱛ",
    mainLesson: "ᱢᱩᱬ ᱯᱟᱴᱷ",
    quiz: "ᱠᱩᱭᱤᱡ ᱟᱨ ᱫᱚᱦᱲᱟ",
    closing: "ᱢᱩᱪᱟᱹᱫ",
    heroTitle: "ᱦᱟᱡ ᱟᱨ ᱩᱢᱨᱟ 100 ᱢᱟᱦᱟ ᱛᱟᱞᱤᱢ",
    languageLearning: "ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱪᱮᱫ",
    meetZoya: "ᱡᱳᱭᱟ ᱥᱟᱶ ᱢᱤᱫ",
    trainingVideos: "ᱛᱟᱞᱤᱢ ᱵᱤᱰᱤᱭᱳ",
    summary: "ᱡᱷᱚᱛᱚ ᱢᱟᱦᱟ ᱥᱚᱦᱚᱡ ᱟᱨ ᱵᱤᱥᱣᱟᱥᱡᱚᱜ ᱦᱟᱡ ᱵᱟᱛᱞᱟᱣ।",
  }),
  mni: regionalTrainingCopy({
    day: "ꯅꯨꯃꯤꯠ",
    minutes: "ꯃꯤꯅꯤꯠ",
    revision: "ꯑꯃꯨꯛ ꯱ꯦꯡꯅ",
    watch: "ꯌꯦꯡꯕꯤꯌꯨ",
    completed: "ꯂꯣꯏꯔꯦ",
    markComplete: "ꯅꯪꯒꯤ ꯃꯁꯤ ꯀ꯭ꯂꯥꯁ ꯂꯣꯏꯁꯤꯜꯂꯨ",
    dailyClass: "ꯅꯨꯃꯤꯠ ꯀ꯭ꯂꯥꯁ",
    opening: "ꯍꯝꯗ ꯑꯃꯁꯨꯡ ꯅꯥꯠ",
    quran: "ꯀꯨꯔꯥꯟ ꯇꯤꯂꯥꯋꯥꯠ",
    hadith: "ꯅꯨꯃꯤꯠꯀꯤ ꯍꯗꯤꯁ",
    doctor: "ꯗꯣꯛꯇꯔ ꯀꯣꯔꯅꯔ",
    expert: "ꯑꯁꯦꯡꯕ ꯑꯇꯤꯊꯤ",
    mainLesson: "ꯃꯔꯨꯑꯣꯏꯕ ꯂꯦꯁꯟ",
    quiz: "ꯀ꯭ꯋꯤꯖ ꯑꯃꯁꯨꯡ ꯑꯃꯨꯛ ꯱ꯦꯡꯅ",
    closing: "ꯂꯣꯏꯁꯤꯟꯕ",
    heroTitle: "ꯍꯥꯖ ꯑꯃꯁꯨꯡ ꯎꯝꯔꯥ 100 ꯅꯨꯃꯤꯠ ꯇ꯭ꯔꯦꯅꯤꯡ",
    languageLearning: "ꯅꯪꯒꯤ ꯂꯣꯟꯗ ꯇꯝꯕꯤꯌꯨ",
    meetZoya: "ꯖꯣꯌꯥꯕꯨ ꯎꯠꯄꯤꯌꯨ",
    trainingVideos: "ꯇ꯭ꯔꯦꯅꯤꯡ ꯚꯤꯗꯤꯑꯣ",
    summary: "ꯅꯨꯃꯤꯠ ꯑꯃꯥꯃꯝꯗ ꯁꯔꯨꯛꯌꯥꯏ ꯑꯃꯁꯨꯡ ꯊꯧꯔꯥꯡ ꯌꯥꯕ ꯍꯥꯖ ꯃꯥꯔꯒꯗꯔꯁꯟ।",
  }),
  ne: regionalTrainingCopy({
    day: "दिन",
    minutes: "मिनेट",
    revision: "पुनरावलोकन",
    watch: "हेर्नुहोस्",
    completed: "पूरा भयो",
    markComplete: "आजको कक्षा पूरा गर्नुहोस्",
    dailyClass: "दैनिक कक्षा",
    opening: "हम्द र नात",
    quran: "कुरआन तिलावत",
    hadith: "आजको हदीस",
    doctor: "डाक्टर कर्नर",
    expert: "विशेषज्ञ अतिथि",
    mainLesson: "मुख्य पाठ",
    quiz: "क्विज र पुनरावलोकन",
    closing: "समापन",
    heroTitle: "हज र उमराह १०० दिनको प्रशिक्षण",
    languageLearning: "आफ्नो भाषामा सिक्नुहोस्",
    meetZoya: "जोयालाई भेट्नुहोस्",
    trainingVideos: "प्रशिक्षण भिडियो",
    summary: "हरेक दिन सरल, भरपर्दो र व्यावहारिक हज मार्गदर्शन।",
  }),
});

const getTrainingCopy = (language: Language) => trainingCopy[language] || en;

const DailySession = ({
  lesson,
  completed,
  onComplete,
  onPlayVideo,
  copy,
}: {
  lesson: DailyLesson;
  completed: boolean;
  onComplete: () => void;
  onPlayVideo: (video: DayOneVideo) => void;
  copy: TrainingCopy;
}) => {
  const hasDayOneVideos = lesson.day === 1;

  return (
    <Card className="border-primary/15 shadow-soft overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary to-emerald-800 px-5 py-4 text-primary-foreground">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-85">
                {copy.day} {lesson.day} · 30 {copy.minutes}
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {copy.dailyClass} {lesson.day}
              </h2>
            </div>
            {lesson.revision && (
              <Badge className="bg-amber-300 text-amber-950">
                {copy.revision}
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-3 p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {copy.classDescription}
          </p>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
              <b>
                1. {copy.opening} · 2 {copy.minutes}
              </b>
              <br />
              <span className="text-xs">{copy.openingDescription}</span>
              {hasDayOneVideos && (
                <button
                  type="button"
                  onClick={() =>
                    onPlayVideo({
                      title: "Hamd & Naat",
                      videoId: "J76Dtc0MePA",
                    })
                  }
                  className="mt-3 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
                  aria-label={`${copy.watch} ${copy.opening}`}
                >
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  {copy.watch} {copy.opening}
                </button>
              )}
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
              <b>
                2. {copy.quran} · 2 {copy.minutes}
              </b>
              <br />
              <span className="text-xs">{copy.sourceReflection}</span>
              {hasDayOneVideos && (
                <button
                  type="button"
                  onClick={() =>
                    onPlayVideo({
                      title: "Qur'an Tilawat",
                      videoId: "ilFRBeioTv0",
                    })
                  }
                  className="mt-3 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                  aria-label={`${copy.watch} ${copy.quran}`}
                >
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  {copy.watch} {copy.quran}
                </button>
              )}
            </div>
            <div className="rounded-xl bg-sky-50 p-3 text-sky-950 dark:bg-sky-950/30 dark:text-sky-100">
              <b>
                3. {copy.hadith} · 2 {copy.minutes}
              </b>
              <br />
              <span className="text-xs">{copy.sourceReflection}</span>
              {hasDayOneVideos && (
                <button
                  type="button"
                  onClick={() =>
                    onPlayVideo({
                      title: "Hadith of the Day",
                      videoId: "UG5eDW33FS0",
                    })
                  }
                  className="mt-3 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-sky-800 px-3 text-xs font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
                  aria-label={`${copy.watch} ${copy.hadith}`}
                >
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  {copy.watch} {copy.hadith}
                </button>
              )}
            </div>
            <div className="rounded-xl bg-rose-50 p-3 text-rose-950 dark:bg-rose-950/30 dark:text-rose-100">
              <b>
                4. {copy.doctor} · 3 {copy.minutes}
              </b>
              <br />
              <span className="text-xs">{copy.healthDescription}</span>
              {hasDayOneVideos && (
                <button
                  type="button"
                  onClick={() =>
                    onPlayVideo({
                      title: "Doctor's Corner",
                      videoId: "qhHXiOIfO4k",
                    })
                  }
                  className="mt-3 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-rose-800 px-3 text-xs font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2"
                  aria-label={`${copy.watch} ${copy.doctor}`}
                >
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  {copy.watch} {copy.doctor}
                </button>
              )}
            </div>
            <div className="rounded-xl bg-violet-50 p-3 text-violet-950 dark:bg-violet-950/30 dark:text-violet-100">
              <b>
                5. {copy.expert} · 3 {copy.minutes}
              </b>
              <br />
              <span className="text-xs">{copy.expertDescription}</span>
            </div>
            <div className="rounded-xl bg-primary/5 p-3 text-foreground">
              <b>
                6. {copy.mainLesson} · 15 {copy.minutes}
              </b>
              <br />
              <span className="text-xs">{copy.mainLessonDescription}</span>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <b>
                7. {copy.quiz} · 2 {copy.minutes}
              </b>
              <br />
              <span className="text-xs">{copy.quizDescription}</span>
              {hasDayOneVideos && (
                <button
                  type="button"
                  onClick={() =>
                    onPlayVideo({
                      title: "Quiz & Revision",
                      videoId: "NMoEj39fpxs",
                    })
                  }
                  className="mt-3 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label={`${copy.watch} ${copy.quiz}`}
                >
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  {copy.watch} {copy.quiz}
                </button>
              )}
            </div>
            <div className="rounded-xl border border-amber-300/60 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 text-foreground dark:from-amber-950/30 dark:via-background dark:to-emerald-950/25 sm:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    8. {copy.closing} · 1 {copy.minutes}
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-primary">
                    {copy.closingTitle}{" "}
                    <span className="text-sm font-medium text-muted-foreground">
                      ({copy.closingSubtitle})
                    </span>
                  </h3>
                </div>
                <Heart
                  className="h-5 w-5 shrink-0 text-rose-500"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed">
                <span className="font-semibold">{copy.quoteLabel}</span>{" "}
                “Innamal a'malu bin-niyyat, wa innama likullimri'in ma nawa.”
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {copy.quoteMeaning}
              </p>
              <p className="mt-2 text-xs font-semibold text-primary">
                Sahih al-Bukhari: 1
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-white/80 p-3 text-sm shadow-sm dark:bg-background/60">
                  <b>{copy.lessonLearned}</b>
                  <br />
                  <span className="text-xs">{copy.lessonText}</span>
                </div>
                <div className="rounded-lg bg-primary p-3 text-sm text-primary-foreground shadow-sm">
                  <b>{copy.todayAction}</b>
                  <br />
                  <span className="text-xs">{copy.actionText}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={onComplete}
            variant={completed ? "secondary" : "default"}
            className="min-h-12 w-full sm:w-auto"
          >
            {completed ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {copy.completed}
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {copy.markComplete}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DailyHajjTrainingPage() {
  const { language, isRTL } = useLanguage();
  const copy = getTrainingCopy(language);
  const [completed, setCompleted] = useState<number[]>([]);
  const [day, setDay] = useState(1);
  const [activeVideo, setActiveVideo] = useState<DayOneVideo | null>(null);
  const [showZoyaIntro, setShowZoyaIntro] = useState(false);
  useEffect(() => {
    try {
      setCompleted(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {
      setCompleted([]);
    }
  }, []);
  const done = (next: number[]) => {
    setCompleted(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  const lesson = dailyHajjTraining[day - 1];
  const percentage = Math.round((completed.length / PROGRAMME_DAYS) * 100);
  const phases = useMemo(
    () => Array.from(new Set(dailyHajjTraining.map((item) => item.phase))),
    [],
  );
  const localizedPhase = (index: number, fallback: string) =>
    phaseNames[language]?.[index] ||
    (language === "en" ? fallback : copy.dailyClass);
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />
      <SEO
        title={copy.heroTitle}
        description={copy.heroDescription}
        path="/daily-hajj-training"
      />
      <main className="container mx-auto max-w-4xl space-y-6 px-4 py-6 sm:py-10">
        <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-800 to-emerald-950 p-6 text-primary-foreground shadow-elevated sm:p-8">
          <Badge className="bg-amber-300 text-amber-950">
            {copy.freeLearning}
          </Badge>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/85">
            {copy.heroDescription}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <CalendarDays className="mb-2 h-5 w-5" />
              {copy.dailyClasses}
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <Users className="mb-2 h-5 w-5" />
              {copy.languageLearning}
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <BookOpen className="mb-2 h-5 w-5" />
              {copy.authentic}
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button
              asChild
              className="min-h-12 bg-amber-300 text-amber-950 hover:bg-amber-200"
            >
              <Link to="/free-hajj-training">
                <Users className="mr-2 h-4 w-4" />
                {copy.register}
              </Link>
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="min-h-12"
              onClick={() => setShowZoyaIntro(true)}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              {copy.meetZoya}
            </Button>
          </div>
        </section>
        <Card className="overflow-hidden border-primary/20 bg-primary/5">
          <CardContent className="p-3 sm:p-4">
            <img
              src={zoyaApprovedImage}
              alt={copy.meetZoya}
              className="mx-auto h-auto w-full max-w-md rounded-2xl object-cover object-top shadow-sm"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex justify-between text-sm font-semibold">
              <span>{copy.progress}</span>
              <span>
                {completed.length}/{PROGRAMME_DAYS} · {percentage}%
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
            {completed.length === PROGRAMME_DAYS && (
              <p className="mt-4 flex items-center gap-2 font-semibold text-primary">
                <Award className="h-5 w-5" />
                {copy.certificate}
              </p>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="training-day">
            {copy.chooseDay}
          </label>
          <select
            id="training-day"
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="min-h-12 rounded-xl border bg-card px-3 text-sm"
          >
            <>
              {dailyHajjTraining.map((item) => (
                <option key={item.day} value={item.day}>
                  {copy.day} {item.day}: {copy.dailyClass}
                </option>
              ))}
            </>
          </select>
          <Button asChild variant="outline" className="min-h-12">
            <Link to="/hajj-training-videos">
              <PlayCircle className="mr-2 h-4 w-4" />
              {copy.trainingVideos}
            </Link>
          </Button>
        </div>
        <DailySession
          lesson={lesson}
          completed={completed.includes(day)}
          onComplete={() =>
            !completed.includes(day) && done([...completed, day])
          }
          onPlayVideo={setActiveVideo}
          copy={copy}
        />
        <section className="space-y-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Heart className="h-5 w-5 text-primary" />
              {copy.roadmap}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.roadmapDescription}
            </p>
          </div>
          {phases.map((phase, index) => {
            const start = index * DAYS_PER_PHASE + 1;
            const end = start + DAYS_PER_PHASE - 1;
            return (
              <Collapsible key={phase}>
                <Card>
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left font-semibold">
                    <span>
                      {copy.day} {start}–{end}: {localizedPhase(index, phase)}
                    </span>
                    <ChevronDown className="h-5 w-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-t px-4 pb-4 pt-3 text-sm text-muted-foreground">
                    {dailyHajjTraining.slice(start - 1, end).map((item) => (
                      <button
                        key={item.day}
                        onClick={() => {
                          setDay(item.day);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="mr-2 mt-2 rounded-lg bg-muted px-3 py-2 text-left hover:bg-primary/10"
                      >
                        {copy.day} {item.day}: {copy.dailyClass} · 30{" "}
                        {copy.minutes}
                      </button>
                    ))}
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </section>
        <Card className="border-amber-300 bg-amber-50/60 dark:bg-amber-950/20">
          <CardContent className="flex gap-3 p-5">
            <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm">{copy.contentNotice}</p>
          </CardContent>
        </Card>
        <Dialog
          open={Boolean(activeVideo)}
          onOpenChange={(open) => !open && setActiveVideo(null)}
        >
          <DialogContent className="max-w-3xl p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>{activeVideo?.title}</DialogTitle>
              <DialogDescription>{copy.videoDescription}</DialogDescription>
            </DialogHeader>
            {activeVideo && (
              <div className="aspect-video overflow-hidden rounded-xl bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?rel=0&modestbranding=1&playsinline=1&cc_load_policy=1&cc_lang_pref=${encodeURIComponent(getZoyaLanguage(language).locale)}`}
                  title={`${activeVideo.title} video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
            {activeVideo && (
              <Button asChild variant="outline" className="min-h-11 w-full">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {copy.openYoutube}
                </a>
              </Button>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={showZoyaIntro} onOpenChange={setShowZoyaIntro}>
          <DialogContent className="max-w-sm p-4 sm:p-6">
            <DialogHeader className="sr-only">
              <DialogTitle>{copy.meetZoya}</DialogTitle>
            </DialogHeader>
            <img
              src={zoyaApprovedImage}
              alt={copy.meetZoya}
              className="h-auto w-full rounded-xl object-contain"
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
