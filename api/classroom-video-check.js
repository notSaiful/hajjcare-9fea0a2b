/**
 * Read-only play check. YouTube uses oEmbed. A direct https mp4/webm uses HEAD.
 * Anything else is "unchecked". This does not write to the database.
 */

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "youtu.be",
]);

function send(res, status, body) {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  if (typeof res.status === "function") {
    res.status(status).json(body);
    return;
  }
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

function youtubeId(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return null;
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    return VIDEO_ID.test(id) ? id : null;
  }
  if (url.pathname === "/watch") {
    const id = url.searchParams.get("v") ?? "";
    return VIDEO_ID.test(id) ? id : null;
  }
  const parts = url.pathname.split("/").filter(Boolean);
  if ((parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live" || parts[0] === "v") && parts[1] && VIDEO_ID.test(parts[1])) {
    return parts[1];
  }
  return null;
}

function privateHost(hostname) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host === "metadata.google.internal") return true;
  if (host.includes(":")) return true;
  const parts = host.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function publicFileUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (privateHost(url.hostname)) return null;
  const path = url.pathname.toLowerCase();
  if (!path.endsWith(".mp4") && !path.endsWith(".webm")) return null;
  return url;
}

/** @returns {{ kind: "youtube", id: string } | { kind: "file", href: string } | null} */
export function inspectTarget(raw) {
  const text = typeof raw === "string" ? raw.trim() : "";
  if (!text) return null;
  const id = youtubeId(text);
  if (id) return { kind: "youtube", id };
  const file = publicFileUrl(text);
  if (file) return { kind: "file", href: file.toString() };
  return null;
}

async function follow(url, method, left) {
  const response = await fetch(url, { method, redirect: "manual", signal: AbortSignal.timeout(8000) });
  if (response.status >= 300 && response.status < 400 && left > 0) {
    const location = response.headers.get("location");
    if (!location) return response;
    const next = new URL(location, url);
    if (next.protocol !== "https:" || privateHost(next.hostname)) return response;
    return follow(next.toString(), method, left - 1);
  }
  return response;
}

export async function checkClassroomVideo(raw) {
  const target = inspectTarget(raw);
  if (!target) return { status: "unchecked", detail: "not a YouTube or direct mp4/webm link" };
  try {
    if (target.kind === "youtube") {
      const endpoint = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${target.id}`)}`;
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
      if (response.ok) return { status: "playing", detail: "youtube oembed" };
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        return { status: "not-playing", detail: `youtube oembed ${response.status}` };
      }
      return { status: "unchecked", detail: `youtube oembed ${response.status}` };
    }
    let response = await follow(target.href, "HEAD", 3);
    if (response.status === 405 || response.status === 501) response = await follow(target.href, "GET", 3);
    if (response.ok || response.status === 206) return { status: "playing", detail: `file ${response.status}` };
    if (response.status >= 400 && response.status < 600) return { status: "not-playing", detail: `file ${response.status}` };
    return { status: "unchecked", detail: `file ${response.status}` };
  } catch {
    return { status: "unchecked", detail: "check unreachable" };
  }
}

export async function handleClassroomVideoCheck(req, res) {
  if (req.method !== "GET") {
    send(res, 405, { ok: false, reason: "method" });
    return;
  }
  const query = new URL(req.url || "/", "http://classroom.local").searchParams.get("url") || "";
  const result = await checkClassroomVideo(query);
  send(res, 200, { ok: true, ...result });
}

export default async function handler(req, res) {
  await handleClassroomVideoCheck(req, res);
}
