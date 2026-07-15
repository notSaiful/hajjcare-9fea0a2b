import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRAIN_SYSTEM_PROMPT = `You are the Central AI Brain for HajjCare — a national-level Hajj management intelligence system.

Given operational data from multiple modules (tracking, health, fraud, notifications), produce a unified situational assessment.

Respond with JSON (no markdown):
{
  "situation_level": "green|yellow|orange|red",
  "executive_summary": "<2-3 sentence overview for decision-makers>",
  "active_incidents": [
    {
      "type": "tracking|health|fraud|crowd",
      "severity": "low|medium|high|critical",
      "description": "<what's happening>",
      "affected_count": <number>,
      "recommended_action": "<what to do>"
    }
  ],
  "auto_actions_taken": ["<action already executed by the brain>"],
  "predictions": [
    {
      "event": "<what might happen>",
      "probability": "low|medium|high",
      "timeframe": "<when>",
      "preventive_action": "<what to do now>"
    }
  ],
  "resource_allocation": {
    "medical_teams_needed": <number>,
    "priority_zones": ["<zone names>"],
    "notification_queue": <number>
  }
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

    const { action = "assess" } = await req.json();

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Role check — only staff can access aggregated intelligence
    const { data: roles } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const isStaff = roles?.some((r: { role: string }) =>
      ["admin", "coordinator", "medical_staff"].includes(r.role)
    );
    if (!isStaff) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Module 1: Gather all intelligence in parallel ──
    const [
      trackingAlertsRes,
      healthTicketsRes,
      fraudAlertsRes,
      memberLocationsRes,
      activeGroupsRes,
    ] = await Promise.all([
      serviceClient.from("tracking_alerts").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(100),
      serviceClient.from("health_tickets").select("*").in("status", ["submitted", "ai_triaged", "coordinator_reviewing"]).limit(100),
      serviceClient.from("fraud_alerts").select("*").eq("is_active", true).limit(50),
      serviceClient.from("member_locations").select("*").limit(1000),
      serviceClient.from("family_groups").select("id").limit(500),
    ]);

    const trackingAlerts = trackingAlertsRes.data || [];
    const healthTickets = healthTicketsRes.data || [];
    const fraudAlerts = fraudAlertsRes.data || [];
    const memberLocations = memberLocationsRes.data || [];
    const activeGroups = activeGroupsRes.data || [];

    // ── Module 2: Auto-actions (rules engine) ──
    const autoActions: string[] = [];

    // Auto-escalate critical tracking alerts older than 10 min
    const criticalStaleAlerts = trackingAlerts.filter(a => {
      if (a.severity !== "critical") return false;
      const age = Date.now() - new Date(a.created_at).getTime();
      return age > 10 * 60 * 1000; // 10 min
    });

    if (criticalStaleAlerts.length > 0) {
      autoActions.push(`${criticalStaleAlerts.length} critical tracking alert(s) older than 10min flagged for escalation`);
    }

    // Auto-flag health tickets that are critical but not yet alerted
    const unalertedCritical = healthTickets.filter(
      t => t.ai_urgency_level === "critical" && !t.alert_sent_at
    );
    if (unalertedCritical.length > 0) {
      autoActions.push(`${unalertedCritical.length} critical health ticket(s) pending WhatsApp alert`);
    }

    // ── Module 3: Compute operational metrics ──
    const stageDistribution: Record<string, number> = {};
    const statusDistribution: Record<string, number> = {};
    for (const loc of memberLocations) {
      const stage = loc.current_stage || "unknown";
      const status = loc.pilgrim_status || "normal";
      stageDistribution[stage] = (stageDistribution[stage] || 0) + 1;
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    }

    const operationalData = {
      tracking: {
        total_alerts: trackingAlerts.length,
        critical: trackingAlerts.filter(a => a.severity === "critical").length,
        high: trackingAlerts.filter(a => a.severity === "high").length,
        by_type: groupBy(trackingAlerts, "alert_type"),
      },
      health: {
        open_tickets: healthTickets.length,
        critical: healthTickets.filter(t => t.ai_urgency_level === "critical").length,
        by_zone: groupBy(healthTickets, "zone"),
      },
      fraud: {
        active_alerts: fraudAlerts.length,
        high_severity: fraudAlerts.filter(a => a.severity === "high").length,
      },
      pilgrims: {
        total_tracked: memberLocations.length,
        active_groups: activeGroups.length,
        stage_distribution: stageDistribution,
        status_distribution: statusDistribution,
        emergency_count: statusDistribution["emergency"] || 0,
      },
      auto_actions: autoActions,
    };

    // ── Action: raw data only ──
    if (action === "raw") {
      return new Response(JSON.stringify(operationalData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Module 4: AI situational assessment ──
    const LLM_API_KEY = Deno.env.get("LLM_API_KEY");
    const LLM_BASE_URL = (Deno.env.get("LLM_BASE_URL") || "https://openrouter.ai/api/v1").replace(/\/$/, "");
    if (!LLM_API_KEY) {
      return new Response(JSON.stringify({
        ...operationalData,
        ai_assessment: null,
        error: "AI not configured",
      }), {
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
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: BRAIN_SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(operationalData) },
        ],
      }),
    });

    let aiAssessment = null;
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const rawContent = aiData.choices?.[0]?.message?.content || "";
      try {
        const cleaned = rawContent.replace(/```json\n?|\n?```/g, "").trim();
        aiAssessment = JSON.parse(cleaned);
      } catch {
        aiAssessment = { raw: rawContent };
      }
    } else if (aiResponse.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (aiResponse.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      ...operationalData,
      ai_assessment: aiAssessment,
      generated_at: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Central AI Brain error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function groupBy(arr: any[], key: string): Record<string, number> {
  return arr.reduce((acc, item) => {
    const val = item[key] || "unknown";
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
