import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { assertTrainingProjectUrl, FORBIDDEN_TRAINING_HOSTS, TRAINING_SUPABASE_ORIGIN } from "../project";
import { trainingConfigSource, trainingPublishableKey } from "../publicKey";
import {
  DuplicateEnrollment,
  TRAINING_SUPABASE_ORIGIN as HANDLER_TRAINING_ORIGIN,
  createRateGate,
  handleTrainingEnrollment,
  trainingAuthApiKey,
  trainingUrlAllowed,
  validateEnrollment,
  verifyTrainingUser,
  type EnrollmentInsert,
  type SavedEnrollment,
  type TrainingEnv,
  type TrainingStore,
} from "../../../supabase/training-project/functions/training-enroll/handler";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");
const USER_ID = "11111111-1111-4111-8111-111111111111";

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto });
}

function jwt(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `eyJhbGciOiJub25lIn0.${body}.sig`;
}

function memoryStore() {
  const rows: EnrollmentInsert[] = [];
  let inserts = 0;
  const store: TrainingStore = {
    async insert(row) {
      inserts += 1;
      if (rows.some((item) => item.cover_number === row.cover_number && item.phone_number === row.phone_number)) {
        throw new DuplicateEnrollment();
      }
      rows.push(row);
      const saved: SavedEnrollment = { id: `receipt-${rows.length}`, createdAt: "2026-11-08T00:00:00.000Z" };
      return saved;
    },
  };
  return { store, rows, get inserts() { return inserts; } };
}

const env: TrainingEnv = {
  supabaseUrl: TRAINING_SUPABASE_ORIGIN,
  serviceRoleKey: "service-role-test",
  anonKey: "sb_publishable_test_only",
  publishableKey: "",
  ipHashSalt: "salt",
  allowedOrigins: "",
};

function request(body: unknown, headers: Record<string, string> = {}, opts: { auth?: boolean } = {}) {
  const auth = opts.auth !== false;
  const base: Record<string, string> = { "content-type": "application/json", apikey: env.anonKey };
  if (auth) base.authorization = "Bearer test-token";
  return new Request(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/training-enroll`, {
    method: "POST",
    headers: { ...base, ...headers },
    body: JSON.stringify(body),
  });
}

function validBody(over: Record<string, unknown> = {}) {
  return {
    cover_number: "ab-1234",
    name: "Amina Khan",
    phone_number: "9876543210",
    language: "hi",
    state: "Kerala",
    embarkation_point: "Delhi",
    ...over,
  };
}

function deps(
  store: TrainingStore,
  next: Partial<TrainingEnv> = {},
  verifyUser: (accessToken: string) => Promise<string | null> = async () => USER_ID,
) {
  return { env: { ...env, ...next }, store, rateGate: createRateGate(), verifyUser };
}

describe("training project boundary", () => {
  it("accepts only the typed training project", () => {
    expect(assertTrainingProjectUrl(TRAINING_SUPABASE_ORIGIN)).toBe(TRAINING_SUPABASE_ORIGIN);
    expect(HANDLER_TRAINING_ORIGIN).toBe(TRAINING_SUPABASE_ORIGIN);
    expect(trainingUrlAllowed(TRAINING_SUPABASE_ORIGIN)).toBe(true);
    const browser = read("public/training-enroll.js");
    expect(browser).toContain(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/training-enroll`);
    expect(browser).toContain(`var ALLOWED = "${new URL(TRAINING_SUPABASE_ORIGIN).host}";`);
    for (const host of FORBIDDEN_TRAINING_HOSTS) {
      expect(() => assertTrainingProjectUrl(`https://${host}`)).toThrow(/training project/);
      expect(trainingUrlAllowed(`https://${host}`)).toBe(false);
      expect(browser).toContain(`"${host}": 1`);
    }
  });

  it("rejects a service role key and keeps the committed config empty", () => {
    expect(trainingPublishableKey("")).toBe("");
    expect(trainingPublishableKey("sb_publishable_test_only")).toBe("sb_publishable_test_only");
    expect(trainingPublishableKey(jwt({ role: "anon" }))).toContain("eyJ");
    expect(() => trainingPublishableKey(jwt({ role: "service_role" }))).toThrow(/service role/i);
    expect(() => trainingPublishableKey("sb_secret_test")).toThrow(/service role/i);
    const source = trainingConfigSource("");
    expect(source).toContain(TRAINING_SUPABASE_ORIGIN);
    expect(source).not.toContain("begtqcmwruvwposocnsr");
    expect(source).not.toContain("pwtmrddreqmhyluqbfgi");
    expect(source).not.toContain("vvbbwlfzpfvgyweeggvw");
  });
});

