import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  RotateCcw,
  Hand,
  Footprints,
  Volume2,
  VolumeX,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";

type Mode = "tawaf" | "sai";

const STORAGE_KEY = "hajcare_counter_state_v2";

const T: Record<string, Record<string, string>> = {
  en: {
    title: "Tawaf & Sa'i Counter",
    subtitle: "Guided round-by-round with duas",
    tawaf: "Tawaf",
    sai: "Sa'i",
    of: "of",
    tap: "Tap when this round is done",
    completed: "All 7 rounds complete — May Allah accept",
    reset: "Reset",
    back: "Back",
    sound: "Sound",
    vibrate: "Vibrate",
    duaTitle: "Recite during this round",
    reminderTitle: "Reminder",
    nextTitle: "After completion",
    round: "Round",
    startHere: "Start here",
    moreDuas: "More Duas & Adhkar",
  },
  ur: {
    title: "طواف اور سعی کاؤنٹر",
    subtitle: "ہر چکر کی رہنمائی دعاؤں کے ساتھ",
    tawaf: "طواف",
    sai: "سعی",
    of: "از",
    tap: "چکر مکمل ہونے پر چھوئیں",
    completed: "ساتوں چکر مکمل — اللہ قبول فرمائے",
    reset: "ری سیٹ",
    back: "واپس",
    sound: "آواز",
    vibrate: "وائبریٹ",
    duaTitle: "اس چکر میں پڑھیں",
    reminderTitle: "یاد دہانی",
    nextTitle: "تکمیل کے بعد",
    round: "چکر",
    startHere: "یہاں سے شروع",
    moreDuas: "مزید دعائیں اور اذکار",
  },
  hi: {
    title: "तवाफ़ और सई काउंटर",
    subtitle: "हर चक्कर पर मार्गदर्शन और दुआएँ",
    tawaf: "तवाफ़",
    sai: "सई",
    of: "में से",
    tap: "चक्कर पूरा होने पर छुएं",
    completed: "सातों चक्कर पूरे — अल्लाह क़बूल करे",
    reset: "रीसेट",
    back: "वापस",
    sound: "ध्वनि",
    vibrate: "वाइब्रेट",
    duaTitle: "इस चक्कर में पढ़ें",
    reminderTitle: "याद दिलाना",
    nextTitle: "पूरा होने के बाद",
    round: "चक्कर",
    startHere: "यहाँ से शुरू",
    moreDuas: "और दुआएँ व अज़कार",
  },
  ar: {
    title: "عدّاد الطواف والسعي",
    subtitle: "إرشاد شوطًا بشوط مع الأدعية",
    tawaf: "طواف",
    sai: "سعي",
    of: "من",
    tap: "اضغط عند انتهاء هذا الشوط",
    completed: "تمت السبعة أشواط — تقبّل الله",
    reset: "إعادة",
    back: "رجوع",
    sound: "الصوت",
    vibrate: "اهتزاز",
    duaTitle: "اقرأ في هذا الشوط",
    reminderTitle: "تذكير",
    nextTitle: "بعد الإتمام",
    round: "شوط",
    startHere: "ابدأ من هنا",
    moreDuas: "المزيد من الأدعية والأذكار",
  },
};

type StepContent = {
  dua: { ar: string; tr: string };
  reminder: Record<string, string>;
};

