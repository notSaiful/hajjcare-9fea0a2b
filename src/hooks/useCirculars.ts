import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { bundledOfficialCirculars } from "@/data/localOfficialCirculars";

const CIRCULAR_CACHE_KEY = "hajcare-circulars-v2";
const CIRCULAR_CACHE_FALLBACK_KEY = "hajcare-circulars-v1";
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const CIRCULAR_PAGE_SIZE = 100;

export type Circular = {
  id: string;
  hajj_year: string;
  title: string;
  title_hi: string | null;
  title_ur: string | null;
  original_content: string;
  summary_en: string | null;
  summary_hi: string | null;
  summary_ur: string | null;
  source_url: string | null;
  official_url: string | null;
  document_url: string | null;
  circular_number: string | null;
  circular_date: string | null;
  category: string;
  priority: string;
  is_published: boolean;
  ai_processed: boolean;
  created_at: string;
  source: string;
  source_name_display: string | null;
  issuing_authority: string | null;
  status: "new" | "updated" | "important" | "archived" | string;
  last_checked_at: string | null;
  content_hash: string | null;
  auto_scraped: boolean;
  external_id?: string | null;
  is_current_version?: boolean;
  attachment_path?: string | null;
  review_status?: string | null;
  detected_at?: string | null;
};

type CircularCache = { savedAt: number; circulars: Circular[] };

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;
const asNullableString = (value: unknown) => typeof value === "string" ? value : null;

const inferHajjYear = (row: Record<string, unknown>) => {
  const explicit = asString(row.hajj_year).trim();
  if (explicit && explicit !== "unknown") return explicit;
  const source = [row.title, row.original_content, row.source_url].filter(Boolean).join(" ");
  const match = source.match(/20[0-3][0-9]/);
  if (match) return match[0];
  const date = asString(row.circular_date);
  return /^20\d{2}/.test(date) ? date.slice(0, 4) : "unknown";
};

function parseCircular(value: unknown): Circular | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const id = asString(row.id);
  const title = asString(row.title);
  if (!id || !title) return null;
  return {
    id,
    hajj_year: inferHajjYear(row),
    title,
    title_hi: asNullableString(row.title_hi),
    title_ur: asNullableString(row.title_ur),
    original_content: asString(row.original_content),
    summary_en: asNullableString(row.summary_en),
    summary_hi: asNullableString(row.summary_hi),
    summary_ur: asNullableString(row.summary_ur),
    source_url: asNullableString(row.source_url),
    official_url: asNullableString(row.official_url) || asNullableString(row.source_url),
    document_url: asNullableString(row.document_url) || asNullableString(row.source_url),
    circular_number: asNullableString(row.circular_number),
    circular_date: asNullableString(row.circular_date),
    category: asString(row.category, "general"),
    priority: asString(row.priority, "normal"),
    is_published: row.is_published !== false,
    ai_processed: row.ai_processed === true,
    created_at: asString(row.created_at, new Date(0).toISOString()),
    source: asString(row.source, "Official"),
    source_name_display: asNullableString(row.source_name_display),
    issuing_authority: asNullableString(row.issuing_authority) || asNullableString(row.source_name_display) || asNullableString(row.source),
    status: asString(row.status, row.priority === "high" || row.priority === "urgent" ? "important" : "updated"),
    last_checked_at: asNullableString(row.last_checked_at),
    content_hash: asNullableString(row.content_hash),
    auto_scraped: row.auto_scraped === true,
    external_id: asNullableString(row.external_id),
    is_current_version: row.is_current_version !== false,
    attachment_path: asNullableString(row.attachment_path),
    review_status: asNullableString(row.review_status),
    detected_at: asNullableString(row.detected_at),
  };
}

