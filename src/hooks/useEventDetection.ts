import { useCallback, useRef } from "react";
import { HAJJ_LOCATIONS, type HajjStage } from "@/hooks/useHajjLocation";

/**
 * AI Event Detection Layer
 *
 * Enhances raw GPS → stage detection with:
 *  1. Multi-zone proximity scoring (confidence %)
 *  2. Dwell-time tracking (how long in each zone)
 *  3. Transition validation (prevents impossible stage jumps)
 *  4. Stable stage output (requires MIN_DWELL before confirming)
 */

// --- Configuration ---
const MIN_DWELL_MS = 60_000; // 1 min in a zone before confirming stage change
const CONFIDENCE_THRESHOLD = 0.6; // minimum confidence to consider a zone match

// Valid Hajj stage transitions (directed graph)
const VALID_TRANSITIONS: Record<string, string[]> = {
  unknown: ["outside", "kaaba", "mina", "arafat", "muzdalifah", "jamarat", "safa_marwa"],
  outside: ["kaaba", "mina", "arafat", "muzdalifah", "jamarat", "safa_marwa", "outside"],
  kaaba: ["safa_marwa", "outside", "mina", "kaaba"],
  safa_marwa: ["kaaba", "outside", "mina", "safa_marwa"],
  mina: ["arafat", "outside", "jamarat", "mina", "kaaba"],
  arafat: ["muzdalifah", "outside", "arafat"],
  muzdalifah: ["mina", "jamarat", "outside", "muzdalifah"],
  jamarat: ["mina", "kaaba", "outside", "jamarat"],
};

// Haversine distance in meters
function haversineMeters(
  lat1: number, lon1: number,
  lat2: number, lon2: number
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

export interface ZoneProximity {
  zone: HajjStage;
  distanceMeters: number;
  confidence: number; // 0-1, based on distance vs radius
}

export interface EventDetectionResult {
  /** Confirmed stable stage (requires dwell time) */
  confirmedStage: HajjStage;
  /** Raw nearest stage (instant, no dwell filter) */
  rawStage: HajjStage;
  /** Confidence of the raw detection (0-1) */
  confidence: number;
  /** Whether the stage just changed (transition event) */
  isTransition: boolean;
  /** Whether this is a valid transition in Hajj sequence */
  isValidTransition: boolean;
  /** How long (ms) user has been in the current raw zone */
  dwellTimeMs: number;
  /** All zones ranked by proximity */
  nearbyZones: ZoneProximity[];
}

export function useEventDetection() {
  const confirmedStageRef = useRef<HajjStage>("unknown");
  const rawStageRef = useRef<{ stage: HajjStage; enteredAt: number }>({
    stage: "unknown",
    enteredAt: Date.now(),
  });

  /**
   * Score all zones by proximity. Returns sorted by confidence (highest first).
   */
  const scoreZones = useCallback(
    (lat: number, lng: number): ZoneProximity[] => {
      const entries = Object.entries(HAJJ_LOCATIONS) as [string, { lat: number; lng: number; radiusKm: number }][];

      const scores: ZoneProximity[] = entries.map(([key, loc]) => {
        const dist = haversineMeters(lat, lng, loc.lat, loc.lng);
        const radiusM = loc.radiusKm * 1000;
        // Confidence: 1.0 at center, 0.0 at edge, negative outside
        const confidence = Math.max(0, 1 - dist / radiusM);
        // Map zone key to HajjStage
        const zone: HajjStage =
          key === "safa" || key === "marwa" ? "safa_marwa" : (key as HajjStage);
        return { zone, distanceMeters: Math.round(dist), confidence };
      });

      // Deduplicate safa_marwa (take highest confidence)
      const deduped = new Map<string, ZoneProximity>();
      for (const s of scores) {
        const existing = deduped.get(s.zone);
        if (!existing || s.confidence > existing.confidence) {
          deduped.set(s.zone, s);
        }
      }

      return Array.from(deduped.values()).sort(
        (a, b) => b.confidence - a.confidence
      );
    },
    []
  );

  /**
   * Detect the current Hajj stage with AI-style intelligence.
   */
  const detect = useCallback(
    (lat: number, lng: number): EventDetectionResult => {
      const now = Date.now();
      const nearbyZones = scoreZones(lat, lng);

      // Determine raw stage from best match
      const bestMatch = nearbyZones[0];
      const rawStage: HajjStage =
        bestMatch && bestMatch.confidence >= CONFIDENCE_THRESHOLD
          ? bestMatch.zone
          : "outside";
      const confidence = bestMatch?.confidence ?? 0;

      // Track dwell time in current raw zone
      const prevRaw = rawStageRef.current;
      if (rawStage !== prevRaw.stage) {
        rawStageRef.current = { stage: rawStage, enteredAt: now };
      }
      const dwellTimeMs = now - rawStageRef.current.enteredAt;

      // Confirm stage only after sufficient dwell time
      const previousConfirmed = confirmedStageRef.current;
      let isTransition = false;
      let isValidTransition = true;

      if (rawStage !== previousConfirmed && dwellTimeMs >= MIN_DWELL_MS) {
        // Check if this is a valid transition
        const allowed = VALID_TRANSITIONS[previousConfirmed] || [];
        isValidTransition = allowed.includes(rawStage);

        if (isValidTransition) {
          confirmedStageRef.current = rawStage;
          isTransition = true;
          console.log(
            `[EventDetection] Stage transition: ${previousConfirmed} → ${rawStage} (confidence: ${(confidence * 100).toFixed(0)}%, dwell: ${(dwellTimeMs / 1000).toFixed(0)}s)`
          );
        } else {
          console.warn(
            `[EventDetection] Invalid transition blocked: ${previousConfirmed} → ${rawStage}`
          );
        }
      }

      return {
        confirmedStage: confirmedStageRef.current,
        rawStage,
        confidence,
        isTransition,
        isValidTransition,
        dwellTimeMs,
        nearbyZones: nearbyZones.filter((z) => z.confidence > 0),
      };
    },
    [scoreZones]
  );

  /** Reset detection state (e.g. on logout) */
  const reset = useCallback(() => {
    confirmedStageRef.current = "unknown";
    rawStageRef.current = { stage: "unknown", enteredAt: Date.now() };
  }, []);

  return { detect, reset };
}
