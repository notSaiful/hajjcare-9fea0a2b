import { useEffect, useState } from "react";
import { MAX_SECTION_VIDEOS, type SectionKey } from "./classroomCatalogue";
import type { Maslak, PreviewClip } from "./classroomAttachments";
import type { ParsedVideoLink } from "./classroomVideoLink";

const KEY = "hajcare-classroom-video-overrides";
export const OVERRIDE_EVENT = "hajcare-video-override";

export type StoredVideoOverride = ParsedVideoLink & {
  mode: "replace" | "add";
  note?: string;
  maslak?: Maslak;
};

type Store = Record<string, StoredVideoOverride>;

function slot(day: number, section: SectionKey): string {
  return `${day}:${section}`;
}

function readAll(): Store {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "{}") as Store;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function readVideoOverride(day: number, section: SectionKey): StoredVideoOverride | null {
  return readAll()[slot(day, section)] ?? null;
}

export function writeVideoOverride(day: number, section: SectionKey, override: StoredVideoOverride): void {
  const all = readAll();
  all[slot(day, section)] = override;
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(OVERRIDE_EVENT));
}

export function clearVideoOverride(day: number, section: SectionKey): void {
  const all = readAll();
  delete all[slot(day, section)];
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(OVERRIDE_EVENT));
}

function toClip(day: number, section: SectionKey, override: StoredVideoOverride): PreviewClip {
  if (override.kind === "youtube") {
    return {
      id: `override-${day}-${section}`,
      kind: "youtube",
      youtubeId: override.youtubeId,
      sourceUrl: override.url,
      title: override.note || "Pasted video",
      maslak: override.maslak,
      note: override.note,
    };
  }
  return {
    id: `override-${day}-${section}`,
    kind: "file",
    fileSrc: override.url,
    sourceUrl: override.url,
    title: override.note || "Pasted video",
    maslak: override.maslak,
    note: override.note,
  };
}

/** Catalogue clips, unless this browser has an admin paste for the section. */
export function applyStoredOverride(day: number, section: SectionKey, clips: readonly PreviewClip[]): PreviewClip[] {
  const override = readVideoOverride(day, section);
  if (!override || day < 1 || day > 30) return [...clips];
  const clip = toClip(day, section, override);
  if (override.mode === "add") return [...clips, clip].slice(0, MAX_SECTION_VIDEOS);
  return [clip];
}

export function useVideoOverrideRevision(): number {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener(OVERRIDE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(OVERRIDE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return revision;
}
