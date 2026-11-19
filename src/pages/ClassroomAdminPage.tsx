import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CLASSROOM_CLASSES, CLASSROOM_SCRIPTURE, CLASSROOM_SIDE_VIDEOS } from "@/data/classroom";
import { publicProgramme, formatShortDate } from "@/data/classroomRelease.js";
import ClassroomPage from "@/pages/ClassroomPage";

const programme = publicProgramme();
const dayOne = CLASSROOM_CLASSES[0];

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
      releasedBodies?: Record<string, { note_en?: string; note_hi?: string }>;
    };
    if (payload.admin !== true) {
      setStatus("The server did not confirm an admin session, so this day stays locked.");
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
      setStatus(`Not saved. ${error.message}`);
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
      <p className="mt-1 text-sm" data-testid="admin-save-status">{status}</p>
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
            {open === day.day && day.day === 1 ? (
              <div className="border-t border-[#e4dcc8] px-4 py-3 text-sm">
                <p>{dayOne.title_en}</p>
                <p data-video-id={dayOne.youtube_id}>Naat {dayOne.youtube_id}</p>
                {CLASSROOM_SIDE_VIDEOS.filter((item) => item.day === 1).map((item) => (
                  <p key={item.key}>
                    {item.title_en} {item.youtube_id}
                    {item.end_seconds != null ? ` start ${item.start_seconds ?? 0} end ${item.end_seconds}` : ""}
                  </p>
                ))}
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
