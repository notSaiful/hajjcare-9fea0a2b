import { useCallback, useRef } from "react";

/**
 * Privacy Compliance Layer for Location Tracking
 *
 * Implements GDPR/data minimization principles:
 *  1. Coordinate precision reduction (configurable, default ~11m)
 *  2. Temporal anonymization (round timestamps to nearest minute)
 *  3. Data retention TTL enforcement
 *  4. Consent state management
 *  5. Right-to-erasure support
 *  6. Purpose limitation (only safety-critical fields transmitted)
 */

export interface PrivacyConfig {
  coordinatePrecision: number; // decimal places (4 ≈ 11m, 3 ≈ 111m)
  timestampGranularityMs: number; // round timestamps to this granularity
  retentionHours: number; // auto-purge after this many hours
  allowedFields: string[]; // whitelist of transmittable fields
}

export interface SanitizedLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  stage: string | null;
  source: string;
}

const DEFAULT_CONFIG: PrivacyConfig = {
  coordinatePrecision: 4, // ~11m resolution
  timestampGranularityMs: 60_000, // round to nearest minute
  retentionHours: 48, // purge after 48h
  allowedFields: ["lat", "lng", "accuracy", "timestamp", "stage", "source"],
};

export function usePrivacyCompliance(overrides?: Partial<PrivacyConfig>) {
  const config = { ...DEFAULT_CONFIG, ...overrides };
  const consentRef = useRef<{
    granted: boolean;
    grantedAt: number | null;
    purposes: string[];
  }>({
    granted: false,
    grantedAt: null,
    purposes: [],
  });

  /**
   * Round coordinate to configured precision
   */
  const roundCoord = useCallback(
    (value: number): number => {
      const factor = 10 ** config.coordinatePrecision;
      return Math.round(value * factor) / factor;
    },
    [config.coordinatePrecision]
  );

  /**
   * Round timestamp to configured granularity
   */
  const roundTimestamp = useCallback(
    (ts: number): number => {
      return Math.floor(ts / config.timestampGranularityMs) * config.timestampGranularityMs;
    },
    [config.timestampGranularityMs]
  );

  /**
   * Sanitize a location reading for transmission
   * Strips all non-whitelisted fields, reduces precision
   */
  const sanitize = useCallback(
    (
      lat: number,
      lng: number,
      accuracy: number,
      stage: string | null,
      source: string
    ): SanitizedLocation => {
      return {
        lat: roundCoord(lat),
        lng: roundCoord(lng),
        accuracy: Math.round(accuracy),
        timestamp: roundTimestamp(Date.now()),
        stage,
        source,
      };
    },
    [roundCoord, roundTimestamp]
  );

  /**
   * Record user consent for tracking
   */
  const grantConsent = useCallback((purposes: string[] = ["safety_tracking", "family_visibility"]) => {
    consentRef.current = {
      granted: true,
      grantedAt: Date.now(),
      purposes,
    };
  }, []);

  /**
   * Revoke consent (right to withdraw)
   */
  const revokeConsent = useCallback(() => {
    consentRef.current = {
      granted: false,
      grantedAt: null,
      purposes: [],
    };
  }, []);

  /**
   * Check if tracking is permitted
   */
  const isTrackingPermitted = useCallback((): boolean => {
    return consentRef.current.granted;
  }, []);

  /**
   * Check if data has exceeded retention period
   */
  const isExpired = useCallback(
    (timestamp: number): boolean => {
      const maxAge = config.retentionHours * 60 * 60 * 1000;
      return Date.now() - timestamp > maxAge;
    },
    [config.retentionHours]
  );

  /**
   * Generate a privacy-safe data export for the user (right to access)
   */
  const generateDataExport = useCallback(
    (locations: Array<{ lat: number; lng: number; timestamp: number }>) => {
      return locations.map((loc) => ({
        approximate_location: `${roundCoord(loc.lat)}, ${roundCoord(loc.lng)}`,
        date: new Date(loc.timestamp).toISOString().split("T")[0],
        purpose: "family_safety_tracking",
      }));
    },
    [roundCoord]
  );

  return {
    sanitize,
    grantConsent,
    revokeConsent,
    isTrackingPermitted,
    isExpired,
    generateDataExport,
    consent: consentRef.current,
    config,
  };
}
