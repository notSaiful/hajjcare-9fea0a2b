/** 100-day training uses this Supabase project and no other. */
export const TRAINING_SUPABASE_ORIGIN = "https://uorfprlfpqdpjtrcaqrt.supabase.co";
export const TRAINING_HOST = "uorfprlfpqdpjtrcaqrt.supabase.co";

/** Live site auth, the old training project, and the voice/test project. Never accept these for training. */
export const FORBIDDEN_TRAINING_HOSTS = [
  "begtqcmwruvwposocnsr.supabase.co",
  "pwtmrddreqmhyluqbfgi.supabase.co",
  "vvbbwlfzpfvgyweeggvw.supabase.co",
] as const;

export function assertTrainingProjectUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("Training Supabase URL is not the training project.");
  }
  if (url.protocol !== "https:") {
    throw new Error("Training Supabase URL is not the training project.");
  }
  if (url.username || url.password) {
    throw new Error("Training Supabase URL is not the training project.");
  }
  if (url.host !== TRAINING_HOST) {
    throw new Error("Training Supabase URL is not the training project.");
  }
  if ((FORBIDDEN_TRAINING_HOSTS as readonly string[]).includes(url.host)) {
    throw new Error("Training Supabase URL is not the training project.");
  }
  return TRAINING_SUPABASE_ORIGIN;
}
