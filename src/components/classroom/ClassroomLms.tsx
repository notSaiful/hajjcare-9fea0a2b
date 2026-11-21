import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CircleDot,
  Clock,
  Compass,
  Footprints,
  GraduationCap,
  HandHeart,
  HelpCircle,
  Landmark,
  ListChecks,
  Luggage,
  MapPin,
  Mountain,
  Music,
  Play,
  Quote,
  RefreshCw,
  RotateCw,
  Route,
  Shirt,
  Stethoscope,
  Tent,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import kaaba from "@/assets/rules/kaaba.jpg";
import { SEO } from "@/components/SEO";
import { LargeTextToggle } from "@/components/LargeTextToggle";
import { LANGUAGES, useLanguage } from "@/contexts/LanguageContext";
import { CLASSROOM_QUIZ, classroomSideEmbedSrc, quizScore } from "@/data/classroom";
import {
  CARD_LABEL,
  CARD_ORDER,
  CLASSROOM_DAYS,
  SECTION_LABEL,
  SECTION_ORDER,
  classroomDay,
  displayTopic,
  readySectionCount,
  sectionReady,
  spokenTopic,
  type ClassroomDayContent,
  type SectionKey,
  type SectionMedia,
  type TopicIcon,
} from "@/data/classroomCatalogue";
import { quizResultMessage } from "@/data/classroomPlan";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { attachmentKey, attachmentsForDay, fileObjectUrl, readAttachments } from "@/data/classroomAttachments";
import { SectionAttach } from "@/components/classroom/SectionAttach";

const DONE_KEY = "hajcare-classroom-preview-done";
const EDIT_KEY = "hajcare-classroom-preview-edit";

const TOPIC_ICON: Record<TopicIcon, typeof Compass> = {
  niyyat: Compass,
  ihram: Shirt,
  miqat: MapPin,
  pillar: Landmark,
  reward: Award,
  dhulhijjah: CalendarDays,
  rites: ListChecks,
  tawaf: RotateCw,
  sai: Footprints,
  umrah: Route,
  mina: Tent,
  arafat: Mountain,
  muzdalifah: Landmark,
  jamarat: CircleDot,
  wida: Route,
  madinah: Building2,
  character: HandHeart,
  revision: RefreshCw,
  departure: Luggage,
};

const SECTION_ICON: Record<SectionKey, typeof BookOpen> = {
  quran: BookOpen,
  hadith: Quote,
  dua: HandHeart,
  lesson: GraduationCap,
  doctor: Stethoscope,
  expert: Users,
  naat: Music,
  quiz: HelpCircle,
};

