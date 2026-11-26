import { youtubeIdFromUrl } from "./classroomAttachments";

export type ParsedVideoLink =
  | { kind: "youtube"; youtubeId: string; embed: string; url: string }
  | { kind: "file"; url: string };

export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/** YouTube watch, share, shorts, and embed links, or a direct https mp4/webm file. */
export function parseClassroomVideoLink(raw: string): ParsedVideoLink | null {
  const text = raw.trim();
  if (!text) return null;
  const youtubeId = youtubeIdFromUrl(text);
  if (youtubeId) {
    return { kind: "youtube", youtubeId, embed: youtubeEmbedUrl(youtubeId), url: `https://www.youtube.com/watch?v=${youtubeId}` };
  }
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const path = url.pathname.toLowerCase();
  if (path.endsWith(".mp4") || path.endsWith(".webm")) return { kind: "file", url: url.toString() };
  return null;
}
