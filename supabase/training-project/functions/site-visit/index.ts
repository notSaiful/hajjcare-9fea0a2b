// Deploy only to Supabase project uorfprlfpqdpjtrcaqrt.
// Counts anonymous page loads. Does not store names, email, phone, IP, or user agent.
// The service role stays in the function environment.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  createVisitRateGate,
  handleSiteVisit,
  type VisitRow,
} from "./handler.ts";

const rateGate = createVisitRateGate();

Deno.serve((req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const allowed = [Deno.env.get("TRAINING_ALLOWED_ORIGINS") ?? "", Deno.env.get("SITE_VISIT_ALLOWED_ORIGINS") ?? ""]
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean)
    .join(",");
  return handleSiteVisit(req, {
    env: {
      supabaseUrl,
      serviceRoleKey,
      anonKey: Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      publishableKey: Deno.env.get("TRAINING_PUBLISHABLE_KEY") ?? "",
      ipHashSalt: Deno.env.get("SITE_VISIT_IP_HASH_SALT") ?? "",
      allowedOrigins: allowed,
      ownerSecret: Deno.env.get("SITE_VISIT_OWNER_SECRET") ?? "",
    },
    rateGate,
    async record(row: VisitRow) {
      const { error } = await db.from("site_visits").upsert({
        visitor_id: row.visitor_id,
        path: row.path,
        visited_on: row.visited_on,
      }, { onConflict: "visitor_id,path,visited_on", ignoreDuplicates: true });
      if (error) throw error;
    },
    async loadRows() {
      const { data, error } = await db.from("site_visits").select("visitor_id, path, visited_on");
      if (error) throw error;
      return summarizeReady(data ?? []);
    },
  });
});

function summarizeReady(rows: VisitRow[]): VisitRow[] {
  return rows.filter((row) => row.visitor_id && row.path && row.visited_on);
}
