import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { knowledgeStats, selectVerifiedContext } from "../../../supabase/functions/_shared/knowledge";
import { buildZoyaSystemPrompt } from "../../../supabase/functions/_shared/zoya-prompt";
import {
  DEFAULT_XAI_FALLBACK_MODEL,
  DEFAULT_XAI_MODEL,
  XAI_CHAT_COMPLETIONS_URL,
  isUnknownModelError,
  resolveXaiModels,
} from "../../../supabase/functions/_shared/xai-model";

describe("Zoya verified context", () => {
  it("loads the generated HajCare notes", () => {
    const stats = knowledgeStats();
    expect(stats.chunks).toBeGreaterThan(100);
    expect(stats.zones).toBeGreaterThan(10);
    expect(stats.pins).toBeGreaterThan(100);
    expect(stats.hotels).toBeGreaterThan(300);
  });

  it("answers a ritual question from the manasik notes and does not dump emergency desks", () => {
    const context = selectVerifiedContext("How do I perform Tawaf?");
    expect(context).toContain("Tawaf");
    expect(context).toContain("info@hajjcare.in");
    expect(context).not.toContain("IHPO Makkah desks");
  });

  it("uses the verified building pin and zone for building 125", () => {
    const context = selectVerifiedContext("mera building 125 kahan hai?");
    expect(context).toContain("Building 125");
    expect(context).toContain("Old Aziziya");
    expect(context).toContain("https://");
    expect(context).toMatch(/Bus point:/);
  });

  it("includes the emergency card for an ambulance question", () => {
    const context = selectVerifiedContext("ambulance number in an emergency?");
    expect(context).toContain("997");
    expect(context).toContain("911");
    expect(context).toContain("+966547090402");
  });

  it("does not invent a building pin for a number outside the list", () => {
    const context = selectVerifiedContext("building 2026");
    expect(context).toContain("No matching verified passage");
    expect(context).not.toContain("Building 2026");
  });
});

describe("Zoya system prompt", () => {
  it("keeps Zoya inside verified data and the pilgrim's language", () => {
    const prompt = buildZoyaSystemPrompt({
      language: "hi",
      mode: "guide",
      userQuery: "Tawaf ki dua batao",
    });
    expect(prompt).toContain("You are Zoya");
    expect(prompt).toContain("Never invent duas");
    expect(prompt).toContain("Hinglish");
    expect(prompt).toContain("info@hajjcare.in");
    expect(prompt).toContain("Ghabrayein nahi");
    expect(prompt).not.toMatch(/when helpful/i);
    expect(prompt).not.toContain("google/gemini");
    expect(prompt).not.toContain("LOVABLE");
  });

  it("keeps the FAQ desk short and in the hinted language", () => {
    const prompt = buildZoyaSystemPrompt({
      language: "ur",
      mode: "faq",
      userQuery: "حج کے مراحل",
    });
    expect(prompt).toContain("FAQ desk");
    expect(prompt).toContain("Urdu (ur)");
    expect(prompt).toContain("3–5 sentences");
  });
});

describe("xAI model selection", () => {
  it("defaults to grok-4.3 and the non-reasoning fallback", () => {
    expect(XAI_CHAT_COMPLETIONS_URL).toBe("https://api.x.ai/v1/chat/completions");
    expect(resolveXaiModels({})).toEqual({
      model: DEFAULT_XAI_MODEL,
      fallback: DEFAULT_XAI_FALLBACK_MODEL,
    });
    expect(DEFAULT_XAI_MODEL).toBe("grok-4.3");
    expect(DEFAULT_XAI_FALLBACK_MODEL).toBe("grok-4.20-0309-non-reasoning");
  });

  it("lets XAI_MODEL override the model and skips a duplicate fallback", () => {
    expect(resolveXaiModels({ XAI_MODEL: " grok-4.3 " }).model).toBe("grok-4.3");
    expect(resolveXaiModels({ XAI_MODEL: "grok-4.20-0309-non-reasoning" }).fallback).toBeNull();
  });

  it("retries only when the model itself was rejected", () => {
    expect(isUnknownModelError(404, "model not found")).toBe(true);
    expect(isUnknownModelError(400, "The model grok-4.3 does not exist")).toBe(true);
    expect(isUnknownModelError(401, "invalid api key")).toBe(false);
    expect(isUnknownModelError(429, "rate limit")).toBe(false);
  });

  it("does not hard-code an API key in the chat functions", () => {
    const guide = readFileSync("supabase/functions/hajj-chat/index.ts", "utf8");
    const faq = readFileSync("supabase/functions/hajj-faq-chat/index.ts", "utf8");
    const client = readFileSync("supabase/functions/_shared/xai.ts", "utf8");
    for (const source of [guide, faq, client]) {
      expect(source).not.toContain("LOVABLE_API_KEY");
      expect(source).not.toContain("ai.gateway.lovable.dev");
      expect(source).not.toMatch(/xai-[A-Za-z0-9]{10,}/);
    }
    expect(client).toContain('Deno.env.get("XAI_API_KEY")');
    expect(client).toContain("stream: true");
    expect(client).toContain("text/event-stream");
  });
});
