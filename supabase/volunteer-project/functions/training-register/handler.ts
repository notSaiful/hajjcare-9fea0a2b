/** Login-free training registration into public.training_registrations on hajjcare-live only. */
export const TRAINING_REGISTER_ORIGIN = "https://vvbbwlfzpfvgyweeggvw.supabase.co";
const TRAINING_REGISTER_HOST = "vvbbwlfzpfvgyweeggvw.supabase.co";
const FORBIDDEN_HOSTS = [
  "begtqcmwruvwposocnsr.supabase.co",
  "pwtmrddreqmhyluqbfgi.supabase.co",
  "uorfprlfpqdpjtrcaqrt.supabase.co",
];

export const TRAINING_LANGUAGES = [
  "ur", "hi", "bn", "ta", "te", "kn", "ml", "ks", "gu", "mr", "en",
  "as", "brx", "doi", "kok", "mai", "mni", "ne", "or", "pa", "sa", "sat", "sd",
] as const;

export const EMBARKATION_POINTS = [
  "Srinagar", "Gaya", "Guwahati", "Indore", "Jaipur", "Nagpur",
  "Delhi", "Mumbai", "Kolkata", "Bengaluru", "Hyderabad",
  "Cochin (Kochi)", "Chennai", "Ahmedabad", "Lucknow",
  "Kannur", "Calicut (Kozhikode)", "Vijayawada",
] as const;

const ROW_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECEIPT = /^TR-[A-Z0-9]{8}$/;
const RECEIPT_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export interface TrainingRegistrationInsert {
  receipt_code: string;
  cover_number: string;
  name: string;
  phone_number: string;
  language: (typeof TRAINING_LANGUAGES)[number];
  state: string;
  embarkation_point: (typeof EMBARKATION_POINTS)[number];
  email: string | null;
  status: "new";
  source: "web";
}

export interface SavedTrainingRegistration {
  id: string;
  receiptCode: string;
}

export class DuplicateRegistration extends Error {
  constructor() {
    super("duplicate");
  }
}

export class ReceiptCollision extends Error {
  constructor() {
    super("receipt");
  }
}

export interface TrainingRegisterStore {
  insert(row: TrainingRegistrationInsert): Promise<SavedTrainingRegistration>;
}

export interface RateGate {
  tooMany(key: string, now: number): boolean;
}

export interface TrainingRegisterEnv {
  supabaseUrl: string;
  serviceRoleKey: string;
  anonKey: string;
  publishableKey: string;
  ipHashSalt: string;
}

export interface HandlerDeps {
  env: TrainingRegisterEnv;
  store: TrainingRegisterStore;
  rateGate: RateGate;
  now?: () => Date;
  receiptCode?: () => string;
}

export function createRateGate(limit = 8, windowMs = 60 * 60 * 1000): RateGate {
  const hits = new Map<string, number[]>();
  return {
    tooMany(key: string, now: number) {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return true;
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 2000) {
        const oldest = hits.keys().next().value;
        if (oldest) hits.delete(oldest);
      }
      return false;
    },
  };
}

export function trainingRegisterUrlAllowed(raw: string): boolean {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" || url.username || url.password) return false;
    if (url.host !== TRAINING_REGISTER_HOST || url.origin !== TRAINING_REGISTER_ORIGIN) return false;
    if (FORBIDDEN_HOSTS.includes(url.host)) return false;
    return true;
  } catch {
    return false;
  }
}

export function makeReceiptCode(bytes: Uint8Array): string {
  let out = "TR-";
  for (let i = 0; i < 8; i += 1) out += RECEIPT_ALPHABET[bytes[i] % RECEIPT_ALPHABET.length];
  return out;
}

