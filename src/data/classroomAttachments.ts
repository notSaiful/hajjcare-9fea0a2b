/**
 * Preview-only video lists. YouTube links stay in localStorage.
 * Device files stay in IndexedDB. Nothing is uploaded and nothing is written
 * to the database. The catalogue file is never deleted.
 *
 * Later, after approval, each section in classroom_days.content can hold
 * either one object or an array of up to 3:
 * { youtubeId, durationLabel, language, citation, maslak }
 * maslak is "shia", "sunni", or "neutral".
 * A device file would be stored only as a URL after an approved upload.
 * That is still one existing jsonb row per day. No new table, no RLS change,
 * and training_enrollments is not involved. This file does not do that save.
 */

import { MAX_SECTION_VIDEOS, SECTION_ORDER, sectionClips, type SectionKey, type SectionSlot } from "./classroomCatalogue";

export const ATTACHMENT_META_KEY = "hajcare-classroom-preview-attachments";
export const PREVIEW_SAVE_LABEL = "Preview: sirf is browser mein save";
const DB_NAME = "hajcare-classroom-preview";
const STORE = "files";
const MAX_FILE_BYTES = 80 * 1024 * 1024;

export type Maslak = "shia" | "sunni" | "neutral";

/** Sections where a one-sided Shia or Sunni list should be flagged. Quran and Doctor Corner stay exempt. */
export const MASLAK_SECTIONS: readonly SectionKey[] = ["hadith", "dua", "lesson", "expert", "naat"];

export interface PreviewClip {
  id: string;
  kind: "youtube" | "file" | "quiz" | "external";
  pageUrl?: string;
  platform?: string;
  uploader?: string;
  youtubeId?: string;
  sourceUrl?: string;
  fileSrc?: string;
  fileName?: string;
  mime?: string;
  title?: string;
  language?: string;
  duration?: string;
  maslak?: Maslak;
  startSeconds?: number;
  endSeconds?: number;
  note?: string;
}

export interface SectionPlaylist {
  day: number;
  section: SectionKey;
  clips: PreviewClip[];
}

export type AttachmentMap = Record<string, SectionPlaylist>;

export function attachmentKey(day: number, section: SectionKey): string {
  return `${day}:${section}`;
}

export function fileStoreKey(day: number, section: SectionKey, clipId: string): string {
  return clipId === "legacy" ? attachmentKey(day, section) : `${attachmentKey(day, section)}:${clipId}`;
}

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "youtu.be",
]);

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Accepts a normal YouTube watch, share, shorts, or embed link. */
export function youtubeIdFromUrl(raw: string): string | null {
  const text = raw.trim();
  if (!text) return null;
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return null;
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    return VIDEO_ID.test(id) ? id : null;
  }
  if (url.pathname === "/watch") {
    const id = url.searchParams.get("v") ?? "";
    return VIDEO_ID.test(id) ? id : null;
  }
  const parts = url.pathname.split("/").filter(Boolean);
  if ((parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live" || parts[0] === "v") && parts[1] && VIDEO_ID.test(parts[1])) {
    return parts[1];
  }
  return null;
}

