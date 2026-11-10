// Deploy only to the main site project begtqcmwruvwposocnsr.
// Inserts public.volunteers with the service role. Does not put that key in the browser.
// user_id is set only after the caller's Bearer token is verified. Anonymous rows store null.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  DuplicateVolunteer,
  createRateGate,
  handleVolunteerRegistration,
  mainVolunteerUrlAllowed,
  verifyMainUser,
  type SavedVolunteer,
  type VolunteerInsert,
  type VolunteerStore,
} from "./handler.ts";

type Row = { id: string; volunteer_id: string };
const rateGate = createRateGate();

Deno.serve((req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const publishableKey = Deno.env.get("VOLUNTEER_PUBLISHABLE_KEY") ?? "";
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const store: VolunteerStore = {
    async insert(row: VolunteerInsert) {
      const { data: existing, error: lookupError } = await db
        .from("volunteers")
        .select("id")
        .eq("mobile", row.mobile)
        .limit(1);
      if (lookupError) throw lookupError;
      if (existing && existing.length > 0) throw new DuplicateVolunteer();
      const { data, error } = await db.from("volunteers").insert({
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
        declaration_agreed: row.declaration_agreed,
        user_id: row.user_id,
      }).select("id, volunteer_id").single();
      if (error) {
        if (error.code === "23505") throw new DuplicateVolunteer();
        throw error;
      }
      return toSaved(data as Row);
    },
  };
  const apiKey = publishableKey.trim() || anonKey.trim();
  return handleVolunteerRegistration(req, {
    env: {
      supabaseUrl,
      serviceRoleKey,
      anonKey,
      publishableKey,
      ipHashSalt: Deno.env.get("VOLUNTEER_IP_HASH_SALT") ?? "",
    },
    store,
    rateGate,
    verifyUser: (accessToken) => verifyMainUser(supabaseUrl, apiKey, accessToken),
  });
});

function toSaved(row: Row): SavedVolunteer {
  return { id: row.id, volunteerId: row.volunteer_id };
}

export { mainVolunteerUrlAllowed };
