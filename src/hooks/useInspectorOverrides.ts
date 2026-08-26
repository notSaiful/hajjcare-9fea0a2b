import { useCallback, useEffect, useState } from "react";
import type { HajInspector } from "@/data/hajInspectorsData";

const STORAGE_KEY = "hajcare:inspector-overrides";
const CHANGE_EVENT = "hajcare:inspector-overrides-changed";

export type InspectorEditableFields = Pick<
  HajInspector,
  | "coverNumber"
  | "indianMobile"
  | "ksaMobile"
  | "makkahBuilding"
  | "madinahBuilding"
>;

export type InspectorOverrides = Record<string, Partial<InspectorEditableFields>>;

const readOverrides = (): InspectorOverrides => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as InspectorOverrides)
      : {};
  } catch {
    return {};
  }
};

/**
 * Per-device overrides for Haj Inspector contact / building info.
 * Stored in localStorage so any user can keep their own up-to-date copy
 * without requiring backend writes. Synced across tabs via `storage` event.
 */
export const useInspectorOverrides = () => {
  const [overrides, setOverrides] = useState<InspectorOverrides>(() =>
    readOverrides()
  );

  useEffect(() => {
    const refresh = () => setOverrides(readOverrides());
    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener("storage", storageHandler);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", storageHandler);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, []);

  const persist = useCallback((next: InspectorOverrides) => {
    setOverrides(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
    // Notify other hook instances in the same tab to re-read
    try {
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // ignore
    }
  }, []);

  const setOverride = useCallback(
    (id: string, patch: Partial<InspectorEditableFields>) => {
      const cleaned: Partial<InspectorEditableFields> = {};
      (Object.keys(patch) as (keyof InspectorEditableFields)[]).forEach((k) => {
        const v = patch[k];
        if (typeof v === "string") {
          const trimmed = v.trim();
          if (trimmed.length > 0) cleaned[k] = trimmed;
        }
      });
      const next = { ...overrides, [id]: cleaned };
      // If the user cleared every field, drop the entry entirely
      if (Object.keys(cleaned).length === 0) {
        delete next[id];
      }
      persist(next);
    },
    [overrides, persist]
  );

  const clearOverride = useCallback(
    (id: string) => {
      if (!overrides[id]) return;
      const next = { ...overrides };
      delete next[id];
      persist(next);
    },
    [overrides, persist]
  );

  const hasOverride = useCallback(
    (id: string) => Boolean(overrides[id]),
    [overrides]
  );

  /** Merge stored overrides into a base inspector record. */
  const applyOverride = useCallback(
    (inspector: HajInspector): HajInspector => {
      const o = overrides[inspector.id];
      if (!o) return inspector;
      return { ...inspector, ...o };
    },
    [overrides]
  );

  return {
    overrides,
    setOverride,
    clearOverride,
    hasOverride,
    applyOverride,
  };
};
