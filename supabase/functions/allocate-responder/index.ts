import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Haversine distance in meters
function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface AllocationRequest {
  ticket_id: string;
  lat: number;
  lng: number;
  zone: string;
  escalation_level?: number;
  max_radius_meters?: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await userClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: AllocationRequest = await req.json();
    const { ticket_id, lat, lng, zone, escalation_level = 1, max_radius_meters } = body;

    if (!ticket_id || lat == null || lng == null) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine search radius based on escalation level
    const radiusByLevel: Record<number, number> = {
      1: max_radius_meters || 2000,   // 2km - nearest field medic
      2: 5000,                         // 5km - zone coordinator
      3: 15000,                        // 15km - all available responders
    };
    const searchRadius = radiusByLevel[escalation_level] || 15000;

    // Fetch all available responders
    const { data: responders, error: fetchError } = await supabase
      .from("responder_locations")
      .select("*")
      .eq("is_available", true);

    if (fetchError) {
      console.error("Fetch responders error:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch responders" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!responders || responders.length === 0) {
      return new Response(JSON.stringify({
        allocated: false,
        reason: "no_responders_available",
        escalation_level,
        searched_radius_meters: searchRadius,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate distance for each responder and filter by radius
    const candidates = responders
      .map((r) => ({
        ...r,
        distance: haversineDistance(lat, lng, r.latitude, r.longitude),
      }))
      .filter((r) => r.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    // Prioritize: same zone first, then by distance
    const zoneCandidates = candidates.filter((r) => r.zone === zone);
    const sortedCandidates = [...zoneCandidates, ...candidates.filter((r) => r.zone !== zone)];
    // Deduplicate
    const seen = new Set<string>();
    const uniqueCandidates = sortedCandidates.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });

    if (uniqueCandidates.length === 0) {
      return new Response(JSON.stringify({
        allocated: false,
        reason: "no_responders_in_radius",
        escalation_level,
        searched_radius_meters: searchRadius,
        total_available: responders.length,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nearest = uniqueCandidates[0];

    // Check if ticket already has an active assignment
    const { data: existing } = await supabase
      .from("emergency_assignments")
      .select("id")
      .eq("ticket_id", ticket_id)
      .not("status", "in", '("escalated","resolved")')
      .maybeSingle();

    if (existing) {
      // Update existing assignment's escalation level
      await supabase
        .from("emergency_assignments")
        .update({ 
          status: "escalated",
          notes: `Escalated to level ${escalation_level}`,
        })
        .eq("id", existing.id);
    }

    // Create new assignment
    const { data: assignment, error: insertError } = await supabase
      .from("emergency_assignments")
      .insert({
        ticket_id,
        responder_id: nearest.id,
        distance_meters: Math.round(nearest.distance),
        escalation_level,
        status: "assigned",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert assignment error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create assignment" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark responder as unavailable
    await supabase
      .from("responder_locations")
      .update({ is_available: false })
      .eq("id", nearest.id);

    // Trigger notification to responder via notification-cascade
    try {
      await supabase.functions.invoke("notification-cascade", {
        body: {
          user_id: nearest.user_id,
          alert_type: "emergency_assignment",
          severity: "critical",
          title: "🚨 Emergency Assignment",
          body: `You've been assigned to an emergency ${Math.round(nearest.distance)}m away. Respond immediately.`,
          data: {
            ticket_id,
            assignment_id: assignment.id,
            pilgrim_lat: lat,
            pilgrim_lng: lng,
            zone,
          },
        },
      });
    } catch (notifyError) {
      console.error("Notification error (non-blocking):", notifyError);
    }

    return new Response(JSON.stringify({
      allocated: true,
      assignment_id: assignment.id,
      responder: {
        id: nearest.id,
        name: nearest.full_name,
        role: nearest.role,
        distance_meters: Math.round(nearest.distance),
        zone: nearest.zone,
      },
      escalation_level,
      searched_radius_meters: searchRadius,
      candidates_found: uniqueCandidates.length,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Allocate responder error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
