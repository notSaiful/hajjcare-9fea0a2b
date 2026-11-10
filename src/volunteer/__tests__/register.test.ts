import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { assertVolunteerProjectUrl, FORBIDDEN_VOLUNTEER_HOSTS, VOLUNTEER_SUPABASE_ORIGIN } from "../project";
import { submitVolunteerRegistration, type VolunteerRegistrationInput } from "../register";
import {
  DuplicateRegistration,
  createRateGate,
  handleVolunteerRegistration,
  volunteerUrlAllowed,
  type RegistrationInsert,
  type VolunteerEnv,
  type VolunteerStore,
} from "../../../supabase/volunteer-project/functions/volunteer-register/handler";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");
const ROW_ID = "11111111-1111-4111-8111-111111111111";

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto });
}

function memoryStore() {
  const rows: RegistrationInsert[] = [];
  const store: VolunteerStore = {
    async insert(row) {
      if (rows.some((item) => item.mobile === row.mobile)) throw new DuplicateRegistration();
      rows.push(row);
      return { id: ROW_ID };
    },
  };
  return { store, rows };
}

const env: VolunteerEnv = {
  supabaseUrl: VOLUNTEER_SUPABASE_ORIGIN,
  serviceRoleKey: "service-role-test",
  anonKey: "sb_publishable_volunteer_test",
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
  return new Request(`${VOLUNTEER_SUPABASE_ORIGIN}/functions/v1/volunteer-register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://hajjcare.in",
      apikey: env.anonKey,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("volunteer registration", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("accepts only the hajjcare-live project", () => {
    expect(assertVolunteerProjectUrl(VOLUNTEER_SUPABASE_ORIGIN)).toBe(VOLUNTEER_SUPABASE_ORIGIN);
    expect(volunteerUrlAllowed(VOLUNTEER_SUPABASE_ORIGIN)).toBe(true);
    for (const host of FORBIDDEN_VOLUNTEER_HOSTS) {
      expect(() => assertVolunteerProjectUrl(`https://${host}`)).toThrow(/hajjcare-live/);
      expect(volunteerUrlAllowed(`https://${host}`)).toBe(false);
    }
  });

  it("keeps the new table off the old volunteers table and the main project", () => {
    const sql = read("supabase/volunteer-project/migrations/20261110223000_volunteer_registrations.sql");
    expect(sql).toContain("create table if not exists public.volunteer_registrations");
    expect(sql).toContain("unique (mobile)");
    expect(sql).toContain("age between 18 and 65");
    expect(sql).toContain("force row level security");
    expect(sql).toContain("revoke all on table public.volunteer_registrations from public, anon, authenticated");
    expect(sql).toContain("grant select, insert on table public.volunteer_registrations to service_role");
    expect(sql).toContain("default 'new'");
    expect(sql).toContain("default 'web'");
    expect(sql).not.toMatch(/alter table public\.volunteers|insert into public\.volunteers|update public\.volunteers/i);
    expect(read("supabase/volunteer-project/config.toml")).toContain('project_id = "vvbbwlfzpfvgyweeggvw"');
    expect(read("supabase/volunteer-project/config.toml")).toContain("verify_jwt = false");
    const page = read("src/pages/VolunteerPage.tsx");
    expect(page).not.toContain("@/integrations/supabase/client");
    expect(page).not.toContain('.from("volunteers")');
    expect(page).not.toContain("getUser()");
    expect(page).toContain("submitVolunteerRegistration");
  });

  it("saves a valid registration and returns only a real id", async () => {
    const { store, rows } = memoryStore();
    const res = await handleVolunteerRegistration(request(validBody()), {
      env,
      store,
      rateGate: createRateGate(),
      now: () => new Date("2026-11-10T12:00:00.000Z"),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, id: ROW_ID });
    expect(rows[0]).toMatchObject({
      mobile: "9876543210",
      age: 32,
      skills: ["helpdesk"],
      other_language: "Bhojpuri",
      duty_location: "local",
      status: "new",
      source: "web",
      declaration_agreed: true,
      consent_privacy: true,
      consent_terms: true,
      consent_at: "2026-11-10T12:00:00.000Z",
    });
  });

  it("rejects a bad origin, the service role key, a honeypot, and a duplicate mobile", async () => {
    const { store, rows } = memoryStore();
    const blocked = await handleVolunteerRegistration(request(validBody(), { origin: "https://example.com" }), {
      env,
      store,
      rateGate: createRateGate(),
    });
    expect(blocked.status).toBe(403);
    expect(rows).toHaveLength(0);

    const preview = await handleVolunteerRegistration(
      request(validBody(), { origin: "https://hjcare-git-preview-sazo-team.vercel.app" }),
      { env, store, rateGate: createRateGate() },
    );
    expect(preview.status).toBe(200);

    const privileged = await handleVolunteerRegistration(request(validBody(), { apikey: "service-role-test" }), {
      env,
      store,
      rateGate: createRateGate(),
    });
    expect(privileged.status).toBe(401);

    const honeypot = await handleVolunteerRegistration(request(validBody({ company_website: "https://spam.example" })), {
      env,
      store,
      rateGate: createRateGate(),
    });
    expect(honeypot.status).toBe(400);
    expect(rows).toHaveLength(1);

    const again = await handleVolunteerRegistration(request(validBody()), { env, store, rateGate: createRateGate() });
    expect(again.status).toBe(409);
  });

  it("limits repeats from the same phone even when the IP changes", async () => {
    const { store } = memoryStore();
    const gate = createRateGate(1);
    const first = await handleVolunteerRegistration(request(validBody(), { "x-forwarded-for": "1.1.1.1" }), {
      env,
      store,
      rateGate: gate,
    });
    const second = await handleVolunteerRegistration(request(validBody(), { "x-forwarded-for": "2.2.2.2" }), {
      env,
      store,
      rateGate: gate,
    });
    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
  });

  it("shows success only when the function returns an id", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, id: ROW_ID }), { status: 200 }));
    const saved = await submitVolunteerRegistration(validBody() as VolunteerRegistrationInput, {
      url: VOLUNTEER_SUPABASE_ORIGIN,
      publishableKey: "sb_publishable_volunteer_test",
    }, fetchImpl);
    expect(saved).toEqual({ ok: true, id: ROW_ID });
    expect(fetchImpl.mock.calls[0][0]).toBe(`${VOLUNTEER_SUPABASE_ORIGIN}/functions/v1/volunteer-register`);

    fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const missing = await submitVolunteerRegistration(validBody() as VolunteerRegistrationInput, {
      url: VOLUNTEER_SUPABASE_ORIGIN,
      publishableKey: "sb_publishable_volunteer_test",
    }, fetchImpl);
    expect(missing.ok).toBe(false);
    if (missing.ok === false) expect(missing.description).toMatch(/Nothing was saved/);
  });
});
