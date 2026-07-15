import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LLM_API_KEY = Deno.env.get("LLM_API_KEY");
    const LLM_BASE_URL = (Deno.env.get("LLM_BASE_URL") || "https://openrouter.ai/api/v1").replace(/\/$/, "");
    if (!LLM_API_KEY) throw new Error("LLM_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Auth check - admin only
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) throw new Error("Admin access required");

    const { circular_id } = await req.json();
    if (!circular_id) throw new Error("circular_id required");

    // Fetch circular
    const { data: circular, error: fetchErr } = await supabase
      .from("hajj_circulars")
      .select("*")
      .eq("id", circular_id)
      .single();
    if (fetchErr || !circular) throw new Error("Circular not found");

    const systemPrompt = `You are a Hajj information assistant for Indian Muslim pilgrims. 
Summarize the following official circular from the Haj Committee of India. 
Provide 3 outputs in JSON format:
1. "summary_en" - English summary (2-3 sentences, clear and actionable)
2. "summary_hi" - Hindi summary in Devanagari script (same content)  
3. "summary_ur" - Urdu summary in Nastaliq script (same content)
4. "title_hi" - Hindi title
5. "title_ur" - Urdu title

Focus on: What pilgrims need to know, any deadlines, and required actions.
Return ONLY valid JSON, no markdown.`;

    const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Title: ${circular.title}\n\nContent:\n${circular.original_content}` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response (handle possible markdown wrapping)
    let parsed;
    try {
      const jsonStr = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", rawContent);
      throw new Error("AI returned invalid format");
    }

    // Update circular with summaries
    const { error: updateErr } = await supabase
      .from("hajj_circulars")
      .update({
        summary_en: parsed.summary_en || null,
        summary_hi: parsed.summary_hi || null,
        summary_ur: parsed.summary_ur || null,
        title_hi: parsed.title_hi || null,
        title_ur: parsed.title_ur || null,
        ai_processed: true,
      })
      .eq("id", circular_id);

    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ success: true, summaries: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("summarize-circular error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
