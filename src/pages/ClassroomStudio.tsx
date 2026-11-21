import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookOpen, GraduationCap, Heart, MessageCircle, Music, Stethoscope, Users } from "lucide-react";
import kaaba from "@/assets/rules/kaaba.jpg";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CLASSROOM_CLASSES,
  CLASSROOM_QUIZ,
  CLASSROOM_SCRIPTURE,
  CLASSROOM_SIDE_VIDEOS,
  classroomSideEmbedSrc,
} from "@/data/classroom";
import { formatShortDate, publicProgramme, unlockDateIst } from "@/data/classroomRelease.js";

const QURAN_RECITATION = "https://everyayah.com/data/Alafasy_128kbps/098005.mp3";

type SectionKey = "quran" | "hadith" | "dua" | "lesson" | "doctor" | "expert" | "naat" | "quiz";

type SectionLink = {
  key: SectionKey;
  title: string;
  duration: string | null;
  href: string | null;
  kind: "video" | "audio" | "quiz" | "none";
};

const programme = publicProgramme();

function topicFor(day: number) {
  const item = programme.find((entry) => entry.day === day);
  if (!item || item.title_en === `Day ${day}`) return null;
  return item.title_en;
}

function shortTopic(day: number) {
  const full = topicFor(day);
  if (!full) return null;
  return full.startsWith("Niyyah") ? "Niyyat" : full;
}

function embed(id?: string | null, start?: number | null, end?: number | null) {
  if (!id) return null;
  return classroomSideEmbedSrc({ youtube_id: id, start_seconds: start ?? undefined, end_seconds: end ?? undefined });
}

function sectionsFor(day: number): SectionLink[] {
  const lesson = CLASSROOM_CLASSES.find((item) => item.day === day);
  const scripture = CLASSROOM_SCRIPTURE.find((item) => item.day === day);
  const side = (key: string) => CLASSROOM_SIDE_VIDEOS.find((item) => item.day === day && item.key === key);
  const doctor = side("doctor-corner");
  const dua = side("dua");
  const arkan = side("arkan");
  const quiz = CLASSROOM_QUIZ.day === day ? CLASSROOM_QUIZ : null;
  return [
    { key: "quran", title: "Quran Tilawat", duration: scripture ? "2:00" : null, href: scripture ? QURAN_RECITATION : null, kind: scripture ? "audio" : "none" },
    { key: "hadith", title: "Hadith", duration: scripture ? "1:23" : null, href: embed(scripture?.hadith_youtube_id), kind: scripture ? "video" : "none" },
    { key: "dua", title: "Dua", duration: dua ? "1:12" : null, href: embed(dua?.youtube_id), kind: dua ? "video" : "none" },
    { key: "lesson", title: "Arkan-e-Hajj / Main Lesson", duration: arkan ? "10:00" : null, href: embed(arkan?.youtube_id, arkan?.start_seconds, arkan?.end_seconds), kind: arkan ? "video" : "none" },
    { key: "doctor", title: "Doctor Corner", duration: doctor ? "7:27" : null, href: embed(doctor?.youtube_id), kind: doctor ? "video" : "none" },
    { key: "expert", title: "Expert Guidance", duration: null, href: null, kind: "none" },
    { key: "naat", title: "Naat", duration: lesson?.youtube_id ? "3:00" : null, href: embed(lesson?.youtube_id, lesson?.start_seconds, lesson?.end_seconds), kind: lesson?.youtube_id ? "video" : "none" },
    { key: "quiz", title: "Quiz & Revision", duration: quiz ? "3:00" : null, href: quiz ? "quiz" : null, kind: quiz ? "quiz" : "none" },
  ];
}