const TAWAF_STEPS: StepContent[] = [
  {
    dua: {
      ar: "بِسْمِ اللّٰهِ، اللّٰهُ أَكْبَر، اللّٰهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ ﷺ",
      tr: "Bismillah, Allahu Akbar. Allahumma imanan bika wa tasdiqan bi-Kitabik...",
    },
    reminder: {
      en: "Begin at Hajr-e-Aswad. Face it, raise right hand, say 'Bismillah Allahu Akbar'. Men: do Idtibaa (right shoulder uncovered) and Ramal (brisk walk) for rounds 1–3.",
      ur: "حجرِ اسود سے شروع کریں۔ دایاں ہاتھ اٹھا کر 'بسم اللہ، اللہ اکبر' کہیں۔ مردوں کے لیے: پہلے 3 چکر اِضطباع اور رمل (تیز چال) کے ساتھ۔",
      hi: "हजरे अस्वद से शुरू करें। दायाँ हाथ उठाकर 'बिस्मिल्लाह, अल्लाहु अकबर' कहें। पुरुष: पहले 3 चक्कर इज़्तिबा और रमल (तेज़ चाल) के साथ।",
      ar: "ابدأ من الحجر الأسود. ارفع يدك اليمنى وقل 'بسم الله، الله أكبر'. للرجال: الاضطباع والرمل في الأشواط الثلاثة الأولى.",
    },
  },
  {
    dua: {
      ar: "سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰه",
      tr: "SubhanAllah, Alhamdulillah, La ilaha illallah, Allahu Akbar, La hawla wa la quwwata illa billah",
    },
    reminder: {
      en: "Continue Ramal. At Rukn-e-Yamani touch it if easy (no kiss). Between Yamani & Aswad recite the next dua.",
      ur: "رمل جاری رکھیں۔ رکنِ یمانی پر آسانی سے ہاتھ لگائیں (بوسہ نہیں)۔ یمانی اور اسود کے بیچ اگلی دعا پڑھیں۔",
      hi: "रमल जारी रखें। रुक्ने यमानी पर आसानी से हाथ लगाएं (चूमें नहीं)। यमानी और अस्वद के बीच अगली दुआ पढ़ें।",
      ar: "استمر في الرمل. المس الركن اليماني إن تيسّر دون تقبيل. بين اليماني والأسود اقرأ الدعاء التالي.",
    },
  },
  {
    dua: {
      ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّار",
      tr: "Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adhaban-nar",
    },
    reminder: {
      en: "Last round of Ramal (men). Pass Hajr-e-Aswad to complete round 3. Keep voice low and heart present.",
      ur: "مردوں کا آخری رمل والا چکر۔ حجرِ اسود سے گزر کر 3 چکر مکمل کریں۔ آواز نرم، دل حاضر۔",
      hi: "पुरुषों का अंतिम रमल वाला चक्कर। हजरे अस्वद से गुज़र कर 3 चक्कर पूरे करें। आवाज़ धीमी, दिल हाज़िर।",
      ar: "آخر شوط بالرمل للرجال. مرّ بالحجر الأسود لإتمام الشوط الثالث. اخفض صوتك واحضر بقلبك.",
    },
  },
  {
    dua: {
      ar: "اللّٰهُمَّ اغْفِرْ لِي ذُنُوبِي كُلَّهَا، دِقَّهَا وَجِلَّهَا، أَوَّلَهَا وَآخِرَهَا، عَلَانِيَتَهَا وَسِرَّهَا",
      tr: "Allahumma-ghfir li dhunubi kullaha — diqqaha wa jillaha, awwalaha wa akhiraha, 'alaniyataha wa sirraha",
    },
    reminder: {
      en: "Walk normally from round 4 onwards. Ask forgiveness — no fixed dua required, ask from your heart.",
      ur: "چوتھے چکر سے عام چال۔ معافی مانگیں — کوئی مقرر دعا نہیں، دل سے مانگیں۔",
      hi: "चौथे चक्कर से सामान्य चाल। माफ़ी माँगें — कोई निश्चित दुआ नहीं, दिल से माँगें।",
      ar: "امشِ بشكل عادي من الشوط الرابع. اطلب المغفرة — لا دعاء محدد، ادعُ من قلبك.",
    },
  },
  {
    dua: {
      ar: "اللّٰهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
      tr: "Allahumma inni as'aluka al-huda wat-tuqa wal-'afafa wal-ghina",
    },
    reminder: {
      en: "Make personal duas — for parents, family, ummah, your needs. This is a time of acceptance.",
      ur: "ذاتی دعائیں کریں — والدین، گھر والوں، امت، اپنی حاجتوں کے لیے۔ یہ قبولیت کا وقت ہے۔",
      hi: "व्यक्तिगत दुआएँ करें — माता-पिता, परिवार, उम्मत, अपनी ज़रूरतों के लिए। यह क़बूलियत का समय है।",
      ar: "ادعُ بحوائجك — للوالدين والأهل والأمة. هذا وقت إجابة.",
    },
  },
  {
    dua: {
      ar: "اللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَات",
      tr: "Allahumma inni a'udhu bika min 'adhabil-qabri, wa min fitnatil-mahya wal-mamat",
    },
    reminder: {
      en: "Seek refuge from trials and punishment. Keep eyes lowered, avoid pushing — protect fellow pilgrims.",
      ur: "آزمائشوں اور عذاب سے پناہ مانگیں۔ نظر نیچی رکھیں، دھکا نہ دیں — حجاج کا خیال رکھیں۔",
      hi: "आज़माइशों और अज़ाब से पनाह माँगें। नज़र नीची रखें, धक्का न दें — हुज्जाज का ध्यान रखें।",
      ar: "استعذ من الفتن والعذاب. اخفض بصرك، لا تدفع — احترم الحجاج.",
    },
  },
  {
    dua: {
      ar: "اللّٰهُمَّ تَقَبَّلْ مِنَّا، إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيم، وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيم",
      tr: "Allahumma taqabbal minna, innaka antas-Sami'ul-'Aleem, wa tub 'alayna innaka antat-Tawwabur-Raheem",
    },
    reminder: {
      en: "Final round. Ask Allah to accept. After 7th round: pray 2 rak'ah behind Maqam Ibrahim, then drink Zamzam.",
      ur: "آخری چکر۔ قبولیت کی دعا کریں۔ ساتویں کے بعد: مقامِ ابراہیم کے پیچھے 2 رکعت، پھر زمزم پئیں۔",
      hi: "अंतिम चक्कर। क़बूलियत की दुआ करें। 7वें के बाद: मक़ामे इब्राहीम के पीछे 2 रकात, फिर ज़मज़म पिएँ।",
      ar: "الشوط الأخير. اسأل القبول. بعد السابع: صلِّ ركعتين خلف مقام إبراهيم، ثم اشرب من زمزم.",
    },
  },
];

