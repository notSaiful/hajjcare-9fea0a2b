import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  source: string;
  source_name_display: string | null;
  auto_scraped: boolean;
};

const READS_KEY = "hc-circular-reads";

function readLocalIds(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(READS_KEY) || "[]");
    return new Set(Array.isArray(raw) ? raw.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

export const useCirculars = () => {
  const circularsQuery = useQuery({
    queryKey: ["hajj-circulars"],
    queryFn: async () => {
      const key =
        import.meta.env.VITE_TRAINING_REGISTER_PUBLISHABLE_KEY ||
        import.meta.env.VITE_VOLUNTEER_PUBLISHABLE_KEY;
      if (!key) return [] as Circular[];
      const res = await fetch(
        "https://vvbbwlfzpfvgyweeggvw.supabase.co/rest/v1/hajj_circulars?select=*&is_published=eq.true&order=created_at.desc",
        { headers: { apikey: key, authorization: `Bearer ${key}` } },
      );
      if (!res.ok) throw new Error("Circulars could not be loaded");
      return (await res.json()) as Circular[];
    },
  });

  const readsQuery = useQuery({
    queryKey: ["circular-reads"],
    queryFn: async () => readLocalIds(),
  });

  const queryClient = useQueryClient();

  const markRead = useMutation({
    mutationFn: async (circularId: string) => {
      const next = readLocalIds();
      next.add(circularId);
      localStorage.setItem(READS_KEY, JSON.stringify([...next]));
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
    isError: circularsQuery.isError,
    readIds: readsQuery.data || new Set<string>(),
    unreadCount,
    markRead: markRead.mutate,
  };
};
