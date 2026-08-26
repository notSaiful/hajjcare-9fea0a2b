import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

/**
 * Hook for medical staff / coordinators to broadcast their live location
 * so the allocation engine can find nearest responders.
 */
export function useResponderLocation() {
  const { user } = useAuth();
  const { isMedicalStaff, isCoordinator, isAdmin } = useUserRole();
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isResponder = isMedicalStaff || isCoordinator || isAdmin;

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(async (zone?: string) => {
    if (!user || !isResponder) return;
    if (!navigator.geolocation) return;

    // Get user profile name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle();

    const role = isAdmin ? "admin" : isCoordinator ? "coordinator" : "medical_staff";

    const updateLocation = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;

      await supabase.from("responder_locations").upsert(
        {
          user_id: user.id,
          full_name: profile?.full_name || "Responder",
          role,
          zone: zone || null,
          latitude,
          longitude,
          is_available: true,
          last_heartbeat: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    };

    // Initial position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocation(pos);
        setIsTracking(true);
      },
      (err) => console.error("Responder GPS error:", err),
      { enableHighAccuracy: true }
    );

    // Watch for movement
    watchIdRef.current = navigator.geolocation.watchPosition(
      updateLocation,
      (err) => console.error("Responder watch error:", err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    // Heartbeat every 30 seconds
    heartbeatRef.current = setInterval(async () => {
      await supabase
        .from("responder_locations")
        .update({ last_heartbeat: new Date().toISOString() })
        .eq("user_id", user.id);
    }, 30000);
  }, [user, isResponder, isAdmin, isCoordinator]);

  const setAvailability = useCallback(async (available: boolean) => {
    if (!user) return;
    await supabase
      .from("responder_locations")
      .update({ is_available: available })
      .eq("user_id", user.id);
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTracking();
  }, [stopTracking]);

  return {
    isResponder,
    isTracking,
    startTracking,
    stopTracking,
    setAvailability,
  };
}
