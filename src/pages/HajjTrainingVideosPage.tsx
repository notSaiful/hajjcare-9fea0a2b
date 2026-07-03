import { useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCircle } from "@/components/IconCircle";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Youtube,
  PlayCircle,
  Shirt,
  Circle,
  Footprints,
  Tent,
  Mountain,
  Moon,
  Target,
  Sword,
  Scissors,
  BookOpen,
  Sparkles,
  GraduationCap,
  Volume2,
  Video as VideoIcon,
  LucideIcon,
} from "lucide-react";

type Lang = "hi" | "ur" | "bn" | "ta" | "ml" | "en";

interface Topic {
  id: string;
  icon: LucideIcon;
  color: string;
  order: number;
  title: Record<string, string>;
  desc: Record<string, string>;
  searchQuery: Record<string, string>;
}

const topics: Topic[] = [
  {
    id: "intro",
    icon: Sparkles,
    color: "gold",
    order: 1,
    title: { en: "Hajj Overview", hi: "हज परिचय", ur: "حج تعارف", bn: "হজ পরিচিতি", ta: "ஹஜ் அறிமுகம்", ml: "ഹജ്ജ് ആമുഖം" },
    desc: {
      en: "What is Hajj — 5 days step by step",
      hi: "हज क्या है — 5 दिन का पूरा तरीका",
      ur: "حج کیا ہے — 5 دن کا مکمل طریقہ",
      bn: "হজ কী — ৫ দিনের পূর্ণ প্রক্রিয়া",
      ta: "ஹஜ் என்றால் என்ன — 5 நாட்கள்",
      ml: "ഹജ്ജ് എന്താണ് — 5 ദിവസം",
    },
    searchQuery: {
      hi: "हज का पूरा तरीका हिंदी में",
      ur: "حج کا مکمل طریقہ اردو",
      bn: "হজ পালনের নিয়ম বাংলা",
      ta: "ஹஜ் முறை தமிழ்",
      ml: "ഹജ്ജ് കർമ്മം മലയാളം",
      en: "Complete Hajj step by step English",
    },
  },
  {
    id: "ihram",
    icon: Shirt,
    color: "sand",
    order: 2,
    title: { en: "Ihram", hi: "एहराम", ur: "احرام", bn: "ইহরাম", ta: "இஹ்ராம்", ml: "ഇഹ്റാം" },
    desc: {
      en: "How to wear Ihram, niyyat and rules",
      hi: "एहराम कैसे बांधें, नियत और नियम",
      ur: "احرام کیسے باندھیں، نیت اور احکام",
      bn: "ইহরাম বাঁধার নিয়ম ও নিয়ত",
      ta: "இஹ்ராம் அணியும் முறை",
      ml: "ഇഹ്റാം ധരിക്കുന്ന രീതി",
    },
    searchQuery: {
      hi: "एहराम बांधने का तरीका हिंदी",
      ur: "احرام باندھنے کا طریقہ اردو",
      bn: "ইহরাম বাঁধার নিয়ম",
      ta: "இஹ்ராம் கட்டும் முறை",
      ml: "ഇഹ്റാം ധരിക്കുന്നത് എങ്ങനെ",
      en: "How to wear Ihram Hajj",
    },
  },
  {
    id: "tawaf",
    icon: Circle,
    color: "emerald",
    order: 3,
    title: { en: "Tawaf", hi: "तवाफ़", ur: "طواف", bn: "তাওয়াফ", ta: "தவாஃப்", ml: "ത്വവാഫ്" },
    desc: {
      en: "7 rounds of Kaaba — start, duas, end",
      hi: "काबा के 7 चक्कर — शुरू, दुआ, अंत",
      ur: "کعبہ کے 7 چکر — شروع، دعائیں، اختتام",
      bn: "কাবার ৭ চক্কর — শুরু, দোয়া, শেষ",
      ta: "கஅபா 7 சுற்று — துவக்கம், துஆ",
      ml: "കഅ്ബ 7 പ്രദക്ഷിണം",
    },
    searchQuery: {
      hi: "तवाफ करने का तरीका हिंदी",
      ur: "طواف کا طریقہ اردو",
      bn: "তাওয়াফ করার নিয়ম",
      ta: "தவாஃப் செய்யும் முறை",
      ml: "ത്വവാഫ് എങ്ങനെ",
      en: "How to perform Tawaf",
    },
  },
  {
    id: "sai",
    icon: Footprints,
    color: "teal",
    order: 4,
    title: { en: "Sa'i (Safa-Marwa)", hi: "सई (सफा-मरवा)", ur: "سعی (صفا-مروہ)", bn: "সাঈ (সাফা-মারওয়া)", ta: "சாஈ", ml: "സഅ്‌യ്" },
    desc: {
      en: "7 rounds between Safa and Marwa",
      hi: "सफा से मरवा 7 चक्कर",
      ur: "صفا اور مروہ کے درمیان 7 چکر",
      bn: "সাফা ও মারওয়ার মাঝে ৭ চক্কর",
      ta: "சபா மற்றும் மர்வா 7 சுற்று",
      ml: "സഫാ മർവാ ഇടയിൽ 7 തവണ",
    },
    searchQuery: {
      hi: "सई करने का तरीका सफा मरवा",
      ur: "سعی صفا مروہ کا طریقہ",
      bn: "সাঈ করার নিয়ম",
      ta: "சாஈ செய்யும் முறை",
      ml: "സഅ്‌യ് എങ്ങനെ",
      en: "How to perform Sai Safa Marwa",
    },
  },
  {
    id: "mina",
    icon: Tent,
    color: "sky",
    order: 5,
    title: { en: "Day in Mina (8 Zul-Hijjah)", hi: "मीना का दिन (8 ज़िलहिज्जा)", ur: "منیٰ کا دن (8 ذوالحجہ)", bn: "মিনার দিন", ta: "மினா நாள்", ml: "മിനാ ദിനം" },
    desc: {
      en: "Reach Mina, tent life, 5 salah, prep for Arafah",
      hi: "मीना पहुंचना, तंबू में रहना, 5 नमाज़",
      ur: "منیٰ پہنچنا، خیمے میں قیام، 5 نمازیں",
      bn: "মিনায় পৌঁছানো, তাঁবু, ৫ ওয়াক্ত সালাত",
      ta: "மினா தங்குதல்",
      ml: "മിനായിലെ താമസം",
    },
    searchQuery: {
      hi: "मीना में क्या करें हज हिंदी",
      ur: "منیٰ میں کیا کریں حج",
      bn: "মিনায় হজের নিয়ম",
      ta: "மினா ஹஜ் தமிழ்",
      ml: "മിന ഹജ്ജ്",
      en: "Day in Mina Hajj 8 Zul Hijjah",
    },
  },
  {
    id: "arafah",
    icon: Mountain,
    color: "coral",
    order: 6,
    title: { en: "Wuquf al-Arafah (9)", hi: "अरफ़ात का दिन (9)", ur: "وقوفِ عرفہ (9)", bn: "আরাফাত (৯)", ta: "அரஃபா", ml: "അറഫാ" },
    desc: {
      en: "Most important day — dua, tears, forgiveness",
      hi: "सबसे बड़ा दिन — दुआ और माफ़ी",
      ur: "سب سے اہم دن — دعا اور مغفرت",
      bn: "সবচেয়ে গুরুত্বপূর্ণ দিন — দোয়া",
      ta: "மிக முக்கிய நாள் — துஆ",
      ml: "ഏറ്റവും പ്രധാന ദിവസം",
    },
    searchQuery: {
      hi: "अरफात के दिन क्या करें हज हिंदी",
      ur: "عرفہ کے دن کیا کریں",
      bn: "আরাফাতের দিন কী করবেন",
      ta: "அரஃபா நாள் துஆ",
      ml: "അറഫാ ദിനം ദുആ",
      en: "Wuquf Arafah day Hajj guide",
    },
  },
  {
    id: "muzdalifah",
    icon: Moon,
    color: "plum",
    order: 7,
    title: { en: "Muzdalifah Night", hi: "मुज़दलिफ़ा की रात", ur: "مزدلفہ کی رات", bn: "মুজদালিফার রাত", ta: "முஸ்தலிஃபா", ml: "മുസ്ദലിഫ" },
    desc: {
      en: "Maghrib+Isha jama, sleep under sky, collect 49-70 pebbles",
      hi: "मग़रिब+इशा जमा, खुले आसमान में, कंकड़ चुनना",
      ur: "مغرب+عشاء جمع، کھلے آسمان، کنکریاں چننا",
      bn: "মাগরিব+ইশা একসাথে, নুড়ি সংগ্রহ",
      ta: "மக்ரிப் இஷா, கற்கள் சேகரிப்பு",
      ml: "മഗ്‌രിബ് ഇശാ, കല്ലുകൾ",
    },
    searchQuery: {
      hi: "मुज़दलिफा रात कंकड़ हज",
      ur: "مزدلفہ رات کنکریاں حج",
      bn: "মুজদালিফা রাত হজ",
      ta: "முஸ்தலிஃபா ஹஜ்",
      ml: "മുസ്ദലിഫ ഹജ്ജ്",
      en: "Muzdalifah night Hajj pebbles",
    },
  },
  {
    id: "rami",
    icon: Target,
    color: "coral",
    order: 8,
    title: { en: "Rami al-Jamarat", hi: "रमी (शैतान को कंकड़)", ur: "رمی جمرات", bn: "রামি জামারাত", ta: "ரமீ ஜமராத்", ml: "റമ്യ് ജമറാത്ത്" },
    desc: {
      en: "Stoning the pillars — safe method, timing",
      hi: "जमरात पर कंकड़ मारना — सुरक्षित तरीका, समय",
      ur: "جمرات پر کنکریاں — محفوظ طریقہ",
      bn: "জামারায় নুড়ি নিক্ষেপ",
      ta: "ஜமராத் கல் எறிதல்",
      ml: "ജമറാത്ത് കല്ലേറ്",
    },
    searchQuery: {
      hi: "जमरात कंकड़ मारने का तरीका हिंदी",
      ur: "رمی جمرات کا طریقہ اردو",
      bn: "জামারাত রামি করার নিয়ম",
      ta: "ஜமராத் ரமீ முறை",
      ml: "ജമറാത്ത് റമ്യ്",
      en: "How to perform Rami Jamarat",
    },
  },
  {
    id: "qurbani-halq",
    icon: Sword,
    color: "sand",
    order: 9,
    title: { en: "Qurbani & Halq", hi: "क़ुर्बानी और हल्क़", ur: "قربانی اور حلق", bn: "কুরবানি ও হালক", ta: "குர்பானி & ஹல்க்", ml: "ഖുർബാനി & ഹൽക്ക്" },
    desc: {
      en: "Sacrifice booking (Adahi/IDB) + head shave order",
      hi: "क़ुर्बानी बुकिंग + सिर मुंडवाना — सही क्रम",
      ur: "قربانی بکنگ + سر منڈوانا — درست ترتیب",
      bn: "কুরবানি + মাথা মুণ্ডন",
      ta: "குர்பானி + தலை மொட்டை",
      ml: "ഖുർബാനി + മുടി കളയൽ",
    },
    searchQuery: {
      hi: "हज क़ुर्बानी और हल्क़ का तरीका",
      ur: "حج قربانی اور حلق کا طریقہ",
      bn: "হজ কুরবানি ও হালক",
      ta: "ஹஜ் குர்பானி ஹல்க்",
      ml: "ഹജ്ജ് ഖുർബാനി ഹൽക്ക്",
      en: "Hajj Qurbani and Halq order",
    },
  },
  {
    id: "tawaf-ifada",
    icon: Circle,
    color: "gold",
    order: 10,
    title: { en: "Tawaf al-Ifadah", hi: "तवाफ़-ए-इफ़ाज़ा", ur: "طوافِ افاضہ", bn: "তাওয়াফুল ইফাদা", ta: "தவாஃப் இஃபாதா", ml: "ത്വവാഫുൽ ഇഫാദ" },
    desc: {
      en: "Return to Kaaba after Mina — farz tawaf",
      hi: "मीना के बाद काबा वापसी — फ़र्ज़ तवाफ़",
      ur: "منیٰ کے بعد کعبہ واپسی — فرض طواف",
      bn: "মিনার পর ফরজ তাওয়াফ",
      ta: "ஃபர்ழ் தவாஃப்",
      ml: "ഫർള് ത്വവാഫ്",
    },
    searchQuery: {
      hi: "तवाफ ए इफाजा हज हिंदी",
      ur: "طواف افاضہ حج اردو",
      bn: "তাওয়াফুল ইফাদা",
      ta: "தவாஃப் இஃபாதா",
      ml: "ത്വവാഫുൽ ഇഫാദ",
      en: "Tawaf al Ifadah Hajj",
    },
  },
  {
    id: "duas",
    icon: BookOpen,
    color: "sage",
    order: 11,
    title: { en: "Important Duas", hi: "ज़रूरी दुआएं", ur: "اہم دعائیں", bn: "গুরুত্বপূর্ণ দোয়া", ta: "முக்கிய துஆ", ml: "പ്രധാന ദുആകൾ" },
    desc: {
      en: "Talbiyah, Multazam, Arafah duas — audio-first",
      hi: "तल्बिया, मुल्तज़म, अरफ़ात की दुआएं",
      ur: "تلبیہ، ملتزم، عرفہ کی دعائیں",
      bn: "তালবিয়া ও দোয়া",
      ta: "தல்பியா, துஆ",
      ml: "തൽബിയത്ത്, ദുആകൾ",
    },
    searchQuery: {
      hi: "हज की दुआएं तल्बिया हिंदी",
      ur: "حج کی دعائیں تلبیہ",
      bn: "হজের দোয়া তালবিয়া",
      ta: "ஹஜ் துஆ தல்பியா",
      ml: "ഹജ്ജ് ദുആ തൽബിയത്ത്",
      en: "Hajj duas Talbiyah audio",
    },
  },
  {
    id: "women",
    icon: Sparkles,
    color: "plum",
    order: 12,
    title: { en: "Women's Hajj Guide", hi: "महिलाओं के लिए हज", ur: "خواتین کے لیے حج", bn: "মহিলাদের হজ", ta: "பெண்கள் ஹஜ்", ml: "സ്ത്രീകൾക്കുള്ള ഹജ്ജ്" },
    desc: {
      en: "Menstruation rules, hair, hijab, safety",
      hi: "हैज़ के नियम, बाल, हिजाब, सुरक्षा",
      ur: "حیض کے احکام، بال، حجاب، حفاظت",
      bn: "মহিলাদের বিশেষ মাসআলা",
      ta: "பெண்கள் விதிகள்",
      ml: "സ്ത്രീകളുടെ വിധികൾ",
    },
    searchQuery: {
      hi: "महिलाओं के लिए हज गाइड हिंदी",
      ur: "خواتین کے لیے حج گائیڈ اردو",
      bn: "মহিলাদের হজ গাইড",
      ta: "பெண்கள் ஹஜ் வழிகாட்டி",
      ml: "സ്ത്രീകൾ ഹജ്ജ്",
      en: "Women Hajj guide menstruation",
    },
  },
];

