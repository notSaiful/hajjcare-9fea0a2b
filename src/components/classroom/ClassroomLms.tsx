import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  Lock,
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
  externalPlayerSrc,
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
import { attachmentsForDay, fileObjectUrl, maslakWarning, storedClips, visibleClips, type PreviewClip } from "@/data/classroomAttachments";
import { dayIsFinished, dayIsUnlocked, firstOpenDay, PREVIEW_EDIT_KEY } from "@/data/classroomUnlock";
import { SectionAttach } from "@/components/classroom/SectionAttach";

const DONE_KEY = "hajcare-classroom-preview-done";
const PLAYED_KEY = "hajcare-classroom-preview-played";
const EDIT_KEY = PREVIEW_EDIT_KEY;
const LOCK_MESSAGE = "Pichla din mukammal karein";

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

function readIdList(key: string): number[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((item) => Number.isInteger(item) && item >= 1 && item <= 100) : [];
  } catch {
    return [];
  }
}

function useProgress() {
  const [done, setDone] = useState<number[]>(() => (typeof window === "undefined" ? [] : readIdList(DONE_KEY)));
  const [played, setPlayed] = useState<number[]>(() => (typeof window === "undefined" ? [] : readIdList(PLAYED_KEY)));
  const toggle = useCallback((day: number) => {
    setDone((current) => {
      const next = current.includes(day) ? current.filter((item) => item !== day) : [...current, day];
      localStorage.setItem(DONE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const markPlayed = useCallback((day: number) => {
    setPlayed((current) => {
      if (current.includes(day)) return current;
      const next = [...current, day];
      localStorage.setItem(PLAYED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return { done, played, toggle, markPlayed };
}

export function Shell({ children }: { children: React.ReactNode }) {
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
  const { done, played } = useProgress();
  const { edit } = useEditMode();
  const { language } = useLanguage();
  const navigate = useNavigate();
  useAttachmentRevision();
  const attachedDays = new Set(CLASSROOM_DAYS.filter((day) => attachmentsForDay(day.day).length > 0).map((day) => day.day));
  const [jump, setJump] = useState("1");
  const [notice, setNotice] = useState("");
  const current = firstOpenDay(done, played);
  const today = CLASSROOM_DAYS[current - 1];
  const finished = CLASSROOM_DAYS.filter((day) => dayIsFinished(day.day, done, played)).length;
  useEffect(() => {
    document.getElementById("aaj-ka-din")?.scrollIntoView({ block: "start" });
  }, [current]);
  return (
    <Shell>
      <SEO title="HajCare AI Classroom" description="100 Days Hajj Training. Free recorded classes." path="/classroom" />
      <div data-screen="dashboard">
        <p className="text-center text-[11px] font-semibold tracking-[0.18em] text-[#e4cb87]">100 DAYS HAJJ TRAINING</p>
        <h1 className="lms-serif mt-1 text-center text-4xl text-[#f7f1e4]">HajCare AI Classroom</h1>
        <p className="mt-2 text-center text-base text-[#f3e6c4]">Muft. Login zaroori nahi. Har din ka card alag mauzoo dikhata hai.</p>
        <p className="mt-3 text-center text-sm font-semibold text-[#e4cb87]">{finished} / 100 mukammal</p>
        <section id="aaj-ka-din" data-aaj={current} className="mt-4 rounded-3xl border border-[#e4cb87] bg-[#f7f1e4] px-4 py-4 text-[#1b4a38]">
          <p className="text-center text-xs font-semibold tracking-[0.16em] text-[#8d6b2f]">AAJ KA DIN</p>
          <p className="lms-serif mt-1 text-center text-4xl">{today.short}</p>
          <p className="mt-1 text-center text-base leading-snug">{today.title_hi}</p>
          <p className="mt-1 text-center text-sm text-[#6d6456]">Day {today.day} · {today.block_hi}</p>
          <Link to={`/classroom/day/${today.day}`} className="mt-3 flex h-12 items-center justify-center rounded-2xl bg-[#1a4d3c] text-base font-semibold text-[#f7f1e4]">
            Aaj ka din kholen
          </Link>
        </section>
        {notice ? <p className="mt-3 rounded-2xl bg-[#1a4d3c] px-3 py-3 text-center text-sm text-[#f7f1e4]" role="status">{notice}</p> : null}
        <LanguageAndListen day={today} />
        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const day = Number(jump);
            if (day < 1 || day > 100) return;
            if (!dayIsUnlocked(day, done, played, edit)) {
              setNotice(`${LOCK_MESSAGE}. Aaj ka din ${current} hai.`);
              document.getElementById("aaj-ka-din")?.scrollIntoView({ block: "start" });
              return;
            }
            navigate(`/classroom/day/${day}`);
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
            const complete = dayIsFinished(day.day, done, played);
            const unlocked = dayIsUnlocked(day.day, done, played, edit);
            const locked = !unlocked;
            const attached = attachedDays.has(day.day);
            const ready = attached || readySectionCount(day) > 0;
            const topic = displayTopic(day, language);
            const isCurrent = day.day === current;
            const status = locked ? LOCK_MESSAGE : isCurrent ? "Aaj ka din" : statusLabel(day, complete, attached);
            const label = `Day ${day.day} ${day.short}. ${topic}. ${status}`;
            const body = (
              <>
                <span className="flex w-16 shrink-0 flex-col items-center">
                  <span className="text-xs font-bold tracking-[0.12em] text-[#8d6b2f]">DAY</span>
                  <span className="text-xl font-bold leading-none text-[#1b4a38]">{String(day.day).padStart(2, "0")}</span>
                  <TopicMark day={day} className="mt-1 h-12 w-12" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold leading-snug text-[#8d6b2f]">{day.block_hi}</span>
                  <span className="lms-serif block text-2xl leading-tight text-[#1b4a38]">{day.short}</span>
                  <span className="mt-0.5 block text-base leading-snug text-[#1b4a38]">{day.title_hi}</span>
                  <span className="mt-1 block text-sm font-semibold text-[#6d6456]">{status}</span>
                </span>
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${locked ? "bg-[#e7dfd0] text-[#8a8172]" : "bg-[#1a4d3c] text-[#f7f1e4]"}`}
                  aria-hidden
                >
                  {locked ? <Lock className="h-6 w-6" /> : complete ? <Check className="h-6 w-6" /> : ready || isCurrent ? <Play className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                </span>
              </>
            );
            const className = `flex items-center gap-3 rounded-3xl border px-3 py-3 shadow-sm ${
              locked
                ? "border-[#e4dcc8] bg-[#efe8d8] opacity-70"
                : isCurrent
                  ? "border-[#c4a15a] bg-[#fffaf0] ring-2 ring-[#c4a15a]"
                  : "border-[#e6d3a1] bg-[#f7f1e4]"
            }`;
            return (
              <li key={day.day} id={isCurrent ? "aaj-ka-din-card" : undefined}>
                {locked ? (
                  <div data-day-card={day.day} data-topic={day.title_hi} data-locked="true" aria-disabled="true" aria-label={label} className={className}>
                    {body}
                  </div>
                ) : (
                  <Link
                    to={`/classroom/day/${day.day}`}
                    data-day-card={day.day}
                    data-topic={day.title_hi}
                    data-current={isCurrent ? "true" : undefined}
                    aria-label={label}
                    className={className}
                  >
                    {body}
                  </Link>
                )}
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
  const navigate = useNavigate();
  const { done, played } = useProgress();
  const { edit } = useEditMode();
  const dayNumber = Number(params.dayNumber);
  const day = classroomDay(dayNumber);
  const openDay = firstOpenDay(done, played);
  useEffect(() => {
    if (!day) return;
    if (!dayIsUnlocked(day.day, done, played, edit)) {
      navigate(`/classroom/day/${openDay}?notice=locked`, { replace: true });
    }
  }, [day, done, played, edit, navigate, openDay]);
  if (day && !dayIsUnlocked(day.day, done, played, edit)) {
    return (
      <Shell>
        <p className="rounded-3xl bg-[#f7f1e4] px-4 py-6 text-center text-lg text-[#1b4a38]">{LOCK_MESSAGE}. Aaj ka din {openDay} hai.</p>
      </Shell>
    );
  }
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
  if (media.kind === "external" && media.pageUrl) {
    const src = externalPlayerSrc(media.pageUrl);
    return (
      <div className="mt-3" data-external-video={media.platform || "link"}>
        {src ? (
          <iframe
            title={media.citation}
            className="aspect-video w-full rounded-2xl bg-black"
            src={src}
            allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <a
            href={media.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-24 flex-col justify-center rounded-2xl border border-[#e6d3a1] bg-white px-4 py-4"
          >
            <span className="text-lg font-semibold text-[#1a4d3c]">Video dekhein</span>
            <span className="mt-1 text-sm text-[#6d6456]">{media.platform || "Link"} · nayi tab</span>
          </a>
        )}
        <p className="mt-2 text-sm leading-snug text-[#1b4a38]">
          <span className="font-semibold">Video title: </span>
          {media.citation}
        </p>
        <p className="mt-1 text-sm text-[#6d6456]">
          {media.platform}
          {media.uploader ? ` · ${media.uploader}` : ""}
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

function clipToMedia(clip: PreviewClip, fileSrc?: string): SectionMedia {
  if (clip.kind === "file") {
    return {
      kind: "file",
      fileSrc: clip.fileSrc || fileSrc,
      durationLabel: clip.duration ?? null,
      language: clip.language ?? null,
      citation: clip.title || clip.fileName || "Is browser ki video",
      note: clip.note,
    };
  }
  if (clip.kind === "external") {
    return {
      kind: "external",
      pageUrl: clip.pageUrl,
      platform: clip.platform,
      uploader: clip.uploader,
      durationLabel: clip.duration ?? null,
      language: clip.language ?? null,
      citation: clip.title || "Video",
      note: clip.note,
    };
  }
  if (clip.kind === "quiz") {
    return {
      kind: "quiz",
      durationLabel: clip.duration ?? null,
      language: clip.language ?? null,
      citation: clip.title || "Quiz",
      note: clip.note,
    };
  }
  return {
    kind: "youtube",
    youtubeId: clip.youtubeId,
    startSeconds: clip.startSeconds,
    endSeconds: clip.endSeconds,
    durationLabel: clip.duration ?? null,
    language: clip.language ?? null,
    citation: clip.title || "Is browser ki video",
    note: clip.note,
  };
}

export function ClassroomDayPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dayNumber = Number(params.dayNumber);
  const day = classroomDay(dayNumber);
  const { language } = useLanguage();
  const { done, played, toggle, markPlayed } = useProgress();
  const { edit, set: setEdit } = useEditMode();
  const openDay = firstOpenDay(done, played);
  const unlocked = day ? dayIsUnlocked(day.day, done, played, edit) : false;
  useEffect(() => {
    if (!day || unlocked) return;
    navigate(`/classroom/day/${openDay}?notice=locked`, { replace: true });
  }, [day, unlocked, navigate, openDay]);
  const attachmentRevision = useAttachmentRevision();
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<SectionKey | null>(null);
  const [activeClip, setActiveClip] = useState<Partial<Record<SectionKey, number>>>({});
  const ready = day
    ? SECTION_ORDER.filter((key) => visibleClips(day.sections[key], storedClips(day.day, key)).length > 0).length
    : 0;
  const complete = day ? dayIsFinished(day.day, done, played) : false;

  useEffect(() => {
    const key = window.location.hash.replace("#", "") as SectionKey;
    if (!day || !unlocked) return;
    const hasAttachment = storedClips(day.day, key) !== null;
    if (SECTION_ORDER.includes(key) && (hasAttachment || sectionReady(day.sections[key]))) {
      setOpen(key);
      markPlayed(day.day);
      document.getElementById(`section-${key}`)?.scrollIntoView({ block: "start" });
    }
  }, [day, unlocked, markPlayed]);

  useEffect(() => {
    if (!day || !open || attachmentRevision < 0) return;
    const clips = visibleClips(day.sections[open], storedClips(day.day, open));
    let cancelled = false;
    for (const clip of clips) {
      if (clip.kind !== "file" || clip.fileSrc || fileUrls[clip.id]) continue;
      void fileObjectUrl(day.day, open, clip.id).then((url) => {
        if (cancelled || !url) return;
        setFileUrls((current) => ({ ...current, [clip.id]: url }));
      });
    }
    return () => {
      cancelled = true;
    };
  }, [day, open, fileUrls, attachmentRevision]);

  const topic = day ? displayTopic(day, language) : "";
  const progress = useMemo(() => (day ? Math.round((ready / SECTION_ORDER.length) * 100) : 0), [day, ready]);

  if (!day) {
    return (
      <Shell>
        <p className="text-[#f7f1e4]">Ye din maujood nahi.</p>
      </Shell>
    );
  }

  if (!unlocked) {
    return (
      <Shell>
        <p className="rounded-3xl bg-[#f7f1e4] px-4 py-6 text-center text-lg text-[#1b4a38]">{LOCK_MESSAGE}. Aaj ka din {openDay} hai.</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <SEO title={`HajCare AI Classroom · Day ${day.day}`} description={day.title_en} path={`/classroom/day/${day.day}`} />
      <article data-screen="day-board" data-day={day.day} className="rounded-[28px] border border-[#e6d3a1] bg-[#f7f1e4] px-4 py-5">
        {searchParams.get("notice") === "locked" ? (
          <p className="mb-3 rounded-2xl bg-[#fff6df] px-3 py-3 text-center text-base text-[#1b4a38]" role="status">
            Yeh din abhi band hai. {LOCK_MESSAGE}. Aaj ka din yahan hai.
          </p>
        ) : null}
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
        {edit ? (
          <Link to={`/classroom/admin?day=${day.day}`} className="mt-2 flex h-12 items-center justify-center rounded-2xl border border-[#1a4d3c] text-base font-semibold text-[#1a4d3c]">
            Classroom Videos
          </Link>
        ) : null}
        <LanguageAndListen day={day} />
        <ol className="mt-4 space-y-3">
          {SECTION_ORDER.map((key, index) => {
            const catalogue = day.sections[key];
            const clips = visibleClips(catalogue, storedClips(day.day, key));
            const available = clips.length > 0;
            const Icon = SECTION_ICON[key];
            const active = Math.min(activeClip[key] ?? 0, Math.max(clips.length - 1, 0));
            const currentClip = clips[active];
            const summary = clips.length > 1 ? `${clips.length} videos` : (clips[0]?.duration ?? "Duration jald dastiyab hogi");
            const warning = maslakWarning(key, clips);
            return (
              <li key={key} id={`section-${key}`} className="scroll-mt-20">
                {available ? (
                  <div className="rounded-3xl border border-[#e7dcc4] bg-white p-3" data-section={key}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 text-left"
                      onClick={() => {
                        const next = open === key ? null : key;
                        setOpen(next);
                        setActiveClip((current) => ({ ...current, [key]: 0 }));
                        if (next) markPlayed(day.day);
                      }}
                    >
                      <Icon className="h-7 w-7 shrink-0 text-[#1a4d3c]" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-semibold text-[#1b4a38]">
                          {index + 1}. {SECTION_LABEL[key]}
                        </span>
                        <span className="block text-sm text-[#6d6456]">
                          {summary}
                          {clips.length === 1 && clips[0]?.language ? ` · ${clips[0].language}` : ""}
                        </span>
                      </span>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a4d3c] text-[#f7f1e4]">
                        <Play className="h-5 w-5" aria-hidden />
                      </span>
                    </button>
                    {warning ? (
                      <p className="mt-2 rounded-2xl bg-[#f4e4c4] px-3 py-2 text-sm font-semibold text-[#6b4a16]" role="status" data-maslak-warning={key}>
                        {warning}
                      </p>
                    ) : null}
                    {open === key ? (
                      <div data-video-list={key}>
                        <ol className="mt-3 space-y-2">
                          {clips.map((clip, clipIndex) => (
                            <li key={clip.id}>
                              <button
                                type="button"
                                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${clipIndex === active ? "border-[#1a4d3c] bg-[#f3f7f2]" : "border-[#e7dcc4] bg-[#f7f1e4]"}`}
                                onClick={() => {
                                  setActiveClip((current) => ({ ...current, [key]: clipIndex }));
                                  markPlayed(day.day);
                                }}
                              >
                                <span className="text-sm font-semibold text-[#8d6b2f]">Video {clipIndex + 1}/{clips.length}</span>
                                <span className="min-w-0 flex-1 text-base text-[#1b4a38]">
                                  {clip.title || clip.fileName || "Video"}
                                  {clip.maslak === "shia" || clip.maslak === "sunni" || clip.maslak === "neutral" ? (
                                    <span className="mt-0.5 block text-sm font-semibold text-[#8d6b2f]">
                                      {clip.maslak === "shia" ? "Shia" : clip.maslak === "sunni" ? "Sunni" : "Neutral"}
                                      {clip.reviewPending ? <span className="ml-2 rounded-full bg-[#f4e4c4] px-2 py-0.5 text-xs" data-review-badge>Review baaki</span> : null}
                                    </span>
                                  ) : null}
                                </span>
                                <Play className="h-5 w-5 shrink-0 text-[#1a4d3c]" aria-hidden />
                              </button>
                            </li>
                          ))}
                        </ol>
                        {currentClip ? (
                          currentClip.kind === "file" && !currentClip.fileSrc && !fileUrls[currentClip.id] ? (
                            <p className="mt-2 text-sm">Video khul rahi hai…</p>
                          ) : (
                            <MediaBlock media={clipToMedia(currentClip, fileUrls[currentClip.id])} day={day.day} browserOnly={!currentClip.id.startsWith("catalogue-")} />
                          )
                        ) : null}
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
                      {warning ? <span className="mt-1 block text-sm font-semibold text-[#6b4a16]" role="status" data-maslak-warning={key}>{warning}</span> : null}
                    </span>
                    <Clock className="h-6 w-6 shrink-0" aria-hidden />
                  </div>
                )}
                {edit ? (
                  <SectionAttach
                    day={day.day}
                    section={key}
                    clips={clips}
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
