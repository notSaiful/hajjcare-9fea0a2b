export const TRAINING_SUPABASE_ORIGIN = "https://pwtmrddreqmhyluqbfgi.supabase.co";
const TRAINING_HOST = "pwtmrddreqmhyluqbfgi.supabase.co";
const FORBIDDEN_HOSTS = ["begtqcmwruvwposocnsr.supabase.co", "vvbbwlfzpfvgyweeggvw.supabase.co"];

export const PREFERRED_LANGUAGES = [
  "ur", "hi", "bn", "ta", "te", "kn", "ml", "ks", "gu", "mr", "en",
  "as", "brx", "doi", "kok", "mai", "mni", "ne", "or", "pa", "sa", "sat", "sd",
] as const;

export const MADHHABS = ["hanafi", "shafii", "maliki", "hanbali", "ahl_e_hadith", "other"] as const;

/** Columns that exist on public.training_enrollments. id and created_at are database defaults. */
export interface EnrollmentInsert {
  name: string;
  cover_number: string;
  mobile_number: string;
  email: string | null;
  state: string;
  madhhab: (typeof MADHHABS)[number] | null;
  preferred_language: (typeof PREFERRED_LANGUAGES)[number];
  question_or_consultation: string | null;
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
    const saved = await deps.store.insert(parsed.value);
    return json(200, receiptBody(saved), origin, extra);
  } catch (err) {
    if (err instanceof DuplicateEnrollment) return json(409, { ok: false, error: "duplicate" }, origin, extra);
    return json(503, { ok: false, error: "unavailable" }, origin, extra);
  }
}

export function validateEnrollment(body: unknown): { ok: true; value: EnrollmentInsert } | { ok: false } {
  if (!body || typeof body !== "object") return { ok: false };
  const row = body as Record<string, unknown>;
  const name = cleanLine(row.name, 120);
  if (name.length < 2 || !/\p{L}/u.test(name) || /[<>]/.test(name)) return { ok: false };
  const cover = cleanLine(row.cover_number, 32).toUpperCase().replace(/[^A-Z0-9-]/g, "");
  if (cover.length < 4 || cover.length > 32) return { ok: false };
  let mobile = asText(row.mobile_number).replace(/\D/g, "");
  if (mobile.length === 10) mobile = `91${mobile}`;
  if (!/^[0-9]+$/.test(mobile) || mobile.length < 10 || mobile.length > 15) return { ok: false };
  const emailText = asText(row.email).toLowerCase();
  let email: string | null = null;
  if (emailText) {
    if (emailText.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailText) || /[<>]/.test(emailText)) return { ok: false };
    email = emailText;
  }
  const state = cleanLine(row.state, 80);
  if (state.length < 2 || /[<>]/.test(state)) return { ok: false };
  const madhhabRaw = asText(row.madhhab);
  let madhhab: EnrollmentInsert["madhhab"] = null;
  if (madhhabRaw && madhhabRaw !== "prefer_not_to_say") {
    if (!(MADHHABS as readonly string[]).includes(madhhabRaw)) return { ok: false };
    madhhab = madhhabRaw as EnrollmentInsert["madhhab"];
  }
  const language = asText(row.preferred_language);
  if (!(PREFERRED_LANGUAGES as readonly string[]).includes(language)) return { ok: false };
  const question = cleanBlock(row.question_or_consultation, 1000);
  if (/[<>]/.test(question)) return { ok: false };
  return {
    ok: true,
    value: {
      name,
      cover_number: cover,
      mobile_number: mobile,
      email,
      state,
      madhhab,
      preferred_language: language as EnrollmentInsert["preferred_language"],
      question_or_consultation: question || null,
    },
  };
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
  return collapseSpaces(stripControls(asText(value), false)).trim().slice(0, max);
}

function cleanBlock(value: unknown, max: number): string {
  return stripControls(asText(value), true).replace(/[^\S\n]+/g, " ").trim().slice(0, max);
}

function stripControls(value: string, keepNewline: boolean): string {
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 32 || code === 127) {
      if (keepNewline && ch === "\n") out += "\n";
      else out += " ";
    } else {
      out += ch;
    }
  }
  return out;
}

function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ");
}
