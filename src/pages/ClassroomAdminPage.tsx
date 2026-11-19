import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CLASSROOM_CLASSES, CLASSROOM_SCRIPTURE, CLASSROOM_SIDE_VIDEOS } from "@/data/classroom";
import { publicProgramme, formatShortDate } from "@/data/classroomRelease.js";
import ClassroomPage from "@/pages/ClassroomPage";

const programme = publicProgramme();
const dayOne = CLASSROOM_CLASSES[0];
const DRAFT_KEY = "hajcare-classroom-draft";

type DayDraft = {
  title: string;
  releaseDate: string;
  quran: string;
  hadith: string;
  dua: string;
  arkan: string;
  doctor: string;
  naat: string;
  quiz: string;
};

function blankDraft(day: { day: number; title_en: string; unlocks: string }): DayDraft {
  const side = (key: string) => CLASSROOM_SIDE_VIDEOS.find((item) => item.day === day.day && item.key === key)?.youtube_id || "";
  return {
    title: day.day === 1 ? dayOne.title_en : day.title_en,
    releaseDate: day.unlocks,
    quran: day.day === 1 ? (CLASSROOM_SCRIPTURE[0]?.reference || "") : "",
    hadith: day.day === 1 ? (CLASSROOM_SCRIPTURE[0]?.hadith_youtube_id || "") : "",
    dua: side("dua"),
    arkan: side("arkan"),
    doctor: side("doctor-corner"),
    naat: day.day === 1 ? (dayOne.youtube_id || "") : "",
    quiz: day.day === 1 ? "10 questions" : "",
  };
}

function readDrafts(): Record<string, DayDraft> {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}") as Record<string, DayDraft>;
  } catch {
    return {};
  }
}

/** The generated client has no classroom_days type until the migration is applied. */
function daysTable() {
  return (supabase as unknown as {
    from: (table: string) => {
      upsert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
      select: (cols: string) => {
        eq: (col: string, value: number) => {
          maybeSingle: () => Promise<{ data: { content: { title?: string } } | null; error: { message: string } | null }>;
        };
      };
    };
  }).from("classroom_days");
}

