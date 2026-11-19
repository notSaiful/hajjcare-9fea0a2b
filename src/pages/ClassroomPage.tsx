import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  buildClassroomWhatsAppUrl,
  CLASSROOM_QUIZ,
  CLASSROOM_SCRIPTURE,
  CLASSROOM_SIDE_VIDEOS,
  classroomSideEmbedSrc,
  formatQuizClock,
  formatWhatsAppDisplay,
  publishedClasses,
  quizScore,
  resolveWhatsAppDigits,
  type ClassroomClass,
  type ClassroomQuiz,
  type ClassroomSideVideo,
} from "@/data/classroom";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import {
  formatEpisodeTotal,
  INTRO_EN,
  INTRO_HI,
  planEpisode,
  quizResultMessage,
  type EpisodePlan,
} from "@/data/classroomPlan";
import { formatLongDate, formatShortDate, isDayUnlocked, istDateString, publicProgramme, unlockDateIst } from "@/data/classroomRelease.js";
import { BookOpen, Download, GraduationCap, MessageCircle } from "lucide-react";
import kaabaBanner from "@/assets/rules/kaaba.jpg";

const CLASS_FLOW = ["intro", "quran", "hadith", "dua", "arkan", "doctor", "naat", "quiz"] as const;

const FLOW_LABEL = {
  intro: { en: "Welcome & Intro", hi: "स्वागत और परिचय", ur: "خوش آمدید اور تعارف" },
  quran: { en: "Quran", hi: "क़ुरआन", ur: "قرآن" },
  hadith: { en: "Hadith", hi: "हदीस", ur: "حدیث" },
  dua: { en: "Dua", hi: "दुआ", ur: "دعا" },
  arkan: { en: "Main Hajj Lesson", hi: "मुख्य हज सबक", ur: "حج کا اصل سبق" },
  doctor: { en: "Doctor Corner", hi: "डॉक्टर कॉर्नर", ur: "ڈاکٹر کارنر" },
  naat: { en: "Naat", hi: "नात", ur: "نعت" },
  quiz: { en: "Quiz", hi: "क्विज़", ur: "کوئز" },
} as const;

function softChime() {
  const audioWindow = window as Window & { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  const Context = audioWindow.AudioContext || audioWindow.webkitAudioContext;
  if (!Context) return;
  const context = new Context();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = 523;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.04, context.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.4);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.45);
}
const QURAN_RECITATION = "https://everyayah.com/data/Alafasy_128kbps/098005.mp3";

