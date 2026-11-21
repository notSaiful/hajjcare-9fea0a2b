import { callerIsAdmin } from "./classroom.js";

const SECTIONS = new Set(["quran", "hadith", "dua", "lesson", "doctor", "expert", "naat", "quiz"]);

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

function config() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const anon = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return { url: url.replace(/\/$/, ""), anon, service };
}

function restHeaders(key, extra = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

export async function listClassroomVideos() {
  const { url, anon, service } = config();
  const key = anon || service;
  if (!url || !key) return { status: 503, body: { ok: false, reason: "no-config" } };
  try {
    const response = await fetch(
      `${url}/rest/v1/classroom_videos?select=day,section,position,url,platform,title,tag,review_pending&order=day.asc,section.asc,position.asc`,
      { headers: restHeaders(key) },
    );
    if (!response.ok) return { status: 503, body: { ok: false, reason: "unavailable" } };
    const rows = await response.json();
    if (!Array.isArray(rows)) return { status: 503, body: { ok: false, reason: "unavailable" } };
    return { status: 200, body: { ok: true, videos: rows } };
  } catch {
    return { status: 503, body: { ok: false, reason: "unavailable" } };
  }
}

function cleanClips(raw) {
  if (!Array.isArray(raw)) return null;
  const clips = [];
  for (const item of raw.slice(0, 3)) {
    const url = typeof item?.url === "string" ? item.url.trim() : "";
    if (!url.startsWith("https://")) return null;
    const tag = item?.tag === "shia" || item?.tag === "sunni" ? item.tag : "neutral";
    clips.push({
      position: clips.length + 1,
      url,
      platform: typeof item?.platform === "string" && item.platform.trim() ? item.platform.trim().slice(0, 80) : "Link",
      title: typeof item?.title === "string" ? item.title.trim().slice(0, 300) : "",
      tag,
      review_pending: item?.review_pending === true,
    });
  }
  return clips;
}

export async function replaceClassroomSection(body, authorization) {
  const day = Number(body?.day);
  const section = typeof body?.section === "string" ? body.section : "";
  const clips = cleanClips(body?.clips);
  if (!Number.isInteger(day) || day < 1 || day > 100 || !SECTIONS.has(section) || !clips) {
    return { status: 400, body: { ok: false, reason: "bad-body" } };
  }
  const check = await callerIsAdmin(authorization);
  if (!check.admin) return { status: 401, body: { ok: false, reason: check.reason } };
  const { url, anon, service } = config();
  if (!url || !service) return { status: 503, body: { ok: false, reason: "no-service-role" } };
  let createdBy = null;
  const token = typeof authorization === "string" && authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (anon && token) {
    try {
      const userResponse = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
      if (userResponse.ok) {
        const user = await userResponse.json();
        if (typeof user?.id === "string") createdBy = user.id;
      }
    } catch {
      createdBy = null;
    }
  }
  const headers = restHeaders(service, { "Content-Type": "application/json", Prefer: "return=minimal" });
  const removed = await fetch(
    `${url}/rest/v1/classroom_videos?day=eq.${day}&section=eq.${encodeURIComponent(section)}`,
    { method: "DELETE", headers },
  );
  if (!removed.ok) return { status: 503, body: { ok: false, reason: "write-failed" } };
  if (clips.length) {
    const inserted = await fetch(`${url}/rest/v1/classroom_videos`, {
      method: "POST",
      headers,
      body: JSON.stringify(clips.map((clip) => ({ ...clip, day, section, created_by: createdBy, updated_at: new Date().toISOString() }))),
    });
    if (!inserted.ok) return { status: 503, body: { ok: false, reason: "write-failed" } };
  }
  return { status: 200, body: { ok: true } };
}

export async function handleClassroomVideos(req, res) {
  if (req.method === "GET") {
    const result = await listClassroomVideos();
    send(res, result.status, result.body);
    return;
  }
  if (req.method === "PUT") {
    const result = await replaceClassroomSection(req.body, req.headers?.authorization);
    send(res, result.status, result.body);
    return;
  }
  send(res, 405, { ok: false, reason: "method" });
}

export default async function handler(req, res) {
  await handleClassroomVideos(req, res);
}
