import { useCallback, useEffect, useRef } from "react";

// Critical routes that should be preloaded on app start
const CRITICAL_ROUTES = [
  () => import("@/pages/PreparePage"),
  () => import("@/pages/UmrahGuidePage"),
  () => import("@/pages/ChatPage"),
];

// Routes to prefetch on hover/focus
const ROUTE_MAP: Record<string, () => Promise<unknown>> = {
  "/prepare": () => import("@/pages/PreparePage"),
  "/umrah": () => import("@/pages/UmrahGuidePage"),
  "/makkah-guide": () => import("@/pages/MakkahGuidePage"),
  "/madinah-guide": () => import("@/pages/MadinahGuidePage"),
  "/chat": () => import("@/pages/ChatPage"),
  "/sukoon-tracking": () => import("@/pages/FamilyPage"),
  "/map": () => import("@/pages/MapPage"),
  "/rules": () => import("@/pages/RulesBriefingPage"),
  "/health": () => import("@/pages/HealthGuidePage"),
  "/dua": () => import("@/pages/DuaGuidePage"),
  "/preparation": () => import("@/pages/PreparationGuidePage"),
  "/grievances": () => import("@/pages/GrievancesPage"),
  "/haj-directory": () => import("@/pages/HajMissionDirectoryPage"),
  "/pre-hajj-india": () => import("@/pages/PreHajjIndiaPage"),
  "/post-hajj": () => import("@/pages/PostHajjGuidePage"),
  "/women": () => import("@/pages/WomenSolutionsPage"),
  "/govt-services": () => import("@/pages/GovtServicesPage"),
  "/auth": () => import("@/pages/AuthPage"),
};

const prefetchedRoutes = new Set<string>();

const scheduleWhenIdle = (callback: () => void, timeout: number) => {
  const idleWindow = window as typeof window & {
    requestIdleCallback?: (handler: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };
  if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(() => callback(), { timeout });
  } else {
    setTimeout(callback, Math.min(timeout, 1500));
  }
};

/**
 * Prefetch a route's code on hover/focus for instant navigation
 */
export function usePrefetch(route: string) {
  const prefetch = useCallback(() => {
    if (prefetchedRoutes.has(route)) return;
    
    const loader = ROUTE_MAP[route];
    if (loader) {
      prefetchedRoutes.add(route);
      // Use requestIdleCallback for non-blocking prefetch
      scheduleWhenIdle(() => { void loader(); }, 2000);
    }
  }, [route]);

  return { onMouseEnter: prefetch, onFocus: prefetch };
}

/**
 * Preload critical routes after initial render
 */
export function useCriticalRoutePreload() {
  const hasPreloaded = useRef(false);

  useEffect(() => {
    if (hasPreloaded.current) return;
    hasPreloaded.current = true;

    // Delay preloading to not block initial render
    const preloadAfterIdle = () => {
      CRITICAL_ROUTES.forEach((loader) => {
        try {
          loader();
        } catch {
          // Silently fail - non-critical
        }
      });
    };

    scheduleWhenIdle(preloadAfterIdle, 3000);
  }, []);
}

/**
 * Get prefetch props for a navigation element
 */
export function getPrefetchProps(route: string) {
  return {
    onMouseEnter: () => {
      if (prefetchedRoutes.has(route)) return;
      const loader = ROUTE_MAP[route];
      if (loader) {
        prefetchedRoutes.add(route);
        loader();
      }
    },
    onFocus: () => {
      if (prefetchedRoutes.has(route)) return;
      const loader = ROUTE_MAP[route];
      if (loader) {
        prefetchedRoutes.add(route);
        loader();
      }
    },
  };
}
