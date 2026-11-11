import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { submitVolunteerRegistration, volunteerReference, VOLUNTEER_REGISTER_ENDPOINT, type VolunteerRegistrationInput } from "../register";
import { VOLUNTEER_SUPABASE_ORIGIN } from "../project";
import {
  DuplicateVolunteer,
  MAIN_SUPABASE_ORIGIN,
  createRateGate,
  handleVolunteerRegistration,
  mainVolunteerUrlAllowed,
  type VolunteerEnv,
  type VolunteerInsert,
  type VolunteerStore,
} from "../../../supabase/functions/volunteer-register/handler";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");
const ROW_ID = "11111111-1111-4111-8111-111111111111";
const USER_ID = "22222222-2222-4222-8222-222222222222";
const CODE = "V-LUC-HLP-0001";

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto });
}

function memoryStore() {
  const rows: VolunteerInsert[] = [];
  const store: VolunteerStore = {
    async insert(row) {
      if (rows.some((item) => item.mobile === row.mobile)) throw new DuplicateVolunteer();
      rows.push(row);
      return { id: ROW_ID, volunteerId: CODE };
    },
  };
  return { store, rows };
}

const env: VolunteerEnv = {
  supabaseUrl: MAIN_SUPABASE_ORIGIN,
  serviceRoleKey: "service-role-test",
  anonKey: "sb_publishable_main_test",
  publishableKey: "",
  ipHashSalt: "salt",
};