function useClassroomFonts() {
  useEffect(() => {
    const id = "classroom-lms-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function readDone(): number[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(DONE_KEY) || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((item) => Number.isInteger(item)) : [];
  } catch {
    return [];
  }
}

function useDoneDays() {
  const [done, setDone] = useState<number[]>(() => (typeof window === "undefined" ? [] : readDone()));
  function toggle(day: number) {
    setDone((current) => {
      const next = current.includes(day) ? current.filter((item) => item !== day) : [...current, day];
      localStorage.setItem(DONE_KEY, JSON.stringify(next));
      return next;
    });
  }
  return { done, toggle };
}

function Shell({ children }: { children: React.ReactNode }) {
  useClassroomFonts();
  return (
    <div className="classroom-lms min-h-screen">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-[#0a2e24] px-4 py-3 text-[#f7f1e4]">
        <Link to="/classroom" className="min-w-0 text-base font-semibold leading-tight sm:text-lg">
          HajCare AI Classroom
        </Link>
        <LargeTextToggle className="text-[#e4cb87] hover:bg-white/10" />
      </header>
      <p className="px-4 pt-3 text-right text-[11px] font-semibold tracking-[0.18em] text-[#e4cb87]">PREVIEW · NOT LIVE</p>
      <div className="mx-auto w-full max-w-md px-3 pb-16">{children}</div>
    </div>
  );
}

function LanguageAndListen({ day }: { day: ClassroomDayContent }) {
  const { language, setLanguage } = useLanguage();
  const { speak, isSpeaking } = useTextToSpeech();
  const script = spokenTopic(day, language);
  const languageName = LANGUAGES.find((item) => item.code === language)?.nativeName || language;
  return (
    <div className="mt-4 rounded-3xl border border-[#e6d3a1] bg-white p-3">
      <label className="block text-base font-semibold text-[#1b4a38]" htmlFor={`zaban-${day.day}`}>
        Zaban
        <select
          id={`zaban-${day.day}`}
          className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] bg-[#fbf6ea] px-3 text-base"
          value={language}
          onChange={(event) => setLanguage(event.target.value as typeof language)}
        >
          {LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.nativeName}
            </option>
          ))}
        </select>
      </label>
      {script ? (
        <button
          type="button"
          className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#1a4d3c] px-3 py-3 text-left text-[#f7f1e4]"
          onClick={() => speak(script)}
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e4cb87] text-[#1a4d3c]">
            {isSpeaking ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
          </span>
          <span>
            <span className="block text-lg font-semibold">{isSpeaking ? "Rukien" : "Sunnein"}</span>
            <span className="block text-sm text-[#f3e6c4]">{day.short} · {languageName} · device voice. Recording is not on file.</span>
          </span>
        </button>
      ) : (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-[#d9d0c0] bg-[#f6f1e6] px-3 py-3 text-[#6d6456]" role="status">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#d9d0c0] bg-white">
            <Volume2 className="h-7 w-7" aria-hidden />
          </span>
          <span>
            <span className="block text-base font-semibold text-[#1b4a38]">Awaaz jald dastiyab hogi</span>
            <span className="block text-sm">Is zaban mein koi recording nahi hai. Koi awaaz nahi chalegi.</span>
          </span>
        </div>
      )}
    </div>
  );
}

function KaabaMark() {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16" aria-hidden>
      <polygon points="18,30 46,30 46,64 18,64" fill="#0e0e0e" />
      <polygon points="46,30 64,22 64,56 46,64" fill="#242424" />
      <polygon points="18,30 36,22 64,22 46,30" fill="#3a3a3a" />
      <polygon points="18,40 46,40 46,47 18,47" fill="#c4a15a" />
      <polygon points="46,40 64,32 64,39 46,47" fill="#a6853f" />
      <rect x="29" y="49" width="7" height="10" fill="#c4a15a" />
    </svg>
  );
}

function TopicMark({ day, className = "h-14 w-14" }: { day: ClassroomDayContent; className?: string }) {
  const Icon = TOPIC_ICON[day.icon];
  return (
    <span className={`flex items-center justify-center rounded-full bg-[#1a4d3c] text-[#f7f1e4] ${className}`}>
      <Icon className="h-7 w-7" aria-hidden />
    </span>
  );
}

function statusLabel(day: ClassroomDayContent, complete: boolean, attached: boolean) {
  if (complete) return "Mukammal";
  if (attached || readySectionCount(day) > 0) return "Khula hua";
  return "Jald dastiyab hoga";
}

