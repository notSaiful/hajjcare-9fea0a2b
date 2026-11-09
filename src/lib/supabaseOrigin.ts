/** HTTPS origin from VITE_SUPABASE_URL. Invalid or non-HTTPS values add no preconnect. */
export function supabaseHttpsOrigin(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") return null;
    if (!url.hostname) return null;
    return url.origin;
  } catch {
    return null;
  }
}
