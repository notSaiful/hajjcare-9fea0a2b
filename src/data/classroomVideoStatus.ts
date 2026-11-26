import { useEffect, useState } from "react";
import type { SectionKey } from "./classroomCatalogue";
import type { PreviewClip } from "./classroomAttachments";

export type CellStatus = "has-video" | "missing" | "not-playing" | "unchecked" | "mismatched";
export type PlayState = "playing" | "not-playing" | "unchecked";

const FLAG_KEY = "hajcare-classroom-mismatch-flags";
export const MISMATCH_EVENT = "hajcare-video-mismatch";
const CHECK_PREFIX = "hajcare-video-check:";

export type MismatchFlag = { note?: string };

type FlagStore = Record<string, MismatchFlag>;

function slot(day: number, section: SectionKey): string {
  return `${day}:${section}`;
}

function readFlags(): FlagStore {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(FLAG_KEY) || "{}") as FlagStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function readMismatch(day: number, section: SectionKey): MismatchFlag | null {
  return readFlags()[slot(day, section)] ?? null;
}

export function writeMismatch(day: number, section: SectionKey, note: string): void {
  const all = readFlags();
  const trimmed = note.trim();
  all[slot(day, section)] = trimmed ? { note: trimmed } : {};
  localStorage.setItem(FLAG_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(MISMATCH_EVENT));
}

export function clearMismatch(day: number, section: SectionKey): void {
  const all = readFlags();
  delete all[slot(day, section)];
  localStorage.setItem(FLAG_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(MISMATCH_EVENT));
}

export function useMismatchRevision(): number {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener(MISMATCH_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(MISMATCH_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return revision;
}

/** The one URL a play check can actually run, or a reason it cannot. */
export function clipCheckTarget(clips: readonly PreviewClip[]): { kind: "none" } | { kind: "check"; url: string } | { kind: "uncheckable" } {
  const youtube = clips.find((clip) => clip.kind === "youtube" && clip.youtubeId);
  if (youtube?.youtubeId) return { kind: "check", url: `https://www.youtube.com/watch?v=${youtube.youtubeId}` };
  const file = clips.find((clip) => clip.kind === "file" && /^https:\/\/.+\.(mp4|webm)(\?|$)/i.test(clip.fileSrc || ""));
  if (file?.fileSrc) return { kind: "check", url: file.fileSrc };
  if (clips.length > 0) return { kind: "uncheckable" };
  return { kind: "none" };
}

export function cellStatus(clips: readonly PreviewClip[], play: PlayState | undefined, mismatched: boolean): CellStatus {
  if (mismatched) return "mismatched";
  const target = clipCheckTarget(clips);
  if (target.kind === "none") return "missing";
  if (target.kind === "uncheckable" || !play) return "unchecked";
  if (play === "playing") return "has-video";
  if (play === "not-playing") return "not-playing";
  return "unchecked";
}

export function useVideoPlayMap(urls: readonly string[]): Record<string, PlayState> {
  const key = urls.slice().sort().join("\n");
  const [map, setMap] = useState<Record<string, PlayState>>({});
  useEffect(() => {
    let cancelled = false;
    const list = key ? key.split("\n") : [];
    const queue: string[] = [];
    const seeded: Record<string, PlayState> = {};
    for (const url of list) {
      const cached = sessionStorage.getItem(CHECK_PREFIX + url);
      if (cached === "playing" || cached === "not-playing") seeded[url] = cached;
      else queue.push(url);
    }
    if (Object.keys(seeded).length) setMap((current) => ({ ...seeded, ...current }));
    let index = 0;
    async function worker() {
      while (!cancelled) {
        const url = queue[index];
        index += 1;
        if (!url) return;
        let status: PlayState = "unchecked";
        try {
          const response = await fetch(`/api/classroom-video-check?url=${encodeURIComponent(url)}`);
          const body = (await response.json()) as { status?: string };
          if (body.status === "playing" || body.status === "not-playing") status = body.status;
        } catch {
          status = "unchecked";
        }
        if (status !== "unchecked") sessionStorage.setItem(CHECK_PREFIX + url, status);
        if (!cancelled) setMap((current) => ({ ...current, [url]: status }));
      }
    }
    void Promise.all([worker(), worker(), worker(), worker()]);
    return () => {
      cancelled = true;
    };
  }, [key]);
  return map;
}
