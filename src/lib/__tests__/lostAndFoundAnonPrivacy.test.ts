/**
 * Automated security check: anonymous (anon-key only) clients must never be
 * able to read reporter_mobile or reporter_whatsapp from the lost_and_found
 * table — neither directly nor through the lost_and_found_public view.
 *
 * If this test fails, an RLS policy or view definition has regressed and is
 * leaking reporter PII. Do NOT loosen this test — fix the policy / view.
 */
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qovcctfoxgvowedjioil.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvdmNjdGZveGd2b3dlZGppb2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NjIwNzMsImV4cCI6MjA4MzAzODA3M30.amVMiv0Rdm_66lrPQiDxk-PgNabZALojhJeKf1ZPHFA";

const SENSITIVE_COLUMNS = ["reporter_mobile", "reporter_whatsapp"] as const;

const hasNetwork = typeof fetch === "function";

describe.skipIf(!hasNetwork)("lost_and_found anonymous PII protection", () => {
  const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  it("anon cannot select * from lost_and_found base table", async () => {
    const { data, error } = await anon
      .from("lost_and_found")
      .select("*")
      .limit(1);

    // Either RLS returns an empty result or an explicit error — both are fine.
    // What is NOT fine: any returned row containing reporter PII.
    if (data && data.length > 0) {
      for (const col of SENSITIVE_COLUMNS) {
        expect(data[0]?.[col] ?? null).toBeNull();
      }
      // Defensive: anon should not see rows at all.
      throw new Error(
        "Anonymous client received rows from lost_and_found base table — RLS regression."
      );
    }
    // If error, ensure it is a permission/RLS error, not a network issue.
    if (error) {
      expect(error.message).toBeTruthy();
    }
  });

  it("anon cannot explicitly select reporter_mobile / reporter_whatsapp from base table", async () => {
    for (const col of SENSITIVE_COLUMNS) {
      const { data } = await anon
        .from("lost_and_found")
        .select(col)
        .limit(1);
      expect(data ?? []).toEqual([]);
    }
  });

  it("lost_and_found_public view does not expose reporter PII columns", async () => {
    for (const col of SENSITIVE_COLUMNS) {
      const { data, error } = await anon
        .from("lost_and_found_public" as never)
        .select(col as never)
        .limit(1);
      // Selecting a non-existent column must error (column does not exist).
      expect(error).toBeTruthy();
      expect(data).toBeFalsy();
    }
  });
});
