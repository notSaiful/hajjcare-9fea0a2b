/**
 * Preview-only video attachments. YouTube links stay in localStorage.
 * Device files stay in IndexedDB. Nothing is uploaded and nothing is written
 * to the database. Removing an attachment restores the catalogue section.
 *
 * Later, after approval, the same fields can be copied into
 * classroom_days.content.sections[section] as
 * { youtubeId, durationLabel, language, citation } or, for a device file,
 * a storage URL once an approved upload exists. That is one existing jsonb
 * row per day. It does not need a new table, an RLS change, or
 * training_enrollments. This file does not do that save.
 */

import { SECTION_ORDER, type SectionKey } from "./classroomCatalogue";

export const ATTACHMENT_META_KEY = "hajcare-classroom-preview-attachments";
export const PREVIEW_SAVE_LABEL = "Preview: sirf is browser mein save";
const DB_NAME = "hajcare-classroom-preview";
const STORE = "files";
const MAX_FILE_BYTES = 80 * 1024 * 1024;

export interface PreviewAttachment {
  day: number;
  section: SectionKey;
  kind: "youtube" | "file";
  youtubeId?: string;
  sourceUrl?: string;
  fileName?: string;
  mime?: string;
  title?: string;
  language?: string;
  duration?: string;
}

export type AttachmentMap = Record<string, PreviewAttachment>;

export function attachmentKey(day: number, section: SectionKey): string {
  return `${day}:${section}`;
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

export function readAttachments(): AttachmentMap {
  if (typeof localStorage === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(ATTACHMENT_META_KEY) || "{}") as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const next: AttachmentMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, PreviewAttachment>)) {
      if (!value || (value.kind !== "youtube" && value.kind !== "file")) continue;
      if (!SECTION_ORDER.includes(value.section)) continue;
      if (!Number.isInteger(value.day) || value.day < 1 || value.day > 100) continue;
      next[key] = value;
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

export function attachmentsForDay(day: number, map = readAttachments()): PreviewAttachment[] {
  return SECTION_ORDER.map((section) => map[attachmentKey(day, section)]).filter((item): item is PreviewAttachment => Boolean(item));
}

export function saveYoutubeAttachment(input: {
  day: number;
  section: SectionKey;
  url: string;
  title?: string;
  language?: string;
  duration?: string;
}): { ok: true } | { ok: false; message: string } {
  const youtubeId = youtubeIdFromUrl(input.url);
  if (!youtubeId) return { ok: false, message: "Yeh YouTube link nahi hai." };
  const map = readAttachments();
  const key = attachmentKey(input.day, input.section);
  const previous = map[key];
  map[key] = {
    day: input.day,
    section: input.section,
    kind: "youtube",
    youtubeId,
    sourceUrl: input.url.trim(),
    title: blankText(input.title),
    language: blankText(input.language),
    duration: blankText(input.duration),
  };
  writeAttachments(map);
  if (previous?.kind === "file") void deleteFile(key);
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

export async function fileObjectUrl(day: number, section: SectionKey): Promise<string | null> {
  const blob = await readFileBlob(day, section);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function readFileBlob(day: number, section: SectionKey): Promise<Blob | null> {
  if (typeof indexedDB === "undefined") return null;
  const db = await openDb();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(attachmentKey(day, section));
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
}): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!input.file.type.startsWith("video/")) return { ok: false, message: "Sirf video file chunein." };
  if (input.file.size > MAX_FILE_BYTES) return { ok: false, message: "Yeh file 80 MB se bari hai. Chhoti file chunein." };
  const key = attachmentKey(input.day, input.section);
  await putFile(key, input.file);
  const map = readAttachments();
  map[key] = {
    day: input.day,
    section: input.section,
    kind: "file",
    fileName: input.file.name,
    mime: input.file.type,
    title: blankText(input.title),
    language: blankText(input.language),
    duration: blankText(input.duration),
  };
  writeAttachments(map);
  return { ok: true };
}

export async function removeAttachment(day: number, section: SectionKey) {
  const key = attachmentKey(day, section);
  const map = readAttachments();
  const current = map[key];
  delete map[key];
  writeAttachments(map);
  if (current?.kind === "file") await deleteFile(key);
}
