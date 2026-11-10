export const TRAINING_SUPABASE_ORIGIN = "https://uorfprlfpqdpjtrcaqrt.supabase.co";
const TRAINING_HOST = "uorfprlfpqdpjtrcaqrt.supabase.co";
const FORBIDDEN_HOSTS = ["begtqcmwruvwposocnsr.supabase.co", "pwtmrddreqmhyluqbfgi.supabase.co", "vvbbwlfzpfvgyweeggvw.supabase.co"];

export const TRAINING_LANGUAGES = [
  "ur", "hi", "bn", "ta", "te", "kn", "ml", "ks", "gu", "mr", "en",
  "as", "brx", "doi", "kok", "mai", "mni", "ne", "or", "pa", "sa", "sat", "sd",
] as const;

/** Same embarkation cities already used for Hajj sign-up in this repo. */
export const EMBARKATION_POINTS = [
  "Srinagar", "Gaya", "Guwahati", "Indore", "Jaipur", "Nagpur",
  "Delhi", "Mumbai", "Kolkata", "Bengaluru", "Hyderabad",
  "Cochin (Kochi)", "Chennai", "Ahmedabad", "Lucknow",
  "Kannur", "Calicut (Kozhikode)", "Vijayawada",
] as const;

/** Visible fields plus the signed-in user and database defaults id and created_at. */
export interface EnrollmentInsert {
  cover_number: string;
  name: string;
  phone_number: string;
  language: (typeof TRAINING_LANGUAGES)[number];
  state: string;
  embarkation_point: (typeof EMBARKATION_POINTS)[number];
  user_id: string;
}

export interface SavedEnrollment {
  id: string;
  createdAt: string;
}

export class DuplicateEnrollment extends Error {
  constructor() {
    super("duplicate");
  }
}

export interface TrainingStore {
  insert(row: EnrollmentInsert): Promise<SavedEnrollment>;
}

export interface RateGate {
  tooMany(ipHash: string, now: number): boolean;
}

export interface TrainingEnv {
  supabaseUrl: string;
  serviceRoleKey: string;
  anonKey: string;
  publishableKey: string;
  ipHashSalt: string;
  allowedOrigins: string;
}

export interface HandlerDeps {
  env: TrainingEnv;
  store: TrainingStore;
  rateGate: RateGate;
  /** Returns the auth user id, null when the token is rejected, or throws when Auth cannot be reached. */
  verifyUser: (accessToken: string) => Promise<string | null>;
  now?: () => Date;
}

export function createRateGate(limit = 8, windowMs = 60 * 60 * 1000): RateGate {
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

const USER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function trainingAuthApiKey(anonKey: string, publishableKey: string): string {
  const anon = anonKey.trim();
  if (anon && !isPrivilegedKey(anon)) return anon;
  const publishable = publishableKey.trim();
  if (!publishable || isPrivilegedKey(publishable)) return "";
  return publishable;
}

/** Confirms a training sign-in. Uses the anon or publishable key, never the service role. */
export async function verifyTrainingUser(supabaseUrl: string, apiKey: string, accessToken: string): Promise<string | null> {
  if (!trainingUrlAllowed(supabaseUrl)) return null;
  const key = apiKey.trim();
  if (!key || isPrivilegedKey(key)) return null;
  const token = accessToken.trim();
  if (!token || token.length > 4096 || /\s/.test(token)) return null;
  const res = await fetch(`${TRAINING_SUPABASE_ORIGIN}/auth/v1/user`, {
    method: "GET",
    redirect: "manual",
    headers: {
      authorization: `Bearer ${token}`,
      apikey: key,
    },
  });
  if (res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) return null;
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error("auth unavailable");
  const data = await res.json() as { id?: unknown };
  return typeof data.id === "string" && USER_ID.test(data.id) ? data.id : null;
}

export function trainingUrlAllowed(raw: string): boolean {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" || url.username || url.password) return false;
    if (url.host !== TRAINING_HOST || url.origin !== TRAINING_SUPABASE_ORIGIN) return false;
    if (FORBIDDEN_HOSTS.includes(url.host)) return false;
    return true;
  } catch {
    return false;
  }
}

export function receiptBody(row: SavedEnrollment) {
  return {
    ok: true as const,
    receipt_id: row.id,
    saved_at: row.createdAt,
  };
}

