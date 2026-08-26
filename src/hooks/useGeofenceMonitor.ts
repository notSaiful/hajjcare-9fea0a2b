import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface GeofenceZone {
  id: string;
  name: string;
  name_ar: string | null;
  center_lat: number;
  center_lng: number;
  radius_meters: number;
  zone_type: string;
  max_stationary_minutes: number | null;
}

export interface GeofenceStatus {
  insideHajjSite: boolean;
  insideCityZone: boolean;
  violations: number;
  lastChecked: Date | null;
}

const CHECK_INTERVAL_MS = 60_000; // Check every 60 seconds max

export function useGeofenceMonitor() {
  const { user, session } = useAuth();
  const [zones, setZones] = useState<GeofenceZone[]>([]);
  const [status, setStatus] = useState<GeofenceStatus>({
    insideHajjSite: true,
    insideCityZone: true,
    violations: 0,
    lastChecked: null,
  });
  const lastCheckRef = useRef<number>(0);
  const lastMovementRef = useRef<string | null>(null);

  const loadZones = useCallback(async () => {
    const { data, error } = await supabase
      .from("geofence_zones")
      .select("*")
      .eq("is_active", true);

    if (!error && data) {
      setZones(data as GeofenceZone[]);
    }
    return data as GeofenceZone[] | null;
  }, []);

  const checkGeofence = useCallback(
    async (lat: number, lng: number, groupId: string, memberId?: string) => {
      if (!user || !session) return null;

      // Throttle checks
      const now = Date.now();
      if (now - lastCheckRef.current < CHECK_INTERVAL_MS) return null;
      lastCheckRef.current = now;

      try {
        const { data, error } = await supabase.functions.invoke("geofence-monitor", {
          body: {
            latitude: lat,
            longitude: lng,
            group_id: groupId,
            member_id: memberId,
            last_movement_at: lastMovementRef.current,
          },
        });

        if (error) {
          console.error("[GeofenceMonitor] Error:", error);
          return null;
        }

        setStatus({
          insideHajjSite: data.inside_hajj_site,
          insideCityZone: data.inside_city_zone,
          violations: data.violations,
          lastChecked: new Date(),
        });

        return data;
      } catch (err) {
        console.error("[GeofenceMonitor] Check failed:", err);
        return null;
      }
    },
    [user, session]
  );

  const recordMovement = useCallback(() => {
    lastMovementRef.current = new Date().toISOString();
  }, []);

  // Haversine for client-side proximity check (used by map overlays)
  const getDistanceToZone = useCallback(
    (lat: number, lng: number, zone: GeofenceZone): number => {
      const R = 6_371_000;
      const dLat = ((zone.center_lat - lat) * Math.PI) / 180;
      const dLon = ((zone.center_lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((zone.center_lat * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },
    []
  );

  return {
    zones,
    status,
    loadZones,
    checkGeofence,
    recordMovement,
    getDistanceToZone,
  };
}
