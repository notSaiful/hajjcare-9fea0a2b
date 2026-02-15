import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
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

const rankWeight: Record<string, number> = {
  trainee: 0, field_responder: 2, senior_responder: 3, zone_commander: 4, war_room_commander: 5,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await userClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: AllocationRequest = await req.json();
    const { ticket_id, lat, lng, zone, escalation_level = 1, max_radius_meters } = body;

    if (!ticket_id || lat == null || lng == null) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const radiusByLevel: Record<number, number> = { 1: max_radius_meters || 2000, 2: 5000, 3: 15000 };
    const searchRadius = radiusByLevel[escalation_level] || 15000;

    // Fetch responders + profiles in parallel
    const [{ data: responders, error: fetchError }, { data: profiles }] = await Promise.all([
      supabase.from("responder_locations").select("*").eq("is_available", true),
      supabase.from("responder_profiles").select("user_id, rank, is_field_ready, performance_score, specialty"),
    ]);

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch responders" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!responders?.length) {
      return new Response(JSON.stringify({
        allocated: false, reason: "no_responders_available", escalation_level, searched_radius_meters: searchRadius,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

    // Score candidates: distance + rank + performance + field readiness
    let candidates = responders
      .map((r: any) => {
        const prof = profileMap.get(r.user_id);
        const distance = haversineDistance(lat, lng, r.latitude, r.longitude);
        const rw = prof ? (rankWeight[prof.rank] || 0) : 0;
        const perfBonus = prof?.performance_score || 0;
        const readyBonus = prof?.is_field_ready ? 10 : 0;
        const zoneBonus = r.zone === zone ? 50 : 0;
        const distScore = (distance / searchRadius) * 100;
        const compositeScore = distScore - (rw * 5) - perfBonus - readyBonus - zoneBonus;
        return { ...r, distance, compositeScore, rank: prof?.rank || "trainee", isFieldReady: prof?.is_field_ready };
      })
      .filter((r: any) => r.distance <= searchRadius)
      .sort((a: any, b: any) => a.compositeScore - b.compositeScore);

    // Filter trainees for escalation 2+
    if (escalation_level >= 2) {
      candidates = candidates.filter((r: any) => r.rank !== "trainee");
    }

    if (!candidates.length) {
      return new Response(JSON.stringify({
        allocated: false, reason: "no_responders_in_radius", escalation_level,
        searched_radius_meters: searchRadius, total_available: responders.length,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const nearest = candidates[0];

    // Escalate existing assignment if any
    const { data: existing } = await supabase
      .from("emergency_assignments")
      .select("id")
      .eq("ticket_id", ticket_id)
      .not("status", "in", '("escalated","resolved")')
      .maybeSingle();

    if (existing) {
      await supabase.from("emergency_assignments")
        .update({ status: "escalated", notes: `Escalated to level ${escalation_level}` })
        .eq("id", existing.id);
    }

    // Create assignment
    const { data: assignment, error: insertError } = await supabase
      .from("emergency_assignments")
      .insert({
        ticket_id, responder_id: nearest.id,
        distance_meters: Math.round(nearest.distance),
        escalation_level, status: "assigned",
      })
      .select().single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create assignment" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark unavailable + log deployment
    await Promise.all([
      supabase.from("responder_locations").update({ is_available: false }).eq("id", nearest.id),
      supabase.from("deployment_logs").insert({
        user_id: nearest.user_id, assignment_id: assignment.id,
        deployment_type: "emergency", zone, started_at: new Date().toISOString(),
      }),
      supabase.from("hierarchy_audit_log").insert({
        user_id: nearest.user_id, performed_by: user.id, action: "emergency_deployment",
        new_value: `assigned_to_ticket_${ticket_id}`,
        details: { ticket_id, distance: Math.round(nearest.distance), rank: nearest.rank, escalation_level },
      }),
    ]);

    // Notify responder (non-blocking)
    supabase.functions.invoke("notification-cascade", {
      body: {
        user_id: nearest.user_id, alert_type: "emergency_assignment", severity: "critical",
        title: "🚨 Emergency Assignment",
        body: `Emergency ${Math.round(nearest.distance)}m away. Respond immediately.`,
        data: { ticket_id, assignment_id: assignment.id, pilgrim_lat: lat, pilgrim_lng: lng, zone },
      },
    }).catch((e: any) => console.error("Notification error:", e));

    return new Response(JSON.stringify({
      allocated: true, assignment_id: assignment.id,
      responder: {
        id: nearest.id, name: nearest.full_name, role: nearest.role, rank: nearest.rank,
        distance_meters: Math.round(nearest.distance), zone: nearest.zone,
      },
      escalation_level, searched_radius_meters: searchRadius, candidates_found: candidates.length,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    console.error("Allocate error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