export async function handleTrainingEnrollment(req: Request, deps: HandlerDeps): Promise<Response> {
  const origin = req.headers.get("origin") ?? "";
  const extra = deps.env.allowedOrigins;
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin, extra) });
  if (origin && !originAllowed(origin, extra)) return json(403, { ok: false, error: "unavailable" }, origin, extra);
  if (req.method !== "POST") return json(405, { ok: false, error: "unavailable" }, origin, extra);
  if (!trainingUrlAllowed(deps.env.supabaseUrl) || !deps.env.serviceRoleKey) {
    return json(503, { ok: false, error: "unavailable" }, origin, extra);
  }
  if (!clientKeyAllowed(req.headers.get("apikey") ?? "", deps.env)) {
    return json(401, { ok: false, error: "unavailable" }, origin, extra);
  }
  const accessToken = bearerToken(req.headers.get("authorization") ?? "");
  if (!accessToken) return json(401, { ok: false, error: "sign_in_required" }, origin, extra);
  let userId: string | null;
  try {
    userId = await deps.verifyUser(accessToken);
  } catch {
    return json(503, { ok: false, error: "unavailable" }, origin, extra);
  }
  if (!userId || !USER_ID.test(userId)) return json(401, { ok: false, error: "sign_in_required" }, origin, extra);

  const raw = await req.text();
  if (raw.length > 8000) return json(400, { ok: false, error: "validation" }, origin, extra);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "validation" }, origin, extra);
  }
  const parsed = validateEnrollment(body);
  if (!parsed.ok) return json(400, { ok: false, error: "validation" }, origin, extra);

  const now = (deps.now ?? (() => new Date()))();
  const ipHash = await sha256(`${deps.env.ipHashSalt || "hajcare-training-v1"}:${clientIp(req)}`);
  if (deps.rateGate.tooMany(ipHash, now.getTime())) {
    return json(429, { ok: false, error: "rate_limited" }, origin, extra);
  }

  try {
    const saved = await deps.store.insert({ ...parsed.value, user_id: userId });
    return json(200, receiptBody(saved), origin, extra);
  } catch (err) {
    if (err instanceof DuplicateEnrollment) return json(409, { ok: false, error: "duplicate" }, origin, extra);
    return json(503, { ok: false, error: "unavailable" }, origin, extra);
  }
}

export function validateEnrollment(body: unknown): { ok: true; value: Omit<EnrollmentInsert, "user_id"> } | { ok: false } {
  if (!body || typeof body !== "object") return { ok: false };
  const row = body as Record<string, unknown>;
  const name = cleanLine(row.name, 120);
  if (name.length < 2 || !/\p{L}/u.test(name) || /[<>]/.test(name)) return { ok: false };
  const cover = cleanLine(row.cover_number, 32).toUpperCase().replace(/[^A-Z0-9-]/g, "");
  if (cover.length < 4 || cover.length > 32) return { ok: false };
  let phone = asText(row.phone_number).replace(/\D/g, "");
  if (phone.length === 10) phone = `91${phone}`;
  if (!/^[0-9]+$/.test(phone) || phone.length < 10 || phone.length > 15) return { ok: false };
  const state = cleanLine(row.state, 80);
  if (state.length < 2 || /[<>]/.test(state)) return { ok: false };
  const language = asText(row.language);
  if (!(TRAINING_LANGUAGES as readonly string[]).includes(language)) return { ok: false };
  const embarkation = asText(row.embarkation_point);
  if (!(EMBARKATION_POINTS as readonly string[]).includes(embarkation)) return { ok: false };
  return {
    ok: true,
    value: {
      cover_number: cover,
      name,
      phone_number: phone,
      language: language as EnrollmentInsert["language"],
      state,
      embarkation_point: embarkation as EnrollmentInsert["embarkation_point"],
    },
  };
}

function isPrivilegedKey(key: string): boolean {
  return key.startsWith("sb_secret_") || /service[-_]?role/i.test(key);
}

function bearerToken(header: string): string {
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  if (!match) return "";
  return match[1].length > 4096 ? "" : match[1];
}

function clientKeyAllowed(headerKey: string, env: TrainingEnv): boolean {
  const key = headerKey.trim();
  if (!key || key === env.serviceRoleKey || key.startsWith("sb_secret_") || /service_role/i.test(key)) return false;
  const allowed = [env.anonKey.trim(), env.publishableKey.trim()].filter(Boolean);
  return allowed.includes(key);
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

export async function sha256(value: string): Promise<string> {
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

function corsHeaders(origin: string, extra: string): Headers {
  const headers = new Headers({ vary: "origin", "cache-control": "no-store", "content-type": "application/json" });
  if (origin && originAllowed(origin, extra)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-headers", "authorization, apikey, content-type");
    headers.set("access-control-allow-methods", "POST, OPTIONS");
  }
  return headers;
}

function json(status: number, body: unknown, origin: string, extra: string): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin, extra) });
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function cleanLine(value: unknown, max: number): string {
  return collapseSpaces(stripControls(asText(value))).trim().slice(0, max);
}

function stripControls(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    out += code < 32 || code === 127 ? " " : ch;
  }
  return out;
}

function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ");
}
