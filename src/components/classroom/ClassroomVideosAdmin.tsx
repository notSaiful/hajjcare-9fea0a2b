import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { CLASSROOM_DAYS, SECTION_LABEL, SECTION_ORDER, classroomDay, type SectionKey } from "@/data/classroomCatalogue";
import { browserFileClips } from "@/data/classroomAttachments";
import { useClassroomVideoRows } from "@/data/classroomRemote";
import { boardClips } from "@/data/classroomVideoRows";
import { PREVIEW_EDIT_KEY } from "@/data/classroomUnlock";
import { SectionAttach } from "@/components/classroom/SectionAttach";
import { VideoLinkPaste } from "@/components/classroom/VideoLinkPaste";
import { Shell } from "@/components/classroom/ClassroomLms";

function useEditMode() {
  const [edit, setEdit] = useState(() => (typeof window === "undefined" ? false : localStorage.getItem(PREVIEW_EDIT_KEY) === "1"));
  function set(next: boolean) {
    localStorage.setItem(PREVIEW_EDIT_KEY, next ? "1" : "0");
    setEdit(next);
  }
  return { edit, set };
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

export default function ClassroomVideosAdmin() {
  const { edit, set } = useEditMode();
  const revision = useAttachmentRevision();
  const remote = useClassroomVideoRows();
  const [params, setParams] = useSearchParams();
  const requested = Number(params.get("day"));
  const dayNumber = Number.isInteger(requested) && requested >= 1 && requested <= 100 ? requested : 1;
  const day = classroomDay(dayNumber);

  return (
    <Shell>
      <SEO title="HajCare AI Classroom · Classroom Videos" description="Preview-only video list for the 100 days." path="/classroom/admin" />
      <article data-screen="classroom-videos" data-edit={edit ? "1" : "0"} className="rounded-[28px] border border-[#e6d3a1] bg-[#f7f1e4] px-4 py-5">
        <Link to="/classroom" className="text-sm font-semibold text-[#8d6b2f]">← 100 Days Classroom</Link>
        <h1 className="lms-serif mt-3 text-4xl leading-tight text-[#1b4a38]">Classroom Videos</h1>
        <p className="mt-2 text-base text-[#1b4a38]">
          Din 1 se 100. Har hisse mein teen video tak. YouTube link ya device file. Board par wahi list dikhegi.
        </p>
        <p className="mt-2 text-sm text-[#6d6456]">
          Hadith, Dua, Expert Guidance, Main Lesson, aur Naat par warning aati hai jab sirf Shia ya sirf Sunni tag ho. Doctor Corner aur Quran par warning nahi.
        </p>
        <label className="mt-4 flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-[#e6d3a1] bg-white px-3 py-2">
          <span>
            <span className="block text-base font-semibold text-[#1b4a38]">Admin / Edit mode</span>
            <span className="block text-xs text-[#6d6456]">Yahi switch board par bhi hai. Link server par tabhi save hota hai jab /admin/classroom wala admin login ho.</span>
          </span>
          <input
            data-edit-toggle
            type="checkbox"
            className="h-6 w-6"
            checked={edit}
            onChange={(event) => set(event.target.checked)}
          />
        </label>
        {edit && day ? (
          <>
            <label className="mt-4 block text-sm font-semibold text-[#1b4a38]">
              Din
              <select
                data-day-picker
                className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] bg-white px-3 text-base"
                value={day.day}
                onChange={(event) => setParams({ day: event.target.value })}
              >
                {CLASSROOM_DAYS.map((item) => (
                  <option key={item.day} value={item.day}>
                    Day {item.day} · {item.title_hi}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-3 text-sm font-semibold text-[#8d6b2f]">{day.block_hi}</p>
            <h2 className="text-2xl leading-snug text-[#1b4a38]">{day.title_hi}</h2>
            <p className="text-base text-[#5f6b4e]">{day.short}</p>
            <Link to={`/classroom/day/${day.day}`} className="mt-3 flex h-12 items-center justify-center rounded-2xl border border-[#1a4d3c] text-base font-semibold text-[#1a4d3c]">
              Is din ka board
            </Link>
            {day.day <= 30 ? <VideoLinkPaste day={day.day} /> : null}
            <ol className="mt-4 space-y-4">
              {SECTION_ORDER.map((key) => (
                <SectionEditor key={key} dayNumber={day.day} section={key} revision={revision} remoteOk={remote.ok} rows={remote.rows} />
              ))}
            </ol>
          </>
        ) : (
          <p className="mt-4 text-base text-[#1b4a38]">Video lagane ke liye Edit mode on karein.</p>
        )}
      </article>
    </Shell>
  );
}

function SectionEditor({
  dayNumber,
  section,
  revision,
  remoteOk,
  rows,
}: {
  dayNumber: number;
  section: SectionKey;
  revision: number;
  remoteOk: boolean;
  rows: Parameters<typeof boardClips>[0]["rows"];
}) {
  const day = classroomDay(dayNumber);
  if (!day) return null;
  const clips = boardClips({
    remoteOk,
    rows,
    day: dayNumber,
    section,
    catalogue: day.sections[section],
    browserFiles: browserFileClips(dayNumber, section),
  });
  return (
    <li id={`admin-section-${section}`} data-admin-section={section} data-revision={revision}>
      <h3 className="text-lg font-semibold text-[#1b4a38]">{SECTION_LABEL[section]}</h3>
      <SectionAttach
        day={dayNumber}
        section={section}
        clips={clips}
        onChange={() => window.dispatchEvent(new Event("hajcare-attachments"))}
      />
    </li>
  );
}