describe("training enrollment save", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => {
      throw new Error("outbound call");
    }));
  });

  it("inserts only the existing columns and returns a receipt", async () => {
    const db = memoryStore();
    const res = await handleTrainingEnrollment(request(validBody()), deps(db.store));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({
      ok: true,
      receipt_id: "receipt-1",
      saved_at: "2026-11-08T00:00:00.000Z",
    });
    expect(db.inserts).toBe(1);
    expect(db.rows[0]).toEqual({
      cover_number: "AB-1234",
      name: "Amina Khan",
      phone_number: "919876543210",
      language: "hi",
      state: "Kerala",
      embarkation_point: "Delhi",
      user_id: USER_ID,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not return the earlier row when the same cover and mobile are sent again", async () => {
    const db = memoryStore();
    await handleTrainingEnrollment(request(validBody({ name: "Secret Name" })), deps(db.store));
    const dup = await handleTrainingEnrollment(request(validBody()), deps(db.store));
    const json = await dup.json();
    expect(dup.status).toBe(409);
    expect(json).toEqual({ ok: false, error: "duplicate" });
    expect(JSON.stringify(json)).not.toContain("Secret Name");
    expect(JSON.stringify(json)).not.toContain("receipt-1");
    expect(db.inserts).toBe(2);
    expect(db.rows).toHaveLength(1);
  });

  it("does not write when the project, key, or fields are wrong", async () => {
    const db = memoryStore();
    const wrong = await handleTrainingEnrollment(request(validBody()), deps(db.store, { supabaseUrl: "https://vvbbwlfzpfvgyweeggvw.supabase.co" }));
    expect(wrong.status).toBe(503);
    const secret = await handleTrainingEnrollment(request(validBody(), { apikey: env.serviceRoleKey }), deps(db.store));
    expect(secret.status).toBe(401);
    const bad = await handleTrainingEnrollment(request(validBody({ language: "xx", name: "<b>" })), deps(db.store));
    expect(bad.status).toBe(400);
    expect(db.inserts).toBe(0);
    expect(validateEnrollment(validBody({ embarkation_point: "Paris" }))?.ok).toBe(false);
  });

  it("stops repeated attempts from one address before insert", async () => {
    const db = memoryStore();
    const gate = createRateGate();
    for (let i = 0; i < 8; i += 1) {
      const res = await handleTrainingEnrollment(
        request(validBody({ cover_number: `AB-100${i}`, phone_number: `900000000${i}` })),
        { env, store: db.store, rateGate: gate, verifyUser: async () => USER_ID },
      );
      expect(res.status).toBe(200);
    }
    const blocked = await handleTrainingEnrollment(
      request(validBody({ cover_number: "AB-1999", phone_number: "9000000099" })),
      { env, store: db.store, rateGate: gate, verifyUser: async () => USER_ID },
    );
    expect(blocked.status).toBe(429);
    expect(db.inserts).toBe(8);
  });

  it("matches the created table and does not send a confirmation", () => {
    const handler = read("supabase/training-project/functions/training-enroll/handler.ts");
    const entry = read("supabase/training-project/functions/training-enroll/index.ts");
    const sql = read("supabase/training-project/migrations/20261108053000_training_enrollments.sql");
    const userSql = read("supabase/training-project/migrations/20261111010000_training_enrollments_user_id.sql");
    const client = read("public/training-enroll.js");
    for (const column of ["cover_number", "name", "phone_number", "language", "state", "embarkation_point"]) {
      expect(entry).toContain(column);
    }
    expect(entry).not.toMatch(/email:|madhhab|question_or_consultation|preferred_language|mobile_number/);
    expect(handler).not.toMatch(/madhhab|question_or_consultation|TRAINING_EMAIL/);
    expect(client).not.toMatch(/madhhab|question_or_consultation|TRAINING_EMAIL/);
    expect(client).toContain("cover_number");
    expect(client).toContain("embarkation_point");
    expect(client).toContain("रजिस्ट्रेशन अभी चालू नहीं है");
    expect(sql).toContain("42P07");
    expect(sql).toContain("Do not CREATE TABLE again");
    expect(sql).toContain("grant select, insert on table public.training_enrollments to service_role");
    expect(sql).not.toMatch(/grant .+ to anon/i);
    expect(entry).toContain('select("id, created_at")');
    expect(entry).toContain("user_id: row.user_id");
    expect(entry).toContain("verifyTrainingUser");
    expect(userSql.toLowerCase()).toContain("user_id uuid null references auth.users (id) on delete set null");
    expect(userSql.toLowerCase()).toContain("if not exists");
    expect(userSql.toLowerCase()).not.toMatch(/\bgrant\b/);
    expect(read("supabase/training-project/config.toml")).toContain("verify_jwt = false");
  });

  it("rejects a missing or invalid token before any insert", async () => {
    const db = memoryStore();
    let checks = 0;
    const verifyUser = async () => {
      checks += 1;
      expect(db.inserts).toBe(0);
      return null;
    };
    const missing = await handleTrainingEnrollment(request(validBody(), {}, { auth: false }), deps(db.store, {}, verifyUser));
    expect(missing.status).toBe(401);
    expect(await missing.json()).toEqual({ ok: false, error: "sign_in_required" });
    expect(checks).toBe(0);
    const invalid = await handleTrainingEnrollment(request(validBody()), deps(db.store, {}, verifyUser));
    expect(invalid.status).toBe(401);
    expect(await invalid.json()).toEqual({ ok: false, error: "sign_in_required" });
    expect(checks).toBe(1);
    expect(db.inserts).toBe(0);
    const down = await handleTrainingEnrollment(
      request(validBody()),
      deps(db.store, {}, async () => { throw new Error("auth unavailable"); }),
    );
    expect(down.status).toBe(503);
    expect(db.inserts).toBe(0);
  });
});

