/** Login-free registration into public.volunteers on the main site project only. */
export const MAIN_SUPABASE_ORIGIN = "https://begtqcmwruvwposocnsr.supabase.co";
const MAIN_HOST = "begtqcmwruvwposocnsr.supabase.co";

export const SKILLS = [
  "ground_volunteer", "helpdesk", "family_update", "tech_support",
  "translation", "medical", "logistics",
] as const;
export const LANGUAGES = ["hindi", "urdu", "english", "arabic", "marathi"] as const;
export const AVAILABILITY = ["3", "7", "15", "full_season"] as const;
export const DUTY_LOCATIONS = ["embarkation", "local", "remote"] as const;
export const EMBARKATION_POINTS = [
  "Srinagar", "Gaya", "Guwahati", "Indore", "Jaipur", "Nagpur",
  "Delhi", "Mumbai", "Kolkata", "Bengaluru", "Hyderabad",
  "Cochin (Kochi)", "Chennai", "Ahmedabad", "Lucknow",
  "Kannur", "Calicut (Kozhikode)", "Vijayawada",
] as const;
export const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

const ROW_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VOLUNTEER_CODE = /^V-[A-Z]{3}-[A-Z]{3}-[0-9]{4}$/;

export interface VolunteerInsert {
  full_name: string;
  father_name: string;
  age: number;
  mobile: string;
  whatsapp: string;
  email: string | null;
  full_address: string;
  city: string;
  district: string;
  state: (typeof STATES)[number];
  embarkation_point: (typeof EMBARKATION_POINTS)[number];
  skills: string[];
  availability_days: (typeof AVAILABILITY)[number];
  duty_location: (typeof DUTY_LOCATIONS)[number];
  languages: string[];
  declaration_agreed: true;
  user_id: string | null;
}

export interface SavedVolunteer {
  id: string;
  volunteerId: string;
}

export class DuplicateVolunteer extends Error {
  constructor() {
    super("duplicate");
  }
}

export interface VolunteerStore {
  insert(row: VolunteerInsert): Promise<SavedVolunteer>;
}

export interface RateGate {
  tooMany(key: string, now: number): boolean;
}

export interface VolunteerEnv {
  supabaseUrl: string;
  serviceRoleKey: string;
  anonKey: string;
  publishableKey: string;
  ipHashSalt: string;
}

export interface HandlerDeps {
  env: VolunteerEnv;
  store: VolunteerStore;
  rateGate: RateGate;
  /** Null when there is no Bearer token. Throws when Auth cannot be reached. */
  verifyUser: (accessToken: string) => Promise<string | null>;
  now?: () => Date;
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

export function mainVolunteerUrlAllowed(raw: string): boolean {
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" && !url.username && !url.password && url.host === MAIN_HOST && url.origin === MAIN_SUPABASE_ORIGIN;
  } catch {
    return false;
  }
}

export async function handleVolunteerRegistration(req: Request, deps: HandlerDeps): Promise<Response> {
  const origin = req.headers.get("origin") ?? "";
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (!originAllowed(origin)) return json(403, { ok: false, error: "unavailable" }, origin);
  if (req.method !== "POST") return json(405, { ok: false, error: "unavailable" }, origin);
  if (!mainVolunteerUrlAllowed(deps.env.supabaseUrl) || !deps.env.serviceRoleKey.trim()) {
    return json(503, { ok: false, error: "unavailable" }, origin);
  }
  if (!clientKeyAllowed(req.headers.get("apikey") ?? "", deps.env)) {
    return json(401, { ok: false, error: "unavailable" }, origin);
  }

  const raw = await req.text();
  if (raw.length > 12000) return json(400, { ok: false, error: "validation" }, origin);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "validation" }, origin);
  }
  const parsed = validateVolunteer(body);
  if (!parsed.ok) return json(400, { ok: false, error: "validation" }, origin);

  const now = (deps.now ?? (() => new Date()))().getTime();
  const salt = deps.env.ipHashSalt || "hajcare-volunteer-main-v1";
  const ipHash = await sha256(`${salt}:ip:${clientIp(req)}`);
  const phoneHash = await sha256(`${salt}:phone:${parsed.value.mobile}`);
  if (deps.rateGate.tooMany(`ip:${ipHash}`, now) || deps.rateGate.tooMany(`phone:${phoneHash}`, now)) {
    return json(429, { ok: false, error: "rate_limited" }, origin);
  }
  if (parsed.honeypot) return json(400, { ok: false, error: "validation" }, origin);

  const accessToken = bearerToken(req.headers.get("authorization") ?? "");
  let userId: string | null = null;
  if (accessToken && accessToken !== clientKey(deps.env)) {
    try {
      userId = await deps.verifyUser(accessToken);
    } catch {
      return json(503, { ok: false, error: "unavailable" }, origin);
    }
    if (!userId || !ROW_ID.test(userId)) return json(401, { ok: false, error: "sign_in_required" }, origin);
  }

  try {
    const saved = await deps.store.insert({ ...parsed.value, user_id: userId });
    if (!ROW_ID.test(saved.id) || !VOLUNTEER_CODE.test(saved.volunteerId)) {
      return json(503, { ok: false, error: "unavailable" }, origin);
    }
    return json(200, { ok: true, id: saved.id, volunteer_id: saved.volunteerId }, origin);
  } catch (err) {
    if (err instanceof DuplicateVolunteer) return json(409, { ok: false, error: "duplicate" }, origin);
    return json(503, { ok: false, error: "unavailable" }, origin);
  }
}

