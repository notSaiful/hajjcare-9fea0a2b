import { useCallback, useEffect, useState } from "react";
import type { IHPODesk } from "@/data/ihpoMadinahDesks";

/**
 * On-device overrides for IHPO desk mobile numbers.
 * Stored in localStorage as a map: { [deskId]: mobile }.
 * Empty string clears the override.
 */
const STORAGE_KEY_PREFIX = "ihpo-desk-overrides:";

export type DeskOverrides = Record<string, string>;

const readOverrides = (city: string): DeskOverrides => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + city);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
};

export const useDeskOverrides = (city: string) => {
  const [overrides, setOverrides] = useState<DeskOverrides>(() =>
    readOverrides(city)
  );

  useEffect(() => {
    setOverrides(readOverrides(city));
  }, [city]);

  const persist = useCallback(
    (next: DeskOverrides) => {
      setOverrides(next);
      try {
        localStorage.setItem(STORAGE_KEY_PREFIX + city, JSON.stringify(next));
      } catch {
        /* ignore quota errors */
      }
    },
    [city]
  );

  const setOverride = useCallback(
    (deskId: string, mobile: string) => {
      const trimmed = mobile.replace(/\D/g, "");
      const next = { ...overrides };
      if (trimmed) next[deskId] = trimmed;
      else delete next[deskId];
      persist(next);
    },
    [overrides, persist]
  );

  const setBulk = useCallback(
    (updates: DeskOverrides) => {
      const next = { ...overrides };
      Object.entries(updates).forEach(([id, mobile]) => {
        const trimmed = (mobile || "").replace(/\D/g, "");
        if (trimmed) next[id] = trimmed;
        else delete next[id];
      });
      persist(next);
    },
    [overrides, persist]
  );

  const clearAll = useCallback(() => persist({}), [persist]);

  const apply = useCallback(
    (desks: IHPODesk[]): IHPODesk[] =>
      desks.map((d) =>
        overrides[d.id] ? { ...d, mobile: overrides[d.id] } : d
      ),
    [overrides]
  );

  return { overrides, setOverride, setBulk, clearAll, apply };
};
