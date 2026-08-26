import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hajcare:inspector-favorites";

const readFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

/**
 * Per-device favorites for Haj Inspectors (stored in localStorage).
 * Syncs across tabs via the `storage` event.
 */
export const useInspectorFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites());

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavorites(readFavorites());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const persist = useCallback((next: string[]) => {
    setFavorites(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const next = favorites.includes(id)
        ? favorites.filter((f) => f !== id)
        : [...favorites, id];
      persist(next);
      return !favorites.includes(id);
    },
    [favorites, persist]
  );

  return { favorites, isFavorite, toggleFavorite };
};