const t = {
  hi: {
    title: "हज ट्रेनिंग वीडियो",
    sub: "कम पढ़े-लिखे हाजियों के लिए — देखो और सीखो",
    langLabel: "वीडियो की भाषा चुनें",
    watch: "YouTube पर देखें",
    listen: "सुनें (केवल आवाज़)",
    tip: "टिप: वीडियो YouTube पर खुलेगा। WiFi पर देखें, डेटा बचाने के लिए quality कम रखें।",
    order: "क्रम से देखें",
    badge: "हिंदी/उर्दू में उपलब्ध",
  },
  ur: {
    title: "حج ٹریننگ ویڈیوز",
    sub: "کم پڑھے حاجیوں کے لیے — دیکھیں اور سیکھیں",
    langLabel: "ویڈیو کی زبان چنیں",
    watch: "یوٹیوب پر دیکھیں",
    listen: "سنیں (صرف آواز)",
    tip: "ٹپ: ویڈیو یوٹیوب پر کھلے گا۔ WiFi پر دیکھیں، ڈیٹا بچانے کے لیے کوالٹی کم رکھیں۔",
    order: "ترتیب سے دیکھیں",
    badge: "ہندی/اردو میں دستیاب",
  },
  en: {
    title: "Hajj Training Videos",
    sub: "Simple video training for every pilgrim — watch and learn",
    langLabel: "Choose video language",
    watch: "Watch on YouTube",
    listen: "Listen (audio only)",
    tip: "Tip: Videos open in YouTube. Use WiFi and lower quality to save data.",
    order: "Watch in order",
    badge: "Available in Hindi/Urdu",
  },
  bn: {
    title: "হজ প্রশিক্ষণ ভিডিও",
    sub: "সহজ ভিডিওতে হজ শিখুন",
    langLabel: "ভিডিওর ভাষা বাছুন",
    watch: "ইউটিউবে দেখুন",
    listen: "শুনুন",
    tip: "টিপ: ভিডিও ইউটিউবে খুলবে। WiFi ব্যবহার করুন।",
    order: "ক্রমানুসারে দেখুন",
    badge: "বাংলায় উপলব্ধ",
  },
  ta: {
    title: "ஹஜ் பயிற்சி வீடியோ",
    sub: "எளிய வீடியோவில் ஹஜ் கற்றுக்கொள்ளுங்கள்",
    langLabel: "வீடியோ மொழி",
    watch: "YouTube-ல் பார்க்க",
    listen: "கேளுங்கள்",
    tip: "WiFi பயன்படுத்துங்கள்.",
    order: "வரிசையாக பாருங்கள்",
    badge: "தமிழில் கிடைக்கும்",
  },
  ml: {
    title: "ഹജ്ജ് പരിശീലന വീഡിയോകൾ",
    sub: "ലളിതമായ വീഡിയോകളിലൂടെ ഹജ്ജ്",
    langLabel: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    watch: "YouTube-ൽ കാണുക",
    listen: "കേൾക്കുക",
    tip: "WiFi ഉപയോഗിക്കുക.",
    order: "ക്രമത്തിൽ കാണുക",
    badge: "മലയാളത്തിൽ ലഭ്യം",
  },
};

