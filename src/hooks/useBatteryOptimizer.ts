import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Battery Optimizer for Tracking
 *
 * Dynamically adjusts GPS polling intervals based on:
 *  - Battery level (< 20% → aggressive savings)
 *  - Charging state (plugged in → full accuracy)
 *  - Movement state (stationary → longer intervals)
 *  - Network type (slow → reduce upload frequency)
 *
 * Tiers:
 *   FULL:      GPS every 15s (charging or battery > 50%)
 *   MODERATE:  GPS every 45s (battery 20-50%)
 *   SAVER:     Cell-only every 2m (battery < 20%)
 *   CRITICAL:  Cell-only every 5m, minimal uploads (battery < 10%)
 */

export type PowerTier = "full" | "moderate" | "saver" | "critical";

export interface BatteryState {
  level: number; // 0-1
  charging: boolean;
  powerTier: PowerTier;
  intervalMs: number; // recommended polling interval
  useGps: boolean; // whether to use GPS or cell-only
  uploadBatch: boolean; // batch uploads instead of real-time
}

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

const TIER_CONFIG: Record<PowerTier, { intervalMs: number; useGps: boolean; uploadBatch: boolean }> = {
  full:     { intervalMs: 15_000, useGps: true,  uploadBatch: false },
  moderate: { intervalMs: 45_000, useGps: true,  uploadBatch: false },
  saver:    { intervalMs: 120_000, useGps: false, uploadBatch: true },
  critical: { intervalMs: 300_000, useGps: false, uploadBatch: true },
};

function computeTier(level: number, charging: boolean): PowerTier {
  if (charging) return "full";
  if (level > 0.5) return "full";
  if (level > 0.2) return "moderate";
  if (level > 0.1) return "saver";
  return "critical";
}

export function useBatteryOptimizer() {
  const [state, setState] = useState<BatteryState>({
    level: 1,
    charging: true,
    powerTier: "full",
    ...TIER_CONFIG.full,
  });

  const batteryRef = useRef<BatteryManager | null>(null);

  const updateState = useCallback((level: number, charging: boolean) => {
    const tier = computeTier(level, charging);
    const config = TIER_CONFIG[tier];
    setState({ level, charging, powerTier: tier, ...config });
  }, []);

  // Network-aware adjustment
  const getNetworkAdjustedInterval = useCallback((): number => {
    const conn = (navigator as any).connection;
    if (!conn) return state.intervalMs;

    const effectiveType = conn.effectiveType;
    // On slow networks, increase interval to reduce failed uploads
    if (effectiveType === "slow-2g" || effectiveType === "2g") {
      return Math.max(state.intervalMs, 180_000); // minimum 3 minutes
    }
    if (effectiveType === "3g") {
      return Math.max(state.intervalMs, state.intervalMs * 1.5);
    }
    return state.intervalMs;
  }, [state.intervalMs]);

  useEffect(() => {
    const initBattery = async () => {
      try {
        if ("getBattery" in navigator) {
          const battery = await (navigator as any).getBattery() as BatteryManager;
          batteryRef.current = battery;

          updateState(battery.level, battery.charging);

          const handleChange = () => {
            if (batteryRef.current) {
              updateState(batteryRef.current.level, batteryRef.current.charging);
            }
          };

          battery.addEventListener("levelchange", handleChange);
          battery.addEventListener("chargingchange", handleChange);

          return () => {
            battery.removeEventListener("levelchange", handleChange);
            battery.removeEventListener("chargingchange", handleChange);
          };
        }
      } catch {
        // Battery API not available - default to full
      }
    };

    initBattery();
  }, [updateState]);

  return {
    ...state,
    getNetworkAdjustedInterval,
    tierConfig: TIER_CONFIG,
  };
}