function validBody(over: Record<string, unknown> = {}) {
  return {
    full_name: "Amina Khan",
    father_name: "Yusuf Khan",
    age: 32,
    mobile: "9876543210",
    whatsapp: "9876543210",
    email: "",
    full_address: "12 Market Road",
    city: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    embarkation_point: "Lucknow",
    skills: ["helpdesk"],
    availability_days: "7",
    duty_location: "local",
    languages: ["hindi"],
    other_language: "Bhojpuri",
    declaration_agreed: true,
    consent_privacy: true,
    consent_terms: true,
    company_website: "",
    ...over,
  };
}

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${MAIN_SUPABASE_ORIGIN}/functions/v1/volunteer-register`, {
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

function deps(store: VolunteerStore, extra: Partial<{ verifyUser: (token: string) => Promise<string | null>; rateGate: ReturnType<typeof createRateGate> }> = {}) {
  return {
    env,
    store,
    rateGate: extra.rateGate ?? createRateGate(),
    verifyUser: extra.verifyUser ?? (async () => null),
  };
}

describe("main volunteer registration", () => {
  it("targets only the main project and leaves user_id nullable", () => {
    expect(mainVolunteerUrlAllowed(MAIN_SUPABASE_ORIGIN)).toBe(true);
    expect(mainVolunteerUrlAllowed("https://vvbbwlfzpfvgyweeggvw.supabase.co")).toBe(false);
    expect(mainVolunteerUrlAllowed("https://uorfprlfpqdpjtrcaqrt.supabase.co")).toBe(false);
    const create = read("supabase/migrations/20260214165756_fdbe32ca-c15e-4a65-a81e-eb9bfab803ba.sql");
    expect(create).toContain("user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL");
    expect(create).not.toContain("user_id UUID NOT NULL");
    const page = read("src/pages/VolunteerPage.tsx");
    const client = read("src/volunteer/register.ts");
    expect(page).not.toContain("getSession()");
    expect(page).not.toContain("begtqcmwruvwposocnsr");
    expect(page).toContain('to="/explore#register"');
    expect(page).toContain("Register for training");
    expect(page).toContain("आपका रजिस्ट्रेशन मुकम्मल हुआ। अल्लाह आपका हज मबरूर और कबूल करे।");
    expect(page).not.toMatch(/toast\(\{ title: "आपका रजिस्ट्रेशन मुकम्मल हुआ[\s\S]*duplicate/);
    expect(client).toContain("VOLUNTEER_REGISTER_ENDPOINT");
    expect(client).toContain("/functions/v1/volunteer-register");
    expect(client).not.toContain("begtqcmwruvwposocnsr");
    expect(client).not.toContain("volunteer_id");
    expect(read("src/volunteer/project.ts")).toContain("VITE_VOLUNTEER_PUBLISHABLE_KEY");
    expect(page).not.toContain('.from("volunteers")');
    expect(page).not.toContain("Please log in before registering");
    expect(read("supabase/config.toml")).toContain("[functions.volunteer-register]");
    expect(read("supabase/functions/volunteer-register/index.ts")).toContain('.from("volunteers")');
    expect(client).not.toContain("SERVICE_ROLE");
    expect(page).not.toContain("SERVICE_ROLE");
  });

  it("saves an anonymous registration and a signed-in registration with that user id", async () => {
    const anon = memoryStore();
    const open = await handleVolunteerRegistration(request(validBody()), deps(anon.store));
    expect(open.status).toBe(200);
    expect(await open.json()).toEqual({ ok: true, id: ROW_ID, volunteer_id: CODE });
    expect(anon.rows[0].user_id).toBeNull();
    expect(anon.rows[0].languages).toEqual(["hindi", "Bhojpuri"]);

    const signed = memoryStore();
    const authed = await handleVolunteerRegistration(
      request(validBody({ mobile: "9876543211", whatsapp: "9876543211" }), { authorization: "Bearer user-token" }),
      deps(signed.store, { verifyUser: async (token) => (token === "user-token" ? USER_ID : null) }),
    );
    expect(authed.status).toBe(200);
    expect(signed.rows[0].user_id).toBe(USER_ID);
  });

  it("does not save a honeypot, a spoofed user id, a bad token, or a duplicate mobile", async () => {
    const { store, rows } = memoryStore();
    const spoof = await handleVolunteerRegistration(request(validBody({ user_id: USER_ID })), deps(store));
    expect(spoof.status).toBe(400);
    const honeypot = await handleVolunteerRegistration(request(validBody({ company_website: "spam" })), deps(store));
    expect(honeypot.status).toBe(400);
    const saved = await handleVolunteerRegistration(request(validBody()), deps(store));
    expect(saved.status).toBe(200);
    const again = await handleVolunteerRegistration(request(validBody()), deps(store));
    expect(again.status).toBe(409);
    const badToken = await handleVolunteerRegistration(
      request(validBody({ mobile: "9000000000" }), { authorization: "Bearer nope" }),
      deps(store, { verifyUser: async () => null }),
    );
    expect(badToken.status).toBe(401);
    expect(rows).toHaveLength(1);
    expect(rows[0].user_id).toBeNull();
  });

  it("limits a repeated phone from another IP", async () => {
    const { store } = memoryStore();
    const gate = createRateGate(1);
    const first = await handleVolunteerRegistration(request(validBody(), { "x-forwarded-for": "1.1.1.1" }), deps(store, { rateGate: gate }));
    const second = await handleVolunteerRegistration(
      request(validBody(), { "x-forwarded-for": "2.2.2.2" }),
      deps(store, { rateGate: gate }),
    );
    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
  });

  it("saves only on hajjcare-live and shows a reference from the confirmed row id", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const config = { url: VOLUNTEER_SUPABASE_ORIGIN, publishableKey: "sb_publishable_live_test" };
    fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify({ id: ROW_ID }), { status: 200 }));
    const saved = await submitVolunteerRegistration(validBody() as VolunteerRegistrationInput, config, fetchImpl);
    expect(saved).toEqual({ ok: true, id: ROW_ID, reference: volunteerReference(ROW_ID) });
    expect(volunteerReference(ROW_ID)).toBe("HC-11111111");
    const call = fetchImpl.mock.calls[0];
    expect(String(call[0])).toBe(VOLUNTEER_REGISTER_ENDPOINT);
    expect(String(call[0])).not.toContain("begtqcmwruvwposocnsr");
    const headers = new Headers(call[1]?.headers);
    expect(headers.get("apikey")).toBe("sb_publishable_live_test");
    expect(headers.get("authorization")).toBe("Bearer sb_publishable_live_test");

    fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const missing = await submitVolunteerRegistration(validBody() as VolunteerRegistrationInput, config, fetchImpl);
    expect(missing.ok).toBe(false);
    if (missing.ok === false) expect(missing.description).toMatch(/Nothing was saved/);

    fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify({ error: "duplicate" }), { status: 409 }));
    const duplicate = await submitVolunteerRegistration(validBody() as VolunteerRegistrationInput, config, fetchImpl);
    expect(duplicate.ok).toBe(false);
    if (duplicate.ok === false) expect(duplicate.description).toMatch(/already registered/);

    fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify({ error: "validation" }), { status: 400 }));
    const invalid = await submitVolunteerRegistration(validBody() as VolunteerRegistrationInput, config, fetchImpl);
    expect(invalid.ok).toBe(false);
    if (invalid.ok === false) expect(invalid.description).toMatch(/Nothing was saved/);

    const wrongHost = await submitVolunteerRegistration(
      validBody() as VolunteerRegistrationInput,
      { url: MAIN_SUPABASE_ORIGIN, publishableKey: "sb_publishable_live_test" },
      fetchImpl,
    );
    expect(wrongHost.ok).toBe(false);
    expect(fetchImpl).toHaveBeenCalledTimes(4);
  });
});