const SAI_STEPS: StepContent[] = [
  {
    dua: {
      ar: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللّٰه، أَبْدَأُ بِمَا بَدَأَ اللّٰهُ بِه",
      tr: "Innas-Safa wal-Marwata min sha'a'irillah. Abda'u bima bada'allahu bih",
    },
    reminder: {
      en: "At Safa: face the Kaaba, raise hands, say Takbir 3x, recite the dua, then walk toward Marwa.",
      ur: "صفا پر: کعبہ کی طرف رخ، ہاتھ اٹھائیں، 3 بار تکبیر، دعا پڑھیں، پھر مروہ کی طرف چلیں۔",
      hi: "सफ़ा पर: काबा की तरफ़ रुख़, हाथ उठाएँ, 3 बार तकबीर, दुआ पढ़ें, फिर मरवा की तरफ़ चलें।",
      ar: "على الصفا: استقبل الكعبة، ارفع يديك، كبّر ثلاثًا، ادعُ، ثم اتجه إلى المروة.",
    },
  },
  {
    dua: {
      ar: "رَبِّ اغْفِرْ وَارْحَمْ، وَأَنْتَ الْأَعَزُّ الْأَكْرَم",
      tr: "Rabbi-ghfir war-ham, wa anta al-a'azzu al-akram",
    },
    reminder: {
      en: "Between the green lights, men should jog briskly (Hervala). Women walk normally throughout.",
      ur: "سبز نشانوں کے بیچ مرد تیز چلیں (ہرولہ)۔ خواتین عام چال چلیں۔",
      hi: "हरी निशानियों के बीच पुरुष तेज़ चलें (हरवला)। महिलाएँ सामान्य चाल चलें।",
      ar: "بين العلامتين الخضراوين يهرول الرجال. النساء يمشين بشكل عادي.",
    },
  },
  {
    dua: {
      ar: "اللّٰهُمَّ اسْتَعْمِلْنِي بِسُنَّةِ نَبِيِّكَ ﷺ وَتَوَفَّنِي عَلَى مِلَّتِه",
      tr: "Allahumma-sta'milni bi-Sunnati Nabiyyika ﷺ wa tawaffani 'ala millatih",
    },
    reminder: {
      en: "At Marwa: face Kaaba, raise hands, Takbir 3x, dua. This is round 2 done. Head back toward Safa.",
      ur: "مروہ پر: کعبہ کی طرف، ہاتھ اٹھائیں، 3 تکبیر، دعا۔ یہ دوسرا چکر مکمل۔ پھر صفا کی طرف۔",
      hi: "मरवा पर: काबा की तरफ़, हाथ उठाएँ, 3 तकबीर, दुआ। यह दूसरा चक्कर पूरा। फिर सफ़ा की तरफ़।",
      ar: "على المروة: استقبل الكعبة، ارفع يديك، كبّر، ادعُ. هذا الشوط الثاني. ارجع نحو الصفا.",
    },
  },
  {
    dua: {
      ar: "اللّٰهُمَّ إِنَّكَ قُلْتَ ادْعُونِي أَسْتَجِبْ لَكُم",
      tr: "Allahumma innaka qulta 'Ud'uni astajib lakum'",
    },
    reminder: {
      en: "Walking from Marwa back to Safa. Make personal duas — Allah promised to answer.",
      ur: "مروہ سے واپس صفا کی طرف۔ ذاتی دعائیں کریں — اللہ نے قبول کرنے کا وعدہ کیا۔",
      hi: "मरवा से वापस सफ़ा की तरफ़। व्यक्तिगत दुआएँ करें — अल्लाह ने क़बूल का वादा किया है।",
      ar: "تمشي من المروة إلى الصفا. ادعُ بحوائجك — وعد الله بالإجابة.",
    },
  },
  {
    dua: {
      ar: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَان",
      tr: "Rabbana-ghfir lana wa li-ikhwanina alladhina sabaquna bil-iman",
    },
    reminder: {
      en: "Round 5. Remember those who passed before us. Stay hydrated — sip water if needed.",
      ur: "پانچواں چکر۔ گذرے ہوؤں کو یاد کریں۔ پانی پیتے رہیں۔",
      hi: "5वाँ चक्कर। पहले गुज़र चुके लोगों को याद करें। पानी पीते रहें।",
      ar: "الشوط الخامس. اذكر من سبقونا. اشرب الماء عند الحاجة.",
    },
  },
  {
    dua: {
      ar: "اللّٰهُمَّ آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
      tr: "Allahumma atina fid-dunya hasanah wa fil-akhirati hasanah",
    },
    reminder: {
      en: "Round 6. One more after this. Keep gentle pace, no rush — Sa'i has no time limit.",
      ur: "چھٹا چکر۔ ایک اور باقی۔ نرم چال، جلدی نہیں — سعی کی کوئی وقت کی حد نہیں۔",
      hi: "छठा चक्कर। एक और बाक़ी। नर्म चाल, जल्दी नहीं — सई की कोई समय सीमा नहीं।",
      ar: "الشوط السادس. بقي واحد. اهدأ — لا وقت محدد للسعي.",
    },
  },
  {
    dua: {
      ar: "اللّٰهُمَّ تَقَبَّلْ سَعْيَنَا، وَاغْفِرْ ذَنْبَنَا، وَأَصْلِحْ شَأْنَنَا كُلَّه",
      tr: "Allahumma taqabbal sa'yana, waghfir dhanbana, wa aslih sha'nana kullah",
    },
    reminder: {
      en: "Final round ends at Marwa. After Sa'i: for Umrah, men shave/trim hair; women trim a fingertip length.",
      ur: "آخری چکر مروہ پر ختم۔ سعی کے بعد: عمرہ والے مرد سر منڈوائیں یا کترائیں؛ خواتین انگلی کے پور کے برابر۔",
      hi: "अंतिम चक्कर मरवा पर ख़त्म। सई के बाद: उमरा वाले पुरुष सर मुंडवाएँ या कटवाएँ; महिलाएँ उंगली के पोर बराबर।",
      ar: "ينتهي الشوط الأخير عند المروة. بعد السعي: للعمرة يحلق الرجال أو يقصّرون؛ النساء يقصصن قدر أنملة.",
    },
  },
];