function useAttachmentRevision() {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener("hajcare-attachments", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("hajcare-attachments", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return revision;
}

export function ClassroomDashboardPage() {
  const { done } = useDoneDays();
  const { language } = useLanguage();
  const navigate = useNavigate();
  useAttachmentRevision();
  const attachedDays = new Set(CLASSROOM_DAYS.filter((day) => attachmentsForDay(day.day).length > 0).map((day) => day.day));
  const [jump, setJump] = useState("1");
  const finished = CLASSROOM_DAYS.filter((day) => done.includes(day.day)).length;
  return (
    <Shell>
      <SEO title="HajCare AI Classroom" description="100 Days Hajj Training. Free recorded classes." path="/classroom" />
      <div data-screen="dashboard">
        <p className="text-center text-[11px] font-semibold tracking-[0.18em] text-[#e4cb87]">100 DAYS HAJJ TRAINING</p>
        <h1 className="lms-serif mt-1 text-center text-4xl text-[#f7f1e4]">HajCare AI Classroom</h1>
        <p className="mt-2 text-center text-base text-[#f3e6c4]">Muft. Login zaroori nahi. Har din ka card alag mauzoo dikhata hai.</p>
        <p className="mt-3 text-center text-sm font-semibold text-[#e4cb87]">{finished} / 100 mukammal</p>
        <LanguageAndListen day={CLASSROOM_DAYS[0]} />
        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const day = Number(jump);
            if (day >= 1 && day <= 100) navigate(`/classroom/day/${day}`);
          }}
        >
          <label className="min-w-0 flex-1 text-sm font-semibold text-[#f7f1e4]">
            Din number
            <input
              inputMode="numeric"
              className="mt-1 h-12 w-full rounded-2xl border border-[#e4cb87] bg-[#f7f1e4] px-3 text-lg text-[#1b4a38]"
              value={jump}
              onChange={(event) => setJump(event.target.value)}
            />
          </label>
          <button type="submit" className="mt-6 h-12 rounded-2xl bg-[#e4cb87] px-4 text-base font-semibold text-[#1a4d3c]">
            Kholen
          </button>
        </form>
        <Link
          to="/classroom/day/1/card"
          className="mt-4 flex h-12 items-center justify-center rounded-2xl border border-[#e4cb87] text-base font-semibold text-[#f7f1e4]"
        >
          Day 1 Niyyat card
        </Link>
        <ol className="mt-5 space-y-3">
          {CLASSROOM_DAYS.map((day) => {
            const complete = done.includes(day.day);
            const attached = attachedDays.has(day.day);
            const ready = attached || readySectionCount(day) > 0;
            const topic = displayTopic(day, language);
            const label = `Day ${day.day} ${day.short}. ${topic}. ${statusLabel(day, complete, attached)}`;
            return (
              <li key={day.day}>
                <Link
                  to={`/classroom/day/${day.day}`}
                  data-day-card={day.day}
                  data-topic={day.title_hi}
                  aria-label={label}
                  className="flex items-center gap-3 rounded-3xl border border-[#e6d3a1] bg-[#f7f1e4] px-3 py-3 shadow-sm"
                >
                  <span className="flex w-16 shrink-0 flex-col items-center">
                    <span className="text-xs font-bold tracking-[0.12em] text-[#8d6b2f]">DAY</span>
                    <span className="text-xl font-bold leading-none text-[#1b4a38]">{String(day.day).padStart(2, "0")}</span>
                    <TopicMark day={day} className="mt-1 h-12 w-12" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold leading-snug text-[#8d6b2f]">{day.block_hi}</span>
                    <span className="lms-serif block text-2xl leading-tight text-[#1b4a38]">{day.short}</span>
                    <span className="mt-0.5 block text-base leading-snug text-[#1b4a38]">{day.title_hi}</span>
                    <span className="mt-1 block text-sm font-semibold text-[#6d6456]">{statusLabel(day, complete, attached)}</span>
                  </span>
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${ready || complete ? "bg-[#1a4d3c] text-[#f7f1e4]" : "bg-[#efe7d6] text-[#8d6b2f]"}`}
                    aria-hidden
                  >
                    {complete ? <Check className="h-6 w-6" /> : ready ? <Play className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </Shell>
  );
}

function PremiumCard({ day }: { day: ClassroomDayContent }) {
  const { language } = useLanguage();
  const topic = displayTopic(day, language);
  return (
    <article data-screen="day-card" data-day={day.day} className="rounded-[28px] border border-[#e6d3a1] bg-[#f7f1e4] px-4 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <p className="text-center text-[11px] font-semibold tracking-[0.16em] text-[#8d6b2f]">HAJCARE AI CLASSROOM · 100 DAYS</p>
      <p className="mt-4 text-center text-xs font-semibold tracking-[0.16em] text-[#1b4a38]">DAY {String(day.day).padStart(2, "0")} / 100</p>
      <p className="mt-1 text-center text-sm font-semibold text-[#8d6b2f]">{day.block_hi}</p>
      <h1 className="lms-serif mt-1 text-center text-5xl text-[#1b4a38]">{day.short}</h1>
      {day.arabic ? (
        <p className="text-center font-arabic text-2xl text-[#c4a15a]" dir="rtl" lang="ar">
          {day.arabic}
        </p>
      ) : null}
      <div className="mx-auto mt-4 flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#e4cb87] bg-[#143d30]">
        <KaabaMark />
      </div>
      <p className="mt-4 text-center text-[11px] font-semibold tracking-[0.16em] text-[#8d6b2f]">ROZ KA MAUZOO</p>
      <p className="lms-serif text-center text-3xl text-[#1b4a38]">{day.short}</p>
      <p className="mt-1 text-center text-base leading-snug text-[#1b4a38]">{day.title_hi}</p>
      {language !== "hi" ? <p className="mt-1 text-center text-sm text-[#5f6b4e]">{topic}</p> : null}
      <div className="mx-auto mt-3 h-2 w-2 rotate-45 bg-[#c4a15a]" aria-hidden />
      <p className="mt-3 text-center text-base">Konsi video dekhni hai?</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {CARD_ORDER.slice(0, 4).map((key) => (
          <CardButton key={key} day={day} section={key} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-[1.3fr_1fr] gap-2">
        <CardButton day={day} section="lesson" primary />
        <CardButton day={day} section="quiz" />
      </div>
      <div className="mt-2">
        <CardButton day={day} section="naat" wide />
      </div>
      <LanguageAndListen day={day} />
      <p className="mt-3 text-center text-xs leading-relaxed text-[#6d6456]">
        Har button us din ki usi qism ki video kholta hai. Link na ho to “Jald dastiyab hoga”.
      </p>
    </article>
  );
}

function CardButton({
  day,
  section,
  primary = false,
  wide = false,
}: {
  day: ClassroomDayContent;
  section: SectionKey;
  primary?: boolean;
  wide?: boolean;
}) {
  const media = day.sections[section];
  const ready = sectionReady(media);
  const Icon = SECTION_ICON[section];
  const className = `flex min-h-14 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-base font-semibold ${
    wide ? "w-full" : ""
  } ${
    ready
      ? primary
        ? "bg-[#1a4d3c] text-[#f7f1e4]"
        : "border border-[#e7dcc4] bg-white text-[#1b4a38]"
      : "border border-dashed border-[#d9d0c0] bg-[#f3ecdc] text-[#8a8172]"
  }`;
  const inner = (
    <>
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span>{CARD_LABEL[section]}</span>
      {!ready ? <span className="text-xs font-medium">Jald dastiyab hoga</span> : null}
    </>
  );
  if (!ready) {
    return (
      <div className={className} aria-disabled="true">
        {inner}
      </div>
    );
  }
  return (
    <Link to={`/classroom/day/${day.day}#${section}`} className={className}>
      {inner}
    </Link>
  );
}

export function ClassroomDayCardPage() {
  const params = useParams();
  const day = classroomDay(Number(params.dayNumber));
  if (!day) {
    return (
      <Shell>
        <p className="text-[#f7f1e4]">Ye din maujood nahi.</p>
      </Shell>
    );
  }
  return (
    <Shell>
      <SEO title={`HajCare AI Classroom · Day ${day.day}`} description={day.title_en} path={`/classroom/day/${day.day}/card`} />
      <Link to="/classroom" className="mb-3 inline-flex h-11 items-center text-base font-semibold text-[#f7f1e4]">
        ← Back to 100 Days Classroom
      </Link>
      <PremiumCard day={day} />
    </Shell>
  );
}

function MediaBlock({ media, day, browserOnly }: { media: SectionMedia; day: number; browserOnly?: boolean }) {
  if (media.kind === "youtube" && media.youtubeId) {
    const src = classroomSideEmbedSrc({
      youtube_id: media.youtubeId,
      start_seconds: media.startSeconds,
      end_seconds: media.endSeconds,
    });
    return (
      <div className="mt-3">
        <iframe
          title={media.citation}
          className="aspect-video w-full rounded-2xl bg-black"
          src={src}
          allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
        <p className="mt-2 text-sm leading-snug text-[#1b4a38]">
          <span className="font-semibold">Video title: </span>
          {media.citation}
        </p>
        {browserOnly ? <p className="mt-1 text-sm font-semibold text-[#8d6b2f]">Preview: sirf is browser mein save</p> : null}
      </div>
    );
  }
  if (media.kind === "file" && media.fileSrc) {
    return (
      <div className="mt-3">
        <video className="w-full rounded-2xl bg-black" controls playsInline src={media.fileSrc}>
          <track kind="captions" />
        </video>
        {browserOnly ? <p className="mt-1 text-sm font-semibold text-[#8d6b2f]">Preview: sirf is browser mein save</p> : null}
      </div>
    );
  }
  if (media.kind === "quiz" && day === CLASSROOM_QUIZ.day) return <DayQuiz />;
  return null;
}

function DayQuiz() {
  const { language } = useLanguage();
  const [answers, setAnswers] = useState<(number | null)[]>(() => CLASSROOM_QUIZ.questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const score = quizScore(CLASSROOM_QUIZ.questions, answers);
  const message = quizResultMessage(score, CLASSROOM_QUIZ.questions.length);
  const line = language === "ur" ? message.ur : language === "en" ? message.en : message.hi;
  return (
    <form
      className="mt-3 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {CLASSROOM_QUIZ.questions.map((question, index) => (
        <fieldset key={question.prompt} className="rounded-2xl border border-[#e7dcc4] bg-white p-3">
          <legend className="px-1 text-base font-semibold">
            {index + 1}. {question.prompt}
          </legend>
          <div className="mt-2 space-y-2">
            {question.options.map((option, optionIndex) => (
              <label key={option} className="flex min-h-12 items-center gap-3 rounded-xl bg-[#f7f1e4] px-3 py-2 text-base">
                <input
                  type="radio"
                  name={`q-${index}`}
                  className="h-5 w-5"
                  checked={answers[index] === optionIndex}
                  onChange={() => {
                    setAnswers((current) => current.map((value, item) => (item === index ? optionIndex : value)));
                    setSubmitted(false);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <button type="submit" className="h-12 w-full rounded-2xl bg-[#1a4d3c] text-base font-semibold text-[#f7f1e4]">
        Jawab dekhein
      </button>
      {submitted ? (
        <p className="rounded-2xl bg-[#1a4d3c] px-4 py-3 text-base text-[#f7f1e4]" role="status">
          {score} / {CLASSROOM_QUIZ.questions.length}. {line}
        </p>
      ) : null}
    </form>
  );
}

function useEditMode() {
  const [edit, setEdit] = useState(() => (typeof window === "undefined" ? false : localStorage.getItem(EDIT_KEY) === "1"));
  function set(next: boolean) {
    localStorage.setItem(EDIT_KEY, next ? "1" : "0");
    setEdit(next);
  }
  return { edit, set };
}

function playingMedia(catalogue: SectionMedia | null, extra: ReturnType<typeof readAttachments>[string] | undefined, fileSrc: string | undefined): { media: SectionMedia | null; browserOnly: boolean } {
  if (extra?.kind === "youtube" && extra.youtubeId) {
    return {
      browserOnly: true,
      media: {
        kind: "youtube",
        youtubeId: extra.youtubeId,
        durationLabel: extra.duration ?? null,
        language: extra.language ?? null,
        citation: extra.title || "Is browser ki video",
      },
    };
  }
  if (extra?.kind === "file" && fileSrc) {
    return {
      browserOnly: true,
      media: {
        kind: "file",
        fileSrc,
        durationLabel: extra.duration ?? null,
        language: extra.language ?? null,
        citation: extra.title || extra.fileName || "Is browser ki video",
      },
    };
  }
  return { browserOnly: false, media: catalogue };
}

export function ClassroomDayPage() {
  const params = useParams();
  const navigate = useNavigate();
  const dayNumber = Number(params.dayNumber);
  const day = classroomDay(dayNumber);
  const { language } = useLanguage();
  const { done, toggle } = useDoneDays();
  const { edit, set: setEdit } = useEditMode();
  useAttachmentRevision();
  const attached = readAttachments();
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<SectionKey | null>(null);
  const ready = day
    ? SECTION_ORDER.filter((key) => Boolean(attached[attachmentKey(day.day, key)]) || sectionReady(day.sections[key])).length
    : 0;
  const complete = day ? done.includes(day.day) : false;

  useEffect(() => {
    const key = window.location.hash.replace("#", "") as SectionKey;
    if (!day) return;
    const hasAttachment = Boolean(readAttachments()[attachmentKey(day.day, key)]);
    if (SECTION_ORDER.includes(key) && (hasAttachment || sectionReady(day.sections[key]))) {
      setOpen(key);
      document.getElementById(`section-${key}`)?.scrollIntoView({ block: "start" });
    }
  }, [day]);

  useEffect(() => {
    if (!day || !open) return;
    const key = attachmentKey(day.day, open);
    const extra = attached[key];
    if (extra?.kind !== "file" || fileUrls[key]) return;
    let cancelled = false;
    void fileObjectUrl(day.day, open).then((url) => {
      if (cancelled || !url) return;
      setFileUrls((current) => ({ ...current, [key]: url }));
    });
    return () => {
      cancelled = true;
    };
  }, [day, open, attached, fileUrls]);

  const topic = day ? displayTopic(day, language) : "";
  const progress = useMemo(() => (day ? Math.round((ready / SECTION_ORDER.length) * 100) : 0), [day, ready]);

  if (!day) {
    return (
      <Shell>
        <p className="text-[#f7f1e4]">Ye din maujood nahi.</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <SEO title={`HajCare AI Classroom · Day ${day.day}`} description={day.title_en} path={`/classroom/day/${day.day}`} />
      <article data-screen="day-board" data-day={day.day} className="rounded-[28px] border border-[#e6d3a1] bg-[#f7f1e4] px-4 py-5">
        <button type="button" className="min-h-11 text-base font-semibold text-[#1b4a38]" onClick={() => navigate("/classroom")}>
          ← Back to 100 Days Classroom
        </button>
        <p className="mt-3 text-center text-xs font-semibold tracking-[0.14em] text-[#8d6b2f]">DAY {String(day.day).padStart(2, "0")} / 100</p>
        <p className="mt-1 text-center text-sm font-semibold text-[#8d6b2f]">{day.block_hi}</p>
        <p className="lms-serif mt-1 text-center text-4xl leading-tight text-[#1b4a38]">{day.short}</p>
        <h1 className="mt-1 text-center text-2xl leading-snug text-[#1b4a38]">{day.title_hi}</h1>
        {language !== "hi" ? <p className="mt-1 text-center text-base text-[#5f6b4e]">{topic}</p> : null}
        <div className="mx-auto mt-4 h-36 w-full max-w-[16rem] overflow-hidden rounded-3xl border-4 border-[#e4cb87]">
          <img src={kaaba} alt="" className="h-full w-full object-cover" />
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-[#1b4a38]">
          {ready} / {SECTION_ORDER.length} hisse maujood
          {complete ? " · Mukammal" : ""}
        </p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#efe7d6]" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Tayyari">
          <div className="h-full rounded-full bg-[#c4a15a]" style={{ width: `${progress}%` }} />
        </div>
        <label className="mt-4 flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-[#e6d3a1] bg-white px-3 py-2">
          <span>
            <span className="block text-base font-semibold text-[#1b4a38]">Admin / Edit mode</span>
            <span className="block text-xs text-[#6d6456]">Video lagane ka option. Pilgrims ko band rehta hai.</span>
          </span>
          <input
            data-edit-toggle
            type="checkbox"
            className="h-6 w-6"
            checked={edit}
            onChange={(event) => setEdit(event.target.checked)}
          />
        </label>
        <LanguageAndListen day={day} />
        <ol className="mt-4 space-y-3">
          {SECTION_ORDER.map((key, index) => {
            const catalogue = day.sections[key];
            const extra = attached[attachmentKey(day.day, key)];
            const resolved = playingMedia(catalogue, extra, fileUrls[attachmentKey(day.day, key)]);
            const media = resolved.media;
            const available = Boolean(extra) || sectionReady(catalogue);
            const Icon = SECTION_ICON[key];
            const duration = media?.durationLabel ?? (extra ? "Duration optional" : null);
            return (
              <li key={key} id={`section-${key}`} className="scroll-mt-20">
                {available && (media || extra) ? (
                  <div className={`rounded-3xl border bg-white p-3 ${resolved.browserOnly ? "border-[#c4a15a]" : "border-[#e7dcc4]"}`}>
                    <button type="button" className="flex w-full items-center gap-3 text-left" onClick={() => setOpen(open === key ? null : key)}>
                      <Icon className="h-7 w-7 shrink-0 text-[#1a4d3c]" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-semibold text-[#1b4a38]">
                          {index + 1}. {SECTION_LABEL[key]}
                        </span>
                        <span className="block text-sm text-[#6d6456]">
                          {duration ?? catalogue?.durationLabel ?? "Duration jald dastiyab hogi"}
                          {(media?.language || catalogue?.language) ? ` · ${media?.language || catalogue?.language}` : ""}
                        </span>
                      </span>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a4d3c] text-[#f7f1e4]">
                        <Play className="h-5 w-5" aria-hidden />
                      </span>
                    </button>
                    {open === key ? (
                      <div>
                        {catalogue?.note && !resolved.browserOnly ? <p className="mt-2 text-sm text-[#6d6456]">{catalogue.note}</p> : null}
                        {media ? <MediaBlock media={media} day={day.day} browserOnly={resolved.browserOnly} /> : <p className="mt-2 text-sm">Video khul rahi hai…</p>}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-3xl border border-dashed border-[#d9d0c0] bg-[#f3ecdc] px-3 py-3 text-[#6d6456]" aria-disabled="true">
                    <Icon className="h-7 w-7 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold text-[#1b4a38]">
                        {index + 1}. {SECTION_LABEL[key]}
                      </span>
                      <span className="block text-sm">Coming Soon · Jald dastiyab hoga</span>
                    </span>
                    <Clock className="h-6 w-6 shrink-0" aria-hidden />
                  </div>
                )}
                {edit ? (
                  <SectionAttach
                    day={day.day}
                    section={key}
                    attachment={extra}
                    onChange={() => {
                      window.dispatchEvent(new Event("hajcare-attachments"));
                      setOpen(key);
                    }}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          className="mt-4 h-12 w-full rounded-2xl border border-[#1a4d3c] text-base font-semibold text-[#1a4d3c]"
          onClick={() => toggle(day.day)}
        >
          {complete ? "Mukammal hataein" : "Yeh din mukammal mark karein"}
        </button>
        <Link to={`/classroom/day/${day.day}/card`} className="mt-3 flex h-12 items-center justify-center text-base font-semibold text-[#8d6b2f]">
          Day card dekhein
        </Link>
      </article>
    </Shell>
  );
}
