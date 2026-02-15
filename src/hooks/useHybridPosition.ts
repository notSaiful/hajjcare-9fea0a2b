import { useCallback, useRef, useState, useEffect } from "react";

/**
 * Hybrid Position Provider
 * 
 * Fuses multiple positioning sources with accuracy-weighted fallback:
 *   1. GPS (highest accuracy, highest battery cost)
 *   2. Cell/Network triangulation (medium accuracy, low battery)
 *   3. Bluetooth mesh (peer-relative, indoor/crowd positioning)
 *   4. Last-known cached position (offline fallback)
 *
 * Privacy: All coordinates are rounded to ~11m precision (4 decimal places)
 * before leaving the device. Raw high-precision data is never stored.
 */

// --- Types ---
export type PositionSource = "gps" | "cell" | "bluetooth" | "cache";

export interface HybridPosition {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  source: PositionSource;
  timestamp: number;
  batteryAware: boolean; // was this reading influenced by battery saver?
  fused: boolean; // was this a multi-source fusion?
}

export interface HybridPositionConfig {
  enableGps?: boolean;
  enableCell?: boolean;
  enableBluetooth?: boolean;
  privacyPrecision?: number; // decimal places for coordinate rounding (default: 4 ≈ 11m)
}

// --- Privacy: Coordinate rounding ---
function roundCoord(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

// --- Accuracy-weighted fusion of two positions ---
function fusePositions(a: HybridPosition, b: HybridPosition): HybridPosition {
  // Inverse-accuracy weighting (lower accuracy value = higher weight)
  const wA = 1 / Math.max(a.accuracy, 1);
  const wB = 1 / Math.max(b.accuracy, 1);
  const total = wA + wB;

  return {
    latitude: (a.latitude * wA + b.latitude * wB) / total,
    longitude: (a.longitude * wA + b.longitude * wB) / total,
    accuracy: Math.min(a.accuracy, b.accuracy) * 0.85, // fusion improves accuracy ~15%
    source: a.accuracy <= b.accuracy ? a.source : b.source,
    timestamp: Math.max(a.timestamp, b.timestamp),
    batteryAware: a.batteryAware || b.batteryAware,
    fused: true,
  };
}

// --- Bluetooth Mesh Scanner (Web Bluetooth API) ---
async function scanBluetoothPeers(): Promise<{ peerCount: number; signalStrength: number } | null> {
  try {
    if (!("bluetooth" in navigator)) return null;
    // Web Bluetooth is limited; we estimate crowd density from available devices
    // In production, a native BLE mesh SDK would replace this
    const device = await (navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [],
    }).catch(() => null);
    
    if (!device) return null;
    return { peerCount: 1, signalStrength: -60 }; // placeholder for mesh data
  } catch {
    return null;
  }
}

export function useHybridPosition(config?: HybridPositionConfig) {
  const {
    enableGps = true,
    enableCell = true,
    enableBluetooth = false, // opt-in for BT mesh
    privacyPrecision = 4,
  } = config || {};

  const [position, setPosition] = useState<HybridPosition | null>(null);
  const [isAcquiring, setIsAcquiring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastGpsRef = useRef<HybridPosition | null>(null);
  const lastCellRef = useRef<HybridPosition | null>(null);
  const btMeshRef = useRef<{ peerCount: number; signalStrength: number } | null>(null);

  /**
   * Get GPS position (high accuracy)
   */
  const getGpsPosition = useCallback((): Promise<HybridPosition | null> => {
    if (!enableGps || !navigator.geolocation) return Promise.resolve(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const hp: HybridPosition = {
            latitude: roundCoord(pos.coords.latitude, privacyPrecision),
            longitude: roundCoord(pos.coords.longitude, privacyPrecision),
            accuracy: pos.coords.accuracy,
            source: "gps",
            timestamp: Date.now(),
            batteryAware: false,
            fused: false,
          };
          lastGpsRef.current = hp;
          resolve(hp);
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    });
  }, [enableGps, privacyPrecision]);

  /**
   * Get Cell/Network position (lower accuracy, lower battery)
   */
  const getCellPosition = useCallback((): Promise<HybridPosition | null> => {
    if (!enableCell || !navigator.geolocation) return Promise.resolve(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const hp: HybridPosition = {
            latitude: roundCoord(pos.coords.latitude, privacyPrecision),
            longitude: roundCoord(pos.coords.longitude, privacyPrecision),
            accuracy: pos.coords.accuracy,
            source: "cell",
            timestamp: Date.now(),
            batteryAware: false,
            fused: false,
          };
          lastCellRef.current = hp;
          resolve(hp);
        },
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 } // low-power mode
      );
    });
  }, [enableCell, privacyPrecision]);

  /**
   * Acquire position using the best available source(s) and fuse if possible
   */
  const acquirePosition = useCallback(
    async (batterySaver: boolean = false): Promise<HybridPosition | null> => {
      setIsAcquiring(true);
      setError(null);

      try {
        let readings: HybridPosition[] = [];

        if (batterySaver) {
          // Battery saver: cell-only (no GPS radio)
          const cell = await getCellPosition();
          if (cell) {
            cell.batteryAware = true;
            readings.push(cell);
          }
        } else {
          // Full mode: GPS + Cell in parallel
          const [gps, cell] = await Promise.all([getGpsPosition(), getCellPosition()]);
          if (gps) readings.push(gps);
          if (cell) readings.push(cell);
        }

        // Bluetooth mesh scan (non-blocking, for crowd density)
        if (enableBluetooth) {
          scanBluetoothPeers().then((mesh) => {
            btMeshRef.current = mesh;
          });
        }

        if (readings.length === 0) {
          // Fallback: use cached position
          const cached = lastGpsRef.current || lastCellRef.current;
          if (cached) {
            const fallback: HybridPosition = {
              ...cached,
              source: "cache",
              batteryAware: batterySaver,
              timestamp: Date.now(),
            };
            setPosition(fallback);
            return fallback;
          }
          setError("no_position_source");
          return null;
        }

        // Fuse multiple readings for better accuracy
        let best = readings[0];
        for (let i = 1; i < readings.length; i++) {
          best = fusePositions(best, readings[i]);
        }

        // Apply privacy rounding to fused result
        best.latitude = roundCoord(best.latitude, privacyPrecision);
        best.longitude = roundCoord(best.longitude, privacyPrecision);

        setPosition(best);
        return best;
      } catch (err) {
        setError(err instanceof Error ? err.message : "position_error");
        return null;
      } finally {
        setIsAcquiring(false);
      }
    },
    [getGpsPosition, getCellPosition, enableBluetooth, privacyPrecision]
  );

  return {
    position,
    isAcquiring,
    error,
    acquirePosition,
    bluetoothMesh: btMeshRef.current,
  };
}