const ICONS = {
  quran: BookOpen,
  hadith: MessageCircle,
  dua: Heart,
  lesson: GraduationCap,
  doctor: Stethoscope,
  expert: Users,
  naat: Music,
  quiz: BookOpen,
} as const;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f3d2e] text-[#1f4d3a]" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, rgba(201,164,92,0.08), transparent 28%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.04), transparent 24%)" }}>
      <p className="px-4 py-3 text-right text-[10px] font-semibold tracking-[0.16em] text-[#e4cb87]">PREVIEW · NOT LIVE</p>
      <div className="mx-auto w-full max-w-md px-3 pb-12">{children}</div>
    </div>
  );
}

function DayCard({ day }: { day: number }) {
  const topic = shortTopic(day);
  const full = topicFor(day);
  const sections = sectionsFor(day);
  return (
    <article className="rounded-[28px] border border-[#e4cb87] bg-[#fbf6ea] px-4 py-5 shadow-sm" data-day-card={day}>
      <p className="text-center text-[11px] font-semibold tracking-[0.18em] text-[#8a6a2e]">HAJCARE AI CLASSROOM · 100 DAYS</p>
      <p className="mt-4 text-center text-xs font-semibold tracking-[0.16em] text-[#1f4d3a]">DAY {String(day).padStart(2, "0")} / 100</p>
      <h2 className="mt-2 text-center font-serif text-4xl text-[#1f4d3a]">{topic ?? "Jald dastiyab hoga"}</h2>
      {day === 1 ? <p className="text-center font-arabic text-xl text-[#c9a45c]" dir="rtl" lang="ar">النية</p> : null}
      <Link to={`/classroom/day/${day}`} className="mx-auto mt-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#e4cb87] bg-[#1f4d3a]" aria-label={topic ? `Day ${day} ${topic}` : `Day ${day}`}>
        <img src={kaaba} alt="" className="h-16 w-16 object-cover" />
      </Link>
      <p className="mt-4 text-center text-[11px] font-semibold tracking-[0.16em] text-[#8a6a2e]">ROZ KA MAUZOO</p>
      <p className="text-center font-serif text-2xl text-[#1f4d3a]">{topic ?? "—"}</p>
      <p className="mt-1 text-center text-xs text-[#5f6b4e]">{full && full !== topic ? full : `Opens ${formatShortDate(unlockDateIst(day))}`}</p>
      <p className="mt-4 text-center text-sm">Konsi video dekhni hai?</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {sections.map((section) => {
          const Icon = ICONS[section.key];
          const ready = Boolean(section.href);
          const className = `flex items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-sm font-semibold ${ready ? "border-[#e4dcc8] bg-white text-[#1f4d3a]" : "border-dashed border-[#d9d3c4] bg-[#f3f0e7] text-[#8a8172]"}`;
          return ready ? (
            <Link key={section.key} to={`/classroom/day/${day}#${section.key}`} className={className}>
              <Icon className="h-4 w-4" aria-hidden /> {section.title.split(" / ")[0]}
            </Link>
          ) : (
            <span key={section.key} className={className}>
              <Icon className="h-4 w-4" aria-hidden /> {section.title.split(" / ")[0]}
              <span className="text-[10px] font-medium">Jald dastiyab hoga</span>
            </span>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[10px] text-[#8a8172]">Har button us din ki usi qism ki video kholta hai. Link na ho to Jald dastiyab hoga.</p>
    </article>
  );
}

export function ClassroomDashboardPage() {
  return (
    <Shell>
      <h1 className="mb-4 text-center font-serif text-2xl text-[#f6f3ec]">HajCare AI Classroom</h1>
      <div className="space-y-4">
        {programme.map((item) => <DayCard key={item.day} day={item.day} />)}
      </div>
    </Shell>
  );
}

export function ClassroomDayPage() {
  const { dayNumber } = useParams();
  const day = Number(dayNumber);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const valid = Number.isInteger(day) && day >= 1 && day <= 100;
  const topic = valid ? shortTopic(day) : null;
  const full = valid ? topicFor(day) : null;
  const stored = programme.find((item) => item.day === day);
  const speech = language === "hi" && stored && stored.title_hi !== `दिन ${day}` ? stored.title_hi : (full ?? "");
  const sections = useMemo(() => (valid ? sectionsFor(day) : []), [day, valid]);
  const [openKey, setOpenKey] = useState<SectionKey | null>(null);
  useEffect(() => {
    const key = window.location.hash.replace("#", "") as SectionKey;
    if (sections.some((section) => section.key === key && section.href)) setOpenKey(key);
  }, [sections]);
  const open = sections.find((section) => section.key === openKey) ?? null;

  if (!valid) {
    return <Shell><p className="text-[#f6f3ec]">Ye din maujood nahi.</p></Shell>;
  }

  return (
    <Shell>
      <article className="rounded-[28px] border border-[#e4cb87] bg-[#fbf6ea] px-4 py-5">
        <button type="button" className="text-sm font-semibold text-[#1f4d3a]" onClick={() => navigate("/classroom")}>← 100 Days Classroom</button>
        <p className="mt-3 text-center text-[11px] tracking-[0.16em] text-[#8a6a2e]">HAJCARE AI CLASSROOM · 100 DAYS</p>
        <p className="mt-3 text-center text-xs font-semibold tracking-[0.16em]">DAY {String(day).padStart(2, "0")} / 100</p>
        <h1 className="mt-2 text-center font-serif text-4xl">{topic ?? "Jald dastiyab hoga"}</h1>
        {day === 1 ? <p className="text-center font-arabic text-xl text-[#c9a45c]" dir="rtl" lang="ar">النية</p> : null}
        <div className="mx-auto mt-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#e4cb87] bg-[#1f4d3a]">
          <img src={kaaba} alt="" className="h-16 w-16 object-cover" />
        </div>
        <p className="mt-4 text-center text-[11px] tracking-[0.16em] text-[#8a6a2e]">ROZ KA MAUZOO</p>
        <p className="text-center font-serif text-2xl">{full ?? "—"}</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          {(["en", "hi", "ur"] as const).map((code) => (
            <button key={code} type="button" className="rounded-full border border-[#e4dcc8] px-2 py-1 text-xs" onClick={() => setLanguage(code)}>{code === "en" ? "English" : code === "hi" ? "हिंदी" : "اردو"}</button>
          ))}
          {speech ? <TextToSpeechButton text={speech} size="sm" /> : null}
        </div>
        <p className="mt-4 text-center text-sm">Konsi video dekhni hai?</p>
        <ul className="mt-3 space-y-2">
          {sections.map((section) => {
            const Icon = ICONS[section.key];
            const ready = Boolean(section.href);
            return (
              <li key={section.key}>
                <button
                  type="button"
                  disabled={!ready}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${ready ? "border-[#e4dcc8] bg-white" : "border-dashed border-[#d9d3c4] bg-[#f3f0e7] text-[#8a8172]"}`}
                  onClick={() => ready && setOpenKey(section.key)}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{section.title}</span>
                    <span className="text-xs text-[#5f6b4e]">{section.duration ?? "Jald dastiyab hoga"}</span>
                  </span>
                  <span className="text-xs font-semibold">{ready ? "Play" : "Coming Soon"}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {open?.kind === "video" && open.href ? (
          <iframe title={open.title} className="mt-4 aspect-video w-full rounded-2xl" src={open.href} allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        ) : null}
        {open?.kind === "audio" && open.href ? <audio className="mt-4 w-full" controls src={open.href} /> : null}
        {open?.kind === "quiz" ? (
          <ol className="mt-4 space-y-3 text-sm">
            {CLASSROOM_QUIZ.questions.map((question, index) => (
              <li key={question.prompt}><span className="font-semibold">{index + 1}. {question.prompt}</span></li>
            ))}
          </ol>
        ) : null}
      </article>
    </Shell>
  );
}
