import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COMMAND_PROMPT = `You are the National Hajj Command Center AI. Analyze real-time operational data and produce tactical intelligence.

Respond with JSON only (no markdown):
{
  "situation_level": "green|yellow|orange|red",
  "executive_summary": "<2-3 sentences>",
  "zone_risks": [{"zone": "<name>", "risk_level": "low|medium|high|critical", "density_pct": <0-100>, "stampede_probability": <0-1>, "factors": ["<factor>"]}],
  "emergency_queue": [{"id": "<ticket_id>", "urgency": "low|medium|high|critical", "zone": "<zone>", "description": "<brief>", "wait_minutes": <number>}],
  "volunteer_allocation": [{"zone": "<zone>", "current": <number>, "needed": <number>, "gap": <number>, "priority": "low|medium|high"}],
  "medical_predictions": [{"risk": "<description>", "probability": "low|medium|high", "zone": "<zone>", "preventive_action": "<action>"}],
  "crowd_analysis": {"total_tracked": <number>, "peak_zones": ["<zone>"], "flow_direction": "<description>", "bottleneck_zones": ["<zone>"]},
  "auto_actions": ["<action taken>"]
}`;

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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const svc = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify admin role
    const { data: roles } = await svc.from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.some(r => r.role === "admin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action = "full" } = await req.json().catch(() => ({ action: "full" }));

    // Gather all data in parallel
    const [
      locationsRes,
      alertsRes,
      healthRes,
      volunteersRes,
      assignmentsRes,
      geofenceRes,
    ] = await Promise.all([
      svc.from("member_locations").select("*").limit(2000),
      svc.from("tracking_alerts").select("*").eq("status", "active").limit(200),
      svc.from("health_tickets").select("*").in("status", ["submitted", "ai_triaged", "coordinator_reviewing"]).limit(200),
      svc.from("responder_locations").select("*").eq("is_available", true).limit(500),
      svc.from("emergency_assignments").select("*").in("status", ["assigned", "acknowledged"]).limit(100),
      svc.from("geofence_zones").select("*").eq("is_active", true),
    ]);

    const locations = locationsRes.data || [];
    const alerts = alertsRes.data || [];
    const healthTickets = healthRes.data || [];
    const volunteers = volunteersRes.data || [];
    const assignments = assignmentsRes.data || [];
    const geofenceZones = geofenceRes.data || [];

    // Compute zone densities
    const zoneDensity: Record<string, number> = {};
    const zoneStatuses: Record<string, Record<string, number>> = {};
    locations.forEach(l => {
      const zone = l.current_stage || "unknown";
      zoneDensity[zone] = (zoneDensity[zone] || 0) + 1;
      if (!zoneStatuses[zone]) zoneStatuses[zone] = {};
      const st = l.pilgrim_status || "normal";
      zoneStatuses[zone][st] = (zoneStatuses[zone][st] || 0) + 1;
    });

    // Emergency queue
    const emergencyQueue = healthTickets
      .sort((a, b) => {
        const urgencyOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return (urgencyOrder[a.ai_urgency_level || "low"] || 3) - (urgencyOrder[b.ai_urgency_level || "low"] || 3);
      })
      .slice(0, 20)
      .map(t => ({
        id: t.id,
        urgency: t.ai_urgency_level || "low",
        zone: t.zone || "unknown",
        description: (t.description || "").slice(0, 80),
        wait_minutes: Math.round((Date.now() - new Date(t.created_at || Date.now()).getTime()) / 60000),
        status: t.status,
      }));

    // Volunteer allocation by zone
    const volunteerByZone: Record<string, number> = {};
    volunteers.forEach(v => {
      const zone = (v as any).current_zone || "unassigned";
      volunteerByZone[zone] = (volunteerByZone[zone] || 0) + 1;
    });

    // Alert breakdown
    const alertsByType: Record<string, number> = {};
    const alertsBySeverity: Record<string, number> = {};
    alerts.forEach(a => {
      alertsByType[a.alert_type || "unknown"] = (alertsByType[a.alert_type || "unknown"] || 0) + 1;
      alertsBySeverity[a.severity || "low"] = (alertsBySeverity[a.severity || "low"] || 0) + 1;
    });

    const rawData = {
      density: {
        total_tracked: locations.length,
        by_zone: zoneDensity,
        zone_statuses: zoneStatuses,
        emergency_count: locations.filter(l => l.pilgrim_status === "emergency").length,
      },
      alerts: {
        total: alerts.length,
        critical: alerts.filter(a => a.severity === "critical").length,
        by_type: alertsByType,
        by_severity: alertsBySeverity,
      },
      health: {
        open_tickets: healthTickets.length,
        critical: healthTickets.filter(t => t.ai_urgency_level === "critical").length,
        queue: emergencyQueue,
      },
      volunteers: {
        total_available: volunteers.length,
        active_assignments: assignments.length,
        by_zone: volunteerByZone,
      },
      geofence_zones: geofenceZones.map(z => ({
        name: z.name,
        type: z.zone_type,
        center: { lat: z.center_lat, lng: z.center_lng },
        radius: z.radius_meters,
      })),
      generated_at: new Date().toISOString(),
    };

    if (action === "raw") {
      return new Response(JSON.stringify(rawData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // AI analysis
    const LLM_API_KEY = Deno.env.get("LLM_API_KEY");
    const LLM_BASE_URL = (Deno.env.get("LLM_BASE_URL") || "https://openrouter.ai/api/v1").replace(/\/$/, "");
    if (!LLM_API_KEY) {
      return new Response(JSON.stringify({ ...rawData, ai_analysis: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: COMMAND_PROMPT },
          { role: "user", content: JSON.stringify(rawData) },
        ],
      }),
    });

    let aiAnalysis = null;
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const raw = aiData.choices?.[0]?.message?.content || "";
      try {
        aiAnalysis = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
      } catch { /* fallback */ }
    }

    return new Response(JSON.stringify({ ...rawData, ai_analysis: aiAnalysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("National command error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
