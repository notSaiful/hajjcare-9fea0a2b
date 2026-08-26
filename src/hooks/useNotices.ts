import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Notice = {
  id: string;
  notice_id: string;
  circular_id: string | null;
  title: string;
  message: string;
  category: string;
  subcategory: string | null;
  hajj_year: string;
  state_code: string | null;
  state_name: string | null;
  district: string | null;
  priority: "normal" | "important" | "urgent" | string;
  status: "draft" | "scheduled" | "published" | "unpublished" | "archived" | "expired" | string;
  published_at: string | null;
  updated_at: string;
  expires_at: string | null;
  source_name: string | null;
  source_url: string | null;
  document_url: string | null;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
};

const NOTICE_FIELDS = "id,notice_id,circular_id,title,message,category,subcategory,hajj_year,state_code,state_name,district,priority,status,published_at,updated_at,expires_at,source_name,source_url,document_url,image_url,created_by,created_at";

export function useNotices(options: { admin?: boolean; id?: string } = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["notices", options.admin ? "admin" : "public", options.id || "all"];
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      let request = supabase.from("notices").select(NOTICE_FIELDS).order("published_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }).limit(250);
      if (options.id) request = request.eq("id", options.id);
      if (!options.admin) request = request.in("status", ["published"]);
      const { data, error } = await request;
      if (error) throw error;
      return (data || []) as unknown as Notice[];
    },
    enabled: options.admin ? !!user : true,
    staleTime: 60_000,
  });

  useEffect(() => {
    const channel = supabase.channel("notice-board-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "notices" }, () => {
        void queryClient.invalidateQueries({ queryKey: ["notices"] });
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [queryClient]);

  return { ...query, notices: query.data || [] };
}

export function useNoticeFilters(notices: Notice[], filters: { query: string; year: string; category: string; state: string; priority: string; status?: string }) {
  return useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return notices.filter((notice) => {
      const haystack = [notice.notice_id, notice.title, notice.message, notice.category, notice.state_name, notice.district, notice.source_name].filter(Boolean).join(" ").toLowerCase();
      return (!q || haystack.includes(q))
        && (filters.year === "all" || notice.hajj_year === filters.year)
        && (filters.category === "all" || notice.category === filters.category)
        && (filters.state === "all" || notice.state_code === filters.state)
        && (filters.priority === "all" || notice.priority === filters.priority)
        && (!filters.status || filters.status === "all" || notice.status === filters.status);
    });
  }, [filters, notices]);
}