function speakLesson(text: string, lang: string): Promise<"ended" | "blocked"> {
  return new Promise((resolve) => {
    if (!text || !("speechSynthesis" in window)) {
      resolve("blocked");
      return;
    }
    let settled = false;
    const done = (result: "ended" | "blocked") => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : lang === "ur" ? "ur-PK" : "en-US";
    utterance.rate = 0.9;
    const startedAt = performance.now();
    const watchdog = window.setTimeout(() => done("blocked"), 1500);
    utterance.onstart = () => window.clearTimeout(watchdog);
    utterance.onend = () => {
      window.clearTimeout(watchdog);
      done(performance.now() - startedAt < 3000 ? "blocked" : "ended");
    };
    utterance.onerror = () => {
      window.clearTimeout(watchdog);
      done("blocked");
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}
const MENU = [
  { href: "/", hi: "डैशबोर्ड", en: "Dashboard", ur: "ڈیش بورڈ" },
  { href: "/classroom", hi: "हज क्लासरूम (100 दिन)", en: "Hajj Classroom (100 Days Training)", ur: "حج کلاس روم" },
  { href: "/library#quran", hi: "क़ुरआन लाइब्रेरी", en: "Quran Library", ur: "قرآن لائبریری" },
  { href: "/explore#hadith", hi: "हदीस लाइब्रेरी", en: "Hadith Library", ur: "حدیث لائبریری" },
  { href: "/#duas", hi: "दुआ संग्रह", en: "Dua Collection", ur: "دعا مجموعہ" },
  { href: "/#journey", hi: "मेरा हज सफ़र", en: "My Hajj Journey", ur: "میرا حج سفر" },
] as const;

function hindiFirst(language: string) {
  return language === "hi" || language === "ur";
}

function Pair({
  hi,
  en,
  language,
  primaryClass = "",
  secondaryClass = "text-xs opacity-70",
}: {
  hi: string;
  en: string;
  language: string;
  primaryClass?: string;
  secondaryClass?: string;
}) {
  const hiLead = hindiFirst(language);
  return (
    <span className="block min-w-0">
      <span className={`block ${primaryClass}`} lang={hiLead ? "hi" : "en"}>
        {hiLead ? hi : en}
      </span>
      <span className={`block ${secondaryClass}`} lang={hiLead ? "en" : "hi"}>
        {hiLead ? en : hi}
      </span>
    </span>
  );
}

function fileDownload(url: string) {
  return /\.(mp4|pdf|pptx)(\?|$)/i.test(url);
}

function WhatsAppLink({ item, className, children }: { item: ClassroomClass; className: string; children: string }) {
  const href = buildClassroomWhatsAppUrl(item, import.meta.env.VITE_HAJCARE_WHATSAPP_NUMBER);
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </a>
  );
}

const waClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#1f7a4d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17663f]";

function DayQuiz({ quiz, language }: { quiz: ClassroomQuiz; language: string }) {
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(quiz.seconds);
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.questions.map(() => null));
  const [locked, setLocked] = useState(false);
  const allAnswered = answers.every((answer) => answer != null);

  useEffect(() => {
    if (!started || locked) return;
    if (secondsLeft <= 0) {
      setLocked(true);
      return;
    }
    const timer = window.setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [started, locked, secondsLeft]);

  useEffect(() => {
    if (started && allAnswered) setLocked(true);
  }, [started, allAnswered]);

  function choose(questionIndex: number, optionIndex: number) {
    if (!started || locked || answers[questionIndex] != null) return;
    setAnswers((current) => current.map((answer, index) => (index === questionIndex ? optionIndex : answer)));
  }

  function retry() {
    setStarted(false);
    setSecondsLeft(quiz.seconds);
    setAnswers(quiz.questions.map(() => null));
    setLocked(false);
  }

  useEffect(() => {
    if (!locked) return;
    try {
      const key = "hajcare-classroom-done";
      const current = JSON.parse(localStorage.getItem(key) || "[]") as number[];
      if (!current.includes(quiz.day)) localStorage.setItem(key, JSON.stringify([...current, quiz.day]));
    } catch {
      /* Progress stays on this page even if storage is blocked. */
    }
  }, [locked, quiz.day]);

  const score = quizScore(quiz.questions, answers);
  const result = quizResultMessage(score, quiz.questions.length);
  const resultLine = language === "ur" ? result.ur : language === "hi" ? result.hi : result.en;

  return (
    <section className="rounded-3xl border border-[#e4dcc8] bg-white px-3 py-3 sm:px-5 sm:py-4" aria-labelledby="day-quiz">
      <h2 id="day-quiz" className="text-lg font-semibold">
        <Pair
          hi={quiz.title_hi}
          en={quiz.title_en}
          language={language}
          secondaryClass="mt-1 text-sm font-medium text-[#5f6b4e]"
        />
      </h2>
      {!started ? (
        <button
          type="button"
          className={`${waClass} mt-3`}
          onClick={() => {
            setSecondsLeft(quiz.seconds);
            setStarted(true);
          }}
        >
          क्विज़ शुरू करें
        </button>
      ) : (
        <p className="mt-3 text-sm font-semibold" aria-live="polite">
          समय: {formatQuizClock(secondsLeft)}
        </p>
      )}
      {started ? (
        <ol className="mt-4 space-y-4">
          {quiz.questions.map((question, questionIndex) => {
            const picked = answers[questionIndex];
            const reveal = picked != null || locked;
            return (
              <li key={question.prompt}>
                <p className="text-sm font-semibold">
                  {questionIndex + 1}. {question.prompt}
                </p>
                {picked != null ? (
                  <p className={`mt-1 text-xs font-semibold ${picked === question.correct ? "text-[#1f7a4d]" : "text-[#9b2c2c]"}`}>
                    {picked === question.correct ? "सही" : "ग़लत"}
                  </p>
                ) : null}
                <div className="mt-2 grid gap-2">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = optionIndex === question.correct;
                    const isPick = picked === optionIndex;
                    let tone = "border-[#e4dcc8] bg-white";
                    if (reveal && isCorrect) tone = "border-[#1f7a4d] bg-[#e7f5ec]";
                    else if (reveal && isPick) tone = "border-[#9b2c2c] bg-[#fdecec]";
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`rounded-2xl border px-3 py-2 text-start text-sm disabled:cursor-default ${tone}`}
                        disabled={!started || locked || picked != null}
                        onClick={() => choose(questionIndex, optionIndex)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}
      {locked ? (
        <div className="mt-4">
          <p className="text-base font-semibold">स्कोर: {score}/10</p>
          <p className="mt-2 text-sm" data-testid="quiz-result">{resultLine}</p>
          <button type="button" className={`${waClass} mt-3`} onClick={retry}>
            दोबारा कोशिश करें
          </button>
        </div>
      ) : null}
    </section>
  );
}

function SideVideoBox({
  item,
  language,
  section,
  clock,
  review,
}: {
  item: ClassroomSideVideo;
  language: string;
  section: string;
  clock: string;
  review: boolean;
}) {
  return (
    <section
      data-section={section}
      className="overflow-hidden rounded-3xl border border-[#e4dcc8] bg-white scroll-mt-24 transition-opacity duration-500"
      aria-labelledby={`side-${item.key}`}
    >
      <h2 id={`side-${item.key}`} className="px-3 py-3 text-lg font-semibold sm:px-5 sm:py-4">
        <Pair
          hi={item.title_hi}
          en={item.title_en}
          language={language}
          secondaryClass="mt-1 text-sm font-medium text-[#5f6b4e]"
        />
      </h2>
      <p className="px-3 pb-3 text-xs font-semibold text-[#8a6a2e] sm:px-5" data-duration={section} data-video-id={item.youtube_id}>
        {clock}
        {review ? " · admin review" : ""}
      </p>
      {item.caption ? <p className="px-3 pb-3 text-sm text-[#5f6b4e] sm:px-5">{item.caption}</p> : null}
    </section>
  );
}

export default function ClassroomPage({
  playDay,
  ignoreLock = false,
  previewNote,
}: {
  playDay?: number;
  ignoreLock?: boolean;
  previewNote?: { note_en?: string; note_hi?: string };
} = {}) {
  const { language, isRTL, setLanguage } = useLanguage();
  const classes = useMemo(() => publishedClasses(), []);
  const [day, setDay] = useState(playDay ?? classes[0]?.day ?? 0);
  const selected = classes.find((item) => item.day === day) ?? (playDay ? undefined : classes[0]);
  const studySheet = selected?.materials.find((item) => !fileDownload(item.url));
  const digits = resolveWhatsAppDigits(import.meta.env.VITE_HAJCARE_WHATSAPP_NUMBER);
  const displayNumber = formatWhatsAppDisplay(digits);
  const [searchParams] = useSearchParams();
  const asOf = searchParams.get("asOf");
  const todayIst = asOf || istDateString();
  const programme = useMemo(() => publicProgramme(todayIst), [todayIst]);
  const scripture = CLASSROOM_SCRIPTURE.find((item) => item.day === selected?.day);
  const side = (key: string) => CLASSROOM_SIDE_VIDEOS.find((item) => item.key === key && item.day === selected?.day);
  const dua = side("dua");
  const arkan = side("arkan");
  const doctor = side("doctor-corner");
  const plan: EpisodePlan | null = selected && scripture && dua && arkan && doctor
    ? planEpisode({
        hadith: { youtubeId: scripture.hadith_youtube_id },
        dua: { youtubeId: dua.youtube_id, start: dua.start_seconds, end: dua.end_seconds },
        arkan: { youtubeId: arkan.youtube_id, start: arkan.start_seconds, end: arkan.end_seconds },
        doctor: { youtubeId: doctor.youtube_id, start: doctor.start_seconds, end: doctor.end_seconds },
        naat: { youtubeId: selected.youtube_id, start: selected.start_seconds, end: selected.end_seconds },
        quizSeconds: CLASSROOM_QUIZ.seconds,
      })
    : null;
  const [releasedNotes, setReleasedNotes] = useState<Record<string, { note_hi: string; note_en: string }>>({});
  const [played, setPlayed] = useState<Record<string, number>>({});

  useEffect(() => {
    const query = asOf ? `?asOf=${encodeURIComponent(asOf)}` : "";
    fetch(`/api/classroom${query}`)
      .then((response) => response.json())
      .then((payload: { releasedBodies?: Record<string, { note_hi: string; note_en: string }> }) => {
        setReleasedNotes(payload.releasedBodies ?? {});
      })
      .catch(() => setReleasedNotes({}));
  }, [asOf]);

  useEffect(() => {
    if (!selected) return;
    try {
      const raw = localStorage.getItem(`hajcare-classroom-playback:${selected.day}`);
      setPlayed(raw ? JSON.parse(raw) as Record<string, number> : {});
    } catch {
      setPlayed({});
    }
  }, [selected]);

  useEffect(() => {
    const win = window as Window & {
      YT?: { Player: new (el: HTMLIFrameElement, opts: unknown) => void };
      onYouTubeIframeAPIReady?: () => void;
    };
    const record = (key: string, seconds: number) => {
      if (!selected) return;
      setPlayed((current) => {
        const next = { ...current, [key]: Math.max(current[key] ?? 0, Math.floor(seconds)) };
        localStorage.setItem(`hajcare-classroom-playback:${selected.day}`, JSON.stringify(next));
        return next;
      });
    };
    const bind = () => {
      if (!win.YT?.Player) return;
      document.querySelectorAll<HTMLIFrameElement>("iframe[data-section]").forEach((frame) => {
        if (frame.dataset.bound === "1") return;
        frame.dataset.bound = "1";
        const key = frame.dataset.section || "";
        new win.YT.Player(frame, {
          events: {
            onStateChange: (event: { data: number; target: { getCurrentTime: () => number } }) => {
              const time = event.target.getCurrentTime();
              if (event.data === 0 || event.data === 1 || event.data === 2) record(key, time);
              const endAt = Number(frame.dataset.end || 0);
              const finished = event.data === 0 || (endAt > 0 && time >= endAt - 0.4);
              if (finished) advanceClassRef.current();
            },
          },
        });
      });
    };
    if (win.YT?.Player) {
      bind();
      return;
    }
    const previous = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      previous?.();
      bind();
    };
    if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  }, [selected]);

  const playedTotal = Object.values(played).reduce((sum, value) => sum + value, 0);
  const introSpeech = hindiFirst(language) ? INTRO_HI : INTRO_EN;
  const clockFor = (key: EpisodePlan["sections"][number]["key"]) => {
    const section = plan?.sections.find((item) => item.key === key);
    if (!section || section.seconds == null) return "अवधि जाँच बाकी";
    return formatQuizClock(section.seconds);
  };
  const dayOpen = ignoreLock || (selected ? isDayUnlocked(selected.day, todayIst) : false);
  const [doneDays, setDoneDays] = useState<number[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hajcare-classroom-done");
      setDoneDays(raw ? JSON.parse(raw) as number[] : []);
    } catch {
      setDoneDays([]);
    }
  }, []);
  const [classRun, setClassRun] = useState<{ index: number; phase: "transition" | "play" } | null>(null);
  const advanceClassRef = useRef<() => void>(() => {});
  advanceClassRef.current = () => {
    setClassRun((current) => {
      if (!current || current.phase !== "play") return current;
      const next = current.index + 1;
      if (next >= CLASS_FLOW.length) return null;
      return { index: next, phase: "transition" };
    });
  };
  useEffect(() => {
    if (!classRun || classRun.phase !== "transition") return;
    try {
      softChime();
    } catch {
      /* A blocked audio device must not stop the lesson. */
    }
    const timer = window.setTimeout(() => {
      setClassRun((current) => (current?.phase === "transition" ? { ...current, phase: "play" } : current));
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [classRun]);
  const [speechBlocked, setSpeechBlocked] = useState(false);
  useEffect(() => {
    if (!classRun || classRun.phase !== "play") return;
    const key = CLASS_FLOW[classRun.index];
    if (key !== "intro" && key !== "quran") {
      setSpeechBlocked(false);
      return;
    }
    let cancelled = false;
    let timer = 0;
    const finish = () => {
      if (!cancelled) advanceClassRef.current();
    };
    const audio = key === "quran" ? new Audio(QURAN_RECITATION) : null;
    if (key === "intro") {
      void speakLesson(introSpeech, language).then((result) => {
        if (cancelled) return;
        if (result === "ended") finish();
        else {
          setSpeechBlocked(true);
          timer = window.setTimeout(finish, 90_000);
        }
      });
    } else {
      setSpeechBlocked(false);
      timer = window.setTimeout(() => {
        audio?.pause();
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        finish();
      }, 120_000);
      const meaning = language === "hi" ? scripture?.hindi : scripture?.english;
      const speakMeaning = () => {
        if (!cancelled && meaning) void speakLesson(meaning, language === "hi" ? "hi" : "en");
      };
      if (audio) {
        audio.onended = speakMeaning;
        audio.onerror = () => {
          if (!cancelled) setSpeechBlocked(true);
          speakMeaning();
        };
        audio.play().catch(() => {
          if (!cancelled) setSpeechBlocked(true);
          speakMeaning();
        });
      }
    }
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      audio?.pause();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [classRun, introSpeech, language, scripture?.english, scripture?.hindi]);
  const [infoTab, setInfoTab] = useState<"about" | "sheet" | "takeaways" | "notes" | "downloads">("about");
  const flowKey = classRun ? CLASS_FLOW[classRun.index] : null;
  const flowLabel = flowKey ? FLOW_LABEL[flowKey] : null;
  const [pickedKey, setPickedKey] = useState("intro");
  const activeKey = classRun?.phase === "play" && flowKey ? flowKey : pickedKey;
  const mainVideo = (() => {
    if (activeKey === "hadith" && scripture) {
      return { id: scripture.hadith_youtube_id, end: "", src: `https://www.youtube-nocookie.com/embed/${scripture.hadith_youtube_id}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1` };
    }
    if (activeKey === "dua" && dua) return { id: dua.youtube_id, end: dua.end_seconds ?? "", src: classroomSideEmbedSrc(dua, { jsApi: true }) };
    if (activeKey === "arkan" && arkan) return { id: arkan.youtube_id, end: arkan.end_seconds ?? "", src: classroomSideEmbedSrc(arkan, { jsApi: true }) };
    if (activeKey === "doctor" && doctor) return { id: doctor.youtube_id, end: doctor.end_seconds ?? "", src: classroomSideEmbedSrc(doctor, { jsApi: true }) };
    if (activeKey === "naat" && selected?.youtube_id) {
      const clip = {
        youtube_id: selected.youtube_id,
        start_seconds: selected.start_seconds,
        end_seconds: selected.end_seconds,
      };
      return { id: selected.youtube_id, end: selected.end_seconds ?? "", src: classroomSideEmbedSrc(clip, { jsApi: true }) };
    }
    return null;
  })();
  useEffect(() => {
    const frame = document.querySelector<HTMLIFrameElement>("iframe[data-testid='main-iframe']");
    if (!frame || frame.dataset.bound === "1") return;
    const win = window as Window & { YT?: { Player: new (el: HTMLIFrameElement, opts: unknown) => void }; onYouTubeIframeAPIReady?: () => void };
    const attach = () => {
      if (!win.YT?.Player || frame.dataset.bound === "1") return;
      frame.dataset.bound = "1";
      new win.YT.Player(frame, {
        events: {
          onStateChange: (event: { data: number; target: { getCurrentTime: () => number } }) => {
            const time = event.target.getCurrentTime();
            const endAt = Number(frame.dataset.end || 0);
            const finished = event.data === 0 || (endAt > 0 && time >= endAt - 0.4);
            if (finished) advanceClassRef.current();
          },
        },
      });
    };
    if (win.YT?.Player) attach();
    else {
      const previous = win.onYouTubeIframeAPIReady;
      win.onYouTubeIframeAPIReady = () => {
        previous?.();
        attach();
      };
    }
  }, [activeKey, mainVideo?.id]);

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#1f4d3a]" dir={isRTL ? "rtl" : "ltr"}>
      <SEO
        title="HajCare AI Classroom"
        description="HajCare AI Classroom: recorded Hajj classes, study materials, and WhatsApp support. hajjcare.in"
        path="/classroom"
      />
      <SimpleHeader />
      {classRun?.phase === "transition" && flowLabel ? (
        <div data-testid="section-transition" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1f4d3a] text-[#f6f3ec]">
          <div className="mb-4 h-16 w-28 rounded-t-full border-4 border-[#c9a45c] border-b-0" aria-hidden />
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8a6a2e]">Next</p>
          <p className="text-2xl font-semibold">{language === "ur" ? flowLabel.ur : language === "hi" ? flowLabel.hi : flowLabel.en}</p>
        </div>
      ) : null}
      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[13.5rem_minmax(0,1fr)_18.5rem] lg:items-start">
        <nav
          aria-label={hindiFirst(language) ? "क्लासरूम मेनू" : "Classroom menu"}
          className="order-5 flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-20 lg:order-none lg:col-start-1 lg:row-span-2 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {MENU.map((item) => {
            const current = item.href === "/classroom";
            return (
              <a
                key={item.en}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`min-w-[9.5rem] shrink-0 rounded-2xl border px-3 py-2.5 lg:min-w-0 ${
                  current
                    ? "border-[#1f4d3a] bg-[#1f4d3a] text-[#f6f3ec]"
                    : "border-[#e4dcc8] bg-white text-[#1f4d3a] hover:border-[#c9a45c]"
                }`}
              >
                <Pair hi={item.hi} en={language === "ur" ? item.ur : item.en} language={language} primaryClass="text-sm font-semibold" />
              </a>
            );
          })}
          <p className="min-w-[9.5rem] shrink-0 rounded-2xl border border-dashed border-[#e4dcc8] px-3 py-2.5 text-sm text-[#8a6a2e] lg:min-w-0" aria-disabled="true">
            {language === "hi" ? "शिक्षक / हज गाइड" : language === "ur" ? "استاد / حج گائیڈ" : "Teacher / Hajj Guide"}
          </p>
          {digits ? (
            <a className="min-w-[9.5rem] shrink-0 rounded-2xl border border-[#e4dcc8] bg-white px-3 py-2.5 text-sm font-semibold lg:min-w-0" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
              {language === "hi" ? "WhatsApp पर पूछें" : language === "ur" ? "واٹس ایپ پر پوچھیں" : "Ask on WhatsApp"}
            </a>
          ) : null}
        </nav>

        <div className="order-1 min-w-0 space-y-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:space-y-4">
          <header className="rounded-3xl border border-[#e4dcc8] bg-white px-3 py-2 sm:px-5 sm:py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a6a2e]">HAJCARE AI · 100 DAYS FREE HAJJ TRAINING</p>
            <h1 className="mt-1 text-xl font-semibold sm:text-3xl">
              <Pair
                hi="100 दिन मुफ़्त हज प्रशिक्षण"
                en="100 Days Free Hajj Training Programme"
                language={language}
                primaryClass="leading-tight"
                secondaryClass="mt-1 text-sm font-medium text-[#5f6b4e]"
              />
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(["en", "hi", "ur"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  data-lang={code}
                  className={`rounded-full border px-3 py-1 text-sm ${language === code ? "border-[#1f4d3a] bg-[#1f4d3a] text-[#f6f3ec]" : "border-[#e4dcc8] bg-white"}`}
                  onClick={() => setLanguage(code)}
                >
                  {code === "en" ? "English" : code === "hi" ? "हिंदी" : "اردو"}
                </button>
              ))}
              <TextToSpeechButton text={introSpeech} size="sm" />
            </div>
            <p className="mt-2 hidden text-sm text-[#5f6b4e] sm:block">
              {hindiFirst(language)
                ? "रिकॉर्डेड कक्षा, अध्ययन सामग्री, और WhatsApp पर सवाल। लाइव कक्षा नहीं।"
                : "Recorded classes, study materials, and questions on WhatsApp. No live class."}
            </p>
          </header>
          <section data-testid="training-calendar" className="rounded-3xl border border-[#e4dcc8] bg-white p-3">
            <h2 className="text-sm font-semibold">Training Calendar · 7 Dec 2026 – 16 Mar 2027</h2>
            <ul className="mt-2 grid max-h-64 grid-cols-1 gap-1 overflow-auto sm:grid-cols-2">
              {programme.map((item) => {
                const done = doneDays.includes(item.day);
                const locked = item.status === "locked";
                const tone = done ? "bg-[#e7f5ec] text-[#1f4d3a]" : locked ? "bg-[#eceae4] text-[#6b675d]" : "bg-[#e7f5ec] text-[#1f4d3a]";
                return (
                  <li key={item.day} className={`rounded-xl px-2 py-1 text-xs ${tone}`} data-calendar-day={item.day} data-calendar-status={done ? "completed" : item.status}>
                    {done ? "✓ " : ""}Day {item.day} · {item.title_en} · {formatShortDate(item.unlocks)} · {done ? "Completed" : locked ? "Locked" : "Available"}
                  </li>
                );
              })}
            </ul>
          </section>

          {!dayOpen ? (
            <section data-testid="opens-on" className="rounded-3xl border border-[#c9a45c] bg-white p-5">
              <p className="text-lg font-semibold">
                {language === "hi"
                  ? `${formatShortDate(unlockDateIst(selected?.day ?? 1))} को खुलेगा`
                  : language === "ur"
                    ? `${formatShortDate(unlockDateIst(selected?.day ?? 1))} کو کھلے گا`
                    : `Opens on ${formatShortDate(unlockDateIst(selected?.day ?? 1))}`}
              </p>
            </section>
          ) : ignoreLock && !selected ? (
            <section data-testid="day-preview" className="rounded-3xl border border-[#e4dcc8] bg-white p-5">
              <h2 className="text-lg font-semibold">Day {day}</h2>
              <p className="mt-2 text-sm">{previewNote?.note_hi || "जल्द आएगा"}</p>
              <p className="mt-1 text-sm text-[#5f6b4e]">{previewNote?.note_en || "Coming soon"}</p>
            </section>
          ) : (
          <>
          {selected ? (
            <section className="overflow-hidden rounded-3xl border border-[#e4dcc8] bg-white" aria-label={selected.title_en}>
              <div className="bg-[#1f4d3a] px-3 py-2 text-[#f6f3ec] sm:px-5 sm:py-4">
                <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
                  <Pair
                    hi={selected.day === 1 ? "नीयत – हज एक इबादत है, सफ़र नहीं" : selected.title_hi}
                    en={selected.day === 1 ? "Niyyat – Hajj is Worship, Not a Trip" : selected.title_en}
                    language={language}
                    secondaryClass="mt-1 text-sm text-[#f6f3ec]/80"
                  />
                </h2>
                <p className="mt-2 text-sm text-[#e4cb87]" data-testid="episode-date">
                  {formatLongDate(unlockDateIst(selected.day))} ({language === "hi" ? `दिन ${selected.day} / 100` : language === "ur" ? `دن ${selected.day} / 100` : `Day ${selected.day} of 100`})
                </p>
                <button
                  type="button"
                  data-testid="start-class"
                  className={`${waClass} mt-3`}
                  onClick={() => setClassRun({ index: 0, phase: "transition" })}
                >
                  {language === "hi" ? "क्लास शुरू करें" : language === "ur" ? "کلاس شروع کریں" : "Start Class"}
                </button>
              </div>
              <div className="relative min-h-[220px] bg-[#10281f]" data-testid="main-player">
                <img src={kaabaBanner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f4d3a] via-[#1f4d3a]/50 to-[#1f4d3a]/20" />
                <div className="relative px-4 py-4 text-[#f6f3ec]">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e4cb87]">Day 1 · Niyyat</p>
                  <p className="text-lg font-semibold">Hajj is Worship, Not a Trip</p>
                  <p className="text-sm text-[#e4cb87]">नीयत – हज एक इबादत है, सफ़र नहीं</p>
                  {speechBlocked && (activeKey === "intro" || activeKey === "quran") ? (
                    <p className="mt-3 rounded-2xl bg-white/15 px-3 py-2 text-sm" data-testid="listen-prompt">
                      {language === "hi" ? "आवाज़ रुकी है। सुनें दबाएँ — यह हिस्सा अपने पूरे समय तक रहेगा।" : "Speech is blocked. Press Listen — this part stays for its full time."}
                    </p>
                  ) : null}
                </div>
                {mainVideo ? (
                  <iframe
                    key={mainVideo.id}
                    data-testid="main-iframe"
                    data-section={activeKey}
                    data-video-id={mainVideo.id}
                    data-end={mainVideo.end}
                    className="relative aspect-video w-full"
                    src={mainVideo.src}
                    title={activeKey}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : null}
              </div>

              {studySheet ? (
                <a
                  className="mx-3 mt-3 flex items-center justify-center gap-2 rounded-full bg-[#1f4d3a] px-4 py-3 text-center text-sm font-semibold text-[#f6f3ec] sm:mx-5"
                  href={studySheet.url}
                >
                  <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                  <span>
                    {hindiFirst(language) ? studySheet.label_hi : studySheet.label_en}
                    <span className="mt-0.5 block text-xs font-medium opacity-80">
                      {hindiFirst(language) ? studySheet.label_en : studySheet.label_hi}
                    </span>
                  </span>
                </a>
              ) : null}

              <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm text-[#5f6b4e]">
                  {hindiFirst(language)
                    ? "वीडियो चलाएँ। सवाल अपनी भाषा में WhatsApp पर लिखें।"
                    : "Play the recording. Write your question on WhatsApp in your own language."}
                </p>
                <WhatsAppLink item={selected} className={waClass}>
                  {hindiFirst(language) ? "WhatsApp पर पूछें" : "Ask on WhatsApp"}
                </WhatsAppLink>
              </div>
            </section>
          ) : (
            <p className="rounded-3xl border border-[#e4dcc8] bg-white p-5 text-sm">
              {hindiFirst(language) ? "अभी कोई रिकॉर्डेड कक्षा प्रकाशित नहीं है।" : "No recorded class is published yet."}
            </p>
          )}

          {plan ? (
            <>
            <div className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${plan.exceedsCap ? "border-[#9b2c2c] bg-[#fdecec] text-[#9b2c2c]" : "border-[#e4dcc8] bg-white"}`} data-testid="episode-total">
              <p>
                {language === "hi" ? "इस क्लास में" : language === "ur" ? "اس کلاس میں" : "This Class Includes"} ({language === "hi" ? "कुल अवधि" : language === "ur" ? "کل مدت" : "Total Duration"}: {formatEpisodeTotal(plan)})
                {plan.exceedsCap ? " — OVER CAP · admin review" : ""}
              </p>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1" data-testid="section-chips">
                {plan.sections.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    className="shrink-0 rounded-full border border-[#c9a45c] bg-white px-3 py-1 text-xs font-semibold text-[#1f4d3a]"
                    onClick={() => { setClassRun(null); setPickedKey(section.key); }}
                  >
                    {language === "ur" ? FLOW_LABEL[section.key].ur : language === "hi" ? FLOW_LABEL[section.key].hi : FLOW_LABEL[section.key].en}
                    {" "}
                    {section.seconds == null ? "—" : formatQuizClock(section.seconds)}
                  </button>
                ))}
              </div>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#e4dcc8]">
                <span
                  className="block h-full bg-[#1f4d3a] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((playedTotal / plan.capSeconds) * 100))}%` }}
                />
              </span>
            </div>
            <div className="rounded-3xl border border-[#e4dcc8] bg-white p-3" data-testid="class-tabs">
              <div className="flex gap-2 overflow-x-auto">
                {([
                  ["about", "About Today's Topic", "आज का विषय", "آج کا موضوع"],
                  ["sheet", "Study Sheet", "अध्ययन पत्र", "مطالعہ"],
                  ["takeaways", "Key Takeaways", "मुख्य बातें", "اہم باتیں"],
                  ["notes", "Notes", "नोट्स", "نوٹس"],
                  ["downloads", "Downloads", "डाउनलोड", "ڈاؤن لوڈ"],
                ] as const).map(([id, en, hi, ur]) => (
                  <button key={id} type="button" className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${infoTab === id ? "bg-[#1f4d3a] text-[#f6f3ec]" : "bg-[#f6f3ec]"}`} onClick={() => setInfoTab(id)}>
                    {language === "hi" ? hi : language === "ur" ? ur : en}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm">
                {infoTab === "about" ? <p>{introSpeech}</p> : null}
                {infoTab === "sheet" ? (studySheet ? <a className="font-semibold text-[#1f4d3a]" href={studySheet.url}>{hindiFirst(language) ? studySheet.label_hi : studySheet.label_en}</a> : <p>Coming soon</p>) : null}
                {infoTab === "takeaways" || infoTab === "notes" ? <p>{language === "hi" ? "जल्द आएगा" : language === "ur" ? "جلد آ رہا ہے" : "Coming soon"}</p> : null}
                {infoTab === "downloads" ? (
                  <ul>
                    {selected?.materials.map((material) => (
                      <li key={material.url}><a className="text-[#1f4d3a]" href={material.url}>{hindiFirst(language) ? material.label_hi : material.label_en}</a></li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
            </>
          ) : null}

          {selected ? (
            <section data-section="intro" className="rounded-3xl border border-[#e4dcc8] bg-white px-3 py-3 scroll-mt-24 transition-opacity duration-500 sm:px-5 sm:py-4">
              <h2 className="text-lg font-semibold">
                <Pair hi="परिचय" en="Intro" language={language} secondaryClass="mt-1 text-sm font-medium text-[#5f6b4e]" />
              </h2>
              <p className="mt-1 text-xs font-semibold text-[#8a6a2e]" data-duration="intro">{clockFor("intro")}</p>
              <p className="mt-3 text-sm leading-relaxed" lang={hindiFirst(language) ? "hi" : "en"}>{introSpeech}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#5f6b4e]" lang={hindiFirst(language) ? "en" : "hi"}>
                {hindiFirst(language) ? INTRO_EN : INTRO_HI}
              </p>
              <div className="mt-3">
                <TextToSpeechButton text={introSpeech} size="sm" />
              </div>
            </section>
          ) : null}

          {scripture ? (
            <section data-section="quran" className="rounded-3xl border border-[#e4dcc8] bg-white px-3 py-3 scroll-mt-24 transition-opacity duration-500 sm:px-5 sm:py-4">
              <h2 className="text-lg font-semibold">
                <Pair hi="क़ुरआन" en="Quran" language={language} secondaryClass="mt-1 text-sm font-medium text-[#5f6b4e]" />
              </h2>
              <p className="mt-1 text-xs font-semibold text-[#8a6a2e]" data-duration="quran">{clockFor("quran")}</p>
              <p className="mt-2 text-sm font-semibold text-[#8a6a2e]">{scripture.reference}</p>
              <p className="mt-3 text-right font-arabic text-2xl leading-loose" dir="rtl" lang="ar">{scripture.arabic}</p>
              <p className="mt-3 text-sm leading-relaxed" lang="hi">{scripture.hindi}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#5f6b4e]" lang="en">{scripture.english}</p>
            </section>
          ) : null}

          {scripture ? (
            <section data-section="hadith" className="overflow-hidden rounded-3xl border border-[#e4dcc8] bg-white scroll-mt-24 transition-opacity duration-500">
              <div className="px-3 py-3 sm:px-5 sm:py-4">
                <h2 className="text-lg font-semibold">
                  <Pair hi="हदीस" en="Hadith" language={language} secondaryClass="mt-1 text-sm font-medium text-[#5f6b4e]" />
                </h2>
                <p className="mt-1 text-xs font-semibold text-[#8a6a2e]" data-duration="hadith">{clockFor("hadith")}</p>
                <p className="mt-3 text-sm font-semibold" data-video-id={scripture.hadith_youtube_id}>{scripture.hadith_label}</p>
              </div>
            </section>
          ) : null}

          {dua ? <SideVideoBox item={dua} language={language} section="dua" clock={clockFor("dua")} review={Boolean(plan?.sections.find((item) => item.key === "dua")?.adminReview)} /> : null}
          {arkan ? <SideVideoBox item={arkan} language={language} section="arkan" clock={clockFor("arkan")} review={Boolean(plan?.sections.find((item) => item.key === "arkan")?.adminReview)} /> : null}
          {doctor ? <SideVideoBox item={doctor} language={language} section="doctor" clock={clockFor("doctor")} review={Boolean(plan?.sections.find((item) => item.key === "doctor")?.adminReview)} /> : null}

          <section data-section="naat" className="overflow-hidden rounded-3xl border border-[#e4dcc8] bg-white scroll-mt-24 transition-opacity duration-500">
            <div className="px-3 py-3 sm:px-5 sm:py-4">
              <h2 className="text-lg font-semibold">
                <Pair hi="नात" en="Naat" language={language} secondaryClass="mt-1 text-sm font-medium text-[#5f6b4e]" />
              </h2>
              <p className="mt-1 text-xs font-semibold text-[#8a6a2e]" data-duration="naat" data-video-id={selected?.youtube_id ?? ""}>
                {clockFor("naat")}
                {plan?.sections.find((item) => item.key === "naat")?.adminReview ? " · admin review" : ""}
              </p>
            </div>
          </section>

          {selected?.day === CLASSROOM_QUIZ.day ? (
            <div data-section="quiz" className="scroll-mt-24 transition-opacity duration-500">
              <p className="mb-1 text-xs font-semibold text-[#8a6a2e]" data-duration="quiz">{clockFor("quiz")}</p>
              <DayQuiz quiz={CLASSROOM_QUIZ} language={language} />
            </div>
          ) : null}

          <section data-section="end" className="rounded-3xl border border-[#e4dcc8] bg-white px-3 py-4 text-sm font-semibold sm:px-5">
            <p>TO BE CONTINUED IN THE NEXT EPISODE...</p>
            <p className="mt-2">Thank you for attending today's HajCare AI Hajj Training Session.</p>
          </section>
          </>
          )}
        </div>

        <div className="order-4 min-w-0 space-y-4 lg:col-start-2 lg:row-start-2">
          {selected && selected.materials.length > 0 ? (
            <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4 sm:p-5" aria-labelledby="class-materials">
              <h2 id="class-materials" className="flex items-center gap-2 text-lg font-semibold">
                <Download className="h-5 w-5" aria-hidden />
                <Pair hi="कक्षा सामग्री" en="Class materials" language={language} primaryClass="text-lg" />
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {selected.materials.map((material) => {
                  const download = fileDownload(material.url);
                  return (
                    <li key={material.url}>
                      <a
                        className="flex items-center justify-between gap-3 rounded-2xl border border-[#e4dcc8] px-3 py-3 hover:border-[#c9a45c]"
                        href={material.url}
                        {...(download
                          ? { download: "", target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        <Pair hi={material.label_hi} en={material.label_en} language={language} primaryClass="text-sm font-semibold" />
                        <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4 sm:p-5" aria-labelledby="recorded-classes">
            <h2 id="recorded-classes" className="text-lg font-semibold">
              <Pair hi="रिकॉर्डेड कक्षाएँ" en="Recorded classes" language={language} primaryClass="text-lg" />
            </h2>
            <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {classes.map((item) => {
                const active = item.day === selected?.day;
                const status = programme.find((entry) => entry.day === item.day)?.status ?? "current";
                return (
                  <li key={item.day} className="w-56 shrink-0">
                    <article className={`rounded-2xl border p-3 ${active ? "border-[#1f4d3a] bg-[#f3f7f2]" : "border-[#e4dcc8]"}`} data-day-status={status}>
                      <button
                        type="button"
                        className="w-full text-start"
                        onClick={() => setDay(item.day)}
                        aria-pressed={active}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#8a6a2e]">
                          {hindiFirst(language) ? `दिन ${item.day}` : `Day ${item.day}`}
                          {" · "}
                          {status === "locked"
                            ? (language === "hi" ? `बंद · ${formatShortDate(unlockDateIst(item.day))}` : language === "ur" ? `بند · ${formatShortDate(unlockDateIst(item.day))}` : `Opens on ${formatShortDate(unlockDateIst(item.day))}`)
                            : status === "completed"
                            ? (hindiFirst(language) ? "पूरा" : "Completed")
                            : status === "current"
                              ? (hindiFirst(language) ? "आज" : "Today")
                              : (hindiFirst(language) ? "खुला" : "Open")}
                        </span>
                        <span className="mt-1 block">
                          <Pair hi={item.title_hi} en={item.title_en} language={language} primaryClass="text-sm font-semibold" />
                        </span>
                      </button>
                      <WhatsAppLink item={item} className={`${waClass} mt-3 w-full`}>
                        WhatsApp
                      </WhatsAppLink>
                    </article>
                  </li>
                );
              })}
              {programme.filter((item) => !classes.some((existing) => existing.day === item.day)).map((item) => {
                const locked = item.status === "locked";
                const note = releasedNotes[String(item.day)];
                return (
                  <li key={item.day} className="w-56 shrink-0">
                    <article className="rounded-2xl border border-[#e4dcc8] p-3" data-day-status={item.status}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8a6a2e]">
                        {hindiFirst(language) ? `दिन ${item.day}` : `Day ${item.day}`}
                        {" · "}
                        {locked
                          ? (hindiFirst(language) ? `बंद · ${item.unlocks}` : `Locked · ${item.unlocks}`)
                          : (hindiFirst(language) ? "खुला" : "Open")}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{hindiFirst(language) ? item.title_hi : item.title_en}</p>
                      {note ? <p className="mt-2 text-xs text-[#5f6b4e]">{hindiFirst(language) ? note.note_hi : note.note_en}</p> : null}
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="order-3 space-y-4 lg:sticky lg:top-20 lg:col-start-3 lg:row-start-1 lg:row-span-2">
          <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4" data-testid="course-progress">
            <h2 className="text-sm font-semibold text-[#8a6a2e]">{language === "hi" ? "कोर्स प्रगति" : language === "ur" ? "کورس کی پیشرفت" : "Course Progress"}</h2>
            <p className="mt-3 text-3xl font-semibold text-[#1f4d3a]">{programme.filter((item) => item.status === "completed").length}<span className="text-base text-[#5f6b4e]">/100</span></p>
            <p className="mt-1 text-xs text-[#5f6b4e]">
              {language === "hi" ? "जारी" : language === "ur" ? "جاری" : "In progress"}: {programme.filter((item) => item.status === "current").length}
              {" · "}
              {language === "hi" ? "बाकी" : language === "ur" ? "باقی" : "Remaining"}: {programme.filter((item) => item.status === "locked").length}
            </p>
          </section>
          <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4" data-testid="next-episode">
            <h2 className="text-sm font-semibold text-[#8a6a2e]">{language === "hi" ? "अगली कड़ी" : language === "ur" ? "اگلی قسط" : "Next Episode"}</h2>
            <p className="mt-2 text-sm font-semibold">{language === "hi" ? "दिन 2 बंद" : language === "ur" ? "دن 2 بند" : "Day 2 locked"}</p>
            <p className="text-xs text-[#5f6b4e]">{language === "hi" ? `${formatShortDate(unlockDateIst(2))} को खुलेगा` : language === "ur" ? `${formatShortDate(unlockDateIst(2))} کو کھلے گا` : `Opens on ${formatShortDate(unlockDateIst(2))}`}</p>
          </section>
          <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4" data-testid="need-help">
            <h2 className="text-sm font-semibold text-[#8a6a2e]">{language === "hi" ? "मदद चाहिए" : language === "ur" ? "مدد چاہیے" : "Need Help"}</h2>
            {displayNumber ? <p className="mt-2 text-sm font-semibold">{displayNumber}</p> : null}
            {selected && digits ? (
              <a className={`${waClass} mt-3 w-full`} href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
                {language === "hi" ? "WhatsApp पर पूछें" : language === "ur" ? "واٹس ایپ" : "Ask on WhatsApp"}
              </a>
            ) : null}
          </section>
          <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4" aria-labelledby="class-teacher">
            <h2 id="class-teacher" className="text-sm font-semibold uppercase tracking-wide text-[#8a6a2e]">
              {hindiFirst(language) ? "शिक्षक" : "Teacher"}
            </h2>
            {selected?.teacher ? (
              <div className="mt-3 flex items-center gap-3">
                {selected.teacher.photo_url ? (
                  <img
                    src={selected.teacher.photo_url}
                    alt={hindiFirst(language) ? selected.teacher.name_hi : selected.teacher.name_en}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1f4d3a] text-sm font-semibold text-[#f6f3ec]" aria-hidden>
                    HC
                  </div>
                )}
                <Pair
                  hi={selected.teacher.name_hi}
                  en={selected.teacher.name_en}
                  language={language}
                  primaryClass="font-semibold"
                />
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1f4d3a] text-[#f6f3ec]" aria-hidden>
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <Pair
                    hi="HajCare AI टीम"
                    en="HajCare AI team"
                    language={language}
                    primaryClass="font-semibold"
                    secondaryClass="text-xs text-[#5f6b4e]"
                  />
                  <p className="mt-1 text-xs text-[#5f6b4e]">
                    {hindiFirst(language)
                      ? "इस कक्षा के लिए अलग शिक्षक दर्ज नहीं है।"
                      : "No separate teacher is set for this class."}
                  </p>
                </div>
              </div>
            )}
            {selected?.teacher ? (
              <p className="mt-2 text-sm text-[#5f6b4e]">
                {hindiFirst(language) ? selected.teacher.title_hi : selected.teacher.title_en}
              </p>
            ) : null}
          </section>

          <section className="rounded-3xl border border-[#e4dcc8] bg-white p-4" aria-labelledby="ask-whatsapp">
            <h2 id="ask-whatsapp" className="text-lg font-semibold">
              <Pair hi="WhatsApp पर पूछें" en="Ask on WhatsApp" language={language} primaryClass="text-lg" />
            </h2>
            <p className="mt-2 text-sm text-[#5f6b4e]">
              {hindiFirst(language)
                ? "अपनी भाषा में लिखें। टीम ख़ुद जवाब देती है।"
                : "Write in your own language. The team replies personally."}
            </p>
            {displayNumber ? (
              <p className="mt-3 text-base font-semibold">{displayNumber} (WhatsApp)</p>
            ) : null}
            {selected ? (
              <WhatsAppLink item={selected} className={`${waClass} mt-3 w-full`}>
                {hindiFirst(language) ? "इस कक्षा का सवाल भेजें" : "Send a question about this class"}
              </WhatsAppLink>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
