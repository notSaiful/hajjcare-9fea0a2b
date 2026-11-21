import { useEffect, useState } from "react";
import {
  PREVIEW_SAVE_LABEL,
  removeAttachment,
  saveFileAttachment,
  saveYoutubeAttachment,
  type PreviewAttachment,
} from "@/data/classroomAttachments";
import type { SectionKey } from "@/data/classroomCatalogue";

export function SectionAttach({
  day,
  section,
  attachment,
  onChange,
}: {
  day: number;
  section: SectionKey;
  attachment: PreviewAttachment | undefined;
  onChange: () => void;
}) {
  const [form, setForm] = useState(false);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTitle(attachment?.title ?? "");
    setLanguage(attachment?.language ?? "");
    setDuration(attachment?.duration ?? "");
    setError("");
  }, [attachment]);

  const details = { title, language, duration };

  async function saveLink(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = saveYoutubeAttachment({ day, section, url: link, ...details });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setLink("");
    setForm(false);
    setError("");
    onChange();
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const result = await saveFileAttachment({ day, section, file, ...details });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setForm(false);
    setError("");
    onChange();
  }

  async function clear() {
    setBusy(true);
    await removeAttachment(day, section);
    setBusy(false);
    setForm(false);
    onChange();
  }

  return (
    <div data-attach={section} className="mt-2 rounded-2xl border border-[#e6d3a1] bg-[#fffaf0] p-3">
      <p className="text-sm font-semibold text-[#8d6b2f]">{PREVIEW_SAVE_LABEL}</p>
      {attachment ? (
        <p className="mt-1 text-sm text-[#1b4a38]">
          Lagi hui video: {attachment.title || attachment.fileName || attachment.youtubeId}
        </p>
      ) : null}
      {attachment ? (
        <div className="mt-2 flex gap-2">
          <button type="button" className="h-12 flex-1 rounded-2xl bg-[#1a4d3c] text-base font-semibold text-[#f7f1e4]" onClick={() => setForm((open) => !open)}>
            Badlein
          </button>
          <button type="button" className="h-12 flex-1 rounded-2xl border border-[#1a4d3c] text-base font-semibold text-[#1a4d3c]" onClick={() => void clear()} disabled={busy}>
            Hatayein
          </button>
        </div>
      ) : null}
      {!attachment && !form ? (
        <button
          type="button"
          className="mt-2 h-12 w-full rounded-2xl bg-[#1a4d3c] text-base font-semibold text-[#f7f1e4]"
          onClick={() => setForm(true)}
        >
          Video lagayein
        </button>
      ) : null}
      {form ? (
        <form className="mt-3 space-y-2" onSubmit={(event) => void saveLink(event)}>
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

