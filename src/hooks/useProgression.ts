import { useState, useEffect, useCallback, useMemo } from "react";

type ProgressionModule = "hajj" | "umrah" | "rules" | "makkah" | "madinah";

interface ProgressionItem {
  id: string;
  order: number;
}

interface UseProgressionOptions {
  module: ProgressionModule;
  items: ProgressionItem[];
  autoMarkOnView?: boolean;
}

interface UseProgressionReturn {
  completedSteps: string[];
  progress: number;
  completedCount: number;
  totalCount: number;
  isCompleted: (id: string) => boolean;
  isUnlocked: (order: number) => boolean;
  markComplete: (id: string) => void;
  markIncomplete: (id: string) => void;
  toggleComplete: (id: string) => void;
  markAsViewed: (id: string) => void;
  resetProgress: () => void;
  isAllComplete: boolean;
}

const STORAGE_KEYS: Record<ProgressionModule, string> = {
  hajj: "hajj-completed-steps",
  umrah: "umrah-completed-steps",
  rules: "hajj-rules-read",
  makkah: "makkah-guide-completed",
  madinah: "madinah-guide-completed",
};

export const useProgression = ({
  module,
  items,
  autoMarkOnView = false,
}: UseProgressionOptions): UseProgressionReturn => {
  const storageKey = STORAGE_KEYS[module];

  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedSteps));
    } catch {
      // Silent fail for storage errors
    }
  }, [completedSteps, storageKey]);

  const isCompleted = useCallback(
    (id: string) => completedSteps.includes(id),
    [completedSteps]
  );

  const isUnlocked = useCallback(
    (order: number) => {
      if (order === 1) return true;
      const previousItem = items.find((item) => item.order === order - 1);
      return previousItem ? completedSteps.includes(previousItem.id) : false;
    },
    [items, completedSteps]
  );

  const markComplete = useCallback((id: string) => {
    setCompletedSteps((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const markIncomplete = useCallback((id: string) => {
    setCompletedSteps((prev) => prev.filter((s) => s !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const markAsViewed = useCallback(
    (id: string) => {
      if (autoMarkOnView) {
        markComplete(id);
      }
    },
    [autoMarkOnView, markComplete]
  );

  const resetProgress = useCallback(() => {
    setCompletedSteps([]);
  }, []);

  const completedCount = completedSteps.length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllComplete = completedCount === totalCount && totalCount > 0;

  return useMemo(
    () => ({
      completedSteps,
      progress,
      completedCount,
      totalCount,
      isCompleted,
      isUnlocked,
      markComplete,
      markIncomplete,
      toggleComplete,
      markAsViewed,
      resetProgress,
      isAllComplete,
    }),
    [
      completedSteps,
      progress,
      completedCount,
      totalCount,
      isCompleted,
      isUnlocked,
      markComplete,
      markIncomplete,
      toggleComplete,
      markAsViewed,
      resetProgress,
      isAllComplete,
    ]
  );
};

// Helper hook to get just the current item's navigation info
export const useProgressionNavigation = (
  items: ProgressionItem[],
  currentId: string
) => {
  const currentItem = items.find((item) => item.id === currentId);
  const currentOrder = currentItem?.order ?? 0;

  const nextItem = items.find((item) => item.order === currentOrder + 1);
  const prevItem = items.find((item) => item.order === currentOrder - 1);

  return {
    currentItem,
    currentOrder,
    nextItem,
    prevItem,
    isFirst: currentOrder === 1,
    isLast: !nextItem,
    totalItems: items.length,
  };
};
