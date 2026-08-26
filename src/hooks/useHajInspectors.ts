import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HajInspectorRecord {
  id: string;
  name: string;
  father_name: string | null;
  state: string;
  cover_number: string | null;
  mobile: string | null;
  whatsapp: string | null;
  duty_location: string;
  language: string;
  photo_url: string | null;
  gender: string | null;
  category: string | null;
  quota: string | null;
  cbt_marks: number | null;
  interview_marks: number | null;
  total_marks: number | null;
  result: string | null;
  is_active: boolean;
  flight_schedule: string | null;
  emergency_control_room_no: string | null;
  total_haji_quota: number | null;
  total_hajis: number | null;
  total_groups: number | null;
  total_group_leaders: number | null;
  total_doctors: number | null;
  total_buildings: number | null;
  live_emergency_cases: number | null;
  live_complaints: number | null;
}

interface UseHajInspectorsOptions {
  state?: string;
  dutyLocation?: string;
  coverNumber?: string;
  search?: string;
}

export const useHajInspectors = (options: UseHajInspectorsOptions = {}) => {
  return useQuery({
    queryKey: ["haj-inspectors", options],
    queryFn: async () => {
      let query = supabase
        .from("haj_inspectors")
        .select("*")
        .eq("is_active", true)
        .order("state")
        .order("name");

      if (options.state) {
        query = query.ilike("state", options.state);
      }
      if (options.dutyLocation) {
        query = query.eq("duty_location", options.dutyLocation);
      }
      if (options.coverNumber) {
        query = query.ilike("cover_number", `%${options.coverNumber}%`);
      }
      if (options.search) {
        query = query.or(
          `name.ilike.%${options.search}%,cover_number.ilike.%${options.search}%,mobile.ilike.%${options.search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as HajInspectorRecord[];
    },
  });
};
