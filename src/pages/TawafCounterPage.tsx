import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Hand, Footprints, Volume2, VolumeX, CheckCircle2 } from "lucide-react";

type Mode = "tawaf" | "sai";

const STORAGE_KEY = "hajcare_counter_state_v1";

const T: Record<string, Record<string, string>> = {
  en: {
    title: "Tawaf & Sa'i Counter",
    subtitle: "Track each round with calm and focus",
    tawaf: "Tawaf",
    sai: "Sa'i",
    of: "of",
    tap: "Tap to count this round",
    completed: "Completed — May Allah accept your worship",
    reset: "Reset",
    back: "Back",
    sound: "Sound",
    vibrate: "Vibrate",
    duaTitle: "Recite during this round",
    startNote: "Begin at Hajr-e-Aswad. Say:",
    startTakbir: "Bismillah, Allahu Akbar",
    saiStart: "Begin at Safa, end at Marwa. 7 trips total.",
    round: "Round",
  },
  ur: {
    title: "طواف اور سعی کاؤنٹر",
    subtitle: "ہر چکر کو سکون سے گنیں",
    tawaf: "طواف",
    sai: "سعی",
    of: "از",
    tap: "اس چکر کو گننے کے لیے چھوئیں",
    completed: "مکمل — اللہ آپ کی عبادت قبول فرمائے",
    reset: "ری سیٹ",
    back: "واپس",
    sound: "آواز",
    vibrate: "وائبریٹ",
    duaTitle: "اس چکر میں پڑھیں",
    startNote: "حجرِ اسود سے شروع کریں۔ کہیں:",
    startTakbir: "بسم اللہ، اللہ اکبر",
    saiStart: "صفا سے شروع، مروہ پر ختم۔ کل ۷ چکر۔",
    round: "چکر",
  },
  hi: {
    title: "तवाफ़ और सई काउंटर",
    subtitle: "हर चक्कर को सुकून से गिनें",
    tawaf: "तवाफ़",
    sai: "सई",
    of: "में से",
    tap: "इस चक्कर को गिनने के लिए छुएं",
    completed: "पूरा — अल्लाह आपकी इबादत क़बूल करे",
    reset: "रीसेट",
    back: "वापस",
    sound: "ध्वनि",
    vibrate: "वाइब्रेट",
    duaTitle: "इस चक्कर में पढ़ें",
    startNote: "हजरे अस्वद से शुरू करें। कहें:",
    startTakbir: "बिस्मिल्लाह, अल्लाहु अकबर",
    saiStart: "सफ़ा से शुरू, मरवा पर ख़त्म। कुल 7 चक्कर।",
    round: "चक्कर",
  },
  ar: {
    title: "عدّاد الطواف والسعي",
    subtitle: "احسب كل شوط بسكينة وخشوع",
    tawaf: "طواف",
    sai: "سعي",
    of: "من",
    tap: "اضغط لاحتساب هذا الشوط",
    completed: "تمّ — تقبّل الله منكم",
    reset: "إعادة",
    back: "رجوع",
    sound: "الصوت",
    vibrate: "اهتزاز",
    duaTitle: "اقرأ في هذا الشوط",
    startNote: "ابدأ من الحجر الأسود. قل:",
    startTakbir: "بسم الله، الله أكبر",
    saiStart: "ابدأ من الصفا، انتهِ عند المروة. سبعة أشواط.",
    round: "شوط",
  },
};

