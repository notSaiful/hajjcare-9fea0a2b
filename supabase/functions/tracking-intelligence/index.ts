import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRACKING_ANALYSIS_PROMPT = `You are a Tracking Intelligence Engine for HajjCare AI. Analyze pilgrim movement data and detect safety concerns.

Given location data, detect:
1. LOST: Pilgrim far from group, no movement toward group
2. FATIGUE: Prolonged stationary time in non-rest areas
3. PANIC: Rapid irregular movement patterns
4. STATIONARY: Unusually long time without movement (potential medical emergency)
5. CROWD_DENSITY: Multiple pilgrims in small area indicating dangerous crowding

Respond with JSON (no markdown):
{
  "alerts": [
    {
      "member_id": "<id>",
      "alert_type": "lost|fatigue|panic|stationary|crowd_density",
      "severity": "low|medium|high|critical",
      "reason": "<explanation>",
      "recommended_action": "<what to do>"
    }
  ],
  "group_status": "safe|attention|warning|danger",
  "summary": "<1-2 sentence overview>"
}`;

// Haversine distance in meters
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { group_id, action = "analyze" } = await req.json();

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "analyze" && group_id) {
      // AUTHORIZATION: caller must be a member of the group, or a coordinator/admin
      const { data: membership } = await serviceClient
        .from("group_members")
        .select("id")
        .eq("group_id", group_id)
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: callerRoles } = await serviceClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isStaff = callerRoles?.some((r: { role: string }) =>
        ["admin", "coordinator"].includes(r.role)
      );

      if (!membership && !isStaff) {
        return new Response(
          JSON.stringify({ error: "Forbidden: not a member of this group" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get all member locations for the group
      const { data: locations } = await serviceClient
        .from("member_locations")
        .select("*")
        .eq("group_id", group_id);

      if (!locations?.length) {
        return new Response(JSON.stringify({ message: "No location data", alerts: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Calculate group centroid
      const centroid = {
        lat: locations.reduce((s, l) => s + l.latitude, 0) / locations.length,
        lng: locations.reduce((s, l) => s + l.longitude, 0) / locations.length,
      };

      // Pre-compute distances and staleness
      const enrichedLocations = locations.map(loc => {
        const distFromGroup = haversine(loc.latitude, loc.longitude, centroid.lat, centroid.lng);
        const lastUpdate = new Date(loc.updated_at);
        const staleMinutes = (Date.now() - lastUpdate.getTime()) / 60000;
        return {
          member_id: loc.member_id,
          latitude: loc.latitude,
          longitude: loc.longitude,
          current_stage: loc.current_stage,
          pilgrim_status: loc.pilgrim_status,
          distance_from_group_meters: Math.round(distFromGroup),
          minutes_since_update: Math.round(staleMinutes),
        };
      });

      // Quick heuristic alerts (no AI needed for obvious cases)
      const quickAlerts = [];
      for (const loc of enrichedLocations) {
        if (loc.distance_from_group_meters > 2000) {
          quickAlerts.push({
            member_id: loc.member_id,
            alert_type: "lost",
            severity: loc.distance_from_group_meters > 5000 ? "critical" : "high",
            reason: `${loc.distance_from_group_meters}m from group`,
          });
        }
        if (loc.minutes_since_update > 60) {
          quickAlerts.push({
            member_id: loc.member_id,
            alert_type: "stationary",
            severity: loc.minutes_since_update > 180 ? "critical" : "high",
            reason: `No update for ${loc.minutes_since_update} minutes`,
          });
        }
      }

      // Use AI for complex pattern analysis
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      let aiAlerts: any[] = [];

      if (LOVABLE_API_KEY && enrichedLocations.length > 1) {
        try {
          const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-lite",
              messages: [
                { role: "system", content: TRACKING_ANALYSIS_PROMPT },
                { role: "user", content: JSON.stringify({ members: enrichedLocations, group_centroid: centroid }) },
              ],
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const rawContent = data.choices?.[0]?.message?.content || "";
            try {
              const cleaned = rawContent.replace(/```json\n?|\n?```/g, "").trim();
              const parsed = JSON.parse(cleaned);
              aiAlerts = parsed.alerts || [];
            } catch { /* use heuristic only */ }
          }
        } catch (e) {
          console.error("AI tracking analysis failed:", e);
        }
      }

      // Merge alerts (dedup by member_id + type)
      const allAlerts = [...quickAlerts, ...aiAlerts];
      const uniqueAlerts = new Map();
      for (const alert of allAlerts) {
        const key = `${alert.member_id}-${alert.alert_type}`;
        if (!uniqueAlerts.has(key) || alert.severity === "critical") {
          uniqueAlerts.set(key, alert);
        }
      }

      const finalAlerts = Array.from(uniqueAlerts.values());

      // Store alerts in database
      if (finalAlerts.length > 0) {
        const alertRows = finalAlerts.map(a => ({
          member_id: a.member_id,
          group_id,
          alert_type: a.alert_type,
          severity: a.severity,
          details: { reason: a.reason, recommended_action: a.recommended_action },
          status: "active",
        }));

        await serviceClient.from("tracking_alerts").insert(alertRows);
      }

      return new Response(JSON.stringify({
        group_id,
        members: enrichedLocations.length,
        alerts: finalAlerts,
        group_centroid: centroid,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action: get active alerts for coordinator
    if (action === "get_alerts") {
      const { data: roles } = await serviceClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isCoordinator = roles?.some(r => ["admin", "coordinator"].includes(r.role));
      
      let query = serviceClient
        .from("tracking_alerts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!isCoordinator) {
        query = query.eq("user_id", user.id);
      }

      const { data: alerts } = await query.limit(50);

      return new Response(JSON.stringify({ alerts: alerts || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action: resolve alert
    if (action === "resolve" && req.method === "POST") {
      const { alert_id } = await req.json();

      // AUTHORIZATION: only staff (admin/coordinator/medical_staff) or the alert owner may resolve
      const { data: resolverRoles } = await serviceClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const isStaff = resolverRoles?.some((r: { role: string }) =>
        ["admin", "coordinator", "medical_staff"].includes(r.role)
      );

      let canResolve = isStaff === true;
      if (!canResolve) {
        const { data: alertRow } = await serviceClient
          .from("tracking_alerts")
          .select("user_id, group_id")
          .eq("id", alert_id)
          .maybeSingle();

        if (alertRow) {
          if (alertRow.user_id && alertRow.user_id === user.id) {
            canResolve = true;
          } else if (alertRow.group_id) {
            const { data: gm } = await serviceClient
              .from("group_members")
              .select("id")
              .eq("group_id", alertRow.group_id)
              .eq("user_id", user.id)
              .maybeSingle();
            if (gm) canResolve = true;
          }
        }
      }

      if (!canResolve) {
        return new Response(
          JSON.stringify({ error: "Forbidden: only staff or the alert owner may resolve" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await serviceClient
        .from("tracking_alerts")
        .update({ status: "resolved", resolved_at: new Date().toISOString(), resolved_by: user.id })
        .eq("id", alert_id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Tracking intelligence error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