function blankText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function clipId(): string {
  return `clip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function clipsFromSlot(slot: SectionSlot | undefined): PreviewClip[] {
  return sectionClips(slot).map((media, index) => ({
    id: `catalogue-${index}-${media.youtubeId ?? media.kind}`,
    kind: media.kind,
    youtubeId: media.youtubeId,
    fileSrc: media.fileSrc,
    title: media.citation,
    language: media.language ?? undefined,
    duration: media.durationLabel ?? undefined,
    maslak: media.maslak,
    pageUrl: media.pageUrl,
    platform: media.platform,
    uploader: media.uploader,
    startSeconds: media.startSeconds,
    endSeconds: media.endSeconds,
    note: media.note,
  }));
}

/** Stored list wins. Otherwise the catalogue clips are shown, still capped at 3. */
export function visibleClips(slot: SectionSlot | undefined, stored: PreviewClip[] | null): PreviewClip[] {
  if (stored) return stored.slice(0, MAX_SECTION_VIDEOS);
  return clipsFromSlot(slot);
}

function asClip(value: Partial<PreviewClip> | null | undefined): PreviewClip | null {
  if (!value || (value.kind !== "youtube" && value.kind !== "file" && value.kind !== "quiz" && value.kind !== "external")) return null;
  return {
    id: value.id || "legacy",
    kind: value.kind,
    youtubeId: value.youtubeId,
    sourceUrl: value.sourceUrl,
    fileSrc: value.fileSrc,
    fileName: value.fileName,
    mime: value.mime,
    title: value.title,
    language: value.language,
    duration: value.duration,
    maslak: value.maslak === "shia" || value.maslak === "sunni" || value.maslak === "neutral" ? value.maslak : undefined,
    startSeconds: value.startSeconds,
    endSeconds: value.endSeconds,
    note: value.note,
    pageUrl: value.pageUrl,
    platform: value.platform,
    uploader: value.uploader,
  };
}

function asPlaylist(value: unknown): SectionPlaylist | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<SectionPlaylist> & Partial<PreviewClip> & { kind?: string };
  if (!SECTION_ORDER.includes(row.section as SectionKey)) return null;
  if (!Number.isInteger(row.day) || (row.day as number) < 1 || (row.day as number) > 100) return null;
  if (Array.isArray(row.clips)) {
    const clips = row.clips.map((clip) => asClip(clip)).filter((clip): clip is PreviewClip => Boolean(clip)).slice(0, MAX_SECTION_VIDEOS);
    return { day: row.day as number, section: row.section as SectionKey, clips };
  }
  const legacy = asClip(row);
  if (!legacy) return null;
  return { day: row.day as number, section: row.section as SectionKey, clips: [legacy] };
}

export function readAttachments(): AttachmentMap {
  if (typeof localStorage === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(ATTACHMENT_META_KEY) || "{}") as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const next: AttachmentMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const playlist = asPlaylist(value);
      if (playlist) next[key] = playlist;
    }
    return next;
  } catch {
    return {};
  }
}

function writeAttachments(map: AttachmentMap) {
  localStorage.setItem(ATTACHMENT_META_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("hajcare-attachments"));
}

export function storedClips(day: number, section: SectionKey, map = readAttachments()): PreviewClip[] | null {
  const row = map[attachmentKey(day, section)];
  return row ? row.clips : null;
}

export function attachmentsForDay(day: number, map = readAttachments()): SectionPlaylist[] {
  return SECTION_ORDER.map((section) => map[attachmentKey(day, section)]).filter((item): item is SectionPlaylist => Boolean(item));
}

export function commitClips(day: number, section: SectionKey, clips: readonly PreviewClip[]) {
  const map = readAttachments();
  map[attachmentKey(day, section)] = { day, section, clips: clips.slice(0, MAX_SECTION_VIDEOS) };
  writeAttachments(map);
}

function clipMaslak(value: string | undefined): Maslak {
  return value === "shia" || value === "sunni" ? value : "neutral";
}

/** "shia" or "sunni" when that side is tagged and the other side is missing. Neutral clips do not fill the gap. */
export function maslakGap(section: SectionKey, clips: readonly PreviewClip[]): "shia" | "sunni" | "empty" | null {
  if (!MASLAK_SECTIONS.includes(section)) return null;
  if (clips.length === 0) return "empty";
  let shia = false;
  let sunni = false;
  for (const clip of clips) {
    if (clip.maslak === "shia") shia = true;
    if (clip.maslak === "sunni") sunni = true;
  }
  if (shia && !sunni) return "shia";
  if (sunni && !shia) return "sunni";
  return null;
}

export function maslakWarning(section: SectionKey, clips: readonly PreviewClip[]): string | null {
  const gap = maslakGap(section, clips);
  if (gap === "shia") return "Sirf Shia tag hai. Sunni video bhi chahiye.";
  if (gap === "sunni") return "Sirf Sunni tag hai. Shia video bhi chahiye.";
  if (gap === "empty") return "Shia aur Sunni dono video chahiye.";
  return null;
}

export function setClipMaslak(day: number, section: SectionKey, clips: readonly PreviewClip[], clipIdToTag: string, maslak: Maslak) {
  commitClips(
    day,
    section,
    clips.map((clip) => (clip.id === clipIdToTag ? { ...clip, maslak } : clip)),
  );
}

export function saveYoutubeAttachment(input: {
  day: number;
  section: SectionKey;
  url: string;
  title?: string;
  language?: string;
  duration?: string;
  maslak?: string;
  /** Clips already on screen. Passed so a catalogue list is kept when a new one is added. */
  base?: readonly PreviewClip[];
  replaceId?: string;
}): { ok: true } | { ok: false; message: string } {
  const youtubeId = youtubeIdFromUrl(input.url);
  if (!youtubeId) return { ok: false, message: "Yeh YouTube link nahi hai." };
  const current = input.base ? [...input.base] : storedClips(input.day, input.section) ?? [];
  const nextClip: PreviewClip = {
    id: input.replaceId || clipId(),
    kind: "youtube",
    youtubeId,
    sourceUrl: input.url.trim(),
    title: blankText(input.title),
    language: blankText(input.language),
    duration: blankText(input.duration),
    maslak: clipMaslak(input.maslak),
  };
  if (input.replaceId) {
    const index = current.findIndex((clip) => clip.id === input.replaceId);
    if (index < 0) return { ok: false, message: "Yeh video nahi mili." };
    current[index] = { ...current[index], ...nextClip, id: input.replaceId };
  } else {
    if (current.length >= MAX_SECTION_VIDEOS) return { ok: false, message: "Is section mein teen video se zyada nahi." };
    current.push(nextClip);
  }
  commitClips(input.day, input.section, current);
  return { ok: true };
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putFile(key: string, blob: Blob) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function deleteFile(key: string) {
  if (typeof indexedDB === "undefined") return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function fileObjectUrl(day: number, section: SectionKey, clipId: string): Promise<string | null> {
  const blob = await readFileBlob(day, section, clipId);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function readFileBlob(day: number, section: SectionKey, clipId: string): Promise<Blob | null> {
  if (typeof indexedDB === "undefined") return null;
  const db = await openDb();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(fileStoreKey(day, section, clipId));
    request.onsuccess = () => resolve((request.result as Blob | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return blob;
}

export async function saveFileAttachment(input: {
  day: number;
  section: SectionKey;
  file: File;
  title?: string;
  language?: string;
  duration?: string;
  maslak?: string;
  base?: readonly PreviewClip[];
  replaceId?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!input.file.type.startsWith("video/")) return { ok: false, message: "Sirf video file chunein." };
  if (input.file.size > MAX_FILE_BYTES) return { ok: false, message: "Yeh file 80 MB se bari hai. Chhoti file chunein." };
  const current = input.base ? [...input.base] : storedClips(input.day, input.section) ?? [];
  const id = input.replaceId || clipId();
  if (!input.replaceId && current.length >= MAX_SECTION_VIDEOS) {
    return { ok: false, message: "Is section mein teen video se zyada nahi." };
  }
  await putFile(fileStoreKey(input.day, input.section, id), input.file);
  const nextClip: PreviewClip = {
    id,
    kind: "file",
    fileName: input.file.name,
    mime: input.file.type,
    title: blankText(input.title) || input.file.name,
    language: blankText(input.language),
    duration: blankText(input.duration),
    maslak: clipMaslak(input.maslak),
  };
  if (input.replaceId) {
    const index = current.findIndex((clip) => clip.id === input.replaceId);
    if (index < 0) return { ok: false, message: "Yeh video nahi mili." };
    current[index] = nextClip;
  } else {
    current.push(nextClip);
  }
  commitClips(input.day, input.section, current);
  return { ok: true };
}

export function moveClip(day: number, section: SectionKey, clips: readonly PreviewClip[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (index < 0 || next < 0 || index >= clips.length || next >= clips.length) return;
  const copy = [...clips];
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  commitClips(day, section, copy);
}

export async function removeClip(day: number, section: SectionKey, clips: readonly PreviewClip[], clipIdToRemove: string) {
  const clip = clips.find((item) => item.id === clipIdToRemove);
  commitClips(day, section, clips.filter((item) => item.id !== clipIdToRemove));
  if (clip?.kind === "file" && !clip.fileSrc) await deleteFile(fileStoreKey(day, section, clip.id));
}

export async function removeAttachment(day: number, section: SectionKey) {
  const key = attachmentKey(day, section);
  const map = readAttachments();
  const current = map[key];
  delete map[key];
  writeAttachments(map);
  for (const clip of current?.clips ?? []) {
    if (clip.kind === "file" && !clip.fileSrc) await deleteFile(fileStoreKey(day, section, clip.id));
  }
}
