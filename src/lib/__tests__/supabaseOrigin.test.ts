import { describe, expect, it } from "vitest";
import { supabaseHttpsOrigin } from "@/lib/supabaseOrigin";

describe("supabaseHttpsOrigin", () => {
  it("returns the origin for an https project URL", () => {
    expect(supabaseHttpsOrigin("https://example.supabase.co/rest/v1/")).toBe(
      "https://example.supabase.co"
    );
  });

  it("rejects missing, insecure, and non-URL values", () => {
    expect(supabaseHttpsOrigin(undefined)).toBeNull();
    expect(supabaseHttpsOrigin("")).toBeNull();
    expect(supabaseHttpsOrigin("http://example.supabase.co")).toBeNull();
    expect(supabaseHttpsOrigin("not a url")).toBeNull();
  });
});
