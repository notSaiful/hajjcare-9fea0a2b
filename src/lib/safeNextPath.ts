/** Internal paths the new public demo may return to after account sign-in. */
const ALLOWED_NEXT = new Set([
  "/home",
  "/volunteer",
  "/auth",
  "/lost-and-found",
  "/grievances",
  "/circulars",
  "/rules",
  "/money",
  "/telecom",
  "/hajj-buildings",
  "/madinah-hotels",
  "/mina-tents",
  "/mashair-map",
  "/qurbani",
  "/women",
  "/food-guide",
  "/socials",
  "/hajj-training-videos",
  "/contact-us",
  "/pricing",
  "/post-hajj",
  "/umrah",
  "/profile",
]);

/**
 * Accept only a same-site path we already ship.
 * Anything else, including protocol-relative URLs, stays on /home.
 */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return "/home";
  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return "/home";
  }
  const path = value.split(/[?#]/, 1)[0];
  if (!path || path.includes("..") || !ALLOWED_NEXT.has(path)) return "/home";
  return path;
}
