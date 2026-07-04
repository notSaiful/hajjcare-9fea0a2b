import { useMemo, useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IconCircle } from "@/components/IconCircle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTrainingProgress } from "@/hooks/useTrainingProgress";
import { topicSummaries, topicQuizzes, type TrainingLang } from "@/data/hajjTrainingContent";
import { toast } from "@/hooks/use-toast";
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
  CheckCircle2,
  ChevronDown,
  Flame,
  Trophy,
  HelpCircle,
  X,
  RotateCcw,
} from "lucide-react";

type Lang = TrainingLang;

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
  { id: "intro", icon: Sparkles, color: "gold", order: 1,
    title: { en: "Hajj Overview", hi: "हज परिचय", ur: "حج تعارف", bn: "হজ পরিচিতি", ta: "ஹஜ் அறிமுகம்", ml: "ഹജ്ജ് ആമുഖം" },
    desc: { en: "What is Hajj — 5 days step by step", hi: "हज क्या है — 5 दिन का पूरा तरीका", ur: "حج کیا ہے — 5 دن کا مکمل طریقہ", bn: "হজ কী — ৫ দিন", ta: "ஹஜ் என்றால் என்ன", ml: "ഹജ്ജ് എന്താണ്" },
    searchQuery: { hi: "हज का पूरा तरीका हिंदी में", ur: "حج کا مکمل طریقہ اردو", bn: "হজ পালনের নিয়ম বাংলা", ta: "ஹஜ் முறை தமிழ்", ml: "ഹജ്ജ് കർമ്മം മലയാളം", en: "Complete Hajj step by step English" } },
  { id: "ihram", icon: Shirt, color: "sand", order: 2,
    title: { en: "Ihram", hi: "एहराम", ur: "احرام", bn: "ইহরাম", ta: "இஹ்ராம்", ml: "ഇഹ്റാം" },
    desc: { en: "How to wear Ihram, niyyat and rules", hi: "एहराम कैसे बांधें, नियत और नियम", ur: "احرام کیسے باندھیں", bn: "ইহরাম বাঁধার নিয়ম", ta: "இஹ்ராம் அணியும் முறை", ml: "ഇഹ്റാം ധരിക്കുന്ന രീതി" },
    searchQuery: { hi: "एहराम बांधने का तरीका हिंदी", ur: "احرام باندھنے کا طریقہ اردو", bn: "ইহরাম বাঁধার নিয়ম", ta: "இஹ்ராம் கட்டும் முறை", ml: "ഇഹ്റാം ധരിക്കുന്നത് എങ്ങനെ", en: "How to wear Ihram Hajj" } },
  { id: "tawaf", icon: Circle, color: "emerald", order: 3,
    title: { en: "Tawaf", hi: "तवाफ़", ur: "طواف", bn: "তাওয়াফ", ta: "தவாஃப்", ml: "ത്വവാഫ്" },
    desc: { en: "7 rounds of Kaaba — start, duas, end", hi: "काबा के 7 चक्कर", ur: "کعبہ کے 7 چکر", bn: "কাবার ৭ চক্কর", ta: "கஅபா 7 சுற்று", ml: "കഅ്ബ 7 പ്രദക്ഷിണം" },
    searchQuery: { hi: "तवाफ करने का तरीका हिंदी", ur: "طواف کا طریقہ اردو", bn: "তাওয়াফ করার নিয়ম", ta: "தவாஃப் செய்யும் முறை", ml: "ത്വവാഫ് എങ്ങനെ", en: "How to perform Tawaf" } },
  { id: "sai", icon: Footprints, color: "teal", order: 4,
    title: { en: "Sa'i (Safa-Marwa)", hi: "सई (सफा-मरवा)", ur: "سعی (صفا-مروہ)", bn: "সাঈ", ta: "சாஈ", ml: "സഅ്‌യ്" },
    desc: { en: "7 rounds between Safa and Marwa", hi: "सफा से मरवा 7 चक्कर", ur: "صفا اور مروہ 7 چکر", bn: "সাফা-মারওয়া", ta: "சபா-மர்வா", ml: "സഫാ-മർവാ" },
    searchQuery: { hi: "सई करने का तरीका सफा मरवा", ur: "سعی صفا مروہ کا طریقہ", bn: "সাঈ করার নিয়ম", ta: "சாஈ செய்யும் முறை", ml: "സഅ്‌യ് എങ്ങനെ", en: "How to perform Sai Safa Marwa" } },
  { id: "mina", icon: Tent, color: "sky", order: 5,
    title: { en: "Day in Mina (8)", hi: "मीना का दिन (8)", ur: "منیٰ کا دن (8)", bn: "মিনার দিন", ta: "மினா நாள்", ml: "മിനാ ദിനം" },
    desc: { en: "Reach Mina, tent life, 5 salah", hi: "मीना, तंबू, 5 नमाज़", ur: "منیٰ، خیمے، 5 نمازیں", bn: "মিনায় ৫ ওয়াক্ত", ta: "மினா தங்குதல்", ml: "മിനായിലെ താമസം" },
    searchQuery: { hi: "मीना में क्या करें हज हिंदी", ur: "منیٰ میں کیا کریں", bn: "মিনায় হজ", ta: "மினா ஹஜ்", ml: "മിന ഹജ്ജ്", en: "Day in Mina Hajj" } },
  { id: "arafah", icon: Mountain, color: "coral", order: 6,
    title: { en: "Wuquf al-Arafah (9)", hi: "अरफ़ात (9)", ur: "وقوفِ عرفہ (9)", bn: "আরাফাত (৯)", ta: "அரஃபா", ml: "അറഫാ" },
    desc: { en: "Most important day — dua & forgiveness", hi: "सबसे बड़ा दिन — दुआ", ur: "سب سے اہم دن", bn: "সবচেয়ে গুরুত্বপূর্ণ দিন", ta: "மிக முக்கிய நாள்", ml: "പ്രധാന ദിവസം" },
    searchQuery: { hi: "अरफात के दिन क्या करें हज हिंदी", ur: "عرفہ کے دن کیا کریں", bn: "আরাফাতের দিন", ta: "அரஃபா நாள்", ml: "അറഫാ ദിനം", en: "Wuquf Arafah day Hajj" } },
  { id: "muzdalifah", icon: Moon, color: "plum", order: 7,
    title: { en: "Muzdalifah Night", hi: "मुज़दलिफ़ा की रात", ur: "مزدلفہ کی رات", bn: "মুজদালিফা", ta: "முஸ்தலிஃபா", ml: "മുസ്ദലിഫ" },
    desc: { en: "Combine Maghrib+Isha, collect pebbles", hi: "मग़रिब+इशा जमा, कंकड़", ur: "مغرب+عشا، کنکریاں", bn: "মাগরিব+ইশা, নুড়ি", ta: "மக்ரிப் இஷா, கற்கள்", ml: "മഗ്‌രിബ്+ഇശാ, കല്ലുകൾ" },
    searchQuery: { hi: "मुज़दलिफा रात कंकड़ हज", ur: "مزدلفہ رات کنکریاں", bn: "মুজদালিফা রাত", ta: "முஸ்தலிஃபா ஹஜ்", ml: "മുസ്ദലിഫ ഹജ്ജ്", en: "Muzdalifah night pebbles" } },
  { id: "rami", icon: Target, color: "coral", order: 8,
    title: { en: "Rami al-Jamarat", hi: "रमी (कंकड़)", ur: "رمی جمرات", bn: "রামি জামারাত", ta: "ரமீ ஜமராத்", ml: "റമ്യ് ജമറാത്ത്" },
    desc: { en: "Stoning the pillars — method & timing", hi: "जमरात पर कंकड़ मारना", ur: "جمرات پر کنکریاں", bn: "জামারায় নুড়ি", ta: "ஜமராத் கல் எறிதல்", ml: "ജമറാത്ത് കല്ലേറ്" },
    searchQuery: { hi: "जमरात कंकड़ मारने का तरीका हिंदी", ur: "رمی جمرات کا طریقہ اردو", bn: "জামারাত রামি", ta: "ஜமராத் ரமீ", ml: "ജമറാത്ത് റമ്യ്", en: "How to perform Rami Jamarat" } },
  { id: "qurbani-halq", icon: Sword, color: "sand", order: 9,
    title: { en: "Qurbani & Halq", hi: "क़ुर्बानी और हल्क़", ur: "قربانی اور حلق", bn: "কুরবানি ও হালক", ta: "குர்பானி & ஹல்க்", ml: "ഖുർബാനി & ഹൽക്ക്" },
    desc: { en: "Sacrifice booking + head shave order", hi: "क़ुर्बानी + सिर मुंडवाना", ur: "قربانی + حلق", bn: "কুরবানি + মাথা", ta: "குர்பானி + தலை", ml: "ഖുർബാനി + മുടി" },
    searchQuery: { hi: "हज क़ुर्बानी और हल्क़ का तरीका", ur: "حج قربانی اور حلق", bn: "হজ কুরবানি হালক", ta: "ஹஜ் குர்பானி", ml: "ഹജ്ജ് ഖുർബാനി", en: "Hajj Qurbani Halq" } },
  { id: "tawaf-ifada", icon: Circle, color: "gold", order: 10,
    title: { en: "Tawaf al-Ifadah", hi: "तवाफ़-ए-इफ़ाज़ा", ur: "طوافِ افاضہ", bn: "তাওয়াফুল ইফাদা", ta: "தவாஃப் இஃபாதா", ml: "ത്വവാഫുൽ ഇഫാദ" },
    desc: { en: "Farz Tawaf after Mina", hi: "फ़र्ज़ तवाफ़", ur: "فرض طواف", bn: "ফরজ তাওয়াফ", ta: "ஃபர்ழ் தவாஃப்", ml: "ഫർള് ത്വവാഫ്" },
    searchQuery: { hi: "तवाफ ए इफाजा हज हिंदी", ur: "طواف افاضہ حج اردو", bn: "তাওয়াফুল ইফাদা", ta: "தவாஃப் இஃபாதா", ml: "ത്വവാഫുൽ ഇഫാദ", en: "Tawaf al Ifadah Hajj" } },
  { id: "duas", icon: BookOpen, color: "sage", order: 11,
    title: { en: "Important Duas", hi: "ज़रूरी दुआएं", ur: "اہم دعائیں", bn: "গুরুত্বপূর্ণ দোয়া", ta: "முக்கிய துஆ", ml: "പ്രധാന ദുആകൾ" },
    desc: { en: "Talbiyah, Multazam, Arafah duas", hi: "तल्बिया, मुल्तज़म, अरफ़ात दुआएं", ur: "تلبیہ، ملتزم، عرفہ", bn: "তালবিয়া ও দোয়া", ta: "தல்பியா, துஆ", ml: "തൽബിയത്ത്, ദുആകൾ" },
    searchQuery: { hi: "हज की दुआएं तल्बिया हिंदी", ur: "حج کی دعائیں تلبیہ", bn: "হজের দোয়া", ta: "ஹஜ் துஆ", ml: "ഹജ്ജ് ദുആ", en: "Hajj duas Talbiyah" } },
  { id: "women", icon: Sparkles, color: "plum", order: 12,
    title: { en: "Women's Hajj Guide", hi: "महिलाओं के लिए हज", ur: "خواتین کے لیے حج", bn: "মহিলাদের হজ", ta: "பெண்கள் ஹஜ்", ml: "സ്ത്രീകൾക്കുള്ള ഹജ്ജ്" },
    desc: { en: "Menstruation rules, hair, hijab, safety", hi: "हैज़, बाल, हिजाब, सुरक्षा", ur: "حیض، بال، حجاب، حفاظت", bn: "মহিলাদের বিশেষ মাসআলা", ta: "பெண்கள் விதிகள்", ml: "സ്ത്രീകളുടെ വിധികൾ" },
    searchQuery: { hi: "महिलाओं के लिए हज गाइड हिंदी", ur: "خواتین کے لیے حج گائیڈ اردو", bn: "মহিলাদের হজ গাইড", ta: "பெண்கள் ஹஜ் வழிகாட்டி", ml: "സ്ത്രീകൾ ഹജ്ജ്", en: "Women Hajj guide" } },
];

