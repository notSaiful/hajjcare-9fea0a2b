export type ExternalVideoPlatform = "youtube" | "vimeo" | "cloudflare_stream" | "aws_cloudfront" | "mux";
export type ExternalVideoEmbedOptions = {
  /** Prefer this existing creator-provided caption track. Never generates a caption. */
  captionLocale?: string;
};

const providerPatterns: Array<[ExternalVideoPlatform, RegExp]> = [
  ["youtube", /(^|\\.)youtube\\.com|youtu\\.be/i],
  ["vimeo", /(^|\\.)vimeo\\.com/i],
  ["cloudflare_stream", /videodelivery\\.net|cloudflarestream\\.com/i],
  ["mux", /stream\\.mux\\.com|image\\.mux\\.com/i],
  ["aws_cloudfront", /cloudfront\\.net/i],
];

export const detectVideoPlatform = (url: string): ExternalVideoPlatform | null => {
  try {
    const hostname = new URL(url).hostname;
    return providerPatterns.find(([, pattern]) => pattern.test(hostname))?.[0] ?? null;
  } catch {
    return null;
  }
};

export const isSupportedExternalVideoUrl = (url: string) => /^https:\/\//.test(url) && !!detectVideoPlatform(url);

const youtubeId = (url: string) => {
  const value = new URL(url);
  if (value.hostname.includes("youtu.be")) return value.pathname.split("/").filter(Boolean)[0];
  return value.searchParams.get("v") || value.pathname.split("/").filter(Boolean).at(-1);
};

export const externalVideoEmbedUrl = (url: string, platform?: ExternalVideoPlatform, options: ExternalVideoEmbedOptions = {}) => {
  const provider = platform ?? detectVideoPlatform(url);
  try {
    if (provider === "youtube") {
      const id = youtubeId(url);
      const captions = options.captionLocale
        ? `&cc_load_policy=1&cc_lang_pref=${encodeURIComponent(options.captionLocale)}`
        : "";
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1&enablejsapi=1${captions}` : url;
    }
    if (provider === "vimeo") {
      const id = new URL(url).pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://player.vimeo.com/video/${encodeURIComponent(id)}?dnt=1` : url;
    }
    if (provider === "cloudflare_stream" && !url.includes("/iframe")) return `${url.replace(/\/$/, "")}/iframe`;
  } catch { /* Use the original URL as a safe fallback. */ }
  return url;
};

export const formatSeconds = (seconds: number | null | undefined) => {
  if (!seconds || seconds < 1) return "—";
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
};
