import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FRAUD_ANALYSIS_PROMPT = `You are a Fraud Intelligence Engine for HajjCare AI. Analyze the provided operator data and produce a fraud risk assessment.

You will receive:
- Operator profile (name, company, license, verification status)
- Review data (ratings, fraud reports, review texts)
- Complaint patterns

Produce a JSON response (no markdown):
{
  "fraud_probability": <0.0-1.0>,
  "risk_factors": [{"factor": "<name>", "severity": "low|medium|high", "description": "<detail>"}],
  "recommendation": "<text>",
  "auto_blacklist_suggested": <boolean>,
  "summary": "<1-2 sentence summary>"
}

Risk indicators:
- Multiple fraud reports = high risk
- Very low ratings with many reviews = moderate risk
- No license number = moderate risk
- Pattern of similar complaints = high risk
- Recently created with no verification = moderate risk
- Blacklist reason already exists = critical`;

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

    // Check admin/coordinator role
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: roles } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isAdmin = roles?.some(r => ["admin", "coordinator"].includes(r.role));
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action = "analyze_all", operator_id } = await req.json();

    if (action === "analyze_single" && operator_id) {
      const result = await analyzeOperator(serviceClient, operator_id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Analyze all operators
    const { data: operators } = await serviceClient
      .from("verified_operators")
      .select("*")
      .eq("is_blacklisted", false);

    if (!operators?.length) {
      return new Response(JSON.stringify({ message: "No operators to analyze", results: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];
    for (const op of operators) {
      try {
        const result = await analyzeOperator(serviceClient, op.id, op);
        results.push(result);
      } catch (e) {
        console.error(`Failed to analyze operator ${op.id}:`, e);
      }
    }

    return new Response(JSON.stringify({
      analyzed: results.length,
      high_risk: results.filter(r => r.fraud_probability > 0.7).length,
      results: results.sort((a, b) => b.fraud_probability - a.fraud_probability),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fraud intelligence error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function analyzeOperator(serviceClient: any, operatorId: string, operatorData?: any) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  // Fetch operator if not provided
  let operator = operatorData;
  if (!operator) {
    const { data } = await serviceClient
      .from("verified_operators")
      .select("*")
      .eq("id", operatorId)
      .single();
    operator = data;
  }

  if (!operator) throw new Error("Operator not found");

  // Fetch reviews
  const { data: reviews } = await serviceClient
    .from("operator_reviews")
    .select("*")
    .eq("operator_id", operatorId);

  const fraudReports = reviews?.filter((r: any) => r.is_fraud_report) || [];
  const avgRating = reviews?.length
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  const analysisInput = JSON.stringify({
    operator: {
      name: operator.name,
      company: operator.company_name,
      license: operator.license_number,
      is_verified: operator.is_verified,
      state: operator.state,
      avg_rating: avgRating,
      total_reviews: reviews?.length || 0,
      created_at: operator.created_at,
    },
    fraud_reports: fraudReports.length,
    fraud_report_texts: fraudReports.slice(0, 5).map((r: any) => r.review_text),
    low_ratings: reviews?.filter((r: any) => r.rating <= 2).length || 0,
    complaint_texts: reviews?.filter((r: any) => r.rating <= 2).slice(0, 5).map((r: any) => r.review_text) || [],
  });

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        { role: "system", content: FRAUD_ANALYSIS_PROMPT },
        { role: "user", content: analysisInput },
      ],
    }),
  });

  if (!response.ok) throw new Error(`AI analysis failed: ${response.status}`);

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content || "";

  let analysis;
  try {
    const cleaned = rawContent.replace(/```json\n?|\n?```/g, "").trim();
    analysis = JSON.parse(cleaned);
  } catch {
    analysis = {
      fraud_probability: fraudReports.length > 2 ? 0.8 : fraudReports.length > 0 ? 0.5 : 0.1,
      risk_factors: [],
      recommendation: "Manual review recommended",
      auto_blacklist_suggested: false,
      summary: "AI analysis failed, using heuristic scoring",
    };
  }

  // Upsert fraud score
  await serviceClient.from("fraud_scores").upsert({
    operator_id: operatorId,
    fraud_probability: analysis.fraud_probability,
    risk_factors: analysis.risk_factors,
    complaint_count: fraudReports.length,
    payment_anomaly_count: 0,
    recommendation: analysis.recommendation,
    auto_blacklist_suggested: analysis.auto_blacklist_suggested,
    last_analyzed_at: new Date().toISOString(),
  }, { onConflict: "operator_id" });

  return {
    operator_id: operatorId,
    operator_name: operator.name,
    company: operator.company_name,
    ...analysis,
  };
}
