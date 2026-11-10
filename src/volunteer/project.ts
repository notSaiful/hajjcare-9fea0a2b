/** Volunteer registration uses hajjcare-live and no other project. */
export const VOLUNTEER_SUPABASE_ORIGIN = "https://vvbbwlfzpfvgyweeggvw.supabase.co";
export const VOLUNTEER_HOST = "vvbbwlfzpfvgyweeggvw.supabase.co";

/** Main site, old training, and the current training project. Never accept these for volunteer registration. */
export const FORBIDDEN_VOLUNTEER_HOSTS = [
  "begtqcmwruvwposocnsr.supabase.co",
  "pwtmrddreqmhyluqbfgi.supabase.co",
  "uorfprlfpqdpjtrcaqrt.supabase.co",
] as const;

export function assertVolunteerProjectUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("Volunteer Supabase URL is not the hajjcare-live project.");
  }
  if (url.protocol !== "https:" || url.username || url.password || url.host !== VOLUNTEER_HOST) {
    throw new Error("Volunteer Supabase URL is not the hajjcare-live project.");
  }
  if ((FORBIDDEN_VOLUNTEER_HOSTS as readonly string[]).includes(url.host)) {
    throw new Error("Volunteer Supabase URL is not the hajjcare-live project.");
  }
  return VOLUNTEER_SUPABASE_ORIGIN;
}

function viteValue(name: string): string {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return env?.[name]?.trim() ?? "";
}

export function volunteerClientConfig(): { url: string; publishableKey: string } | null {
  const url = viteValue("VITE_VOLUNTEER_SUPABASE_URL");
  const publishableKey = viteValue("VITE_VOLUNTEER_SUPABASE_PUBLISHABLE_KEY");
  if (!url || !publishableKey) return null;
  try {
    assertVolunteerProjectUrl(url);
  } catch {
    return null;
  }
  if (publishableKey.startsWith("sb_secret_") || /service[-_]?role/i.test(publishableKey)) return null;
  return { url: VOLUNTEER_SUPABASE_ORIGIN, publishableKey };
}
