import { useState } from "react";
import { MAX_SECTION_VIDEOS, type SectionKey } from "@/data/classroomCatalogue";
import {
  maslakWarning,
  moveClip,
  removeClip,
  saveFileAttachment,
  setClipMaslak,
  youtubeIdFromUrl,
  type Maslak,
  type PreviewClip,
} from "@/data/classroomAttachments";
import { saveClassroomSection } from "@/data/classroomRemote";
import { platformForUrl } from "@/data/classroomVideoRows";
import { useAuth } from "@/hooks/useAuth";

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
  const { session } = useAuth();
  const details = { title, language, duration, maslak };
  const warning = maslakWarning(section, clips);
  const links = clips.filter((clip) => clip.kind !== "file");
  const files = clips.filter((clip) => clip.kind === "file");

  async function persist(nextLinks: PreviewClip[]) {
    setBusy(true);
    const result = await saveClassroomSection({ day, section, clips: nextLinks, token: session?.access_token });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return false;
    }
    onChange();
    return true;
  }

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
    const youtubeId = youtubeIdFromUrl(link);
    if (!youtubeId && !link.trim().startsWith("https://")) {
      setError("Yeh link nahi hai.");
      return;
    }
    const nextClip: PreviewClip = {
      id: replaceId || `remote-new-${Date.now()}`,
      kind: youtubeId ? "youtube" : "external",
      youtubeId: youtubeId ?? undefined,
      sourceUrl: link.trim(),
      pageUrl: youtubeId ? undefined : link.trim(),
      platform: platformForUrl(link.trim()),
      title: title.trim() || undefined,
      language: language.trim() || undefined,
      duration: duration.trim() || undefined,
      maslak,
    };
    const next = [...links];
    if (replaceId) {
      const index = next.findIndex((clip) => clip.id === replaceId);
      if (index < 0) {
        setError("Yeh video nahi mili.");
        return;
      }
      next[index] = { ...next[index], ...nextClip, id: replaceId };
    } else if (clips.length >= MAX_SECTION_VIDEOS) {
      setError("Is section mein teen video se zyada nahi.");
      return;
    } else {
      next.push(nextClip);
    }
    if (await persist(next)) {
      setForm(false);
      setReplaceId(null);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const replacing = clips.find((clip) => clip.id === replaceId);
    if (replacing && replacing.kind !== "file") {
      const removed = await saveClassroomSection({
        day,
        section,
        clips: links.filter((clip) => clip.id !== replacing.id),
        token: session?.access_token,
      });
      if (!removed.ok) {
        setBusy(false);
        setError(removed.message);
        return;
      }
    }
    const result = await saveFileAttachment({
      day,
      section,
      file,
      ...details,
      base: files,
      replaceId: replacing?.kind === "file" ? replacing.id : undefined,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setForm(false);
    setReplaceId(null);
    onChange();
  }

  function onTag(clip: PreviewClip, nextTag: Maslak) {
    if (clip.kind === "file") {
      setClipMaslak(day, section, files, clip.id, nextTag);
      onChange();
      return;
    }
    void persist(links.map((item) => (item.id === clip.id ? { ...item, maslak: nextTag } : item)));
  }

  function onMove(clip: PreviewClip, direction: -1 | 1) {
    if (clip.kind === "file") {
      const index = files.findIndex((item) => item.id === clip.id);
      moveClip(day, section, files, index, direction);
      onChange();
      return;
    }
    const index = links.findIndex((item) => item.id === clip.id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= links.length) return;
    const copy = [...links];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    void persist(copy);
  }

  function onRemove(clip: PreviewClip) {
    if (clip.kind === "file") {
      void removeClip(day, section, files, clip.id).then(onChange);
      return;
    }
    void persist(links.filter((item) => item.id !== clip.id));
  }

  return (
    <div data-attach={section} className="mt-2 rounded-2xl border border-[#e6d3a1] bg-[#fffaf0] p-3">
      <p className="text-sm font-semibold text-[#8d6b2f]">Link server par save hota hai. Device file sirf is browser mein rehti hai.</p>
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
            <p className="text-base text-[#1b4a38]">
              {clip.title || clip.fileName || clip.youtubeId}
              {clip.reviewPending ? <span className="ml-2 rounded-full bg-[#f4e4c4] px-2 py-0.5 text-xs font-semibold text-[#6b4a16]" data-review-badge>Review baaki</span> : null}
            </p>
            <label className="mt-2 block text-sm font-semibold text-[#1b4a38]">
              Maslak
              <select
                value={clip.maslak ?? "neutral"}
                aria-label={`${section} video ${index + 1} maslak`}
                className="mt-1 h-12 w-full rounded-2xl border border-[#e4dcc8] bg-white px-3 text-base"
                onChange={(event) => onTag(clip, event.target.value as Maslak)}
              >
                <option value="neutral">Neutral</option>
                <option value="sunni">Sunni</option>
                <option value="shia">Shia</option>
              </select>
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" className="h-11 rounded-2xl border border-[#1a4d3c] text-sm font-semibold text-[#1a4d3c]" disabled={index === 0 || busy} onClick={() => onMove(clip, -1)}>
                Upar
              </button>
              <button type="button" className="h-11 rounded-2xl border border-[#1a4d3c] text-sm font-semibold text-[#1a4d3c]" disabled={index === clips.length - 1 || busy} onClick={() => onMove(clip, 1)}>
                Neeche
              </button>
              <button type="button" className="h-11 rounded-2xl bg-[#1a4d3c] text-sm font-semibold text-[#f7f1e4]" onClick={() => openReplace(clip)}>
                Badlein
              </button>
              <button type="button" className="h-11 rounded-2xl border border-[#1a4d3c] text-sm font-semibold text-[#1a4d3c]" disabled={busy} onClick={() => onRemove(clip)}>
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
            Device se video chunein (sirf is browser)
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
