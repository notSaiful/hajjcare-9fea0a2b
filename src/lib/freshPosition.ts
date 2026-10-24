export interface Coordinates {
  lat: number;
  lng: number;
}

/** True only for finite, in-range coordinates that are not the (0,0) "null island" placeholder. */
export function isUsableCoordinate(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return false;
  if (lat === 0 && lng === 0) return false;
  return true;
}

/** Prefer a fresh fix, then the last known fix; never fabricate (0,0). */
export function pickCoordinates(
  fresh: Partial<Coordinates> | null | undefined,
  cached: { lat?: number | null; lng?: number | null } | null | undefined,
): Coordinates | null {
  if (fresh && isUsableCoordinate(fresh.lat, fresh.lng)) return { lat: fresh.lat as number, lng: fresh.lng as number };
  if (cached && isUsableCoordinate(cached.lat, cached.lng)) return { lat: cached.lat as number, lng: cached.lng as number };
  return null;
}

/**
 * One-shot high-accuracy GPS read with a hard timeout. Resolves null (never
 * rejects) when geolocation is unavailable, denied, or too slow.
 */
export function getFreshPosition(timeoutMs = 6000): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    let settled = false;
    const finish = (value: Coordinates | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => finish(pickCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude }, null)),
        () => finish(null),
        { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 15_000 },
      );
    } catch {
      finish(null);
    }
  });
}