const NEXT_STEP: Record<Mode, Record<string, string>> = {
  tawaf: {
    en: "Pray 2 rak'ah behind Maqam Ibrahim. Drink Zamzam standing, facing Qibla. Then proceed to Sa'i.",
    ur: "مقامِ ابراہیم کے پیچھے 2 رکعت پڑھیں۔ کھڑے ہو کر قبلہ رو ہو کر زمزم پئیں۔ پھر سعی کے لیے جائیں۔",
    hi: "मक़ामे इब्राहीम के पीछे 2 रकात पढ़ें। खड़े होकर क़िबला रुख़ ज़मज़म पिएँ। फिर सई के लिए जाएँ।",
    ar: "صلِّ ركعتين خلف مقام إبراهيم. اشرب من زمزم قائمًا مستقبل القبلة. ثم اذهب للسعي.",
  },
  sai: {
    en: "Umrah: cut/shave hair to exit Ihram. Hajj Sa'i: stay in Ihram until Rami & Qurbani.",
    ur: "عمرہ: بال کاٹیں/منڈوائیں اور احرام کھولیں۔ حج کی سعی: رمی اور قربانی تک احرام رکھیں۔",
    hi: "उमरा: बाल कटवाएँ/मुंडवाएँ और एहराम खोलें। हज की सई: रमी और क़ुरबानी तक एहराम रखें।",
    ar: "العمرة: قصّر أو احلق ثم تحلّل. سعي الحج: ابقَ في الإحرام حتى الرمي والنحر.",
  },
};

