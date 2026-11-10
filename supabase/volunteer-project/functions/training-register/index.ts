// Deploy only to Supabase project vvbbwlfzpfvgyweeggvw (hajjcare-live).
// Writes public.training_registrations with the service role from the function environment.
// Does not read or write public.training_enrollments, public.volunteers, or public.volunteer_registrations.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  DuplicateRegistration,
  ReceiptCollision,
  createRateGate,
  handleTrainingRegistration,
  type TrainingRegisterStore,
  type TrainingRegistrationInsert,
} from "./handler.ts";

type Row = { id: string; receipt_code: string };
const rateGate = createRateGate();

Deno.serve((req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const store: TrainingRegisterStore = {
    async insert(row: TrainingRegistrationInsert) {
      const { data, error } = await db.from("training_registrations").insert({
        receipt_code: row.receipt_code,
        cover_number: row.cover_number,
        name: row.name,
        phone_number: row.phone_number,
        language: row.language,
        state: row.state,
        embarkation_point: row.embarkation_point,
        email: row.email,
        status: row.status,
        source: row.source,
      }).select("id, receipt_code").single();
      if (error) {
        if (error.code === "23505") {
          const blob = `${error.message ?? ""} ${error.details ?? ""}`;
          if (blob.includes("receipt_code")) throw new ReceiptCollision();
          throw new DuplicateRegistration();
        }
        throw error;
      }
      const saved = data as Row;
      return { id: saved.id, receiptCode: saved.receipt_code };
    },
  };
  return handleTrainingRegistration(req, {
    env: {
      supabaseUrl,
      serviceRoleKey,
      anonKey: Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      publishableKey: Deno.env.get("TRAINING_REGISTER_PUBLISHABLE_KEY") ?? "",
      ipHashSalt: Deno.env.get("TRAINING_REGISTER_IP_HASH_SALT") ?? "",
    },
    store,
    rateGate,
  });
});
