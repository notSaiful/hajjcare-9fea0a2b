import { useCallback, useRef } from "react";

/**
 * Smart Sensor Engine — Movement-based sleep/wake GPS filter.
 *
 * Only sends location updates when:
 *  1. GPS coordinates change by more than DISTANCE_THRESHOLD_METERS
 *  2. OR the detected Hajj stage changes
 *  3. OR MAX_SILENCE_MS has elapsed since last send (heartbeat)
 *
 * Rejects invalid coordinates (0,0 or null island).
 */

// --- Configuration ---
const DISTANCE_THRESHOLD_METERS = 50; // minimum movement to trigger an update
const MAX_SILENCE_MS = 5 * 60 * 1000; // heartbeat every 5 minutes even without movement
const MIN_ACCURACY_METERS = 200; // reject readings worse than this

// Haversine distance in meters
function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isValidCoordinate(lat: number, lng: number): boolean {
  // Reject null-island (0,0) and out-of-range values
  if (lat === 0 && lng === 0) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
}

export type SensorDecision = "send" | "sleep";

export interface SensorResult {
  decision: SensorDecision;
  reason: string;
  distanceMoved: number | null;
  msSinceLastSend: number | null;
}

export interface SmartSensorOptions {
  distanceThreshold?: number;
  maxSilenceMs?: number;
  minAccuracy?: number;
}

export function useSmartSensor(options?: SmartSensorOptions) {
  const threshold = options?.distanceThreshold ?? DISTANCE_THRESHOLD_METERS;
  const silence = options?.maxSilenceMs ?? MAX_SILENCE_MS;
  const minAcc = options?.minAccuracy ?? MIN_ACCURACY_METERS;

  const lastSentRef = useRef<{
    lat: number;
    lng: number;
    stage: string | null;
    timestamp: number;
  } | null>(null);

  const statsRef = useRef({ sent: 0, skipped: 0 });

  /**
   * Evaluate whether a new GPS reading should be sent upstream.
   * Returns a SensorResult with decision + reason.
   */
  const evaluate = useCallback(
    (
      lat: number,
      lng: number,
      accuracy: number | null,
      stage: string | null
    ): SensorResult => {
      // 1. Reject invalid coordinates
      if (!isValidCoordinate(lat, lng)) {
        statsRef.current.skipped++;
        return {
          decision: "sleep",
          reason: "invalid_coordinates",
          distanceMoved: null,
          msSinceLastSend: null,
        };
      }

      // 2. Reject low-accuracy readings
      if (accuracy !== null && accuracy > minAcc) {
        statsRef.current.skipped++;
        return {
          decision: "sleep",
          reason: `accuracy_too_low (${Math.round(accuracy)}m > ${minAcc}m)`,
          distanceMoved: null,
          msSinceLastSend: null,
        };
      }

      const now = Date.now();
      const last = lastSentRef.current;

      // 3. First reading — always send
      if (!last) {
        return makeSend(lat, lng, stage, now, 0, 0, "first_reading");
      }

      const distance = haversineMeters(last.lat, last.lng, lat, lng);
      const elapsed = now - last.timestamp;

      // 4. Stage changed — always send
      if (stage !== null && stage !== last.stage) {
        return makeSend(lat, lng, stage, now, distance, elapsed, "stage_changed");
      }

      // 5. Meaningful movement
      if (distance >= threshold) {
        return makeSend(lat, lng, stage, now, distance, elapsed, "movement_detected");
      }

      // 6. Heartbeat — send after max silence
      if (elapsed >= silence) {
        return makeSend(lat, lng, stage, now, distance, elapsed, "heartbeat");
      }

      // 7. No meaningful change → sleep
      statsRef.current.skipped++;
      return {
        decision: "sleep",
        reason: `no_change (${Math.round(distance)}m moved, ${Math.round(elapsed / 1000)}s ago)`,
        distanceMoved: distance,
        msSinceLastSend: elapsed,
      };
    },
    [threshold, silence, minAcc]
  );

  function makeSend(
    lat: number,
    lng: number,
    stage: string | null,
    now: number,
    distance: number,
    elapsed: number,
    reason: string
  ): SensorResult {
    lastSentRef.current = { lat, lng, stage, timestamp: now };
    statsRef.current.sent++;
    return {
      decision: "send",
      reason,
      distanceMoved: distance,
      msSinceLastSend: elapsed,
    };
  }

  /** Reset internal state (e.g. on logout or group change) */
  const reset = useCallback(() => {
    lastSentRef.current = null;
    statsRef.current = { sent: 0, skipped: 0 };
  }, []);

  /** Get send/skip stats for debugging */
  const getStats = useCallback(
    () => ({ ...statsRef.current }),
    []
  );

  return { evaluate, reset, getStats };
}