describe("training auth user check", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("asks the Sazo auth user endpoint and refuses a service role key", async () => {
    expect(trainingAuthApiKey("service-role-test", "sb_publishable_test_only")).toBe("sb_publishable_test_only");
    expect(trainingAuthApiKey("sb_publishable_test_only", "")).toBe("sb_publishable_test_only");
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: USER_ID }), { status: 200 }));
    const id = await verifyTrainingUser(TRAINING_SUPABASE_ORIGIN, "sb_publishable_test_only", "access-token");
    expect(id).toBe(USER_ID);
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toBe(`${TRAINING_SUPABASE_ORIGIN}/auth/v1/user`);
    const headers = (call[1] as RequestInit).headers as Record<string, string>;
    expect(headers.authorization).toBe("Bearer access-token");
    expect(headers.apikey).toBe("sb_publishable_test_only");
    vi.mocked(fetch).mockClear();
    expect(await verifyTrainingUser(TRAINING_SUPABASE_ORIGIN, "service-role-test", "access-token")).toBeNull();
    expect(await verifyTrainingUser("https://pwtmrddreqmhyluqbfgi.supabase.co", "sb_publishable_test_only", "access-token")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ message: "bad" }), { status: 401 }));
    expect(await verifyTrainingUser(TRAINING_SUPABASE_ORIGIN, "sb_publishable_test_only", "expired-token")).toBeNull();
  });
});

