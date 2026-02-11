import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

interface GeofenceZone {
  id: string;
  name: string;
  name_ar: string | null;
  center_lat: number;
  center_lng: number;
  radius_meters: number;
  zone_type: string;
  max_stationary_minutes: number | null;
}

interface ViolationResult {
  zone_id: string;
  zone_name: string;
  zone_name_ar: string | null;
  violation_type: "exit" | "stationary";
  distance_from_center: number;
  radius_meters: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { latitude, longitude, group_id, member_id, last_movement_at } = body;

    if (!latitude || !longitude || !group_id) {
      return new Response(
        JSON.stringify({ error: "Missing latitude, longitude, or group_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all active geofence zones
    const { data: zones, error: zonesError } = await supabase
      .from("geofence_zones")
      .select("*")
      .eq("is_active", true);

    if (zonesError) {
      console.error("Error fetching zones:", zonesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch geofence zones" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geofenceZones = (zones || []) as GeofenceZone[];
    const violations: ViolationResult[] = [];

    // Check if pilgrim is inside ANY hajj_site zone
    let insideAnyHajjSite = false;
    let insideAnyCityZone = false;

    for (const zone of geofenceZones) {
      const distance = haversineMeters(latitude, longitude, zone.center_lat, zone.center_lng);

      if (distance <= zone.radius_meters) {
        if (zone.zone_type === "hajj_site") insideAnyHajjSite = true;
        if (zone.zone_type === "city_zone") insideAnyCityZone = true;
      }

      // Check stationary violation: if pilgrim hasn't moved and max_stationary_minutes is set
      if (
        zone.max_stationary_minutes &&
        last_movement_at &&
        distance <= zone.radius_meters
      ) {
        const minutesSinceMovement =
          (Date.now() - new Date(last_movement_at).getTime()) / 60000;

        if (minutesSinceMovement > zone.max_stationary_minutes) {
          violations.push({
            zone_id: zone.id,
            zone_name: zone.name,
            zone_name_ar: zone.name_ar,
            violation_type: "stationary",
            distance_from_center: Math.round(distance),
            radius_meters: zone.radius_meters,
          });
        }
      }
    }

    // If pilgrim is outside ALL city zones → exit violation
    if (!insideAnyCityZone && geofenceZones.some((z) => z.zone_type === "city_zone")) {
      // Find nearest city zone for the alert
      const nearestCity = geofenceZones
        .filter((z) => z.zone_type === "city_zone")
        .map((z) => ({
          ...z,
          distance: haversineMeters(latitude, longitude, z.center_lat, z.center_lng),
        }))
        .sort((a, b) => a.distance - b.distance)[0];

      if (nearestCity) {
        violations.push({
          zone_id: nearestCity.id,
          zone_name: nearestCity.name,
          zone_name_ar: nearestCity.name_ar,
          violation_type: "exit",
          distance_from_center: Math.round(nearestCity.distance),
          radius_meters: nearestCity.radius_meters,
        });
      }
    }

    // Create tracking_alerts for each violation
    const alertsCreated = [];
    for (const v of violations) {
      // Check if there's already an active alert for this zone+member to avoid duplicates
      const { data: existing } = await supabase
        .from("tracking_alerts")
        .select("id")
        .eq("member_id", member_id || user.id)
        .eq("geofence_zone_id", v.zone_id)
        .eq("status", "active")
        .limit(1);

      if (existing && existing.length > 0) {
        continue; // Skip duplicate
      }

      const { data: alert, error: alertError } = await supabase
        .from("tracking_alerts")
        .insert({
          user_id: user.id,
          group_id,
          member_id: member_id || user.id,
          alert_type: `geofence_${v.violation_type}`,
          severity: v.violation_type === "exit" ? "high" : "medium",
          status: "active",
          location_lat: latitude,
          location_lng: longitude,
          geofence_zone_id: v.zone_id,
          details: {
            zone_name: v.zone_name,
            zone_name_ar: v.zone_name_ar,
            violation_type: v.violation_type,
            distance_from_center: v.distance_from_center,
            radius_meters: v.radius_meters,
          },
        })
        .select()
        .single();

      if (alertError) {
        console.error("Error creating alert:", alertError);
      } else {
        alertsCreated.push(alert);
      }
    }

    // If there were exit violations, trigger notification cascade
    if (alertsCreated.length > 0) {
      try {
        await fetch(`${supabaseUrl}/functions/v1/notification-cascade`, {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "geofence_alert",
            group_id,
            alerts: alertsCreated.map((a) => ({
              id: a.id,
              alert_type: a.alert_type,
              severity: a.severity,
              details: a.details,
            })),
          }),
        });
      } catch (notifyError) {
        console.error("Notification cascade error:", notifyError);
      }
    }

    return new Response(
      JSON.stringify({
        inside_hajj_site: insideAnyHajjSite,
        inside_city_zone: insideAnyCityZone,
        violations: violations.length,
        alerts_created: alertsCreated.length,
        violation_details: violations,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Geofence monitor error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
