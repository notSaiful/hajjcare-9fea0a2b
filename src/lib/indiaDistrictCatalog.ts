import { supabase } from "@/integrations/supabase/client";
import {
  INDIA_DISTRICT_CATALOG,
  type IndiaDistrict,
} from "@/data/indiaDistricts";

const CACHE_KEY = "hajcare:india-districts:lgd:v1";

type DistrictRow = {
  state_code?: unknown;
  state_name?: unknown;
  district_code?: unknown;
  district_name?: unknown;
  district_local_name?: unknown;
};

type DistrictQuery = {
  select: (columns: string) => {
    eq: (column: string, value: boolean) => {
      order: (column: string, options: { ascending: boolean }) => Promise<{
        data: DistrictRow[] | null;
        error: { message?: string } | null;
      }>;
    };
  };
};

const publicClient = supabase as unknown as {
  from: (table: "india_districts") => DistrictQuery;
};

function validRecord(row: DistrictRow): IndiaDistrict | null {
  const state = typeof row.state_name === "string" ? row.state_name.trim() : "";
  const name = typeof row.district_name === "string" ? row.district_name.trim() : "";
  const stateCode = typeof row.state_code === "string" ? row.state_code.trim() : "";
  const districtCode = typeof row.district_code === "string" ? row.district_code.trim() : "";
  if (!state || !name || !stateCode || !districtCode) return null;
  const localName = typeof row.district_local_name === "string"
    ? row.district_local_name.trim()
    : "";
  return {
    state,
    name,
    stateCode,
    districtCode,
    ...(localName ? { localName } : {}),
  };
}

function normalize(rows: DistrictRow[]): IndiaDistrict[] {
  const seen = new Set<string>();
  return rows
    .map(validRecord)
    .filter((record): record is IndiaDistrict => Boolean(record))
    .filter((record) => {
      const key = `${record.stateCode}:${record.districtCode}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));
}

function readCache(): IndiaDistrict[] | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (!Array.isArray(parsed)) return null;
    const rows = normalize(parsed as DistrictRow[]);
    return rows.length >= 700 ? rows : null;
  } catch {
    return null;
  }
}

function writeCache(rows: IndiaDistrict[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rows));
  } catch {
    // Storage is optional; the bundled snapshot remains available offline.
  }
}

/**
 * Returns the bundled LGD data immediately, then overlays an admin-managed
 * Supabase catalog when available. A short timeout keeps first paint fast on
 * slow networks; cached data is accepted only when it contains a complete
 * district-scale catalog.
 */
export async function loadLatestIndiaDistrictCatalog(): Promise<IndiaDistrict[]> {
  const cached = readCache();
  const fallback = cached && cached.length >= INDIA_DISTRICT_CATALOG.length
    ? cached
    : [...INDIA_DISTRICT_CATALOG];
  try {
    const request = publicClient
      .from("india_districts")
      .select("state_code,state_name,district_code,district_name,district_local_name")
      .eq("is_active", true)
      .order("state_name", { ascending: true });
    const result = await Promise.race([
      request,
      new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 1500)),
    ]);
    if (!result || result.error || !result.data) return fallback;
    const rows = normalize(result.data);
    if (rows.length < 700) return fallback;
    writeCache(rows);
    return rows;
  } catch {
    return fallback;
  }
}
