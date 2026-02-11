import { useCallback, useRef, useEffect, useState } from "react";
import { useSmartSensor, SensorResult } from "@/hooks/useSmartSensor";
import { useGeofenceMonitor, GeofenceStatus } from "@/hooks/useGeofenceMonitor";
import { useAuth } from "@/hooks/useAuth";

/**
 * Unified hook that integrates the Smart Sensor Engine with the Geofence Monitor.
 *
 * On every GPS update the pipeline is:
 *   1. Smart Sensor evaluates whether the reading is worth sending
 *   2. If "send" → also run geofence check (throttled server-side)
 *   3. Expose geofence status + last sensor decision to the consumer
 */

export interface GeofencedTrackingState {
  lastSensorResult: SensorResult | null;
  geofenceStatus: GeofenceStatus;
  isMonitoring: boolean;
  stats: { sent: number; skipped: number };
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

  const [lastSensorResult, setLastSensorResult] = useState<SensorResult | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const zonesLoadedRef = useRef(false);

  // Load geofence zones once on mount
  useEffect(() => {
    if (!zonesLoadedRef.current) {
      zonesLoadedRef.current = true;
      loadZones();
    }
  }, [loadZones]);

  /**
   * Process a GPS reading through the full pipeline:
   * Smart Sensor → Geofence Monitor
   *
   * Returns the SensorResult so the caller knows if data was sent.
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

      // Step 1: Smart Sensor evaluation
      const result = evaluate(lat, lng, accuracy, stage);
      setLastSensorResult(result);

      // Step 2: If sensor says "send" and we have a group, run geofence check
      if (result.decision === "send" && groupId && user) {
        // Record movement for stationary detection
        recordMovement();

        // Run server-side geofence check (internally throttled to 60s)
        checkGeofence(lat, lng, groupId, memberId).catch((err) => {
          console.warn("[GeofencedTracking] Geofence check failed:", err);
        });
      }

      return result;
    },
    [evaluate, groupId, user, checkGeofence, recordMovement]
  );

  /** Reset both sensor and monitoring state */
  const reset = useCallback(() => {
    resetSensor();
    setLastSensorResult(null);
    setIsMonitoring(false);
  }, [resetSensor]);

  return {
    processLocation,
    reset,
    lastSensorResult,
    geofenceStatus,
    isMonitoring,
    stats: getStats(),
  };
}
