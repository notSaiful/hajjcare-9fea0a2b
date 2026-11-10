export const SITE_VISIT_ORIGIN = "https://uorfprlfpqdpjtrcaqrt.supabase.co";
const SITE_VISIT_HOST = "uorfprlfpqdpjtrcaqrt.supabase.co";
const FORBIDDEN_HOSTS = [
  "begtqcmwruvwposocnsr.supabase.co",
  "pwtmrddreqmhyluqbfgi.supabase.co",
  "vvbbwlfzpfvgyweeggvw.supabase.co",
];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface SiteVisitEnv {
  supabaseUrl: string;
  serviceRoleKey: string;
  anonKey: string;
  publishableKey: string;
  ipHashSalt: string;
  allowedOrigins: string;
  ownerSecret: string;
}

export interface VisitRow {
  visitor_id: string;
  path: string;
  visited_on: string;
}

export interface VisitSummary {
  total_visits: number;
  unique_visitors: number;
  today_visits: number;
  today_unique: number;
  by_path: { path: string; visits: number }[];
  last_7_days: { date: string; visits: number }[];
}

export interface VisitRateGate {
  tooMany(ipHash: string, now: number): boolean;
}

export interface SiteVisitDeps {
  env: SiteVisitEnv;
  rateGate: VisitRateGate;
  record: (row: VisitRow) => Promise<void>;
  loadRows: () => Promise<VisitRow[]>;
  now?: () => Date;
}

export function createVisitRateGate(limit = 40, windowMs = 60 * 60 * 1000): VisitRateGate {
  const hits = new Map<string, number[]>();
  return {
    tooMany(ipHash: string, now: number) {
      const recent = (hits.get(ipHash) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(ipHash, recent);
        return true;
      }
      recent.push(now);
      hits.set(ipHash, recent);
      if (hits.size > 1000) {
        const oldest = hits.keys().next().value;
        if (oldest) hits.delete(oldest);
      }
      return false;
    },
  };
}

export function istDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function projectUrlAllowed(raw: string): boolean {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" || url.username || url.password) return false;
    if (url.host !== SITE_VISIT_HOST || url.origin !== SITE_VISIT_ORIGIN) return false;
    if (FORBIDDEN_HOSTS.includes(url.host)) return false;
    return true;
  } catch {
    return false;
  }
}

export function validateVisit(body: unknown): { ok: true; value: { visitor_id: string; path: string } } | { ok: false } {
  if (!body || typeof body !== "object") return { ok: false };
  const row = body as Record<string, unknown>;
  const visitor = typeof row.visitor_id === "string" ? row.visitor_id.trim() : "";
  if (!UUID.test(visitor)) return { ok: false };
  const path = typeof row.path === "string" ? row.path.trim() : "";
  if (!path.startsWith("/") || path.length > 120) return { ok: false };
  if (/[\s?#\\<>]/.test(path) || path.includes("://")) return { ok: false };
  return { ok: true, value: { visitor_id: visitor, path } };
}

export function summarizeVisits(rows: VisitRow[], now: Date): VisitSummary {
  const today = istDate(now);
  const days = lastSeven(today);
  const daySet = new Set(days);
  const visitors = new Set<string>();
  const todayVisitors = new Set<string>();
  const paths = new Map<string, number>();
  const byDay = new Map<string, number>(days.map((day) => [day, 0]));
  let todayVisits = 0;
  for (const row of rows) {
    visitors.add(row.visitor_id);
    paths.set(row.path, (paths.get(row.path) ?? 0) + 1);
    if (row.visited_on === today) {
      todayVisits += 1;
      todayVisitors.add(row.visitor_id);
    }
    if (daySet.has(row.visited_on)) byDay.set(row.visited_on, (byDay.get(row.visited_on) ?? 0) + 1);
  }
  return {
    total_visits: rows.length,
    unique_visitors: visitors.size,
    today_visits: todayVisits,
    today_unique: todayVisitors.size,
    by_path: [...paths.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10).map(([path, visits]) => ({ path, visits })),
    last_7_days: days.map((date) => ({ date, visits: byDay.get(date) ?? 0 })),
  };
}

export async function handleSiteVisit(req: Request, deps: SiteVisitDeps): Promise<Response> {
  const origin = req.headers.get("origin") ?? "";
  const extra = deps.env.allowedOrigins;
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin, extra, false) });
  if (origin && !originAllowed(origin, extra)) return json(403, { ok: false }, origin, extra);
  if (!projectUrlAllowed(deps.env.supabaseUrl) || !deps.env.serviceRoleKey) return json(503, { ok: false }, origin, extra);
  if (req.method === "GET") return ownerSummary(req, deps, origin, extra);
  if (req.method !== "POST") return json(405, { ok: false }, origin, extra);
  if (!clientKeyAllowed(req.headers.get("apikey") ?? "", deps.env)) return json(401, { ok: false }, origin, extra);

  const raw = await req.text();
  if (raw.length > 2000) return json(400, { ok: false }, origin, extra);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false }, origin, extra);
  }
  const parsed = validateVisit(body);
  if (!parsed.ok) return json(400, { ok: false }, origin, extra);

  const now = (deps.now ?? (() => new Date()))();
  const ipHash = await sha256(`${deps.env.ipHashSalt || "hajcare-site-visit-v1"}:${clientIp(req)}`);
  if (deps.rateGate.tooMany(ipHash, now.getTime())) return json(429, { ok: false }, origin, extra);

  try {
    await deps.record({ ...parsed.value, visited_on: istDate(now) });
  } catch {
    return json(503, { ok: false }, origin, extra);
  }
  return new Response(null, { status: 204, headers: corsHeaders(origin, extra, false) });
}

