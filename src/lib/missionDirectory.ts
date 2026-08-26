import { supabase } from "@/integrations/supabase/client";

export const DIRECTORY_CATEGORIES = [
  "building", "inspector", "doctor", "branch_office", "mission_official",
  "medical_emergency", "emergency_service", "transport", "accommodation",
  "group_leader", "helpline", "saudi_service",
] as const;

export type DirectoryCategory = (typeof DIRECTORY_CATEGORIES)[number];

export type MissionDirectoryContact = {
  id: string;
  name: string;
  designation: string | null;
  category: DirectoryCategory;
  city: string | null;
  state: string | null;
  embarkation_point: string | null;
  building_number: string | null;
  building_name: string | null;
  sector: string | null;
  address: string | null;
  duty_area: string | null;
  group_number: string | null;
  specialization: string | null;
  languages: string[];
  available_hours: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  emergency_phone: string | null;
  maps_url: string | null;
  source_name: string;
  source_url: string | null;
  verified: boolean;
  verified_at: string | null;
  created_at: string;
};

const restUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`;
const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function headers(write = false) {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    apikey: apiKey,
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    ...(write ? { "Content-Type": "application/json", Prefer: "return=representation" } : {}),
  };
}

export async function getMissionDirectoryContacts(admin = false): Promise<MissionDirectoryContact[]> {
  const query = admin
    ? "select=*&order=updated_at.desc"
    : "select=*&verified=eq.true&order=name.asc";
  const response = await fetch(`${restUrl}/mission_directory_contacts?${query}`, { headers: await headers() });
  if (!response.ok) throw new Error("Could not load verified directory contacts.");
  return response.json();
}

export async function saveMissionDirectoryContact(contact: Partial<MissionDirectoryContact> & Pick<MissionDirectoryContact, "name" | "category" | "source_name">) {
  const id = contact.id;
  const response = await fetch(
    id ? `${restUrl}/mission_directory_contacts?id=eq.${encodeURIComponent(id)}` : `${restUrl}/mission_directory_contacts`,
    { method: id ? "PATCH" : "POST", headers: await headers(true), body: JSON.stringify(contact) },
  );
  if (!response.ok) throw new Error("Could not save this contact. Check verification details and try again.");
  return response.json();
}

export async function deleteMissionDirectoryContact(id: string) {
  const response = await fetch(`${restUrl}/mission_directory_contacts?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE", headers: await headers(),
  });
  if (!response.ok) throw new Error("Could not delete this contact.");
}

export function normalizedPhone(value: string) {
  return value.replace(/[^0-9+]/g, "");
}
