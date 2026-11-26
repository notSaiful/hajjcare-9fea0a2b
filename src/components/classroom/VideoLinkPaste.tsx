import { useEffect, useMemo, useState } from "react";
import { classroomDay, SECTION_LABEL, type SectionKey } from "@/data/classroomCatalogue";
import { clipsFromSlot, type Maslak } from "@/data/classroomAttachments";
import { clearVideoOverride, readVideoOverride, writeVideoOverride } from "@/data/classroomOverrides";
import { parseClassroomVideoLink } from "@/data/classroomVideoLink";
import { clearMismatch, readMismatch, useMismatchRevision, writeMismatch } from "@/data/classroomVideoStatus";

const PASTE_SECTIONS: SectionKey[] = ["quran", "hadith", "dua", "lesson", "doctor", "expert", "naat"];

export function VideoLinkPaste({ day, section: sectionProp, onSectionChange }: { day: number; section?: SectionKey; onSectionChange?: (section: SectionKey) => void }) {
  const [sectionState, setSectionState] = useState<SectionKey>(sectionProp ?? "lesson");
  const section = sectionProp ?? sectionState;
  function setSection(next: SectionKey) {
    setSectionState(next);
    onSectionChange?.(next);
  }
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [maslak, setMaslak] = useState<Maslak>("neutral");
  const [message, setMessage] = useState("");
  const content = classroomDay(day);
  const original = useMemo(() => (content ? clipsFromSlot(content.sections[section]) : []), [content, section]);
  const parsed = parseClassroomVideoLink(link);
  const saved = readVideoOverride(day, section);
  useMismatchRevision();
  const mismatch = readMismatch(day, section);
  const [mismatchNote, setMismatchNote] = useState(mismatch?.note ?? "");
  useEffect(() => {
    setMismatchNote(readMismatch(day, section)?.note ?? "");
  }, [day, section]);
  const originalYoutube = original.find((clip) => clip.kind === "youtube" && clip.youtubeId);

  if (day > 30) return <p className="mt-3 text-sm text-[#6d6456]">Paste link din 1 se 30 tak hai.</p>;

  function save(mode: "replace" | "add") {
    if (!parsed) {
      setMessage("Sirf YouTube link ya seedha https mp4/webm link chalega.");
      return;
    }
    writeVideoOverride(day, section, { ...parsed, mode, note: note.trim() || undefined, maslak });
    setMessage(mode === "add" ? "Video add ho gayi. Yeh browser ab nayi video dikhata hai." : "Video badal gayi. Revert se purani video wapas aati hai.");
  }

  return (
    <section data-paste-panel className="mt-4 rounded-3xl border border-[#e6d3a1] bg-white p-3" aria-label="Paste video link">
      <h2 className="text-lg font-semibold text-[#1b4a38]">Paste video link</h2>
      <p className="mt-1 text-sm text-[#6d6456]">Din {day}, {SECTION_LABEL[section]}. Server table abhi nahi hai, is liye yeh save is browser mein rehti hai.</p>
      <label className="mt-3 block text-sm font-semibold text-[#1b4a38]">
        Hissa
        <select data-paste-section className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] px-3" value={section} onChange={(event) => { setSection(event.target.value as SectionKey); setMessage(""); }}>
          {PASTE_SECTIONS.map((key) => <option key={key} value={key}>{SECTION_LABEL[key]}</option>)}
        </select>
      </label>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-[#8d6b2f]">Abhi ki video</p>
          {originalYoutube?.youtubeId ? (
            <iframe title="Current video" className="mt-2 aspect-video w-full rounded-2xl bg-black" src={`https://www.youtube-nocookie.com/embed/${originalYoutube.youtubeId}`} allowFullScreen />
          ) : (
            <p className="mt-2 rounded-2xl bg-[#f7f1e4] px-3 py-4 text-sm text-[#1b4a38]">{original[0]?.title || "Is hisse mein abhi video nahi."}</p>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#8d6b2f]">Nayi video, save se pehle</p>
          {parsed?.kind === "youtube" ? (
            <iframe data-paste-preview title="New video preview" className="mt-2 aspect-video w-full rounded-2xl bg-black" src={parsed.embed} allowFullScreen />
          ) : parsed?.kind === "file" ? (
            <video data-paste-preview className="mt-2 w-full rounded-2xl bg-black" controls src={parsed.url} />
          ) : (
            <p className="mt-2 rounded-2xl bg-[#f7f1e4] px-3 py-4 text-sm text-[#6d6456]">Link paste kijiye.</p>
          )}
        </div>
      </div>
      <label className="mt-3 block text-sm font-semibold text-[#1b4a38]">
        Video link
        <input data-paste-url value={link} onChange={(event) => { setLink(event.target.value); setMessage(""); }} placeholder="https://www.youtube.com/watch?v=" className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] px-3" inputMode="url" />
      </label>
      <label className="mt-2 block text-sm font-semibold text-[#1b4a38]">
        Note (optional)
        <input data-paste-note value={note} onChange={(event) => setNote(event.target.value)} placeholder="maslak: Shia / Sunni / neutral" className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] px-3" />
      </label>
      <label className="mt-2 block text-sm font-semibold text-[#1b4a38]">
        Maslak
        <select data-paste-maslak className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] px-3" value={maslak} onChange={(event) => setMaslak(event.target.value as Maslak)}>
          <option value="neutral">Neutral</option>
          <option value="sunni">Sunni</option>
          <option value="shia">Shia</option>
        </select>
      </label>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" data-paste-replace className="h-12 rounded-2xl bg-[#1a4d3c] text-sm font-semibold text-[#f7f1e4]" onClick={() => save("replace")}>Replace</button>
        <button type="button" data-paste-add className="h-12 rounded-2xl border border-[#1a4d3c] text-sm font-semibold text-[#1a4d3c]" onClick={() => save("add")}>Add</button>
        <button type="button" data-paste-revert className="col-span-2 h-12 rounded-2xl border border-[#8d6b2f] text-sm font-semibold text-[#8d6b2f]" disabled={!saved} onClick={() => { clearVideoOverride(day, section); setMessage("Purani video wapas aa gayi."); }}>Revert to original</button>
      </div>
      {message ? <p data-paste-status className="mt-2 text-sm font-semibold text-[#1b4a38]" role="status">{message}</p> : null}
      {link.trim() && !parsed ? <p className="mt-2 text-sm font-semibold text-[#8a2a2a]" role="alert">Sirf YouTube link ya seedha https mp4/webm link chalega.</p> : null}
      <label className="mt-3 flex min-h-12 items-center gap-3 rounded-2xl border border-[#5b3a8c] bg-[#f6f1fb] px-3 py-2">
        <input
          data-flag-mismatch
          type="checkbox"
          className="h-6 w-6"
          checked={Boolean(mismatch)}
          onChange={(event) => {
            if (event.target.checked) writeMismatch(day, section, mismatchNote);
            else clearMismatch(day, section);
          }}
        />
        <span>
          <span className="block text-sm font-semibold text-[#5b3a8c]">Flag mismatch</span>
          <span className="block text-xs text-[#6d6456]">Manual only. Yeh content check nahi karta.</span>
        </span>
      </label>
      <label className="mt-2 block text-sm font-semibold text-[#5b3a8c]">
        Mismatch note
        <input
          data-mismatch-note
          value={mismatchNote}
          onChange={(event) => {
            setMismatchNote(event.target.value);
            if (mismatch) writeMismatch(day, section, event.target.value);
          }}
          placeholder="Topic se video alag hai"
          className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] px-3 text-[#1b4a38]"
        />
      </label>
    </section>
  );
}
