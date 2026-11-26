import { useEffect, useState } from "react";
import type { SectionKey } from "./classroomCatalogue";
import type { PreviewClip } from "./classroomAttachments";
import type { ClassroomVideoRow, VideoTag } from "./classroomVideoRows";

export async function loadClassroomVideos(): Promise<{ ok: true; rows: ClassroomVideoRow[] } | { ok: false }> {
  try {
    const response = await fetch("/api/classroom-videos", { cache: "no-store" });
    if (!response.ok) return { ok: false };
    const body = await response.json() as { ok?: boolean; videos?: ClassroomVideoRow[] };
    if (body.ok !== true || !Array.isArray(body.videos)) return { ok: false };
    return { ok: true, rows: body.videos };
  } catch {
    return { ok: false };
  }
}

export function saveMessage(reason: string | undefined, status: number): string {
  if (reason === "no-token") return "Server par save karne ke liye admin login chahiye.";
  if (reason === "not-admin" || status === 401) return "Yeh login admin nahi hai.";
  if (reason === "no-service-role" || reason === "no-config" || reason === "unavailable") {
    return "Server abhi video save nahi kar sakta. classroom_videos migration aur service role chahiye.";
  }
  return "Video save nahi hui.";
}

export function useClassroomVideoRows() {
  const [remote, setRemote] = useState<{ ok: boolean; rows: ClassroomVideoRow[] }>({ ok: false, rows: [] });
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void loadClassroomVideos().then((result) => {
        if (cancelled) return;
        setRemote(result.ok ? { ok: true, rows: result.rows } : { ok: false, rows: [] });
      });
    };
    load();
    window.addEventListener("hajcare-remote", load);
    return () => {
      cancelled = true;
      window.removeEventListener("hajcare-remote", load);
    };
  }, []);
  return remote;
}

export async function saveClassroomSection(input: {
  day: number;
  section: SectionKey;
  clips: readonly PreviewClip[];
  token?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const clips = input.clips.filter((clip) => clip.kind !== "file").slice(0, 3).map((clip, index) => ({
    position: index + 1,
    url: clip.sourceUrl || clip.pageUrl || (clip.youtubeId ? `https://www.youtube.com/watch?v=${clip.youtubeId}` : ""),
    platform: clip.platform || (clip.youtubeId ? "YouTube" : "Link"),
    title: clip.title || clip.fileName || "",
    tag: (clip.maslak === "shia" || clip.maslak === "sunni" ? clip.maslak : "neutral") as VideoTag,
    review_pending: clip.reviewPending === true,
  }));
  try {
    const response = await fetch("/api/classroom-videos", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        ...(input.token ? { authorization: `Bearer ${input.token}` } : {}),
      },
      body: JSON.stringify({ day: input.day, section: input.section, clips }),
    });
    const body = await response.json().catch(() => ({})) as { ok?: boolean; reason?: string };
    if (!response.ok || body.ok === false) return { ok: false, message: saveMessage(body.reason, response.status) };
    window.dispatchEvent(new Event("hajcare-remote"));
    return { ok: true };
  } catch {
    return { ok: false, message: saveMessage("unavailable", 503) };
  }
}
