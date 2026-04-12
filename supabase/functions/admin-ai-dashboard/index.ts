import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DECISION_SUPPORT_PROMPT = `You are an Admin Decision Support AI for HajjCare AI. Analyze the provided operational data and produce actionable insights for national-level Hajj management.

Analyze:
1. Emergency trends and prioritization
2. Operator risk rankings
3. Regional hotspot identification
4. Resource allocation recommendations

Respond with JSON (no markdown):
{
  "risk_summary": "<2-3 sentence overview>",
  "emergency_priority": [{"zone": "<zone>", "urgency": "low|medium|high|critical", "reason": "<why>"}],
  "operator_risks": [{"name": "<name>", "risk_level": "low|medium|high", "action": "<recommended>"}],
  "recommendations": ["<actionable recommendation 1>", "<recommendation 2>"],
  "metrics": {
    "total_pilgrims_tracked": <number>,
    "active_emergencies": <number>,
    "fraud_alerts": <number>,
    "health_tickets_open": <number>
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

    // Verify admin role
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: roles } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (!roles?.some(r => r.role === "admin")) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action = "dashboard" } = await req.json();

    // Gather all data in parallel
    const [
      trackingAlertsResult,
      healthTicketsResult,
      fraudScoresResult,
      fraudAlertsResult,
      memberLocationsResult,
      intentLogsResult,
    ] = await Promise.all([
      serviceClient.from("tracking_alerts").select("*").eq("status", "active").limit(100),
      serviceClient.from("health_tickets").select("*").in("status", ["submitted", "ai_triaged", "coordinator_reviewing"]).limit(100),
      serviceClient.from("fraud_scores").select("*, verified_operators(name, company_name)").gt("fraud_probability", 0.3).order("fraud_probability", { ascending: false }).limit(20),
      serviceClient.from("fraud_alerts").select("*").eq("is_active", true).limit(50),
      serviceClient.from("member_locations").select("*").limit(1000),
      serviceClient.from("ai_intent_logs").select("routed_module, detected_intent, created_at").gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).limit(500),
    ]);

    const dashboardData = {
      tracking_alerts: {
        total: trackingAlertsResult.data?.length || 0,
        critical: trackingAlertsResult.data?.filter(a => a.severity === "critical").length || 0,
        by_type: groupBy(trackingAlertsResult.data || [], "alert_type"),
      },
      health_tickets: {
        total: healthTicketsResult.data?.length || 0,
        critical: healthTicketsResult.data?.filter(t => t.ai_urgency_level === "critical").length || 0,
        by_zone: groupBy(healthTicketsResult.data || [], "zone"),
      },
      fraud: {
        high_risk_operators: fraudScoresResult.data?.length || 0,
        active_alerts: fraudAlertsResult.data?.length || 0,
        top_risks: fraudScoresResult.data?.slice(0, 5).map(f => ({
          operator: (f as any).verified_operators?.name || "Unknown",
          company: (f as any).verified_operators?.company_name || "Unknown",
          probability: f.fraud_probability,
          auto_blacklist: f.auto_blacklist_suggested,
        })) || [],
      },
      tracking: {
        pilgrims_tracked: memberLocationsResult.data?.length || 0,
        location_heatmap: memberLocationsResult.data?.map(l => ({
          lat: l.latitude,
          lng: l.longitude,
          stage: l.current_stage,
          status: l.pilgrim_status,
        })) || [],
      },
      ai_usage: {
        total_queries_24h: intentLogsResult.data?.length || 0,
        by_module: groupBy(intentLogsResult.data || [], "routed_module"),
      },
    };

    if (action === "raw") {
      return new Response(JSON.stringify(dashboardData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // AI-powered analysis
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: DECISION_SUPPORT_PROMPT },
          { role: "user", content: JSON.stringify(dashboardData) },
        ],
      }),
    });

    if (!response.ok) {
      // Fallback to raw data if AI fails
      return new Response(JSON.stringify({ ...dashboardData, ai_analysis: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";

    let aiAnalysis;
    try {
      const cleaned = rawContent.replace(/```json\n?|\n?```/g, "").trim();
      aiAnalysis = JSON.parse(cleaned);
    } catch {
      aiAnalysis = null;
    }

    return new Response(JSON.stringify({
      ...dashboardData,
      ai_analysis: aiAnalysis,
      generated_at: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin decision support error:", error);
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
