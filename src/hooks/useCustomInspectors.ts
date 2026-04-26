import { useCallback, useEffect, useState } from "react";
import { HAJ_INSPECTORS, type HajInspector } from "@/data/hajInspectorsData";

const STORAGE_KEY = "hajcare:custom-inspectors";

/** Normalize a string for fuzzy duplicate matching (case + whitespace + punctuation insensitive). */
const norm = (s?: string) =>
  (s ?? "").toLowerCase().replace(/[\s\-_./#()]+/g, "").trim();

export type DuplicateStrategy = "skip" | "update";

export type DuplicateMatch = {
  /** id of the existing record (custom or official) */
  existingId: string;
  /** which field caused the match */
  reason: "name+state" | "cover" | "name+state+cover";
  /** true if the existing record is a user-added custom one (updatable) */
  isCustom: boolean;
};

export type ImportSummary = {
  added: HajInspector[];
  updated: HajInspector[];
  skipped: Array<{ input: NewInspectorInput; match: DuplicateMatch }>;
};

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

  /**
   * Find a possible duplicate for a given input across both
   * user-added (custom) inspectors and the official dataset.
   * Match priority: name+state, then cover#.
   */
  const findDuplicate = useCallback(
    (
      input: NewInspectorInput,
      pool: HajInspector[] = [...custom, ...HAJ_INSPECTORS]
    ): DuplicateMatch | null => {
      const nName = norm(input.name);
      const nState = norm(input.state);
      const nCover = norm(input.coverNumber);

      // 1) name + state (+ cover when both have it)
      const nameStateMatch = pool.find(
        (p) => norm(p.name) === nName && norm(p.state) === nState
      );
      if (nameStateMatch) {
        const reason: DuplicateMatch["reason"] =
          nCover && norm(nameStateMatch.coverNumber) === nCover
            ? "name+state+cover"
            : "name+state";
        return {
          existingId: nameStateMatch.id,
          reason,
          isCustom: isCustomInspectorId(nameStateMatch.id),
        };
      }

      // 2) cover # (only if provided)
      if (nCover) {
        const coverMatch = pool.find((p) => norm(p.coverNumber) === nCover);
        if (coverMatch) {
          return {
            existingId: coverMatch.id,
            reason: "cover",
            isCustom: isCustomInspectorId(coverMatch.id),
          };
        }
      }

      return null;
    },
    [custom]
  );

  const addManyInspectors = useCallback(
    (
      inputs: NewInspectorInput[],
      strategy: DuplicateStrategy = "skip"
    ): ImportSummary => {
      const summary: ImportSummary = { added: [], updated: [], skipped: [] };

      // Build a working pool we keep updating so duplicates *within* the
      // import batch are also detected.
      let workingCustom = [...custom];
      const pool = (): HajInspector[] => [...workingCustom, ...HAJ_INSPECTORS];

      inputs.forEach((input, idx) => {
        const match = findDuplicate(input, pool());

        if (match) {
          // Only custom (user-added) entries can be updated in place.
          if (strategy === "update" && match.isCustom) {
            workingCustom = workingCustom.map((c) =>
              c.id === match.existingId
                ? {
                    ...c,
                    name: input.name.trim() || c.name,
                    state: input.state.trim() || c.state,
                    coverNumber: cleanStr(input.coverNumber) ?? c.coverNumber,
                    indianMobile: cleanStr(input.indianMobile) ?? c.indianMobile,
                    ksaMobile: cleanStr(input.ksaMobile) ?? c.ksaMobile,
                    makkahBuilding:
                      cleanStr(input.makkahBuilding) ?? c.makkahBuilding,
                    madinahBuilding:
                      cleanStr(input.madinahBuilding) ?? c.madinahBuilding,
                  }
                : c
            );
            const updated = workingCustom.find((c) => c.id === match.existingId);
            if (updated) summary.updated.push(updated);
          } else {
            summary.skipped.push({ input, match });
          }
          return;
        }

        const id = `${CUSTOM_INSPECTOR_PREFIX}${Date.now()}-${idx}-${Math.random()
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
        workingCustom = [inspector, ...workingCustom];
        summary.added.push(inspector);
      });

      persist(workingCustom);
      return summary;
    },
    [custom, findDuplicate, persist]
  );

  return {
    custom,
    addInspector,
    addManyInspectors,
    removeInspector,
    findDuplicate,
  };
};