describe("training browser client", () => {
  beforeEach(() => {
    document.documentElement.lang = "en";
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
    delete (window as unknown as { __HC_TRAINING_CONFIG?: unknown }).__HC_TRAINING_CONFIG;
    delete (window as unknown as { __hcSubmitTrainingEnrollment?: unknown }).__hcSubmitTrainingEnrollment;
    window.eval(read("public/training-enroll.js"));
  });

  function pageConfig(url = TRAINING_SUPABASE_ORIGIN, publishableKey = "sb_publishable_test_only") {
    (window as unknown as { __HC_TRAINING_CONFIG?: { url: string; publishableKey: string } }).__HC_TRAINING_CONFIG = { url, publishableKey };
  }

  function form() {
    document.body.innerHTML = `<form>
      <input name="cover_number" value="AB-1234"><input name="name" value="Amina Khan">
      <input name="phone_number" value="9876543210">
      <select name="language"><option value="hi" selected>Hindi</option></select>
      <input name="state" value="Kerala">
      <select name="embarkation_point"><option value="Delhi" selected>Delhi</option></select>
      <button type="submit">Submit</button>
    </form>`;
    return document.querySelector("form") as HTMLFormElement;
  }

  function client() {
    return window as unknown as {
      __hcSubmitTrainingEnrollment: (form: HTMLFormElement) => Promise<{ ok: boolean; message: string; receiptId?: string }>;
      __hcTrainingRegister: (email: string, password: string, form?: HTMLFormElement) => Promise<{ ok: boolean; message: string }>;
      __hcMountTrainingGate: (form: HTMLFormElement) => void;
    };
  }

  function sessionResponse(access = "access-1", refresh = "refresh-1", expiresIn = 3600) {
    return new Response(JSON.stringify({
      access_token: access,
      refresh_token: refresh,
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    }), { status: 200 });
  }

  it("keeps the enrollment form closed until registration and never calls a forbidden host", async () => {
    pageConfig();
    const api = client();
    const node = form();
    api.__hcMountTrainingGate(node);
    const cover = node.querySelector("[name=cover_number]") as HTMLInputElement;
    expect(node.querySelector("[data-hc-sign-in]")).toBeNull();
    expect(node.querySelectorAll("[data-hc-create]")).toHaveLength(1);
    expect(node.querySelector("[data-hc-register]")?.hasAttribute("hidden")).toBe(false);
    expect(node.querySelector("[data-hc-enroll]")?.hasAttribute("hidden")).toBe(true);
    expect(cover.disabled).toBe(true);
    expect(node.textContent).toContain("Register to join the 100-day training");
    expect(node.textContent).toContain("Register");
    expect(node.textContent).not.toMatch(/Sign in|Create account/);
    const blocked = await api.__hcSubmitTrainingEnrollment(node);
    expect(blocked.ok).toBe(false);
    expect(blocked.message).toMatch(/Register to continue/);
    expect(fetch).not.toHaveBeenCalled();

    for (const host of FORBIDDEN_TRAINING_HOSTS) {
      pageConfig(`https://${host}`);
      const signed = await api.__hcTrainingRegister("a@example.com", "password12", node);
      expect(signed.ok).toBe(false);
      expect(signed.message).toMatch(/Nothing was saved/);
      const submitted = await api.__hcSubmitTrainingEnrollment(node);
      expect(submitted.ok).toBe(false);
    }
    expect(fetch).not.toHaveBeenCalled();
    expect(node.innerHTML).not.toContain("password12");
  });

  it("registers only on the Sazo host and reuses the same password when the email exists", async () => {
    pageConfig();
    const api = client();
    const short = await api.__hcTrainingRegister("a@example.com", "short");
    expect(short.ok).toBe(false);
    expect(short.message).toMatch(/at least 8 characters/i);
    expect(fetch).not.toHaveBeenCalled();

    pageConfig(TRAINING_SUPABASE_ORIGIN, "");
    const closed = await api.__hcTrainingRegister("a@example.com", "password12");
    expect(closed.message).toMatch(/not open/i);
    expect(fetch).not.toHaveBeenCalled();

    pageConfig();
    vi.mocked(fetch).mockResolvedValueOnce(sessionResponse());
    const ok = await api.__hcTrainingRegister("a@example.com", "password12");
    expect(ok.ok).toBe(true);
    const signUpCall = vi.mocked(fetch).mock.calls[0];
    expect(String(signUpCall[0])).toBe(`${TRAINING_SUPABASE_ORIGIN}/auth/v1/signup`);
    expect(JSON.parse(String((signUpCall[1] as RequestInit).body))).toEqual({ email: "a@example.com", password: "password12" });
    expect(((signUpCall[1] as RequestInit).headers as Record<string, string>).apikey).toBe("sb_publishable_test_only");
    expect(sessionStorage.getItem("hc-training-session")).toContain("access-1");
    expect(localStorage.getItem("hc-training-session")).toBeNull();

    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({ error_code: "user_already_exists", msg: "User already registered" }), { status: 422 }))
      .mockResolvedValueOnce(sessionResponse("access-same", "refresh-same"));
    const again = await api.__hcTrainingRegister("a@example.com", "password12");
    expect(again.ok).toBe(true);
    const retry = vi.mocked(fetch).mock.calls.at(-1);
    expect(String(retry?.[0])).toBe(`${TRAINING_SUPABASE_ORIGIN}/auth/v1/token?grant_type=password`);
    expect(JSON.parse(String((retry?.[1] as RequestInit).body))).toEqual({ email: "a@example.com", password: "password12" });

    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify({ error_code: "email_exists", msg: "User already registered" }), { status: 422 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ error_code: "invalid_credentials", msg: "Invalid login credentials" }), { status: 400 }));
    const mismatch = await api.__hcTrainingRegister("b@example.com", "password12");
    expect(mismatch.ok).toBe(false);
    expect(mismatch.message).toMatch(/already registered with a different password/);
    expect(mismatch.message).toMatch(/Nothing was saved/);
    expect(mismatch.message).not.toMatch(/Wrong email or password|Invalid login credentials|Sign in/);

    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ error_code: "unexpected_failure", msg: "Something broke" }), { status: 400 }));
    const generic = await api.__hcTrainingRegister("c@example.com", "password12");
    expect(generic.message).toMatch(/did not confirm the request/);
    expect(generic.message).not.toMatch(/Wrong email or password|Something broke/);

    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ error_code: "weak_password", msg: "Password should be at least 8 characters" }), { status: 422 }));
    const weak = await api.__hcTrainingRegister("d@example.com", "password12");
    expect(weak.message).toMatch(/at least 8 characters/i);

    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ error_code: "email_address_invalid", msg: "Unable to validate email address" }), { status: 400 }));
    const invalidEmail = await api.__hcTrainingRegister("e@example.com", "password12");
    expect(invalidEmail.message).toMatch(/Check the email/);

    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ error_code: "signup_disabled", msg: "Signups not allowed for this instance" }), { status: 400 }));
    const disabled = await api.__hcTrainingRegister("f@example.com", "password12");
    expect(disabled.message).toMatch(/did not confirm the request/);
    expect(disabled.message).not.toMatch(/Signups not allowed|Wrong email or password/);

    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ error_code: "over_email_send_rate_limit", msg: "email rate limit exceeded" }), { status: 429 }));
    const limited = await api.__hcTrainingRegister("g@example.com", "password12");
    expect(limited.message).toMatch(/Too many attempts/);

    vi.mocked(fetch).mockRejectedValueOnce(new Error("network down"));
    const offline = await api.__hcTrainingRegister("h@example.com", "password12");
    expect(offline.message).toMatch(/did not confirm the request/);
    expect(offline.message).not.toContain("network down");
  });

  it("sends the bearer token and clears the session when the function returns 401", async () => {
    pageConfig();
    const api = client();
    const node = form();
    api.__hcMountTrainingGate(node);
    const unsigned = await api.__hcSubmitTrainingEnrollment(node);
    expect(unsigned.message).toMatch(/Register to continue/);
    expect(fetch).not.toHaveBeenCalled();

    vi.mocked(fetch).mockResolvedValueOnce(sessionResponse());
    await api.__hcTrainingRegister("a@example.com", "password12", node);
    expect(node.querySelector("[data-hc-enroll]")?.hasAttribute("hidden")).toBe(false);
    expect((node.querySelector("[name=cover_number]") as HTMLInputElement).disabled).toBe(false);
    expect(node.innerHTML).not.toContain("password12");

    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const missing = await api.__hcSubmitTrainingEnrollment(node);
    expect(missing.ok).toBe(false);
    expect(missing.message).toMatch(/Nothing was saved/);
    const enrollCall = vi.mocked(fetch).mock.calls.at(-1);
    expect(String(enrollCall?.[0])).toBe(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/training-enroll`);
    const sent = JSON.parse(String((enrollCall?.[1] as RequestInit).body));
    expect(sent).toMatchObject({
      cover_number: "AB-1234",
      name: "Amina Khan",
      phone_number: "9876543210",
      language: "hi",
      state: "Kerala",
      embarkation_point: "Delhi",
    });
    expect(sent.email).toBeUndefined();
    expect(sent.madhhab).toBeUndefined();
    expect(sent.idempotency_key).toBeUndefined();
    expect((enrollCall?.[1] as RequestInit).headers).toMatchObject({ authorization: "Bearer access-1" });

    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ ok: false, error: "sign_in_required" }), { status: 401 }));
    const rejected = await api.__hcSubmitTrainingEnrollment(node);
    expect(rejected.ok).toBe(false);
    expect(rejected.message).toMatch(/Register to continue/);
    expect(sessionStorage.getItem("hc-training-session")).toBeNull();
    expect(node.querySelector("[data-hc-sign-in]")).toBeNull();
    expect(node.querySelector("[data-hc-register]")?.hasAttribute("hidden")).toBe(false);
    expect(node.querySelector("[data-hc-enroll]")?.hasAttribute("hidden")).toBe(true);

    vi.mocked(fetch).mockResolvedValueOnce(sessionResponse("access-2", "refresh-2", 30));
    await api.__hcTrainingRegister("a@example.com", "password12", node);
    vi.mocked(fetch)
      .mockResolvedValueOnce(sessionResponse("access-3", "refresh-3", 3600))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        ok: true,
        receipt_id: "receipt-9",
        saved_at: "2026-11-08T00:00:00.000Z",
      }), { status: 200 }));
    const saved = await api.__hcSubmitTrainingEnrollment(node);
    expect(saved.ok).toBe(true);
    expect(saved.message).toContain("Receipt receipt-9");
    expect(saved.message).toMatch(/not checked against a Haj Committee list/i);
    expect(saved.message).not.toMatch(/email was sent|sms was sent/i);
    const refreshCall = vi.mocked(fetch).mock.calls.at(-2);
    expect(String(refreshCall?.[0])).toBe(`${TRAINING_SUPABASE_ORIGIN}/auth/v1/token?grant_type=refresh_token`);
    const savedCall = vi.mocked(fetch).mock.calls.at(-1);
    expect((savedCall?.[1] as RequestInit).headers).toMatchObject({ authorization: "Bearer access-3" });
    expect(localStorage.getItem("hc-train")).toBeNull();
    expect(node.innerHTML).not.toContain("access-3");
  });
});
