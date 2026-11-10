// Deploy only to Supabase project uorfprlfpqdpjtrcaqrt.
// Writes public.training_enrollments with the service role from the function environment.
// Does not send email or SMS. Does not read enrollment rows back except id and created_at.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  DuplicateEnrollment,
  createRateGate,
  handleTrainingEnrollment,
  type EnrollmentInsert,
  type SavedEnrollment,
  type TrainingStore,
} from "./handler.ts";

type Row = { id: string; created_at: string };
const rateGate = createRateGate();

Deno.serve((req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const store: TrainingStore = {
    async insert(row: EnrollmentInsert) {
      const { data, error } = await db.from("training_enrollments").insert({
        cover_number: row.cover_number,
        name: row.name,
        phone_number: row.phone_number,
        language: row.language,
        state: row.state,
        embarkation_point: row.embarkation_point,
      }).select("id, created_at").single();
      if (error) {
        if (error.code === "23505") throw new DuplicateEnrollment();
        throw error;
      }
      return toSaved(data as Row);
    },
  };
  return handleTrainingEnrollment(req, {
    env: {
      supabaseUrl,
      serviceRoleKey,
      anonKey: Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      publishableKey: Deno.env.get("TRAINING_PUBLISHABLE_KEY") ?? "",
      ipHashSalt: Deno.env.get("TRAINING_IP_HASH_SALT") ?? "",
      allowedOrigins: Deno.env.get("TRAINING_ALLOWED_ORIGINS") ?? "",
    },
    store,
    rateGate,
  });
});

function toSaved(row: Row): SavedEnrollment {
  return { id: row.id, createdAt: row.created_at };
}
