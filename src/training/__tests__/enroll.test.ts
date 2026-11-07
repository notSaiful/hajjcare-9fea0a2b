import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { assertTrainingProjectUrl, FORBIDDEN_TRAINING_HOSTS, TRAINING_SUPABASE_ORIGIN } from "../project";
import { trainingConfigSource, trainingPublishableKey } from "../publicKey";
import {
  DuplicateEnrollment,
  createRateGate,
  handleTrainingEnrollment,
  trainingUrlAllowed,
  validateEnrollment,
  type EnrollmentInsert,
  type SavedEnrollment,
  type TrainingEnv,
  type TrainingStore,
} from "../../../supabase/training-project/functions/training-enroll/handler";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

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
      if (rows.some((item) => item.cover_number === row.cover_number && item.mobile_number === row.mobile_number)) {
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

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/training-enroll`, {
    method: "POST",
    headers: { "content-type": "application/json", apikey: env.anonKey, ...headers },
    body: JSON.stringify(body),
  });
}

function validBody(over: Record<string, unknown> = {}) {
  return {
    name: "Amina Khan",
    cover_number: "ab-1234",
    mobile_number: "9876543210",
    email: "amina@example.com",
    state: "Kerala",
    madhhab: "prefer_not_to_say",
    preferred_language: "hi",
    question_or_consultation: "What time is the class?",
    ...over,
  };
}

function deps(store: TrainingStore, next: Partial<TrainingEnv> = {}) {
  return { env: { ...env, ...next }, store, rateGate: createRateGate() };
}

describe("training project boundary", () => {
  it("accepts only the typed training project", () => {
    expect(assertTrainingProjectUrl(TRAINING_SUPABASE_ORIGIN)).toBe(TRAINING_SUPABASE_ORIGIN);
    expect(trainingUrlAllowed(TRAINING_SUPABASE_ORIGIN)).toBe(true);
    for (const host of FORBIDDEN_TRAINING_HOSTS) {
      expect(() => assertTrainingProjectUrl(`https://${host}`)).toThrow(/training project/);
      expect(trainingUrlAllowed(`https://${host}`)).toBe(false);
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
      name: "Amina Khan",
      cover_number: "AB-1234",
      mobile_number: "919876543210",
      email: "amina@example.com",
      state: "Kerala",
      madhhab: null,
      preferred_language: "hi",
      question_or_consultation: "What time is the class?",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not return the earlier row when the same cover and mobile are sent again", async () => {
    const db = memoryStore();
    await handleTrainingEnrollment(request(validBody({ email: "secret@example.com" })), deps(db.store));
    const dup = await handleTrainingEnrollment(request(validBody()), deps(db.store));
    const json = await dup.json();
    expect(dup.status).toBe(409);
    expect(json).toEqual({ ok: false, error: "duplicate" });
    expect(JSON.stringify(json)).not.toContain("secret@example.com");
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
    const bad = await handleTrainingEnrollment(request(validBody({ preferred_language: "xx", name: "<b>" })), deps(db.store));
    expect(bad.status).toBe(400);
    expect(db.inserts).toBe(0);
    expect(validateEnrollment(validBody({ email: "" }))?.ok).toBe(true);
  });

  it("stops repeated attempts from one address before insert", async () => {
    const db = memoryStore();
    const gate = createRateGate();
    for (let i = 0; i < 8; i += 1) {
      const res = await handleTrainingEnrollment(
        request(validBody({ cover_number: `AB-100${i}`, mobile_number: `900000000${i}` })),
        { env, store: db.store, rateGate: gate },
      );
      expect(res.status).toBe(200);
    }
    const blocked = await handleTrainingEnrollment(
      request(validBody({ cover_number: "AB-1999", mobile_number: "9000000099" })),
      { env, store: db.store, rateGate: gate },
    );
    expect(blocked.status).toBe(429);
    expect(db.inserts).toBe(8);
  });

  it("matches the created table and does not send a confirmation", () => {
    const handler = read("supabase/training-project/functions/training-enroll/handler.ts");
    const entry = read("supabase/training-project/functions/training-enroll/index.ts");
    const sql = read("supabase/training-project/migrations/20261108053000_training_enrollments.sql");
    const client = read("public/training-enroll.js");
    for (const column of ["name", "cover_number", "mobile_number", "email", "state", "madhhab", "preferred_language", "question_or_consultation"]) {
      expect(entry).toContain(column);
    }
    expect(entry).not.toMatch(/idempotency_key|full_name|cover_norm|mobile_norm|state_name|eligibility_status|fee_status/);
    expect(handler).not.toMatch(/idempotency_key|eligibility_status|TRAINING_EMAIL/);
    expect(client).not.toMatch(/idempotency_key|eligibility_status|TRAINING_EMAIL/);
    expect(client).toContain("cover_number");
    expect(client).toContain("question_or_consultation");
    expect(sql).toContain("Do not run this file");
    expect(sql).toContain("42P07");
    expect(sql).not.toMatch(/^create table/im);
    expect(entry).toContain('select("id, created_at")');
  });
});

