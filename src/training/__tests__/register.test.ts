import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DuplicateRegistration,
  ReceiptCollision,
  TRAINING_REGISTER_ORIGIN,
  createRateGate,
  handleTrainingRegistration,
  makeReceiptCode,
  trainingRegisterUrlAllowed,
  type TrainingRegisterEnv,
  type TrainingRegisterStore,
  type TrainingRegistrationInsert,
} from "../../../supabase/volunteer-project/functions/training-register/handler";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");
const ROW_ID = "11111111-1111-4111-8111-111111111111";
const RECEIPT = "TR-AB23CD45";

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto });
}

function memoryStore(failReceipt = false) {
  const rows: TrainingRegistrationInsert[] = [];
  let collided = false;
  const store: TrainingRegisterStore = {
    async insert(row) {
      if (failReceipt && !collided) {
        collided = true;
        throw new ReceiptCollision();
      }
      if (rows.some((item) => item.cover_number === row.cover_number && item.phone_number === row.phone_number)) {
        throw new DuplicateRegistration();
      }
      rows.push(row);
      return { id: ROW_ID, receiptCode: row.receipt_code };
    },
  };
  return { store, rows };
}

const env: TrainingRegisterEnv = {
  supabaseUrl: TRAINING_REGISTER_ORIGIN,
  serviceRoleKey: "service-role-test",
  anonKey: "sb_publishable_live_test",
  publishableKey: "",
  ipHashSalt: "salt",
};

