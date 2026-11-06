/** Video 1 of the Hajj Training Academy. Lessons 2–100 are out of scope. */

export const LESSON_ONE_COURSE_ID = "hajj-training";
export const LESSON_ONE_NUMBER = 1;
export const LESSON_ONE_BUCKET = "hajj-training-videos";
export const LESSON_ONE_MAX_BYTES = 40 * 1024 * 1024;
export const LESSON_ONE_PLATFORM = "uploaded";

const LESSON_ONE_PATH = /^lesson-1\/[0-9]+-[a-z0-9]+-[a-z0-9-]+\.mp4$/;

export class LessonOneUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LessonOneUploadError";
  }
}

export type LessonOneRow = {
  id: string;
  course_id: string;
  lesson_number: number;
  language: string;
  external_url: string | null;
  published: boolean;
  platform: string;
};

export interface LessonOneGateway {
  listLessonOne(): Promise<LessonOneRow[]>;
  uploadFile(path: string, file: File, onProgress: (percent: number) => void): Promise<void>;
  removeFile(path: string): Promise<void>;
  publicUrl(path: string): string;
  insertDraft(url: string): Promise<string>;
  updateVideoUrl(id: string, url: string): Promise<void>;
}

export function validateLessonOneFile(file: { name: string; type: string; size: number }): string | null {
  const name = file.name.trim().toLowerCase();
  const type = file.type.trim().toLowerCase();
  const extensionOk = name.endsWith(".mp4");
  const typeOk = type === "video/mp4" || type === "application/mp4" || type === "";
  if (!extensionOk || !typeOk) {
    return "Use an MP4 video. / MP4 वीडियो चुनें।";
  }
  if (file.size <= 0 || file.size > LESSON_ONE_MAX_BYTES) {
    return "Video must be an MP4 of 40 MB or less. / वीडियो 40 MB या उससे छोटी MP4 होनी चाहिए।";
  }
  return null;
}

export function lessonOneObjectPath(fileName: string, now: number, random: string): string {
  const base = fileName
    .toLowerCase()
    .replace(/\.mp4$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "video";
  const nonce = random.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12) || "file";
  const path = `lesson-1/${now}-${nonce}-${base}.mp4`;
  assertLessonOnePath(path);
  return path;
}

export function assertLessonOnePath(path: string): void {
  if (!LESSON_ONE_PATH.test(path)) {
    throw new LessonOneUploadError("Upload path is not Video 1.");
  }
}

export function isLessonOneUploadedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const path = decodeURIComponent(parsed.pathname);
    return path.includes(`/storage/v1/object/public/${LESSON_ONE_BUCKET}/lesson-1/`) && path.toLowerCase().endsWith(".mp4");
  } catch {
    return false;
  }
}

export function lessonOneStoragePathFromUrl(url: string): string | null {
  if (!isLessonOneUploadedUrl(url)) return null;
  const path = decodeURIComponent(new URL(url).pathname);
  const marker = `/${LESSON_ONE_BUCKET}/`;
  const index = path.indexOf(marker);
  if (index < 0) return null;
  const objectPath = path.slice(index + marker.length);
  return LESSON_ONE_PATH.test(objectPath) ? objectPath : null;
}

export function selectLessonOneTarget(rows: LessonOneRow[]): { row: LessonOneRow | null; error: string | null } {
  const matches = rows.filter(
    (row) => row.course_id === LESSON_ONE_COURSE_ID && Number(row.lesson_number) === LESSON_ONE_NUMBER,
  );
  if (matches.length === 0) return { row: null, error: null };
  if (matches.length === 1) return { row: matches[0], error: null };
  const hindi = matches.filter((row) => row.language === "hi");
  if (hindi.length === 1) return { row: hindi[0], error: null };
  return {
    row: null,
    error: "Several Video 1 rows exist, so nothing was changed. / कई वीडियो 1 पंक्तियाँ हैं, इसलिए कुछ नहीं बदला गया।",
  };
}

export function withLessonOneGuestFallback<T extends { lesson_number: number; external_url: string }>(
  published: T[],
  guests: T[],
): T[] {
  const hasPublishedLessonOne = published.some((video) => video.lesson_number === LESSON_ONE_NUMBER);
  const prefix = hasPublishedLessonOne ? [] : guests;
  const rest = prefix.length
    ? published.filter((video) => !guests.some((guest) => guest.external_url === video.external_url))
    : published;
  return [...prefix, ...rest];
}

export function messageFromStorageFailure(status: number, body: string): string {
  if (/Bucket not found|NoSuchBucket/i.test(body)) {
    return "Video storage is not set up on this HajCare project yet. Apply the Video 1 storage migration, then try again. / वीडियो स्टोरेज अभी तैयार नहीं है।";
  }
  if (status === 401 || status === 403) {
    return "This account is not allowed to upload Video 1. / इस खाते को वीडियो 1 अपलोड करने की अनुमति नहीं है।";
  }
  if (status === 413 || /mime|file size|entity too large/i.test(body)) {
    return "This file was rejected. Use an MP4 up to 40 MB. / यह फ़ाइल अस्वीकार हुई। 40 MB तक की MP4 चुनें।";
  }
  return "Upload failed. Video 1 was not changed. / अपलोड नहीं हुआ। वीडियो 1 नहीं बदला।";
}

export async function saveLessonOneVideo(args: {
  gateway: LessonOneGateway;
  file: File;
  rows: LessonOneRow[];
  replaceConfirmed: boolean;
  onProgress: (percent: number) => void;
  now?: number;
  random?: string;
}): Promise<{ url: string; rowId: string }> {
  const problem = validateLessonOneFile(args.file);
  if (problem) throw new LessonOneUploadError(problem);

  const target = selectLessonOneTarget(args.rows);
  if (target.error) throw new LessonOneUploadError(target.error);
  if (target.row?.external_url && !args.replaceConfirmed) {
    throw new LessonOneUploadError("Confirm replacement before changing Video 1. / बदलने से पहले पुष्टि करें।");
  }

  const path = lessonOneObjectPath(args.file.name, args.now ?? Date.now(), args.random ?? crypto.randomUUID());
  await args.gateway.uploadFile(path, args.file, args.onProgress);
  const url = args.gateway.publicUrl(path);

  try {
    if (target.row) {
      await args.gateway.updateVideoUrl(target.row.id, url);
      const previous = target.row.external_url ? lessonOneStoragePathFromUrl(target.row.external_url) : null;
      if (previous && previous !== path) {
        await args.gateway.removeFile(previous).catch(() => undefined);
      }
      return { url, rowId: target.row.id };
    }
    const rowId = await args.gateway.insertDraft(url);
    return { url, rowId };
  } catch (error) {
    await args.gateway.removeFile(path).catch(() => undefined);
    if (error instanceof LessonOneUploadError) throw error;
    const message = error instanceof Error ? error.message : "Upload failed. Video 1 was not changed.";
    throw new LessonOneUploadError(message);
  }
}