// Dua snippets per round (kept short, common Sunnah duas)
const ROUND_DUAS: { ar: string; tr: string }[] = [
  { ar: "سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَر", tr: "SubhanAllah, Alhamdulillah, La ilaha illallah, Allahu Akbar" },
  { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّار", tr: "Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adhaban-nar" },
  { ar: "اللّٰهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَة", tr: "Allahumma inni as'aluka al-'afwa wal-'afiyah" },
  { ar: "اللّٰهُمَّ اغْفِرْ لِي ذُنُوبِي كُلَّهَا", tr: "Allahumma-ghfir li dhunubi kullaha" },
  { ar: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ الْأَعَزُّ الْأَكْرَم", tr: "Rabbi-ghfir wa-rham wa anta al-a'azzu al-akram" },
  { ar: "اللّٰهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا تَعْلَم", tr: "Allahumma inni as'aluka min khayri ma ta'lam" },
  { ar: "اللّٰهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيم", tr: "Allahumma taqabbal minna innaka antas-Sami'ul-'Aleem" },
];

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
  const dua = useMemo(() => ROUND_DUAS[Math.min(state.count, TOTAL - 1)], [state.count]);

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

      <div className="max-w-md mx-auto px-4 pt-5 space-y-5">
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

        {/* Intro note */}
        <div
          className="rounded-2xl p-4 text-sm leading-relaxed"
          style={{ background: "white", border: `1px solid ${PALETTE.gold}44` }}
        >
          {state.mode === "tawaf" ? (
            <>
              <p className="mb-2" style={{ color: `${PALETTE.emerald}CC` }}>{t.startNote}</p>
              <p className="font-arabic text-xl text-center" dir="rtl" style={{ color: PALETTE.emerald }}>
                بِسْمِ اللّٰهِ، اللّٰهُ أَكْبَر
              </p>
              <p className="text-center text-xs mt-1" style={{ color: `${PALETTE.emerald}99` }}>{t.startTakbir}</p>
            </>
          ) : (
            <p style={{ color: `${PALETTE.emerald}CC` }}>{t.saiStart}</p>
          )}
        </div>

        {/* Main counter card */}
        <div
          className="relative rounded-3xl p-6 text-center select-none"
          style={{
            background: `linear-gradient(160deg, ${PALETTE.emerald} 0%, ${PALETTE.emeraldSoft} 100%)`,
            color: PALETTE.ivory,
            boxShadow: `0 12px 40px ${PALETTE.emerald}33`,
          }}
        >
          {/* Round dots */}
          <div className="flex justify-center gap-2 mb-5" dir="ltr">
            {Array.from({ length: TOTAL }).map((_, i) => {
              const filled = i < state.count;
              return (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    background: filled ? PALETTE.gold : `${PALETTE.ivory}33`,
                    boxShadow: filled ? `0 0 8px ${PALETTE.gold}` : "none",
                  }}
                />
              );
            })}
          </div>

          <p className="text-sm uppercase tracking-wider opacity-80 mb-1">{t.round}</p>
          <div className="flex items-baseline justify-center gap-2 mb-1" dir="ltr">
            <span className="text-7xl font-bold tabular-nums" style={{ color: PALETTE.gold }}>
              {state.count}
            </span>
            <span className="text-2xl opacity-70">{t.of} {TOTAL}</span>
          </div>

          {/* Big tap button */}
          <button
            onClick={handleTap}
            disabled={isDone}
            className="w-full mt-5 rounded-2xl py-7 text-lg font-bold transition-all active:scale-[0.98] disabled:opacity-60"
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

        {/* Dua card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", border: `1px solid ${PALETTE.gold}44` }}
        >
          <p className="text-xs uppercase tracking-wider mb-3 font-semibold" style={{ color: PALETTE.gold }}>
            {t.duaTitle}
          </p>
          <p
            className="font-arabic text-2xl leading-loose text-center mb-3"
            dir="rtl"
            style={{ color: PALETTE.emerald }}
          >
            {dua.ar}
          </p>
          <p className="text-sm italic text-center" style={{ color: `${PALETTE.emerald}AA` }}>
            {dua.tr}
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2">
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

        {/* Link to full duas */}
        <Link
          to="/dua"
          className="block text-center text-sm py-3 rounded-2xl font-medium"
          style={{ background: `${PALETTE.gold}22`, color: PALETTE.emerald, border: `1px solid ${PALETTE.gold}44` }}
        >
          📖 More Duas & Adhkar →
        </Link>
      </div>
    </div>
  );
};

export default TawafCounterPage;
