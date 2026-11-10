import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { TRAINING_SUPABASE_ORIGIN } from "../project";
import {
  createVisitRateGate,
  handleSiteVisit,
  istDate,
  summarizeVisits,
  type SiteVisitEnv,
  type VisitRow,
} from "../../../supabase/training-project/functions/site-visit/handler";

const root = resolve(__dirname, "../../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");
const VISITOR = "11111111-1111-4111-8111-111111111111";

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto });
}

const env: SiteVisitEnv = {
  supabaseUrl: TRAINING_SUPABASE_ORIGIN,
  serviceRoleKey: "service-role-test",
  anonKey: "sb_publishable_test_only",
  publishableKey: "",
  ipHashSalt: "salt",
  allowedOrigins: "",
  ownerSecret: "owner-secret",
};

function deps(over: Partial<SiteVisitEnv> = {}) {
  const rows: VisitRow[] = [];
  return {
    rows,
    env: { ...env, ...over },
    rateGate: createVisitRateGate(1, 60 * 60 * 1000),
    record: async (row: VisitRow) => { rows.push(row); },
    loadRows: async () => rows.slice(),
  };
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/site-visit`, {
    method: "POST",
    headers: {
      origin: "https://hajjcare.in",
      "content-type": "application/json",
      apikey: env.anonKey,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("site visit handler", () => {
  it("records one anonymous visit and returns no counts", async () => {
    const gate = deps();
    const res = await handleSiteVisit(post({ visitor_id: VISITOR, path: "/explore" }), gate);
    expect(res.status).toBe(204);
    expect(await res.text()).toBe("");
    expect(JSON.stringify(gate.rows[0])).not.toMatch(/total_visits|email|phone|user_agent/);
    expect(gate.rows[0]).toMatchObject({ visitor_id: VISITOR, path: "/explore", visited_on: istDate(new Date()) });
  });

  it("rejects a bad origin, a bad visit, and the service role before recording", async () => {
    const gate = deps();
    const foreign = await handleSiteVisit(post({ visitor_id: VISITOR, path: "/" }, { origin: "https://evil.example" }), gate);
    expect(foreign.status).toBe(403);
    const badId = await handleSiteVisit(post({ visitor_id: "not-a-uuid", path: "/" }), gate);
    expect(badId.status).toBe(400);
    const badPath = await handleSiteVisit(post({ visitor_id: VISITOR, path: "explore" }), gate);
    expect(badPath.status).toBe(400);
    const secret = await handleSiteVisit(post({ visitor_id: VISITOR, path: "/" }, { apikey: env.serviceRoleKey }), gate);
    expect(secret.status).toBe(401);
    expect(gate.rows).toHaveLength(0);
  });

  it("stops a repeated address before another record", async () => {
    const gate = deps();
    const first = await handleSiteVisit(post({ visitor_id: VISITOR, path: "/" }), gate);
    const second = await handleSiteVisit(post({ visitor_id: VISITOR, path: "/library" }), gate);
    expect(first.status).toBe(204);
    expect(second.status).toBe(429);
    expect(gate.rows).toHaveLength(1);
  });

  it("gives counts only to the owner secret", async () => {
    const gate = deps();
    gate.rows.push(
      { visitor_id: VISITOR, path: "/", visited_on: "2026-11-11" },
      { visitor_id: "22222222-2222-4222-8222-222222222222", path: "/explore", visited_on: "2026-11-11" },
      { visitor_id: VISITOR, path: "/", visited_on: "2026-11-10" },
    );
    const missing = await handleSiteVisit(new Request(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/site-visit`, {
      headers: { apikey: env.anonKey, origin: "https://hajjcare.in" },
    }), gate);
    expect(missing.status).toBe(401);
    const wrong = await handleSiteVisit(new Request(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/site-visit`, {
      headers: { apikey: env.anonKey, origin: "https://hajjcare.in", "x-owner-secret": "nope" },
    }), gate);
    expect(wrong.status).toBe(401);
    const closed = await handleSiteVisit(new Request(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/site-visit`, {
      headers: { apikey: env.anonKey, origin: "https://hajjcare.in", "x-owner-secret": "owner-secret" },
    }), deps({ ownerSecret: "" }));
    expect(closed.status).toBe(503);
    const open = await handleSiteVisit(new Request(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/site-visit`, {
      headers: { apikey: env.anonKey, origin: "https://hajjcare.in", "x-owner-secret": "owner-secret" },
    }), { ...gate, now: () => new Date("2026-11-10T20:30:00.000Z") });
    expect(open.status).toBe(200);
    const json = await open.json();
    expect(json.total_visits).toBe(3);
    expect(json.unique_visitors).toBe(2);
    expect(json.today_visits).toBe(2);
    expect(json.today_unique).toBe(2);
    expect(json.by_path[0]).toEqual({ path: "/", visits: 2 });
    expect(json.last_7_days).toHaveLength(7);
    expect(json.last_7_days.at(-1)).toEqual({ date: "2026-11-11", visits: 2 });
    expect(summarizeVisits([], new Date("2026-11-10T20:30:00.000Z")).today_visits).toBe(0);
  });
});

describe("site visit browser client", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 204 })));
    delete (window as unknown as { __HC_TRAINING_CONFIG?: unknown }).__HC_TRAINING_CONFIG;
    delete (window as unknown as { __hcRecordSiteVisit?: unknown }).__hcRecordSiteVisit;
  });

  function page(key = "sb_publishable_test_only") {
    (window as unknown as { __HC_TRAINING_CONFIG?: { url: string; publishableKey: string } }).__HC_TRAINING_CONFIG = {
      url: TRAINING_SUPABASE_ORIGIN,
      publishableKey: key,
    };
  }

  it("posts one visit per path per day and stays quiet when the network fails", async () => {
    page();
    window.eval(read("public/site-visit.js"));
    const pageWindow = window as unknown as {
      __hcRecordSiteVisit: (path?: string) => Promise<void>;
      __hcSiteVisitReady: Promise<void>;
    };
    await pageWindow.__hcSiteVisitReady;
    const record = pageWindow.__hcRecordSiteVisit;
    expect(fetch).toHaveBeenCalledTimes(1);
    const call = vi.mocked(fetch).mock.calls[0];
    expect(String(call[0])).toBe(`${TRAINING_SUPABASE_ORIGIN}/functions/v1/site-visit`);
    const body = JSON.parse(String((call[1] as RequestInit).body));
    expect(Object.keys(body).sort()).toEqual(["path", "visitor_id"]);
    expect(body.path).toBe("/");
    expect(body.visitor_id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(JSON.stringify(body)).not.toMatch(/email|phone|name|user_agent/);
    await record("/");
    expect(fetch).toHaveBeenCalledTimes(1);
    await record("/explore");
    expect(fetch).toHaveBeenCalledTimes(2);
    vi.mocked(fetch).mockRejectedValueOnce(new Error("offline"));
    await expect(record("/library")).resolves.toBeUndefined();
  });

  it("does not call a forbidden project or an empty key", async () => {
    (window as unknown as { __HC_TRAINING_CONFIG?: { url: string; publishableKey: string } }).__HC_TRAINING_CONFIG = {
      url: "https://pwtmrddreqmhyluqbfgi.supabase.co",
      publishableKey: "sb_publishable_test_only",
    };
    window.eval(read("public/site-visit.js"));
    expect(fetch).not.toHaveBeenCalled();
    localStorage.clear();
    page("");
    window.eval(read("public/site-visit.js"));
    expect(fetch).not.toHaveBeenCalled();
    expect(read("public/index.html")).toContain('<script src="site-visit.js" defer>');
    expect(read("public/explore.html")).toContain('<script src="site-visit.js" defer>');
    expect(read("public/library.html")).toContain('<script src="site-visit.js" defer>');
    expect(read("app.html")).not.toContain("site-visit.js");
    expect(read("public/visitors.html")).toContain('content="noindex"');
    expect(read("public/visitors.html")).not.toContain("site-visit.js");
    expect(read("public/visitors.html")).not.toContain("SITE_VISIT_OWNER_SECRET");
  });
});