const timestamp = (value: string | null | undefined) => {
  const parsed = value ? Date.parse(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : 0;
};

/** De-duplicate by the immutable circular ID, then sort latest publication first. */
export function normaliseCirculars(values: unknown[]): Circular[] {
  const byId = new Map<string, Circular>();
  for (const value of values) {
    const circular = parseCircular(value);
    if (circular && !byId.has(circular.id)) byId.set(circular.id, circular);
  }
  return [...byId.values()].sort((a, b) =>
    timestamp(b.circular_date || b.created_at) - timestamp(a.circular_date || a.created_at),
  );
}

function readCache(): CircularCache | null {
  if (typeof localStorage === "undefined") return null;
  try {
    for (const key of [CIRCULAR_CACHE_KEY, CIRCULAR_CACHE_FALLBACK_KEY]) {
      const cached = JSON.parse(localStorage.getItem(key) || "null") as Partial<CircularCache> | null;
      if (cached && Array.isArray(cached.circulars)) {
        return { savedAt: typeof cached.savedAt === "number" ? cached.savedAt : 0, circulars: normaliseCirculars(cached.circulars) };
      }
    }
  } catch (error) {
    console.error("[circulars] Failed to read offline cache", error);
  }
  return null;
}

function saveCache(circulars: Circular[]): CircularCache {
  const cache = { savedAt: Date.now(), circulars: normaliseCirculars(circulars) };
  try {
    localStorage.setItem(CIRCULAR_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    // Capacitor's Android WebView persists localStorage across restarts. If
    // device storage is unavailable, rendering must still continue in memory.
    console.error("[circulars] Failed to save offline cache", error);
  }
  return cache;
}

function mergeWithFallback(remote: Circular[]): Circular[] {
  // Remote data wins when IDs match; bundled verified circulars guarantee a
  // useful offline screen before the first successful network request.
  return normaliseCirculars([...remote, ...bundledOfficialCirculars]);
}

const cachedAtStartup = readCache();
const initialCirculars = normaliseCirculars([
  ...(cachedAtStartup?.circulars || []),
  ...bundledOfficialCirculars,
]);

type CircularPage = { items: Circular[]; hasMore: boolean };

async function fetchPublishedCirculars(page = 0): Promise<CircularPage> {
  const from = page * CIRCULAR_PAGE_SIZE;
  const to = from + CIRCULAR_PAGE_SIZE - 1;
  const baseQuery = () => supabase
    .from("hajj_circulars")
    .select("id,hajj_year,title,title_hi,title_ur,original_content,summary_en,summary_hi,summary_ur,source_url,official_url,document_url,circular_number,circular_date,category,priority,is_published,ai_processed,created_at,source,source_name_display,issuing_authority,status,last_checked_at,content_hash,auto_scraped,is_current_version,attachment_path,review_status,detected_at")
    .eq("is_published", true);

  let { data, error } = await baseQuery()
    .eq("is_current_version", true)
    .order("circular_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  // Older projects may not have received the versioning migration yet. The
  // base hajj_circulars table and published-read RLS policy are still valid,
  // so retry the same read without that optional column rather than blanking
  // the Circular screen.
  if (error && /hajj_year|official_url|document_url|issuing_authority|last_checked_at|content_hash|status|review_status|detected_at|is_current_version|attachment_path/i.test(error.message || "")) {
    console.warn("[circulars] Versioning columns unavailable; using published circular fallback", error);
    ({ data, error } = await supabase
      .from("hajj_circulars")
      .select("id,title,title_hi,title_ur,original_content,summary_en,summary_hi,summary_ur,source_url,circular_number,circular_date,category,priority,is_published,ai_processed,created_at,source,source_name_display,auto_scraped")
      .eq("is_published", true)
      .order("circular_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to));
  }
  if (error) {
    console.error("[circulars] Supabase fetch failed", error);
    throw error;
  }
  const remoteCirculars = normaliseCirculars(Array.isArray(data) ? data : []);
  const circulars = page === 0 ? mergeWithFallback(remoteCirculars) : remoteCirculars;
  if (page === 0) saveCache(circulars);
  return { items: circulars, hasMore: remoteCirculars.length === CIRCULAR_PAGE_SIZE };
}

export const useCirculars = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [lastUpdated, setLastUpdated] = useState<number | null>(cachedAtStartup?.savedAt || null);
  const [page, setPage] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Record<number, Circular[]>>({ 0: initialCirculars });

  const circularsQuery = useQuery({
    queryKey: ["hajj-circulars", page],
    queryFn: () => fetchPublishedCirculars(page),
    // Initial data deliberately prevents a refetch failure from ever clearing
    // the screen. React Query keeps this last successful value on errors.
    initialData: page === 0 ? { items: initialCirculars, hasMore: true } : undefined,
    staleTime: 60_000,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: true,
    retry: 2, // initial request + two retries = three attempts total
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  useEffect(() => {
    if (circularsQuery.isError) return;
    if (circularsQuery.data?.items) {
      setLoadedPages((current) => {
        const next = { ...current, [page]: circularsQuery.data!.items };
        if (page > 0) saveCache(normaliseCirculars(Object.values(next).flat()));
        return next;
      });
    }
    const cache = readCache();
    if (cache?.savedAt) setLastUpdated(cache.savedAt);
  }, [circularsQuery.data, circularsQuery.dataUpdatedAt, circularsQuery.isError, page]);

  const readsQuery = useQuery({
    queryKey: ["circular-reads", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("circular_reads").select("circular_id").eq("user_id", user!.id);
      if (error) {
        console.error("[circulars] Failed to load read state", error);
        throw error;
      }
      return new Set((data || []).map((row: { circular_id: string }) => row.circular_id).filter(Boolean));
    },
  });

  useEffect(() => {
    const channel = supabase.channel("hajj-circulars-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "hajj_circulars" }, () => {
        console.info("[circulars] Realtime update received; refreshing feed");
        void queryClient.invalidateQueries({ queryKey: ["hajj-circulars"] });
      })
      .subscribe((status) => console.info("[circulars] Realtime status", status));
    return () => { void supabase.removeChannel(channel); };
  }, [queryClient]);

  const markRead = useMutation({
    mutationFn: async (circularId: string) => {
      if (!user || !circularId) return;
      const { error } = await supabase.from("circular_reads").insert({ circular_id: circularId, user_id: user.id });
      if (error && !error.message.toLowerCase().includes("duplicate")) {
        console.error("[circulars] Failed to mark circular as read", error);
        throw error;
      }
    },
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["circular-reads"] }); },
  });

  const circulars = useMemo(() => normaliseCirculars(Object.values(loadedPages).flat()), [loadedPages]);
  const readIds = readsQuery.data || new Set<string>();
  const refresh = async () => {
    setPage(0);
    setLoadedPages({ 0: initialCirculars });
    await queryClient.invalidateQueries({ queryKey: ["hajj-circulars", 0] });
  };
  return {
    circulars,
    isLoading: circularsQuery.isLoading && circulars.length === 0,
    isRefreshing: circularsQuery.isFetching,
    error: circularsQuery.error instanceof Error ? circularsQuery.error.message : circularsQuery.isError ? "Could not get the latest circulars." : null,
    lastUpdated,
    readIds,
    unreadCount: circulars.filter((c) => !readIds.has(c.id)).length,
    markRead: markRead.mutate,
    loadMore: () => setPage((current) => current + 1),
    hasMore: Boolean(circularsQuery.data?.hasMore),
    refresh,
  };
};
