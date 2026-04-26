import { useCallback, useEffect, useState } from "react";
import type { HajInspector } from "@/data/hajInspectorsData";

const STORAGE_KEY = "hajcare:custom-inspectors";

/** Prefix used to identify user-added inspectors (vs official records). */
export const CUSTOM_INSPECTOR_PREFIX = "custom-";

export const isCustomInspectorId = (id: string) =>
  id.startsWith(CUSTOM_INSPECTOR_PREFIX);

const readCustom = (): HajInspector[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HajInspector[]) : [];
  } catch {
    return [];
  }
};

export type NewInspectorInput = {
  name: string;
  state: string;
  coverNumber?: string;
  indianMobile?: string;
  ksaMobile?: string;
  makkahBuilding?: string;
  madinahBuilding?: string;
  fatherName?: string;
  gender?: "Male" | "Female";
};

const cleanStr = (v?: string) => {
  if (!v) return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
};

/**
 * Per-device custom inspectors (stored in localStorage).
 * Lets users add inspectors who aren't yet in the official dataset
 * so they can be searched and contacted from the Inspector Network.
 */
export const useCustomInspectors = () => {
  const [custom, setCustom] = useState<HajInspector[]>(() => readCustom());

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCustom(readCustom());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const persist = useCallback((next: HajInspector[]) => {
    setCustom(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  }, []);

  const addInspector = useCallback(
    (input: NewInspectorInput): HajInspector => {
      const id = `${CUSTOM_INSPECTOR_PREFIX}${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const inspector: HajInspector = {
        id,
        name: input.name.trim(),
        fatherName: cleanStr(input.fatherName) ?? "—",
        gender: input.gender ?? "Male",
        state: input.state.trim(),
        cbtMarks: 0,
        interviewMarks: 0,
        totalMarks: 0,
        result: "Selected",
        quota: "Added by user",
        category: "Custom",
        coverNumber: cleanStr(input.coverNumber),
        indianMobile: cleanStr(input.indianMobile),
        ksaMobile: cleanStr(input.ksaMobile),
        makkahBuilding: cleanStr(input.makkahBuilding),
        madinahBuilding: cleanStr(input.madinahBuilding),
      };
      persist([inspector, ...custom]);
      return inspector;
    },
    [custom, persist]
  );

  const removeInspector = useCallback(
    (id: string) => {
      persist(custom.filter((c) => c.id !== id));
    },
    [custom, persist]
  );

  return { custom, addInspector, removeInspector };
};
