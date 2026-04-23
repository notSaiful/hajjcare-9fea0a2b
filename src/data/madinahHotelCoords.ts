// Madinah Hotel coordinate helpers.
// We do not have GPS for all 381 hotels (the source PDF lists names + Tashee only).
// Strategy:
//   1. Verified coords for well-known landmark hotels live in VERIFIED_COORDS.
//   2. All other hotels are placed as deterministic jitter around Masjid an-Nabawi
//      (within ~600m) so map markers do not stack on a single point. Each hotel's
//      jitter is derived from its `code`, so positions are stable across renders.
//   3. `isApproximate` lets the UI label non-verified positions clearly.

import type { MadinahHotel } from "./madinahHotels";
import { MADINAH_CENTER } from "./madinahHotels";

// Masjid an-Nabawi — used for distance calculations
export const MASJID_NABAWI = { lat: 24.4672, lng: 39.6112 } as const;

// Verified GPS for famous landmark hotels (extend as confirmed)
const VERIFIED_COORDS: Record<number, { lat: number; lng: number }> = {
  24: { lat: 24.4694, lng: 39.6125 }, // Anwar Al Madinah Movenpick
  44: { lat: 24.4719, lng: 39.6098 }, // The Oberoi Madina
  7: { lat: 24.4683, lng: 39.6131 },  // Crowne Plaza Madinah
};

// Deterministic pseudo-random jitter around Masjid an-Nabawi (~ ±0.005°, roughly 550m)
function jitter(code: number): { lat: number; lng: number } {
  // Two independent hash streams from `code`
  const seed1 = Math.sin(code * 12.9898) * 43758.5453;
  const seed2 = Math.sin(code * 78.233) * 96321.7531;
  const dLat = ((seed1 - Math.floor(seed1)) - 0.5) * 0.01;  // ~±550m
  const dLng = ((seed2 - Math.floor(seed2)) - 0.5) * 0.01;
  return {
    lat: MASJID_NABAWI.lat + dLat,
    lng: MASJID_NABAWI.lng + dLng,
  };
}

export interface HotelLocation {
  lat: number;
  lng: number;
  isApproximate: boolean;
  distanceFromHaramKm: number;
  walkMinutes: number;
}

// Haversine distance (km)
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function getHotelLocation(hotel: MadinahHotel): HotelLocation {
  const verified = VERIFIED_COORDS[hotel.code];
  const coords = verified ?? jitter(hotel.code);
  const distanceFromHaramKm = haversineKm(MASJID_NABAWI, coords);
  // Average walking pace ~ 5 km/h => 12 min/km, round up to nearest minute
  const walkMinutes = Math.max(1, Math.round(distanceFromHaramKm * 12));
  return {
    lat: coords.lat,
    lng: coords.lng,
    isApproximate: !verified,
    distanceFromHaramKm,
    walkMinutes,
  };
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(2)} km`;
}

export { MADINAH_CENTER };