export default function ClassroomAdminPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState("Draft — not saved to server");
  const [open, setOpen] = useState<number | null>(1);
  const [play, setPlay] = useState<number | null>(null);
  const [previewNote, setPreviewNote] = useState<{ note_en?: string; note_hi?: string }>();
  const [drafts, setDrafts] = useState<Record<string, DayDraft>>(() => readDrafts());

  function draftFor(day: { day: number; title_en: string; unlocks: string }) {
    return drafts[String(day.day)] || blankDraft(day);
  }

  function updateDraft(dayNumber: number, patch: Partial<DayDraft>) {
    setDrafts((current) => {
      const base = current[String(dayNumber)] || blankDraft(programme.find((item) => item.day === dayNumber)!);
      const next = { ...current, [String(dayNumber)]: { ...base, ...patch } };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      return next;
    });
  }

  function exportDraft() {
    const blob = new Blob([JSON.stringify(drafts, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hajcare-classroom-draft.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Draft exported. It is saved in this browser only, not on the server.");
  }

  async function previewDay(dayNumber: number) {
    setPlay(null);
    setStatus("Checking the admin session…");
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const response = await fetch("/api/classroom", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const payload = await response.json() as {
      admin?: boolean;
      adminReason?: string;
      releasedBodies?: Record<string, { note_en?: string; note_hi?: string }>;
    };
    if (payload.admin !== true) {
      setStatus(`The server kept this day locked (${payload.adminReason || "unknown"}). A logged-in admin is required.`);
      return;
    }
    setPreviewNote(payload.releasedBodies?.[String(dayNumber)]);
    setPlay(dayNumber);
    setStatus(`Previewing day ${dayNumber}. The unlock date is ignored for this admin view.`);
  }

  async function saveDayOne() {
    setStatus("Saving…");
    const content = {
      title: dayOne.title_en,
      scripture: CLASSROOM_SCRIPTURE[0]?.key ?? null,
      videos: CLASSROOM_SIDE_VIDEOS.filter((item) => item.day === 1).map((item) => item.youtube_id),
      naat: dayOne.youtube_id,
    };
    const { error } = await daysTable().upsert({
      day_number: 1,
      unlock_date: programme[0].unlocks,
      content,
      updated_at: new Date().toISOString(),
      updated_by: user?.id ?? null,
    });
    if (error) {
      setStatus(`Not saved to the database (${error.message}). The classroom_days SQL has not been applied. The draft stays in this browser. Saiful needs to run that SQL before Publish can store it.`);
      return;
    }
    const read = await daysTable().select("content").eq("day_number", 1).maybeSingle();
    if (read.error || read.data?.content?.title !== dayOne.title_en) {
      setStatus("Save returned, but the row could not be read back.");
      return;
    }
    setStatus(`Saved day 1: ${read.data.content.title}`);
  }

  return (
    <main className="min-h-screen bg-[#f6f3ec] px-4 py-6 text-[#1f4d3a]" data-testid="classroom-admin">
      <h1 className="text-2xl font-semibold">HajCare AI Classroom</h1>
      <p className="mt-2 max-w-3xl text-sm">
        Open a day, edit its lesson, then Save Draft. Preview plays the full lesson and ignores the release date only after the server confirms your admin role. Publish tries the classroom_days table. That table is not on the database yet, so a failed publish keeps the browser draft. Export JSON downloads it.
      </p>
      <p className="mt-1 text-sm" data-testid="admin-save-status">{status}</p>
      <button type="button" className="mt-3 rounded-full border border-[#1f4d3a] px-4 py-2 text-sm font-semibold" onClick={exportDraft}>
        Export JSON
      </button>
      <button type="button" className="mt-3 rounded-full bg-[#1f4d3a] px-4 py-2 text-sm font-semibold text-white" onClick={saveDayOne}>
        Save day 1
      </button>
      <ol className="mt-6 space-y-2">
        {programme.map((day) => (
          <li key={day.day} className="rounded-2xl border border-[#e4dcc8] bg-white">
            <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left text-sm" onClick={() => setOpen(open === day.day ? null : day.day)}>
              <span>Day {day.day} · {formatShortDate(day.unlocks)} · {day.status}</span>
              <span>{day.title_en}</span>
            </button>
            <div className="px-4 pb-3">
              <button
                type="button"
                className="rounded-full border border-[#1f4d3a] px-3 py-1 text-xs font-semibold"
                onClick={() => previewDay(day.day)}
              >
                Preview / Play Day {day.day}
              </button>
            </div>
            {open === day.day ? (
              <div className="space-y-2 border-t border-[#e4dcc8] px-4 py-3 text-sm">
                {([
                  ["title", "Lesson title"],
                  ["releaseDate", "Release date"],
                  ["quran", "Quran"],
                  ["hadith", "Hadith video"],
                  ["dua", "Dua video"],
                  ["arkan", "Main Hajj Lesson / Arkan video"],
                  ["doctor", "Doctor Corner video"],
                  ["naat", "Naat video"],
                  ["quiz", "Quiz"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="text-xs font-semibold text-[#5f6b4e]">{label}</span>
                    <input
                      className="mt-1 w-full rounded-xl border border-[#e4dcc8] px-3 py-2"
                      value={draftFor(day)[key]}
                      onChange={(event) => updateDraft(day.day, { [key]: event.target.value })}
                    />
                  </label>
                ))}
                <button type="button" className="rounded-full bg-[#1f4d3a] px-4 py-2 text-sm font-semibold text-white" onClick={() => setStatus(`Draft for day ${day.day} saved in this browser. Not saved to the server.`)}>
                  Save Draft
                </button>
                <button type="button" className="ml-2 rounded-full border border-[#1f4d3a] px-4 py-2 text-sm font-semibold" onClick={saveDayOne}>
                  Publish
                </button>
                <p className="text-xs text-[#5f6b4e]">YouTube links are enough. Lock and unlock follow the release date. Day 1 stays 35:38 until a section is shortened.</p>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      {play != null ? (
        <div className="mt-6" data-testid="admin-player">
          <ClassroomPage key={play} playDay={play} ignoreLock previewNote={previewNote} />
        </div>
      ) : null}
    </main>
  );
}
