import { useState } from "react";
import { MAX_SECTION_VIDEOS, type SectionKey } from "@/data/classroomCatalogue";
import {
  PREVIEW_SAVE_LABEL,
  maslakWarning,
  moveClip,
  removeClip,
  saveFileAttachment,
  saveYoutubeAttachment,
  setClipMaslak,
  type Maslak,
  type PreviewClip,
} from "@/data/classroomAttachments";

export function SectionAttach({
  day,
  section,
  clips,
  onChange,
}: {
  day: number;
  section: SectionKey;
  clips: PreviewClip[];
  onChange: () => void;
}) {
  const [form, setForm] = useState(false);
  const [replaceId, setReplaceId] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [duration, setDuration] = useState("");
  const [maslak, setMaslak] = useState<Maslak>("neutral");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const details = { title, language, duration, maslak, base: clips };
  const warning = maslakWarning(section, clips);

  function openAdd() {
    setReplaceId(null);
    setLink("");
    setTitle("");
    setLanguage("");
    setDuration("");
    setMaslak("neutral");
    setError("");
    setForm(true);
  }

  function openReplace(clip: PreviewClip) {
    setReplaceId(clip.id);
    setLink(clip.sourceUrl ?? "");
    setTitle(clip.title ?? "");
    setLanguage(clip.language ?? "");
    setDuration(clip.duration ?? "");
    setMaslak(clip.maslak ?? "neutral");
    setError("");
    setForm(true);
  }

  async function saveLink(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = saveYoutubeAttachment({ day, section, url: link, ...details, replaceId: replaceId ?? undefined });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setForm(false);
    setReplaceId(null);
    onChange();
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const result = await saveFileAttachment({ day, section, file, ...details, replaceId: replaceId ?? undefined });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setForm(false);
    setReplaceId(null);
    onChange();
  }

  return (
    <div data-attach={section} className="mt-2 rounded-2xl border border-[#e6d3a1] bg-[#fffaf0] p-3">
      <p className="text-sm font-semibold text-[#8d6b2f]">{PREVIEW_SAVE_LABEL}</p>
      <p className="mt-1 text-sm text-[#1b4a38]">{clips.length} / {MAX_SECTION_VIDEOS} video</p>
      {warning ? (
        <p className="mt-2 rounded-2xl bg-[#f4e4c4] px-3 py-2 text-sm font-semibold text-[#6b4a16]" role="status" data-maslak-warning={section}>
          {warning}
        </p>
      ) : null}
      <ol className="mt-2 space-y-2">
        {clips.map((clip, index) => (
          <li key={clip.id} className="rounded-2xl border border-[#e7dcc4] bg-white p-3">
            <p className="text-sm font-semibold text-[#8d6b2f]">Video {index + 1}/{clips.length}</p>
            <p className="text-base text-[#1b4a38]">{clip.title || clip.fileName || clip.youtubeId}</p>
            <label className="mt-2 block text-sm font-semibold text-[#1b4a38]">
              Maslak
              <select
                value={clip.maslak ?? "neutral"}
                aria-label={`${section} video ${index + 1} maslak`}
                className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] bg-white px-3 text-base"
                onChange={(event) => {
                  setClipMaslak(day, section, clips, clip.id, event.target.value as Maslak);
                  onChange();
                }}
              >
                <option value="neutral">Neutral</option>
                <option value="sunni">Sunni</option>
                <option value="shia">Shia</option>
              </select>
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" className="h-11 rounded-2xl border border-[#1a4d3c] text-sm font-semibold text-[#1a4d3c]" disabled={index === 0} onClick={() => { moveClip(day, section, clips, index, -1); onChange(); }}>
                Upar
              </button>
              <button type="button" className="h-11 rounded-2xl border border-[#1a4d3c] text-sm font-semibold text-[#1a4d3c]" disabled={index === clips.length - 1} onClick={() => { moveClip(day, section, clips, index, 1); onChange(); }}>
                Neeche
              </button>
              <button type="button" className="h-11 rounded-2xl bg-[#1a4d3c] text-sm font-semibold text-[#f7f1e4]" onClick={() => openReplace(clip)}>
                Badlein
              </button>
              <button type="button" className="h-11 rounded-2xl border border-[#1a4d3c] text-sm font-semibold text-[#1a4d3c]" disabled={busy} onClick={() => { void removeClip(day, section, clips, clip.id).then(onChange); }}>
                Hatayein
              </button>
            </div>
          </li>
        ))}
      </ol>
      {clips.length < MAX_SECTION_VIDEOS && !form ? (
        <button type="button" className="mt-3 h-12 w-full rounded-2xl bg-[#1a4d3c] text-base font-semibold text-[#f7f1e4]" onClick={openAdd}>
          Video lagayein
        </button>
      ) : null}
      {form ? (
        <form className="mt-3 space-y-2" onSubmit={(event) => void saveLink(event)}>
          <p className="text-sm font-semibold text-[#1b4a38]">{replaceId ? "Video badlein" : "Nayi video"}</p>
          <label className="block text-sm font-semibold text-[#1b4a38]">
            YouTube link
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="https://www.youtube.com/watch?v="
              className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] bg-white px-3 text-base"
              inputMode="url"
              aria-label={`${section} YouTube link`}
            />
          </label>
          <button type="submit" className="h-12 w-full rounded-2xl border border-[#1a4d3c] text-base font-semibold text-[#1a4d3c]" disabled={busy}>
            Link lagayein
          </button>
          <label className="flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-[#e6d3a1] bg-white text-base font-semibold text-[#1b4a38]">
            Device se video chunein
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              aria-label={`${section} video file`}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                void onFile(file);
              }}
            />
          </label>
          <label className="block text-sm font-semibold text-[#1b4a38]">
            Title (optional)
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] bg-white px-3 text-base" />
          </label>
          <label className="block text-sm font-semibold text-[#1b4a38]">
            Maslak
            <select value={maslak} onChange={(event) => setMaslak(event.target.value as Maslak)} className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] bg-white px-3 text-base" aria-label={`${section} new maslak`}>
              <option value="neutral">Neutral</option>
              <option value="sunni">Sunni</option>
              <option value="shia">Shia</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm font-semibold text-[#1b4a38]">
              Zaban
              <input value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] bg-white px-3 text-base" />
            </label>
            <label className="block text-sm font-semibold text-[#1b4a38]">
              Duration
              <input value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="4:10" className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] bg-white px-3 text-base" />
            </label>
          </div>
          {error ? <p className="text-sm font-semibold text-[#8a2a2a]" role="alert">{error}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
