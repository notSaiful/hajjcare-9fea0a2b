import { useCallback, useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const TRAINING_PROGRESS_TABLE = "hajj_training_progress";
export const TRAINING_PROGRAMME = "hajj-2027-100-day";

/** idle: logged out / not tried · synced · offline: transient error · unavailable: table missing or RLS denied */
export type TrainingSyncState = "idle" | "syncing" | "synced" | "offline" | "unavailable";

// The table is not in the generated types until the migration is applied.
const db = supabase as unknown as SupabaseClient;

export function readLocalDays(key: string): number[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter((d): d is number => Number.isInteger(d) && d >= 1 && d <= 100) : [];
  } catch {
    return [];
  }
}

export function mergeDays(a: number[], b: number[]): number[] {
  return Array.from(new Set([...a, ...b])).sort((x, y) => x - y);
}

function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return ["42P01", "PGRST205", "PGRST106", "42501"].includes(error.code ?? "") || /does not exist|schema cache|permission denied/i.test(error.message ?? "");
}

/**
 * Training-day completion with localStorage as the offline source of truth and
 * an optional, best-effort Supabase mirror. Never throws; logged-out users and
 * projects without the table silently stay local-only.
 */
export function useTrainingSync(storageKey: string) {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<number[]>(() => readLocalDays(storageKey));
  const [syncState, setSyncState] = useState<TrainingSyncState>("idle");
  const disabledRef = useRef(false);

  const push = useCallback(async (days: number[]) => {
    if (!user || disabledRef.current || days.length === 0) return;
    const rows = days.map((day) => ({ user_id: user.id, programme: TRAINING_PROGRAMME, day }));
    const { error } = await db.from(TRAINING_PROGRESS_TABLE).upsert(rows, { onConflict: "user_id,programme,day", ignoreDuplicates: true });
    if (error) {
      if (isMissingTable(error)) { disabledRef.current = true; setSyncState("unavailable"); }
      else setSyncState("offline");
      return;
    }
    setSyncState("synced");
  }, [user]);

  // Initial pull + merge when a user is signed in.
  useEffect(() => {
    if (!user) { setSyncState("idle"); return; }
    let cancelled = false;
    (async () => {
      setSyncState("syncing");
      try {
        const { data, error } = await db
          .from(TRAINING_PROGRESS_TABLE)
          .select("day")
          .eq("user_id", user.id)
          .eq("programme", TRAINING_PROGRAMME);
        if (cancelled) return;
        if (error) {
          if (isMissingTable(error)) { disabledRef.current = true; setSyncState("unavailable"); }
          else setSyncState("offline");
          return;
        }
        const remote = (data ?? []).map((r: { day: number }) => r.day);
        const local = readLocalDays(storageKey);
        const merged = mergeDays(local, remote);
        localStorage.setItem(storageKey, JSON.stringify(merged));
        setCompleted(merged);
        const missingRemotely = local.filter((d) => !remote.includes(d));
        if (missingRemotely.length) await push(missingRemotely);
        else setSyncState("synced");
      } catch {
        if (!cancelled) setSyncState("offline");
      }
    })();
    return () => { cancelled = true; };
  }, [user, storageKey, push]);

  const updateCompleted = useCallback((next: number[]) => {
    const prev = readLocalDays(storageKey);
    const merged = mergeDays([], next);
    setCompleted(merged);
    localStorage.setItem(storageKey, JSON.stringify(merged));
    void push(merged.filter((d) => !prev.includes(d)));
  }, [storageKey, push]);

  return { completed, setCompleted: updateCompleted, syncState };
}