describe("training browser client", () => {
  beforeEach(() => {
    document.documentElement.lang = "en";
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
    delete (window as unknown as { __HC_TRAINING_CONFIG?: unknown }).__HC_TRAINING_CONFIG;
    delete (window as unknown as { __hcSubmitTrainingEnrollment?: unknown }).__hcSubmitTrainingEnrollment;
    window.eval(read("public/training-enroll.js"));
  });

  function form() {
    document.body.innerHTML = `<form>
      <input name="name" value="Amina Khan"><input name="cover" value="AB-1234">
      <input name="mobile" value="9876543210"><input name="email" value="amina@example.com">
      <input name="state" value="Kerala"><select name="madhhab"><option value="prefer_not_to_say" selected>Prefer not to say</option></select>
      <select name="preferred_language"><option value="hi" selected>Hindi</option></select>
      <textarea name="question">Hello</textarea><button type="submit">Submit</button>
    </form>`;
    return document.querySelector("form") as HTMLFormElement;
  }

  it("does not call the voice project or claim a save without a receipt", async () => {
    const submit = (window as unknown as { __hcSubmitTrainingEnrollment: (form: HTMLFormElement) => Promise<{ ok: boolean; message: string }> }).__hcSubmitTrainingEnrollment;
    window.__HC_TRAINING_CONFIG = { url: "https://vvbbwlfzpfvgyweeggvw.supabase.co", publishableKey: "sb_publishable_test_only" };
    const blocked = await submit(form());
    expect(blocked.ok).toBe(false);
    expect(blocked.message).toMatch(/Nothing was saved/);
    expect(fetch).not.toHaveBeenCalled();

    window.__HC_TRAINING_CONFIG = { url: TRAINING_SUPABASE_ORIGIN, publishableKey: "sb_publishable_test_only" };
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const missing = await submit(form());
    expect(missing.ok).toBe(false);
    expect(missing.message).toMatch(/Nothing was saved/);
    const first = vi.mocked(fetch).mock.calls[0];
    expect(String(first[0])).toBe("https://pwtmrddreqmhyluqbfgi.supabase.co/functions/v1/training-enroll");
    const sent = JSON.parse(String((first[1] as RequestInit).body));
    expect(sent).toMatchObject({
      name: "Amina Khan",
      cover_number: "AB-1234",
      mobile_number: "9876543210",
      preferred_language: "hi",
      question_or_consultation: "Hello",
    });
    expect(sent.idempotency_key).toBeUndefined();
    expect((first[1] as RequestInit).headers).not.toHaveProperty("authorization");

    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({
      ok: true,
      receipt_id: "receipt-9",
      saved_at: "2026-11-08T00:00:00.000Z",
    }), { status: 200 }));
    const saved = await submit(form());
    expect(saved.ok).toBe(true);
    expect(saved.message).toContain("Receipt receipt-9");
    expect(saved.message).toMatch(/not checked against a Haj Committee list/i);
    expect(saved.message).not.toMatch(/email was sent|sms was sent/i);
    expect(localStorage.getItem("hc-train")).toBeNull();
  });
});