const langOptions: { code: Lang; label: string; native: string }[] = [
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "en", label: "English", native: "English" },
];

const buildYouTubeUrl = (query: string, audioOnly = false) => {
  const q = audioOnly ? `${query} audio` : query;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
};

const HajjTrainingVideosPage = () => {
  const { language, isRTL } = useLanguage();
  const [videoLang, setVideoLang] = useState<Lang>(() => {
    if (language === "ur") return "ur";
    if (language === "bn") return "bn";
    if (language === "ta") return "ta";
    if (language === "ml") return "ml";
    if (language === "en") return "en";
    return "hi";
  });

  const uiLang = (t[language as keyof typeof t] ? language : "hi") as keyof typeof t;
  const ui = t[uiLang];
  const contentLang = (["hi", "ur", "bn", "ta", "ml", "en"].includes(language) ? language : "hi") as keyof Topic["title"];

  return (
    <>
      <SEO
        title="Hajj Training Videos — Learn Hajj Step by Step"
        description="Simple Hajj training videos in Hindi, Urdu, Bengali, Tamil, Malayalam and English. Curated YouTube guides on Ihram, Tawaf, Sai, Arafah, Muzdalifah, Rami, Qurbani for every pilgrim."
        path="/hajj-training-videos"
      />
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <SimpleHeader />

        <main className="container max-w-2xl mx-auto px-4 py-6 space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <IconCircle icon={VideoIcon} size="lg" variant="emerald" />
            </div>
            <h1 className="text-2xl font-bold">{ui.title}</h1>
            <p className="text-sm text-muted-foreground">{ui.sub}</p>
            <Badge variant="secondary" className="mt-1">
              <Sparkles className="w-3 h-3 mr-1" />
              {ui.badge}
            </Badge>
          </div>

          {/* Language selector */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-semibold">{ui.langLabel}</p>
              <div className="flex flex-wrap gap-2">
                {langOptions.map((l) => (
                  <Button
                    key={l.code}
                    variant={videoLang === l.code ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVideoLang(l.code)}
                    className="min-h-[44px]"
                  >
                    {l.native}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{ui.tip}</p>
            </CardContent>
          </Card>

          {/* Order hint */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
            <GraduationCap className="w-4 h-4" />
            <span>{ui.order}</span>
          </div>

          {/* Topic list */}
          <div className="space-y-3">
            {topics.map((topic) => {
              const Icon = topic.icon;
              const query = topic.searchQuery[videoLang] || topic.searchQuery.hi;
              return (
                <Card key={topic.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <IconCircle icon={Icon} size="md" variant={topic.color as any} />
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {topic.order}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-tight">
                          {topic.title[contentLang] || topic.title.en}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-snug">
                          {topic.desc[contentLang] || topic.desc.en}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="default"
                            className="min-h-[44px]"
                            onClick={() => window.open(buildYouTubeUrl(query), "_blank", "noopener,noreferrer")}
                          >
                            <Youtube className="w-4 h-4 mr-1.5" />
                            {ui.watch}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-[44px]"
                            onClick={() => window.open(buildYouTubeUrl(query, true), "_blank", "noopener,noreferrer")}
                          >
                            <Volume2 className="w-4 h-4 mr-1.5" />
                            {ui.listen}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer note */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4 flex gap-3 items-start">
              <PlayCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {uiLang === "hi" &&
                  "ये सभी वीडियो YouTube के भरोसेमंद Hajj चैनलों से खोजे जाते हैं। कोई एक वीडियो न पसंद आए तो अगला देखें।"}
                {uiLang === "ur" &&
                  "یہ تمام ویڈیوز یوٹیوب کے قابل اعتماد حج چینلز سے تلاش کیے جاتے ہیں۔"}
                {uiLang === "en" &&
                  "All videos are fetched from trusted Hajj channels on YouTube. If one video does not suit, try the next result."}
                {uiLang === "bn" && "সমস্ত ভিডিও বিশ্বস্ত হজ চ্যানেল থেকে।"}
                {uiLang === "ta" && "நம்பகமான ஹஜ் சேனல்களில் இருந்து."}
                {uiLang === "ml" && "വിശ്വസ്ത ഹജ്ജ് ചാനലുകളിൽ നിന്ന്."}
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default HajjTrainingVideosPage;
