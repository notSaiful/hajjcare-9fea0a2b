import { CLASSROOM_DAYS, SECTION_ORDER, sectionClips, type SectionKey, type SectionSlot } from "./classroomCatalogue";
import { clipsFromSlot, youtubeIdFromUrl, type PreviewClip } from "./classroomAttachments";

export type VideoTag = "shia" | "sunni" | "neutral";

export interface ClassroomVideoRow {
  day: number;
  section: SectionKey;
  position: number;
  url: string;
  platform: string;
  title: string;
  tag: VideoTag;
  review_pending: boolean;
}

const SECTIONS = new Set<string>(SECTION_ORDER);

export function videoTag(value: string | null | undefined): VideoTag {
  return value === "shia" || value === "sunni" ? value : "neutral";
}

export function platformForUrl(raw: string): string {
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("youtube") || host === "youtu.be") return "YouTube";
    if (host.includes("dailymotion")) return "Dailymotion";
    if (host.includes("vimeo")) return "Vimeo";
    if (host.includes("facebook") || host === "fb.watch") return "Facebook";
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("linkedin")) return "LinkedIn";
    if (host === "x.com" || host.includes("twitter")) return "X";
    if (host.includes("archive.org")) return "Internet Archive";
    if (host.includes("al-islam.org")) return "Al-Islam.org";
    return host;
  } catch {
    return "Link";
  }
}

export function catalogueSeedRows(days = CLASSROOM_DAYS): ClassroomVideoRow[] {
  const rows: ClassroomVideoRow[] = [];
  for (const day of days) {
    if (day.day > 30) continue;
    for (const section of SECTION_ORDER) {
      let position = 1;
      for (const media of sectionClips(day.sections[section])) {
        if (position > 3) break;
        const url = media.kind === "youtube" && media.youtubeId
          ? `https://www.youtube.com/watch?v=${media.youtubeId}`
          : media.kind === "external" && media.pageUrl
            ? media.pageUrl
            : "";
        if (!url) continue;
        rows.push({
          day: day.day,
          section,
          position,
          url,
          platform: media.platform || platformForUrl(url),
          title: media.citation,
          tag: videoTag(media.maslak),
          review_pending: media.reviewPending === true,
        });
        position += 1;
      }
    }
  }
  return rows;
}

export function rowToClip(row: ClassroomVideoRow): PreviewClip | null {
  if (!SECTIONS.has(row.section) || row.position < 1 || row.position > 3 || !row.url) return null;
  const youtubeId = youtubeIdFromUrl(row.url);
  return {
    id: `remote-${row.day}-${row.section}-${row.position}`,
    kind: youtubeId ? "youtube" : "external",
    youtubeId: youtubeId ?? undefined,
    sourceUrl: row.url,
    pageUrl: youtubeId ? undefined : row.url,
    platform: row.platform || platformForUrl(row.url),
    title: row.title,
    maslak: videoTag(row.tag),
    reviewPending: row.review_pending === true,
  };
}

export function rowsForSection(rows: readonly ClassroomVideoRow[], day: number, section: SectionKey): PreviewClip[] {
  return rows
    .filter((row) => row.day === day && row.section === section)
    .sort((a, b) => a.position - b.position)
    .map(rowToClip)
    .filter((clip): clip is PreviewClip => Boolean(clip))
    .slice(0, 3);
}

/** DB rows win when the request succeeded. Catalogue is only the fallback. Device files stay on this browser. */
export function boardClips(input: {
  remoteOk: boolean;
  rows: readonly ClassroomVideoRow[] | null;
  day: number;
  section: SectionKey;
  catalogue: SectionSlot | undefined;
  browserFiles: readonly PreviewClip[];
}): PreviewClip[] {
  const files = input.browserFiles.filter((clip) => clip.kind === "file").slice(0, 3);
  const links = input.remoteOk
    ? rowsForSection(input.rows ?? [], input.day, input.section)
    : clipsFromSlot(input.catalogue).filter((clip) => clip.kind !== "file");
  return [...links, ...files].slice(0, 3);
}

export function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}