const t = {
  hi: { title: "हज ट्रेनिंग वीडियो", sub: "देखो, सुनो, समझो, याद रखो", langLabel: "भाषा चुनें", watch: "YouTube पर देखें", listen: "आवाज़ (सुनें)", playApp: "App में चलाएं", tip: "टिप: वीडियो YouTube पर खुलेगा। WiFi पर देखें।", order: "क्रम से देखें", badge: "6 भाषाओं में उपलब्ध", summary: "सारांश", quiz: "क्विज़", markDone: "पूरा हो गया", done: "पूरा", keyDua: "मुख्य दुआ", readAloud: "पढ़कर सुनाएं", stopReading: "बंद करें", progress: "प्रगति", streak: "दिन का सिलसिला", completed: "पूरे", startQuiz: "क्विज़ शुरू करें", correct: "सही!", wrong: "ग़लत", next: "अगला", finish: "ख़त्म", score: "स्कोर", resume: "जहां छोड़ा वहां से", resetAll: "सब मिटाएं", quizNote: "क्विज़ प्रश्न हिंदी/उर्दू/English में मौजूद हैं" },
  ur: { title: "حج ٹریننگ ویڈیوز", sub: "دیکھیں، سنیں، سمجھیں، یاد رکھیں", langLabel: "زبان چنیں", watch: "یوٹیوب پر", listen: "سنیں", playApp: "ایپ میں چلائیں", tip: "ٹپ: WiFi استعمال کریں۔", order: "ترتیب سے دیکھیں", badge: "6 زبانوں میں", summary: "خلاصہ", quiz: "کوئز", markDone: "مکمل ہوگیا", done: "مکمل", keyDua: "اہم دعا", readAloud: "پڑھ کر سنائیں", stopReading: "روکیں", progress: "پیش رفت", streak: "دن کا سلسلہ", completed: "مکمل", startQuiz: "کوئز شروع کریں", correct: "درست!", wrong: "غلط", next: "اگلا", finish: "ختم", score: "اسکور", resume: "جہاں چھوڑا وہاں سے", resetAll: "سب مٹائیں", quizNote: "کوئز ہندی/اردو/انگریزی میں" },
  en: { title: "Hajj Training Videos", sub: "Watch, listen, learn, remember", langLabel: "Choose language", watch: "Watch on YouTube", listen: "Listen (audio)", playApp: "Play in App", tip: "Tip: use WiFi for videos.", order: "Watch in order", badge: "Available in 6 languages", summary: "Summary", quiz: "Quiz", markDone: "Mark as done", done: "Done", keyDua: "Key Dua", readAloud: "Read aloud", stopReading: "Stop", progress: "Progress", streak: "Day streak", completed: "completed", startQuiz: "Start quiz", correct: "Correct!", wrong: "Wrong", next: "Next", finish: "Finish", score: "Score", resume: "Resume where you left off", resetAll: "Reset all", quizNote: "Quiz available in Hindi/Urdu/English" },
  bn: { title: "হজ প্রশিক্ষণ ভিডিও", sub: "দেখুন, শুনুন, শিখুন", langLabel: "ভাষা", watch: "ইউটিউবে", listen: "শুনুন", playApp: "অ্যাপে চালান", tip: "WiFi ব্যবহার করুন।", order: "ক্রমানুসারে", badge: "৬ ভাষায়", summary: "সারসংক্ষেপ", quiz: "কুইজ", markDone: "সম্পন্ন", done: "সম্পন্ন", keyDua: "মূল দোয়া", readAloud: "পড়ে শোনান", stopReading: "থামান", progress: "অগ্রগতি", streak: "দিনের ধারা", completed: "সম্পন্ন", startQuiz: "কুইজ শুরু", correct: "সঠিক!", wrong: "ভুল", next: "পরবর্তী", finish: "শেষ", score: "স্কোর", resume: "যেখানে ছিলেন", resetAll: "সব মুছুন", quizNote: "কুইজ ইংরেজিতে উপলব্ধ" },
  ta: { title: "ஹஜ் பயிற்சி வீடியோ", sub: "பாருங்கள், கேளுங்கள், கற்றுக்கொள்ளுங்கள்", langLabel: "மொழி", watch: "YouTube-ல்", listen: "கேளுங்கள்", playApp: "பயன்பாட்டில் இயக்கு", tip: "WiFi பயன்படுத்துங்கள்.", order: "வரிசையாக", badge: "6 மொழிகளில்", summary: "சுருக்கம்", quiz: "வினாடி வினா", markDone: "முடிந்தது", done: "முடிந்தது", keyDua: "முக்கிய துஆ", readAloud: "வாசிக்க", stopReading: "நிறுத்து", progress: "முன்னேற்றம்", streak: "தினசரி", completed: "முடிந்தது", startQuiz: "வினாடி வினா", correct: "சரி!", wrong: "தவறு", next: "அடுத்து", finish: "முடி", score: "மதிப்பெண்", resume: "தொடர", resetAll: "அனைத்தும் அழி", quizNote: "வினா ஆங்கிலத்தில் உள்ளன" },
  ml: { title: "ഹജ്ജ് പരിശീലനം", sub: "കാണുക, കേൾക്കുക, പഠിക്കുക", langLabel: "ഭാഷ", watch: "YouTube-ൽ", listen: "കേൾക്കുക", playApp: "ആപ്പിൽ കാണുക", tip: "WiFi ഉപയോഗിക്കുക.", order: "ക്രമത്തിൽ", badge: "6 ഭാഷകളിൽ", summary: "സംഗ്രഹം", quiz: "ക്വിസ്", markDone: "പൂർത്തിയായി", done: "പൂർത്തി", keyDua: "പ്രധാന ദുആ", readAloud: "വായിക്കുക", stopReading: "നിർത്തുക", progress: "പുരോഗതി", streak: "ദിന ശ്രേണി", completed: "പൂർത്തി", startQuiz: "ക്വിസ്", correct: "ശരി!", wrong: "തെറ്റ്", next: "അടുത്തത്", finish: "പൂർത്തിയാക്കുക", score: "സ്കോർ", resume: "തുടരുക", resetAll: "എല്ലാം മായ്ക്കുക", quizNote: "ക്വിസ് ഇംഗ്ലീഷിൽ ലഭ്യം" },
};