export async function handleTrainingRegistration(req: Request, deps: HandlerDeps): Promise<Response> {
  const origin = req.headers.get("origin") ?? "";
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (!originAllowed(origin)) return json(403, { ok: false, error: "unavailable" }, origin);
  if (req.method !== "POST") return json(405, { ok: false, error: "unavailable" }, origin);
  if (!trainingRegisterUrlAllowed(deps.env.supabaseUrl) || !deps.env.serviceRoleKey) {
    return json(503, { ok: false, error: "unavailable" }, origin);
  }
  if (!clientKeyAllowed(req.headers.get("apikey") ?? "", deps.env)) {
    return json(401, { ok: false, error: "unavailable" }, origin);
  }

  const raw = await req.text();
  if (raw.length > 8000) return json(400, { ok: false, error: "validation" }, origin);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "validation" }, origin);
  }
  const parsed = validateTrainingRegistration(body);
  if (!parsed.ok) return json(400, { ok: false, error: "validation" }, origin);

  const now = (deps.now ?? (() => new Date()))();
  const salt = deps.env.ipHashSalt || "hajcare-training-register-v1";
  const ipHash = await sha256(`${salt}:ip:${clientIp(req)}`);
  const phoneHash = await sha256(`${salt}:phone:${parsed.value.phone_number}`);
  if (deps.rateGate.tooMany(`ip:${ipHash}`, now.getTime()) || deps.rateGate.tooMany(`phone:${phoneHash}`, now.getTime())) {
    return json(429, { ok: false, error: "rate_limited" }, origin);
  }
  if (parsed.honeypot) return json(400, { ok: false, error: "validation" }, origin);

  const nextCode = deps.receiptCode ?? (() => makeReceiptCode(crypto.getRandomValues(new Uint8Array(8))));
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const receiptCode = nextCode();
    if (!RECEIPT.test(receiptCode)) return json(503, { ok: false, error: "unavailable" }, origin);
    try {
      const saved = await deps.store.insert({
        ...parsed.value,
        receipt_code: receiptCode,
        status: "new",
        source: "web",
      });
      if (!ROW_ID.test(saved.id) || saved.receiptCode !== receiptCode || !RECEIPT.test(saved.receiptCode)) {
        return json(503, { ok: false, error: "unavailable" }, origin);
      }
      return json(200, { ok: true, id: saved.id, receipt_id: saved.receiptCode }, origin);
    } catch (err) {
      if (err instanceof ReceiptCollision) continue;
      if (err instanceof DuplicateRegistration) return json(409, { ok: false, error: "duplicate" }, origin);
      return json(503, { ok: false, error: "unavailable" }, origin);
    }
  }
  return json(503, { ok: false, error: "unavailable" }, origin);
}

export function validateTrainingRegistration(body: unknown):
  | { ok: true; honeypot: boolean; value: Omit<TrainingRegistrationInsert, "receipt_code" | "status" | "source"> }
  | { ok: false } {
  if (!body || typeof body !== "object") return { ok: false };
  const row = body as Record<string, unknown>;
  const honeypot = asText(row.company_website).trim().length > 0;
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
  const emailRaw = asText(row.email).trim();
  let email: string | null = null;
  if (emailRaw) {
    if (emailRaw.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) return { ok: false };
    email = emailRaw;
  }
  return {
    ok: true,
    honeypot,
    value: {
      cover_number: cover,
      name,
      phone_number: phone,
      language: language as TrainingRegistrationInsert["language"],
      state,
      embarkation_point: embarkation as TrainingRegistrationInsert["embarkation_point"],
      email,
    },
  };
}

function originAllowed(origin: string): boolean {
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password) return false;
  if (url.host === "hajjcare.in" || url.host === "www.hajjcare.in") return true;
  return /^hjcare-[a-z0-9-]+-[a-z0-9]+\.vercel\.app$/.test(url.hostname);
}

function corsHeaders(origin: string): Headers {
  const headers = new Headers({ vary: "origin", "cache-control": "no-store", "content-type": "application/json" });
  if (origin && originAllowed(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("access-control-allow-headers", "authorization, apikey, content-type");
    headers.set("access-control-allow-methods", "POST, OPTIONS");
  }
  return headers;
}

function json(status: number, body: unknown, origin: string): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });
}

function clientKeyAllowed(headerKey: string, env: TrainingRegisterEnv): boolean {
  const key = headerKey.trim();
  if (!key || key === env.serviceRoleKey || key.startsWith("sb_secret_") || /service[-_]?role/i.test(key)) return false;
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
