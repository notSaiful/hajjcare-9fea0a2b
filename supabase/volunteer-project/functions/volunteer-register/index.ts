// Deploy only to Supabase project vvbbwlfzpfvgyweeggvw (hajjcare-live).
// Writes public.volunteer_registrations with the service role from the function environment.
// Does not read or write public.volunteers and does not use main-site auth.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  DuplicateRegistration,
  createRateGate,
  handleVolunteerRegistration,
  type RegistrationInsert,
  type VolunteerStore,
} from "./handler.ts";

type Row = { id: string };
const rateGate = createRateGate();

Deno.serve((req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const store: VolunteerStore = {
    async insert(row: RegistrationInsert) {
      const { data, error } = await db.from("volunteer_registrations").insert({
        full_name: row.full_name,
        father_name: row.father_name,
        age: row.age,
        mobile: row.mobile,
        whatsapp: row.whatsapp,
        email: row.email,
        full_address: row.full_address,
        city: row.city,
        district: row.district,
        state: row.state,
        embarkation_point: row.embarkation_point,
        skills: row.skills,
        availability_days: row.availability_days,
        duty_location: row.duty_location,
        languages: row.languages,
        other_language: row.other_language,
        declaration_agreed: row.declaration_agreed,
        consent_privacy: row.consent_privacy,
        consent_terms: row.consent_terms,
        consent_at: row.consent_at,
        status: row.status,
        source: row.source,
      }).select("id").single();
      if (error) {
        if (error.code === "23505") throw new DuplicateRegistration();
        throw error;
      }
      return { id: (data as Row).id };
    },
  };
  return handleVolunteerRegistration(req, {
    env: {
      supabaseUrl,
      serviceRoleKey,
      anonKey: Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      publishableKey: Deno.env.get("VOLUNTEER_PUBLISHABLE_KEY") ?? "",
      ipHashSalt: Deno.env.get("VOLUNTEER_IP_HASH_SALT") ?? "",
    },
    store,
    rateGate,
  });
});