type StoredState = { mode: Mode; count: number };

const PALETTE = {
  emerald: "#0B3D2E",
  emeraldSoft: "#0F5C44",
  gold: "#C8A951",
  goldSoft: "#E4CB87",
  ivory: "#FAF7F2",
};

const TOTAL = 7;

const TawafCounterPage = () => {
  const { language, isRTL } = useLanguage();
  const lang = (["en", "ar", "ur", "hi"].includes(language) ? language : "en") as keyof typeof T;
  const t = T[lang];

  const [state, setState] = useState<StoredState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { mode: "tawaf", count: 0 };
  });
  const [soundOn, setSoundOn] = useState(true);
  const [vibrateOn, setVibrateOn] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const isDone = state.count >= TOTAL;
  const steps = state.mode === "tawaf" ? TAWAF_STEPS : SAI_STEPS;
  const step = useMemo(() => steps[Math.min(state.count, TOTAL - 1)], [steps, state.count]);
  const upcomingRoundNumber = Math.min(state.count + 1, TOTAL);

  const playBeep = () => {
    if (!soundOn) return;
    try {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 660;
      g.gain.value = 0.08;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 140);
    } catch {}
  };

  const handleTap = () => {
    if (isDone) return;
    if (vibrateOn && "vibrate" in navigator) navigator.vibrate?.(30);
    playBeep();
    setState((s) => ({ ...s, count: Math.min(s.count + 1, TOTAL) }));
  };

  const handleReset = () => {
    if (vibrateOn && "vibrate" in navigator) navigator.vibrate?.([20, 40, 20]);
    setState((s) => ({ ...s, count: 0 }));
  };

  const setMode = (mode: Mode) => setState({ mode, count: 0 });

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: PALETTE.ivory, color: PALETTE.emerald }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3"
        style={{ background: PALETTE.emerald, color: PALETTE.ivory }}
      >
        <Link
          to="/home"
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: `${PALETTE.ivory}1A` }}
          aria-label={t.back}
        >
          <ArrowLeft className={`w-6 h-6 ${isRTL ? "rotate-180" : ""}`} />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">{t.title}</h1>
          <p className="text-xs opacity-80">{t.subtitle}</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-4">
        {/* Mode toggle */}
        <div
          className="grid grid-cols-2 p-1.5 rounded-2xl"
          style={{ background: `${PALETTE.gold}22`, border: `1px solid ${PALETTE.gold}44` }}
        >
          {(["tawaf", "sai"] as Mode[]).map((m) => {
            const active = state.mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: active ? PALETTE.emerald : "transparent",
                  color: active ? PALETTE.ivory : PALETTE.emerald,
                }}
              >
                {m === "tawaf" ? <Hand className="w-5 h-5" /> : <Footprints className="w-5 h-5" />}
                {m === "tawaf" ? t.tawaf : t.sai}
              </button>
            );
          })}
        </div>

        {/* Counter card */}
        <div
          className="relative rounded-3xl p-6 text-center select-none"
          style={{
            background: `linear-gradient(160deg, ${PALETTE.emerald} 0%, ${PALETTE.emeraldSoft} 100%)`,
            color: PALETTE.ivory,
            boxShadow: `0 12px 40px ${PALETTE.emerald}33`,
          }}
        >
          {/* Round dots */}
          <div className="flex justify-center gap-2 mb-4" dir="ltr">
            {Array.from({ length: TOTAL }).map((_, i) => {
              const filled = i < state.count;
              const current = i === state.count && !isDone;
              return (
                <div
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width: current ? 14 : 10,
                    height: current ? 14 : 10,
                    background: filled ? PALETTE.gold : current ? `${PALETTE.goldSoft}` : `${PALETTE.ivory}33`,
                    boxShadow: filled || current ? `0 0 10px ${PALETTE.gold}` : "none",
                  }}
                />
              );
            })}
          </div>

          <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
            {isDone ? t.completed : `${t.round} ${upcomingRoundNumber}`}
          </p>
          <div className="flex items-baseline justify-center gap-2 mb-4" dir="ltr">
            <span className="text-7xl font-bold tabular-nums leading-none" style={{ color: PALETTE.gold }}>
              {state.count}
            </span>
            <span className="text-2xl opacity-70">{t.of} {TOTAL}</span>
          </div>

          <button
            onClick={handleTap}
            disabled={isDone}
            className="w-full rounded-2xl py-6 text-lg font-bold transition-all active:scale-[0.98] disabled:opacity-60"
            style={{
              background: isDone ? `${PALETTE.gold}55` : PALETTE.gold,
              color: PALETTE.emerald,
              minHeight: "84px",
              boxShadow: isDone ? "none" : `0 6px 20px ${PALETTE.gold}66`,
            }}
            aria-label={t.tap}
          >
            {isDone ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> {t.completed}
              </span>
            ) : (
              t.tap
            )}
          </button>
        </div>

        {/* Reminder card (per round) */}
        {!isDone && (
          <div
            className="rounded-2xl p-4 flex gap-3"
            style={{ background: `${PALETTE.gold}1A`, border: `1px solid ${PALETTE.gold}55` }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: PALETTE.gold, color: PALETTE.emerald }}
            >
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: PALETTE.emeraldSoft }}>
                {t.reminderTitle} · {state.count === 0 ? t.startHere : `${t.round} ${upcomingRoundNumber}`}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: PALETTE.emerald }}>
                {step.reminder[lang] || step.reminder.en}
              </p>
            </div>
          </div>
        )}

        {/* Dua card */}
        {!isDone && (
          <div
            className="rounded-2xl p-5"
            style={{ background: "white", border: `1px solid ${PALETTE.gold}44` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" style={{ color: PALETTE.gold }} />
              <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: PALETTE.gold }}>
                {t.duaTitle}
              </p>
            </div>
            <p
              className="font-arabic text-2xl leading-loose text-center mb-3"
              dir="rtl"
              style={{ color: PALETTE.emerald }}
            >
              {step.dua.ar}
            </p>
            <p className="text-sm italic text-center leading-relaxed" style={{ color: `${PALETTE.emerald}AA` }}>
              {step.dua.tr}
            </p>
          </div>
        )}

        {/* Next step card — shown when complete */}
        {isDone && (
          <div
            className="rounded-2xl p-5"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.gold}25, ${PALETTE.gold}10)`,
              border: `1px solid ${PALETTE.gold}66`,
            }}
          >
            <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: PALETTE.gold }}>
              ✓ {t.nextTitle}
            </p>
            <p className="text-base leading-relaxed font-medium" style={{ color: PALETTE.emerald }}>
              {NEXT_STEP[state.mode][lang] || NEXT_STEP[state.mode].en}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => setSoundOn((v) => !v)}
            className="h-14 rounded-2xl flex flex-col items-center justify-center text-xs font-medium"
            style={{
              background: "white",
              border: `1px solid ${PALETTE.gold}44`,
              color: soundOn ? PALETTE.emerald : `${PALETTE.emerald}66`,
            }}
          >
            {soundOn ? <Volume2 className="w-5 h-5 mb-0.5" /> : <VolumeX className="w-5 h-5 mb-0.5" />}
            {t.sound}
          </button>
          <button
            onClick={() => setVibrateOn((v) => !v)}
            className="h-14 rounded-2xl flex flex-col items-center justify-center text-xs font-medium"
            style={{
              background: "white",
              border: `1px solid ${PALETTE.gold}44`,
              color: vibrateOn ? PALETTE.emerald : `${PALETTE.emerald}66`,
            }}
          >
            <span className="text-xl leading-none mb-0.5">📳</span>
            {t.vibrate}
          </button>
          <Button
            onClick={handleReset}
            className="h-14 rounded-2xl border-0"
            style={{ background: `${PALETTE.emerald}EE`, color: PALETTE.ivory }}
          >
            <RotateCcw className="w-5 h-5 mr-1" />
            {t.reset}
          </Button>
        </div>

        <Link
          to="/dua"
          className="block text-center text-sm py-3 rounded-2xl font-medium"
          style={{ background: `${PALETTE.gold}22`, color: PALETTE.emerald, border: `1px solid ${PALETTE.gold}44` }}
        >
          📖 {t.moreDuas} →
        </Link>
      </div>
    </div>
  );
};

export default TawafCounterPage;