const langOptions: { code: Lang; label: string; native: string }[] = [
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "en", label: "English", native: "English" },
];

const langToSpeech: Record<Lang, string> = {
  hi: "hi-IN", ur: "ur-PK", bn: "bn-IN", ta: "ta-IN", ml: "ml-IN", en: "en-US",
};

const buildYouTubeSearchUrl = (query: string, audioOnly = false) => {
  const q = audioOnly ? `${query} audio` : query;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
};

// YouTube in-app embed via search-embed (uses nocookie).
// Note: listType=search is deprecated but often still returns the first playable video.
const buildYouTubeEmbedUrl = (query: string) => {
  return `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(query)}&rel=0&modestbranding=1`;
};

// ─────────────── Quiz Component ───────────────
const QuizPanel = ({ topicId, lang, uiLang, onFinish }: {
  topicId: string; lang: Lang; uiLang: keyof typeof t; onFinish: (score: number, total: number) => void;
}) => {
  const questions = topicQuizzes[topicId] ?? [];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const ui = t[uiLang];

  if (questions.length === 0) return null;
  const current = questions[idx];
  const isCorrect = selected === current.correctIndex;
  const isLast = idx === questions.length - 1;

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-6 space-y-3">
        <div className="flex justify-center">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        <p className="text-2xl font-bold">{score} / {questions.length}</p>
        <p className="text-sm text-muted-foreground">{pct}%</p>
        <Button onClick={() => onFinish(score, questions.length)} className="min-h-[44px]">{ui.finish}</Button>
      </div>
    );
  }

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === current.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) setShowResult(true);
    else {
      setIdx((n) => n + 1);
      setSelected(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{idx + 1} / {questions.length}</span>
        <span>{ui.score}: {score}</span>
      </div>
      <p className="font-semibold text-base leading-relaxed">{current.q[lang] ?? current.q.en}</p>
      <div className="space-y-2">
        {(current.options[lang] ?? current.options.en).map((opt, i) => {
          const isSel = selected === i;
          const isRight = i === current.correctIndex;
          const showState = selected !== null;
          const bg = !showState
            ? "bg-background hover:bg-accent"
            : isRight
              ? "bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
              : isSel
                ? "bg-red-50 border-red-500 text-red-900 dark:bg-red-950 dark:text-red-100"
                : "bg-background opacity-60";
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left p-3 rounded-lg border-2 min-h-[52px] transition-colors ${bg}`}
            >
              <span className="font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className={`p-3 rounded-lg text-sm ${isCorrect ? "bg-emerald-50 dark:bg-emerald-950" : "bg-amber-50 dark:bg-amber-950"}`}>
          <p className="font-semibold mb-1">{isCorrect ? `✓ ${t[uiLang].correct}` : `✗ ${t[uiLang].wrong}`}</p>
          <p className="text-muted-foreground">{current.explain[lang] ?? current.explain.en}</p>
        </div>
      )}
      {selected !== null && (
        <Button onClick={handleNext} className="w-full min-h-[48px]">
          {isLast ? ui.finish : ui.next}
        </Button>
      )}
    </div>
  );
};

// ─────────────── Main Page ───────────────
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quizOpenId, setQuizOpenId] = useState<string | null>(null);
  const [playerTopic, setPlayerTopic] = useState<Topic | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const progress = useTrainingProgress(topics.length);

  const uiLang = (t[language as keyof typeof t] ? language : "hi") as keyof typeof t;
  const ui = t[uiLang];
  const contentLang = (["hi", "ur", "bn", "ta", "ml", "en"].includes(language) ? language : "hi") as keyof Topic["title"];

  const lastTopic = useMemo(() => topics.find((tp) => tp.id === progress.lastTopic), [progress.lastTopic]);

  const speakSummary = (topicId: string) => {
    const summary = topicSummaries[topicId];
    if (!summary) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast({ title: "Not supported", description: "Voice not available on this device.", variant: "destructive" });
      return;
    }
    window.speechSynthesis.cancel();
    if (speakingId === topicId) {
      setSpeakingId(null);
      return;
    }
    const bullets = summary.bullets[videoLang] ?? summary.bullets.en;
    const dua = summary.keyDua[videoLang] ?? summary.keyDua.en;
    const text = [...bullets, dua.meaning].join(". ");
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langToSpeech[videoLang];
    utter.rate = 0.9;
    utter.onend = () => setSpeakingId(null);
    utter.onerror = () => setSpeakingId(null);
    setSpeakingId(topicId);
    window.speechSynthesis.speak(utter);
  };

  const handleExpand = (topicId: string) => {
    const nextId = expandedId === topicId ? null : topicId;
    setExpandedId(nextId);
    if (nextId) progress.markInProgress(nextId);
    if (speakingId && nextId !== speakingId) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
    }
  };

  const handleOpenPlayer = (topic: Topic) => {
    setPlayerTopic(topic);
    progress.markInProgress(topic.id);
  };

  const handleQuizFinish = (topicId: string, score: number, total: number) => {
    progress.recordQuizScore(topicId, score);
    if (score >= Math.ceil(total * 0.6)) progress.markCompleted(topicId);
    setQuizOpenId(null);
    toast({
      title: `${ui.score}: ${score}/${total}`,
      description: score >= Math.ceil(total * 0.6) ? `✓ ${ui.done}` : "Try again",
    });
  };

  const scrollToTopic = (id: string) => {
    const el = document.getElementById(`topic-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setExpandedId(id);
    }
  };

  return (
    <>
      <SEO
        title="Hajj Training Videos — Learn Step by Step with Quiz"
        description="Hajj training in 6 languages with AI summaries, key duas, quick quiz, in-app video player and progress tracking. Simple and elderly-friendly."
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

          {/* Progress + Streak */}
          <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/40 border-emerald-200 dark:border-emerald-900">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{ui.progress}</p>
                  <p className="text-lg font-bold">{progress.completed.length} / {topics.length} <span className="text-xs font-normal text-muted-foreground">{ui.completed}</span></p>
                </div>
                <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-950 px-3 py-2 rounded-full">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span className="font-bold text-orange-700 dark:text-orange-300">{progress.streak}</span>
                  <span className="text-xs text-muted-foreground ml-1">{ui.streak}</span>
                </div>
              </div>
              <Progress value={progress.progressPct} className="h-2" />
              {lastTopic && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full min-h-[44px]"
                  onClick={() => scrollToTopic(lastTopic.id)}
                >
                  <PlayCircle className="w-4 h-4 mr-1.5" />
                  {ui.resume}: {lastTopic.title[contentLang] ?? lastTopic.title.en}
                </Button>
              )}
              {progress.completed.length > 0 && (
                <button
                  onClick={progress.reset}
                  className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 mx-auto"
                >
                  <RotateCcw className="w-3 h-3" /> {ui.resetAll}
                </button>
              )}
            </CardContent>
          </Card>

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
              const isDone = progress.isCompleted(topic.id);
              const isOpen = expandedId === topic.id;
              const summary = topicSummaries[topic.id];
              const hasQuiz = (topicQuizzes[topic.id]?.length ?? 0) > 0;
              const quizScore = progress.quizScores[topic.id];

              return (
                <Card key={topic.id} id={`topic-${topic.id}`} className={`overflow-hidden ${isDone ? "border-emerald-400 dark:border-emerald-700" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <IconCircle icon={Icon} size="md" variant={topic.color as any} />
                        <span className={`absolute -top-1 -right-1 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${isDone ? "bg-emerald-600 text-white" : "bg-primary text-primary-foreground"}`}>
                          {isDone ? "✓" : topic.order}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base leading-tight">
                              {topic.title[contentLang] || topic.title.en}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 leading-snug">
                              {topic.desc[contentLang] || topic.desc.en}
                            </p>
                          </div>
                          {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                        </div>

                        {quizScore !== undefined && (
                          <Badge variant="outline" className="mt-2 text-[10px]">
                            <Trophy className="w-3 h-3 mr-1" /> {ui.score}: {quizScore}/{topicQuizzes[topic.id]?.length ?? 0}
                          </Badge>
                        )}

                        {/* Primary actions */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="default"
                            className="min-h-[44px]"
                            onClick={() => handleOpenPlayer(topic)}
                          >
                            <PlayCircle className="w-4 h-4 mr-1.5" />
                            {ui.playApp}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-[44px]"
                            onClick={() => window.open(buildYouTubeSearchUrl(query, true), "_blank", "noopener,noreferrer")}
                          >
                            <Volume2 className="w-4 h-4 mr-1.5" />
                            {ui.listen}
                          </Button>
                        </div>

                        {/* Expand for summary/quiz */}
                        {summary && (
                          <Collapsible open={isOpen} onOpenChange={() => handleExpand(topic.id)}>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-full justify-between mt-2 min-h-[44px] px-2">
                                <span className="text-sm font-medium flex items-center gap-1.5">
                                  <BookOpen className="w-4 h-4" />
                                  {ui.summary} {hasQuiz && `• ${ui.quiz}`}
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-3 space-y-3">
                              {/* Bullets */}
                              <ul className="space-y-2 text-sm">
                                {(summary.bullets[videoLang] ?? summary.bullets.en).map((b, i) => (
                                  <li key={i} className="flex gap-2 leading-relaxed">
                                    <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Key dua */}
                              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg p-3 space-y-1.5">
                                <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                                  🤲 {ui.keyDua}
                                </p>
                                <p className="text-lg font-arabic text-right leading-relaxed" dir="rtl">
                                  {(summary.keyDua[videoLang] ?? summary.keyDua.en).arabic}
                                </p>
                                {(summary.keyDua[videoLang] ?? summary.keyDua.en).translit && (
                                  <p className="text-xs italic text-muted-foreground">
                                    {(summary.keyDua[videoLang] ?? summary.keyDua.en).translit}
                                  </p>
                                )}
                                <p className="text-sm leading-relaxed">
                                  {(summary.keyDua[videoLang] ?? summary.keyDua.en).meaning}
                                </p>
                              </div>

                              {/* Action buttons */}
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="min-h-[44px]"
                                  onClick={() => speakSummary(topic.id)}
                                >
                                  <Volume2 className={`w-4 h-4 mr-1.5 ${speakingId === topic.id ? "animate-pulse text-primary" : ""}`} />
                                  {speakingId === topic.id ? ui.stopReading : ui.readAloud}
                                </Button>
                                {hasQuiz && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="min-h-[44px]"
                                    onClick={() => setQuizOpenId(topic.id)}
                                  >
                                    <HelpCircle className="w-4 h-4 mr-1.5" />
                                    {ui.startQuiz}
                                  </Button>
                                )}
                                {!isDone && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="min-h-[44px] text-emerald-700 dark:text-emerald-400"
                                    onClick={() => progress.markCompleted(topic.id)}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                    {ui.markDone}
                                  </Button>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4 flex gap-3 items-start">
              <PlayCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
                <p>{uiLang === "hi" ? "वीडियो YouTube के भरोसेमंद Hajj चैनलों से।" : uiLang === "ur" ? "ویڈیوز یوٹیوب کے قابل اعتماد چینلز سے۔" : "Videos are curated from trusted YouTube Hajj channels."}</p>
                {(uiLang === "bn" || uiLang === "ta" || uiLang === "ml") && <p>{ui.quizNote}</p>}
              </div>
            </CardContent>
          </Card>
        </main>

        {/* In-App YouTube Player */}
        <Dialog open={!!playerTopic} onOpenChange={(o) => !o && setPlayerTopic(null)}>
          <DialogContent className="max-w-3xl p-0 gap-0" dir="ltr">
            <DialogHeader className="p-4 pb-2">
              <DialogTitle className="text-base pr-8">
                {playerTopic?.title[contentLang] ?? playerTopic?.title.en}
              </DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full bg-black">
              {playerTopic && (
                <iframe
                  key={`${playerTopic.id}-${videoLang}`}
                  src={buildYouTubeEmbedUrl(playerTopic.searchQuery[videoLang] || playerTopic.searchQuery.hi)}
                  title={playerTopic.title[contentLang] ?? playerTopic.title.en}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="p-3 flex flex-wrap gap-2 justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {uiLang === "hi" ? "अगर वीडियो न चले, नीचे 'YouTube पर देखें' दबाएं" :
                 uiLang === "ur" ? "اگر ویڈیو نہ چلے تو یوٹیوب پر دیکھیں" :
                 "If video doesn't play, open on YouTube below"}
              </p>
              <div className="flex gap-2">
                {playerTopic && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(buildYouTubeSearchUrl(playerTopic.searchQuery[videoLang] || playerTopic.searchQuery.hi), "_blank", "noopener,noreferrer")}
                  >
                    <Youtube className="w-4 h-4 mr-1.5" />
                    {ui.watch}
                  </Button>
                )}
                {playerTopic && !progress.isCompleted(playerTopic.id) && (
                  <Button size="sm" onClick={() => { progress.markCompleted(playerTopic.id); setPlayerTopic(null); }}>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    {ui.markDone}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quiz Dialog */}
        <Dialog open={!!quizOpenId} onOpenChange={(o) => !o && setQuizOpenId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                {ui.quiz}: {topics.find((tp) => tp.id === quizOpenId)?.title[contentLang]}
              </DialogTitle>
            </DialogHeader>
            {quizOpenId && (
              <QuizPanel
                topicId={quizOpenId}
                lang={videoLang}
                uiLang={uiLang}
                onFinish={(score, total) => handleQuizFinish(quizOpenId, score, total)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default HajjTrainingVideosPage;
