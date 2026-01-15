import { useCallback, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Optimized navigation hook that provides:
 * 1. Immediate visual feedback (isPending state)
 * 2. Non-blocking navigation using useTransition
 * 3. Haptic feedback on supported devices
 */
export function useOptimizedNavigation() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const navigateTo = useCallback((route: string) => {
    // Immediate visual feedback
    setPendingRoute(route);
    
    // Haptic feedback on supported devices
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }

    // Use transition for non-blocking navigation
    startTransition(() => {
      navigate(route);
      setPendingRoute(null);
    });
  }, [navigate]);

  return {
    navigateTo,
    isPending,
    pendingRoute,
    isNavigatingTo: (route: string) => pendingRoute === route,
  };
}

/**
 * Hook for navigation with loading state per route
 */
export function useNavigationState() {
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  const navigate = useNavigate();

  const goTo = useCallback((route: string) => {
    setLoadingRoute(route);
    
    // Small delay to show loading state, then navigate
    // This ensures the UI responds immediately
    requestAnimationFrame(() => {
      navigate(route);
      // Clear loading state after navigation completes
      setTimeout(() => setLoadingRoute(null), 100);
    });
  }, [navigate]);

  return {
    goTo,
    isLoading: (route: string) => loadingRoute === route,
    loadingRoute,
  };
}
