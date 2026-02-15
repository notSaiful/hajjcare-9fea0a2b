import { useCallback, useRef, useEffect, useState } from "react";
import { useSmartSensor, SensorResult } from "@/hooks/useSmartSensor";
import { useGeofenceMonitor, GeofenceStatus } from "@/hooks/useGeofenceMonitor";
import { useHybridPosition, HybridPosition } from "@/hooks/useHybridPosition";
import { useBatteryOptimizer, PowerTier } from "@/hooks/useBatteryOptimizer";
import { useOfflineLocationCache } from "@/hooks/useOfflineLocationCache";
import { usePrivacyCompliance } from "@/hooks/usePrivacyCompliance";
import { useAuth } from "@/hooks/useAuth";

/**
 * Unified Hybrid Tracking Pipeline
 *
 * Integrates all tracking subsystems:
 *   1. Hybrid Position Provider (GPS + Cell + BT mesh + cache fallback)
 *   2. Smart Sensor Engine (movement-based sleep/wake filter)
 *   3. Geofence Monitor (zone boundary + stationary detection)
 *   4. Battery Optimizer (dynamic interval adjustment)
 *   5. Offline Cache (IndexedDB queue with auto-sync)
 *   6. Privacy Compliance (data minimization + consent)
 *
 * Pipeline: Acquire → Sanitize → Evaluate → Geofence → Upload/Queue
 */

export interface GeofencedTrackingState {
  lastSensorResult: SensorResult | null;
  geofenceStatus: GeofenceStatus;
  isMonitoring: boolean;
  stats: { sent: number; skipped: number };
  lastPosition: HybridPosition | null;
  powerTier: PowerTier;
  offlineQueueSize: number;
  isSyncing: boolean;
  privacyConsented: boolean;
}

export function useGeofencedTracking(groupId: string | null) {
  const { evaluate, reset: resetSensor, getStats } = useSmartSensor();
  const {
    status: geofenceStatus,
    checkGeofence,
    recordMovement,
    loadZones,
  } = useGeofenceMonitor();
  const { user } = useAuth();

  // Hybrid subsystems
  const battery = useBatteryOptimizer();
  const hybrid = useHybridPosition({
    enableGps: battery.useGps,
    enableCell: true,
    enableBluetooth: false, // opt-in via config
  });
  const offline = useOfflineLocationCache();
  const privacy = usePrivacyCompliance();

  const [lastSensorResult, setLastSensorResult] = useState<SensorResult | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const zonesLoadedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load geofence zones once on mount
  useEffect(() => {
    if (!zonesLoadedRef.current) {
      zonesLoadedRef.current = true;
      loadZones();
    }
  }, [loadZones]);

  /**
   * Process a GPS reading through the full hybrid pipeline:
   * Acquire → Sanitize → Smart Sensor → Geofence → Upload/Queue
   */
  const processLocation = useCallback(
    async (
      lat: number,
      lng: number,
      accuracy: number | null,
      stage: string | null,
      memberId?: string
    ): Promise<SensorResult> => {
      setIsMonitoring(true);

      // Privacy gate
      if (!privacy.isTrackingPermitted()) {
        return {
          decision: "sleep",
          reason: "consent_not_granted",
          distanceMoved: null,
          msSinceLastSend: null,
        };
      }

      // Sanitize coordinates (privacy: precision reduction)
      const sanitized = privacy.sanitize(lat, lng, accuracy || 50, stage, hybrid.position?.source || "gps");

      // Smart Sensor evaluation
      const result = evaluate(sanitized.lat, sanitized.lng, accuracy, stage);
      setLastSensorResult(result);

      // If sensor says "send" and we have a group
      if (result.decision === "send" && groupId && user) {
        recordMovement();

        if (navigator.onLine) {
          // Online: direct geofence check + location update
          checkGeofence(sanitized.lat, sanitized.lng, groupId, memberId).catch((err) => {
            console.warn("[HybridTracking] Geofence check failed:", err);
          });
        } else {
          // Offline: queue for later sync
          offline.enqueue({
            latitude: sanitized.lat,
            longitude: sanitized.lng,
            accuracy: sanitized.accuracy,
            source: sanitized.source,
            stage,
            groupId,
            memberId: memberId || "self",
            timestamp: Date.now(),
          });
        }
      }

      return result;
    },
    [evaluate, groupId, user, checkGeofence, recordMovement, privacy, hybrid.position, offline]
  );

  /**
   * Start battery-aware automatic tracking loop
   */
  const startAutoTracking = useCallback(
    (stage: string | null, memberId?: string) => {
      if (!groupId || !user) return;

      // Grant consent when user starts tracking
      privacy.grantConsent();

      const tick = async () => {
        const pos = await hybrid.acquirePosition(battery.powerTier === "saver" || battery.powerTier === "critical");
        if (pos) {
          await processLocation(pos.latitude, pos.longitude, pos.accuracy, stage, memberId);
        }
      };

      // Initial tick
      tick();

      // Set up battery-adjusted interval
      const interval = battery.getNetworkAdjustedInterval();
      intervalRef.current = setInterval(tick, interval);
      setIsMonitoring(true);
    },
    [groupId, user, hybrid, battery, processLocation, privacy]
  );

  /**
   * Stop automatic tracking
   */
  const stopAutoTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMonitoring(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Re-adjust interval when battery tier changes
  useEffect(() => {
    if (intervalRef.current && isMonitoring) {
      // Restart with new interval (preserving tracking state)
      clearInterval(intervalRef.current);
      const newInterval = battery.getNetworkAdjustedInterval();
      const tick = async () => {
        const pos = await hybrid.acquirePosition(battery.powerTier === "saver" || battery.powerTier === "critical");
        if (pos) {
          await processLocation(pos.latitude, pos.longitude, pos.accuracy, null);
        }
      };
      intervalRef.current = setInterval(tick, newInterval);
    }
  }, [battery.powerTier]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Reset all subsystems */
  const reset = useCallback(() => {
    resetSensor();
    stopAutoTracking();
    setLastSensorResult(null);
    setIsMonitoring(false);
  }, [resetSensor, stopAutoTracking]);

  return {
    // Core pipeline
    processLocation,
    startAutoTracking,
    stopAutoTracking,
    reset,

    // State
    lastSensorResult,
    geofenceStatus,
    isMonitoring,
    stats: getStats(),

    // Hybrid subsystems
    lastPosition: hybrid.position,
    powerTier: battery.powerTier,
    batteryLevel: battery.level,
    offlineQueueSize: offline.queueSize,
    isSyncing: offline.isSyncing,
    privacyConsented: privacy.isTrackingPermitted(),

    // Privacy controls
    grantConsent: privacy.grantConsent,
    revokeConsent: privacy.revokeConsent,
    syncOfflineQueue: offline.syncQueue,
  };
}
