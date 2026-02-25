import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Circular = {
  id: string;
  title: string;
  title_hi: string | null;
  title_ur: string | null;
  original_content: string;
  summary_en: string | null;
  summary_hi: string | null;
  summary_ur: string | null;
  source_url: string | null;
  circular_number: string | null;
  circular_date: string | null;
  category: string;
  priority: string;
  is_published: boolean;
  ai_processed: boolean;
  created_at: string;
};

export const useCirculars = () => {
  const { user } = useAuth();

  const circularsQuery = useQuery({
    queryKey: ["hajj-circulars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hajj_circulars")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Circular[];
    },
  });

  const readsQuery = useQuery({
    queryKey: ["circular-reads", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("circular_reads")
        .select("circular_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Set(data.map((r: any) => r.circular_id));
    },
  });

  const queryClient = useQueryClient();

  const markRead = useMutation({
    mutationFn: async (circularId: string) => {
      if (!user) return;
      const { error } = await supabase
        .from("circular_reads")
        .insert({ circular_id: circularId, user_id: user.id });
      if (error && !error.message.includes("duplicate")) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["circular-reads"] });
    },
  });

  const unreadCount = circularsQuery.data && readsQuery.data
    ? circularsQuery.data.filter((c) => !readsQuery.data.has(c.id)).length
    : 0;

  return {
    circulars: circularsQuery.data || [],
    isLoading: circularsQuery.isLoading,
    readIds: readsQuery.data || new Set<string>(),
    unreadCount,
    markRead: markRead.mutate,
  };
};