function validBody(over: Record<string, unknown> = {}) {
  return {
    cover_number: "ab-1234",
    name: "Amina Khan",
    phone_number: "9876543210",
    language: "hi",
    state: "Uttar Pradesh",
    embarkation_point: "Lucknow",
    email: "amina@example.com",
    company_website: "",
    ...over,
  };
}

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${TRAINING_REGISTER_ORIGIN}/functions/v1/training-register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://hajjcare.in",
      apikey: env.anonKey,
      authorization: `Bearer ${env.anonKey}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function deps(store: TrainingRegisterStore, receiptCode = () => RECEIPT) {
  return { env, store, rateGate: createRateGate(), receiptCode };
}

describe("login-free training registration", () => {
  it("targets only hajjcare-live and leaves the older tables untouched", () => {
    expect(trainingRegisterUrlAllowed(TRAINING_REGISTER_ORIGIN)).toBe(true);
    expect(trainingRegisterUrlAllowed("https://begtqcmwruvwposocnsr.supabase.co")).toBe(false);
    expect(trainingRegisterUrlAllowed("https://uorfprlfpqdpjtrcaqrt.supabase.co")).toBe(false);
    const sql = read("supabase/volunteer-project/migrations/20261110235000_training_registrations.sql");
    expect(sql).toContain("public.training_registrations");
    expect(sql).toContain("grant select, insert on table public.training_registrations to service_role");
    expect(sql).toContain("revoke all on table public.training_registrations from public, anon, authenticated");
    expect(sql).not.toMatch(/alter table public\.volunteers|alter table public\.training_enrollments|alter table public\.volunteer_registrations/);
    const toml = read("supabase/volunteer-project/config.toml");
    expect(toml).toContain('project_id = "vvbbwlfzpfvgyweeggvw"');
    expect(toml).toContain("[functions.training-register]");
    expect(toml).toContain("verify_jwt = false");
    const entry = read("supabase/volunteer-project/functions/training-register/index.ts");
    expect(entry).toContain('.from("training_registrations")');
    expect(entry).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(entry).not.toContain("begtqcmwruvwposocnsr");
    const client = read("public/training-register.js");
    expect(client).toContain("https://vvbbwlfzpfvgyweeggvw.supabase.co/functions/v1/training-register");
    expect(client).toContain("begtqcmwruvwposocnsr.supabase.co");
    expect(read("public/training-register-config.js")).toContain('publishableKey: ""');
    expect(read("public/explore.html")).toContain("training-register.js");
    expect(read("src/pages/VolunteerPage.tsx")).toContain("Register for training");
    expect(read("src/pages/VolunteerPage.tsx")).toContain('to="/explore#register"');
  });

  it("saves the six fields plus a carried email and returns a receipt", async () => {
    const { store, rows } = memoryStore();
    const saved = await handleTrainingRegistration(request(validBody()), deps(store));
    expect(saved.status).toBe(200);
    expect(await saved.json()).toEqual({ ok: true, id: ROW_ID, receipt_id: RECEIPT });
    expect(rows[0]).toMatchObject({
      cover_number: "AB-1234",
      name: "Amina Khan",
      phone_number: "919876543210",
      language: "hi",
      state: "Uttar Pradesh",
      embarkation_point: "Lucknow",
      email: "amina@example.com",
      receipt_code: RECEIPT,
    });
    expect(makeReceiptCode(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]))).toMatch(/^TR-[A-Z0-9]{8}$/);
  });

  it("rejects a honeypot, a bad field, a service-role key, and a duplicate", async () => {
    const { store, rows } = memoryStore();
    const trap = await handleTrainingRegistration(request(validBody({ company_website: "spam" })), deps(store));
    expect(trap.status).toBe(400);
    const bad = await handleTrainingRegistration(request(validBody({ language: "xx" })), deps(store));
    expect(bad.status).toBe(400);
    const secret = await handleTrainingRegistration(
      request(validBody(), { apikey: env.serviceRoleKey, authorization: `Bearer ${env.serviceRoleKey}` }),
      deps(store),
    );
    expect(secret.status).toBe(401);
    const main = await handleTrainingRegistration(
      request(validBody()),
      { ...deps(store), env: { ...env, supabaseUrl: "https://begtqcmwruvwposocnsr.supabase.co" } },
    );
    expect(main.status).toBe(503);
    const first = await handleTrainingRegistration(request(validBody()), deps(store));
    expect(first.status).toBe(200);
    const again = await handleTrainingRegistration(request(validBody()), deps(store));
    expect(again.status).toBe(409);
    expect(rows).toHaveLength(1);
  });

  it("retries a receipt collision and limits repeated phones", async () => {
    const { store } = memoryStore(true);
    let n = 0;
    const saved = await handleTrainingRegistration(request(validBody()), deps(store, () => (n++ === 0 ? "TR-AAAAAAAA" : RECEIPT)));
    expect(saved.status).toBe(200);
    expect(await saved.json()).toMatchObject({ receipt_id: RECEIPT });

    const gate = memoryStore();
    const limited = { env, store: gate.store, rateGate: createRateGate(1, 60_000), receiptCode: () => RECEIPT };
    expect((await handleTrainingRegistration(request(validBody()), limited)).status).toBe(200);
    const blocked = await handleTrainingRegistration(
      request(validBody({ cover_number: "AB-9999" }), { "x-forwarded-for": "203.0.113.8" }),
      limited,
    );
    expect(blocked.status).toBe(429);
  });

  it("prefills name and phone from this device and shows the receipt", async () => {
    document.body.innerHTML = `<form data-store="hc-train">
      <input name="cover_number" value=""><input name="name" value=""><input name="phone_number" value="">
      <input name="language" value="hi"><input name="state" value="Uttar Pradesh">
      <input name="embarkation_point" value="Lucknow"><div class="res"></div><button type="submit">Submit</button>
    </form>`;
    sessionStorage.setItem("hc-reg-carry", JSON.stringify({ name: "Amina Khan", phone: "9876543210", email: "amina@example.com" }));
    window.eval(read("public/training-register.js"));
    (window as unknown as { __HC_TRAINING_REGISTER_CONFIG?: { url: string; publishableKey: string } }).__HC_TRAINING_REGISTER_CONFIG = {
      url: TRAINING_REGISTER_ORIGIN,
      publishableKey: "sb_publishable_live_test",
    };
    const prepare = (window as unknown as { __hcPrepareTrainingRegistration?: (form: HTMLFormElement) => void }).__hcPrepareTrainingRegistration!;
    const form = document.querySelector("form") as HTMLFormElement;
    prepare(form);
    expect((form.querySelector("[name=name]") as HTMLInputElement).value).toBe("Amina Khan");
    expect((form.querySelector("[name=phone_number]") as HTMLInputElement).value).toBe("9876543210");
    (form.querySelector("[name=cover_number]") as HTMLInputElement).value = "AB-1234";
    const fetchImpl = globalThis.fetch;
    globalThis.fetch = (async () => new Response(JSON.stringify({ ok: true, id: ROW_ID, receipt_id: RECEIPT }), { status: 200 })) as typeof fetch;
    try {
      const submit = (window as unknown as { __hcSubmitTrainingRegistration?: (form: HTMLFormElement) => Promise<{ ok: boolean; receiptId?: string; message?: string }> }).__hcSubmitTrainingRegistration!;
      const out = await submit(form);
      expect(out.ok).toBe(true);
      expect(out.receiptId).toBe(RECEIPT);
      expect(out.message).toContain(RECEIPT);
      expect(sessionStorage.getItem("hc-reg-carry")).toContain("amina@example.com");
    } finally {
      globalThis.fetch = fetchImpl;
    }
  });
});