export function validateVolunteer(body: unknown):
  | { ok: true; honeypot: boolean; value: Omit<VolunteerInsert, "user_id"> }
  | { ok: false } {
  if (!body || typeof body !== "object") return { ok: false };
  const row = body as Record<string, unknown>;
  if ("user_id" in row) return { ok: false };
  const fullName = personName(row.full_name);
  const fatherName = personName(row.father_name);
  if (!fullName || !fatherName) return { ok: false };
  const age = typeof row.age === "number" ? row.age : Number(asText(row.age));
  if (!Number.isInteger(age) || age < 18 || age > 65) return { ok: false };
  const mobile = digits(row.mobile);
  const whatsapp = digits(row.whatsapp);
  if (!/^[0-9]{10}$/.test(mobile) || !/^[0-9]{10}$/.test(whatsapp)) return { ok: false };
  const emailRaw = asText(row.email).trim();
  if (emailRaw && (emailRaw.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw))) return { ok: false };
  const fullAddress = cleanLine(row.full_address, 400);
  const city = cleanLine(row.city, 80);
  const district = cleanLine(row.district, 80);
  if (fullAddress.length < 2 || city.length < 2 || district.length < 2) return { ok: false };
  if (/[<>]/.test(`${fullAddress} ${city} ${district}`)) return { ok: false };
  const state = asText(row.state);
  const embarkation = asText(row.embarkation_point);
  const availability = asText(row.availability_days);
  const duty = asText(row.duty_location);
  if (!(STATES as readonly string[]).includes(state)) return { ok: false };
  if (!(EMBARKATION_POINTS as readonly string[]).includes(embarkation)) return { ok: false };
  if (!(AVAILABILITY as readonly string[]).includes(availability)) return { ok: false };
  if (!(DUTY_LOCATIONS as readonly string[]).includes(duty)) return { ok: false };
  const skills = stringList(row.skills, SKILLS);
  const languages = stringList(row.languages, LANGUAGES);
  if (!skills || !languages) return { ok: false };
  const other = cleanLine(row.other_language, 40);
  if (other.length === 1 || /[<>]/.test(other)) return { ok: false };
  const spoken = other.length >= 2 && !languages.includes(other) ? [...languages, other] : languages;
  if (row.declaration_agreed !== true || row.consent_privacy !== true || row.consent_terms !== true) return { ok: false };
  return {
    ok: true,
    honeypot: asText(row.company_website).trim().length > 0,
    value: {
      full_name: fullName,
      father_name: fatherName,
      age,
      mobile,
      whatsapp,
      email: emailRaw || null,
      full_address: fullAddress,
      city,
      district,
      state: state as VolunteerInsert["state"],
      embarkation_point: embarkation as VolunteerInsert["embarkation_point"],
      skills,
      availability_days: availability as VolunteerInsert["availability_days"],
      duty_location: duty as VolunteerInsert["duty_location"],
      languages: spoken,
      declaration_agreed: true,
    },
  };
}

export async function verifyMainUser(supabaseUrl: string, apiKey: string, accessToken: string): Promise<string | null> {
  if (!mainVolunteerUrlAllowed(supabaseUrl)) return null;
  const key = apiKey.trim();
  if (!key || isPrivilegedKey(key)) return null;
  const token = accessToken.trim();
  if (!token || token.length > 4096 || /\s/.test(token)) return null;
  const res = await fetch(`${MAIN_SUPABASE_ORIGIN}/auth/v1/user`, {
    method: "GET",
    redirect: "manual",
    headers: { authorization: `Bearer ${token}`, apikey: key },
  });
  if (res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) return null;
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error("auth unavailable");
  const data = await res.json() as { id?: unknown };
  return typeof data.id === "string" && ROW_ID.test(data.id) ? data.id : null;
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

function isPrivilegedKey(key: string): boolean {
  return key.startsWith("sb_secret_") || /service[-_]?role/i.test(key);
}

function clientKey(env: VolunteerEnv): string {
  return env.publishableKey.trim() || env.anonKey.trim();
}

function clientKeyAllowed(headerKey: string, env: VolunteerEnv): boolean {
  const key = headerKey.trim();
  if (!key || key === env.serviceRoleKey || isPrivilegedKey(key)) return false;
  return [env.anonKey.trim(), env.publishableKey.trim()].filter(Boolean).includes(key);
}

function bearerToken(header: string): string {
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  if (!match || match[1].length > 4096) return "";
  return match[1];
}

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("cf-connecting-ip")
    || req.headers.get("x-real-ip")
    || "unknown";
}

async function sha256(value: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("crypto unavailable");
  const buf = await subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function personName(value: unknown): string {
  const name = cleanLine(value, 120);
  if (name.length < 2 || !/\p{L}/u.test(name) || /[<>]/.test(name)) return "";
  return name;
}

function digits(value: unknown): string {
  return asText(value).replace(/\D/g, "");
}

function stringList(value: unknown, allowed: readonly string[]): string[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > allowed.length) return null;
  const items = value.filter((item): item is string => typeof item === "string");
  if (items.length !== value.length) return null;
  const unique = [...new Set(items)];
  if (unique.length !== items.length || !unique.every((item) => allowed.includes(item))) return null;
  return unique;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function cleanLine(value: unknown, max: number): string {
  return asText(value).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}
