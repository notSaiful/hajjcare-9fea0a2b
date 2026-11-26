import { useMemo } from "react";
import { classroomDay, SECTION_LABEL, SECTION_ORDER, type SectionKey } from "@/data/classroomCatalogue";
import { browserFileClips } from "@/data/classroomAttachments";
import { applyStoredOverride, useVideoOverrideRevision } from "@/data/classroomOverrides";
import { boardClips, type ClassroomVideoRow } from "@/data/classroomVideoRows";
import { cellStatus, clipCheckTarget, readMismatch, useMismatchRevision, useVideoPlayMap, type CellStatus } from "@/data/classroomVideoStatus";
import { VideoLinkPaste } from "@/components/classroom/VideoLinkPaste";

const SHORT: Record<SectionKey, string> = {
  quran: "Quran",
  hadith: "Hadith",
  dua: "Dua",
  lesson: "Arkan",
  doctor: "Doctor",
  expert: "Expert",
  naat: "Naat",
  quiz: "Quiz",
};

const BADGE: Record<CellStatus, string> = {
  "has-video": "bg-[#1a4d3c] text-[#f7f1e4]",
  missing: "bg-[#8a2a2a] text-white",
  "not-playing": "bg-[#b7791f] text-white",
  unchecked: "bg-[#e4dcc8] text-[#1b4a38]",
  mismatched: "bg-[#5b3a8c] text-white",
};

const LABEL: Record<CellStatus, string> = {
  "has-video": "Has video",
  missing: "Missing",
  "not-playing": "Not playing",
  unchecked: "Unchecked",
  mismatched: "Mismatched",
};

export function VideoStatusDashboard({
  remoteOk,
  rows,
  day,
  section,
  onPick,
}: {
  remoteOk: boolean;
  rows: ClassroomVideoRow[];
  day: number;
  section: SectionKey | null;
  onPick: (day: number, section: SectionKey) => void;
}) {
  const overrideRevision = useVideoOverrideRevision();
  const mismatchRevision = useMismatchRevision();
  const cells = useMemo(() => {
    if (overrideRevision + mismatchRevision < 0) return [];
    return Array.from({ length: 30 }, (_, index) => {
      const dayNumber = index + 1;
      const content = classroomDay(dayNumber);
      return SECTION_ORDER.map((key) => {
        const catalogue = boardClips({
          remoteOk,
          rows,
          day: dayNumber,
          section: key,
          catalogue: content?.sections[key],
          browserFiles: browserFileClips(dayNumber, key),
        });
        const clips = remoteOk ? catalogue : applyStoredOverride(dayNumber, key, catalogue);
        const target = clipCheckTarget(clips);
        return {
          day: dayNumber,
          section: key,
          clips,
          url: target.kind === "check" ? target.url : "",
          mismatched: Boolean(readMismatch(dayNumber, key)),
          note: readMismatch(dayNumber, key)?.note || "",
        };
      });
    });
  }, [remoteOk, rows, overrideRevision, mismatchRevision]);
  const urls = useMemo(() => cells.flat().map((cell) => cell.url).filter(Boolean), [cells]);
  const play = useVideoPlayMap(urls);
  const statuses = cells.map((row) => row.map((cell) => cellStatus(cell.clips, cell.url ? play[cell.url] : undefined, cell.mismatched)));
  const counts = statuses.flat().reduce<Record<CellStatus, number>>((total, status) => {
    total[status] += 1;
    return total;
  }, { "has-video": 0, missing: 0, "not-playing": 0, unchecked: 0, mismatched: 0 });

  return (
    <section data-video-dashboard className="mt-4" aria-label="Days 1 to 30 video status">
      <h2 className="text-2xl text-[#1b4a38]">Days 1–30</h2>
      <p className="mt-1 text-sm text-[#6d6456]">
        Green is a video oEmbed or HEAD confirmed. Amber failed that check. Grey is unchecked, not a guess. Purple is an admin flag, not an automatic content check.
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-2">
        {(Object.keys(LABEL) as CellStatus[]).map((status) => (
          <div key={status} className={`rounded-2xl px-3 py-2 ${BADGE[status]}`} data-count={status}>
            <dt className="text-xs font-semibold">{LABEL[status]}</dt>
            <dd className="text-2xl font-semibold">{counts[status]}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[44rem] border-separate border-spacing-1 text-left">
          <thead>
            <tr>
              <th className="sticky left-0 bg-[#f7f1e4] px-2 py-1 text-xs text-[#6d6456]">Day</th>
              {SECTION_ORDER.map((key) => (
                <th key={key} className="px-1 py-1 text-xs font-semibold text-[#1b4a38]">{SHORT[key]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, rowIndex) => (
              <tr key={row[0].day}>
                <th className="sticky left-0 bg-[#f7f1e4] px-2 text-sm font-semibold text-[#1b4a38]">{row[0].day}</th>
                {row.map((cell, column) => {
                  const status = statuses[rowIndex][column];
                  const selected = day === cell.day && section === cell.section;
                  return (
                    <td key={cell.section}>
                      <button
                        type="button"
                        data-cell={`${cell.day}:${cell.section}`}
                        data-status={status}
                        title={cell.note || `${LABEL[status]} · ${SECTION_LABEL[cell.section]}`}
                        aria-pressed={selected}
                        className={`h-12 w-full min-w-[4.75rem] rounded-xl px-1 text-[11px] font-semibold leading-tight ${BADGE[status]} ${selected ? "ring-2 ring-[#1b4a38]" : ""}`}
                        onClick={() => onPick(cell.day, cell.section)}
                      >
                        {LABEL[status]}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {section && day >= 1 && day <= 30 ? (
        <VideoLinkPaste day={day} section={section} onSectionChange={(next) => onPick(day, next)} />
      ) : (
        <p className="mt-3 text-sm text-[#6d6456]">Ek cell chuniye. Paste, preview, aur revert usi hisse ke liye khulega.</p>
      )}
    </section>
  );
}