async function ownerSummary(req: Request, deps: SiteVisitDeps, origin: string, extra: string): Promise<Response> {
  const secret = deps.env.ownerSecret.trim();
  if (!secret) return json(503, { ok: false }, origin, extra);
  if (!clientKeyAllowed(req.headers.get("apikey") ?? "", deps.env)) return json(401, { ok: false }, origin, extra);
  if (!secretMatches(req.headers.get("x-owner-secret") ?? "", secret)) return json(401, { ok: false }, origin, extra);
  try {
    const rows = await deps.loadRows();
    const summary = summarizeVisits(rows, (deps.now ?? (() => new Date()))());
    return json(200, summary, origin, extra);
  } catch {
    return json(503, { ok: false }, origin, extra);
  }
}

function secretMatches(header: string, secret: string): boolean {
  const given = header.trim();
  const enc = new TextEncoder();
  const aa = enc.encode(given);
  const bb = enc.encode(secret);
  const len = Math.max(aa.length, bb.length, 1);
  let diff = aa.length === bb.length ? 0 : 1;
  for (let i = 0; i < len; i++) diff |= (aa[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

function clientKeyAllowed(headerKey: string, env: SiteVisitEnv): boolean {
  const key = headerKey.trim();
  if (!key || key === env.serviceRoleKey || key.startsWith("sb_secret_") || /service[-_]?role/i.test(key)) return false;
  const allowed = [env.anonKey.trim(), env.publishableKey.trim()].filter(Boolean);
  return allowed.includes(key);
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

async function sha256(value: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("crypto unavailable");
  const buf = await subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function originAllowed(origin: string, extra: string): boolean {
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  if ((url.host === "hajjcare.in" || url.host === "www.hajjcare.in") && url.protocol === "https:") return true;
  if (url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) return true;
  return extra.split(",").map((item) => item.trim()).filter(Boolean).includes(origin);
}

function corsHeaders(origin: string, extra: string, jsonBody: boolean): Headers {
  const headers = new Headers({ vary: "origin", "cache-control": "no-store" });
  if (jsonBody) headers.set("content-type", "application/json");
  if (origin && originAllowed(origin, extra)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-headers", "apikey, content-type, x-owner-secret");
    headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  }
  return headers;
}

function json(status: number, body: unknown, origin: string, extra: string): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin, extra, true) });
}

function lastSeven(today: string): string[] {
  const [year, month, day] = today.split("-").map(Number);
  const days: string[] = [];
  for (let back = 6; back >= 0; back -= 1) {
    days.push(new Date(Date.UTC(year, month - 1, day - back)).toISOString().slice(0, 10));
  }
  return days;
}
