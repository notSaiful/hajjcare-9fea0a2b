import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const HCI_URL = "https://hajcommittee.gov.in";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // AUTHORIZATION: allow either (a) admin user JWT, (b) shared cron secret,
    // or (c) the service_role key (used by scheduled pg_cron invocations).
    const cronSecret = Deno.env.get("CRON_SECRET");
    const providedCronSecret =
      req.headers.get("x-cron-secret") || req.headers.get("X-Cron-Secret");
    const authHeader = req.headers.get("Authorization");
    const bearer = authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null;

    let authorized = false;

    if (cronSecret && providedCronSecret && providedCronSecret === cronSecret) {
      authorized = true;
    } else if (bearer && bearer === serviceKey) {
      // Scheduled invocation from pg_cron using the service role key
      authorized = true;
    } else if (bearer) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(bearer);
      if (!authError && user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);
        if (roles?.some((r: { role: string }) => r.role === "admin")) {
          authorized = true;
        }
      }
    }


    if (!authorized) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching Haj Committee of India website...");

    // Fetch the HCI homepage
    const response = await fetch(HCI_URL, {
      headers: {
        "User-Agent": "HajCare-AI/1.0 (Circular Monitor)",
        "Accept": "text/html",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch HCI website: ${response.status}`);
    }

    const html = await response.text();
    console.log("HTML length:", html.length);
    console.log("HTML first 500 chars:", html.substring(0, 500));
    
    // Check if page contains circulars section at all
    const hasCircularWord = html.includes("Circular");
    const hasUploadsCirculars = html.includes("/uploads/circulars/");
    console.log("Contains 'Circular':", hasCircularWord, "Contains '/uploads/circulars/':", hasUploadsCirculars);

    // Debug: find a sample circular anchor
    const sampleIdx = html.indexOf("Circular-");
    if (sampleIdx >= 0) {
      console.log("Sample around Circular-:", html.substring(Math.max(0, sampleIdx - 100), sampleIdx + 200));
    }

    // Parse circulars from HTML using multiple regex patterns
    const foundCirculars: Array<{
      circular_number: string;
      title: string;
      source_url: string;
    }> = [];

    // Pattern 1: Circular-XX | Title (most common) - handles both relative and absolute URLs
    const regex1 = /href="((?:https?:\/\/hajcommittee\.gov\.in)?\/uploads\/circulars\/[^"]+)"[^>]*>\s*Circular-(\d+)\s*\|\s*([^<]+)/gi;
    // Pattern 2: Circular No.XX
    const regex2 = /href="((?:https?:\/\/hajcommittee\.gov\.in)?\/uploads\/circulars\/[^"]+)"[^>]*>\s*Circular\s*No\.?\s*(\d+)[^<]*?[|\-–]\s*([^<]+)/gi;

    let match;
    for (const regex of [regex1, regex2]) {
      while ((match = regex.exec(html)) !== null) {
        let url = match[1].trim();
        // Make relative URLs absolute
        if (url.startsWith("/")) {
          url = `https://hajcommittee.gov.in${url}`;
        }
        const num = match[2].trim();
        const title = match[3].trim().replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        const key = `Circular-${num}`;
        if (!foundCirculars.some(c => c.circular_number === key)) {
          foundCirculars.push({ circular_number: key, title, source_url: decodeURIComponent(url) });
        }
      }
    }
    
    console.log("Parsed circulars count:", foundCirculars.length);




    console.log(`Found ${foundCirculars.length} circulars on HCI website`);

    if (foundCirculars.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No circulars found on page", added: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get existing circular numbers from database
    const { data: existingCirculars, error: fetchErr } = await supabase
      .from("hajj_circulars")
      .select("circular_number")
      .not("circular_number", "is", null);

    if (fetchErr) throw fetchErr;

    const existingNumbers = new Set(
      (existingCirculars || []).map((c: any) => c.circular_number)
    );

    // Filter out circulars that already exist
    const newCirculars = foundCirculars.filter(
      (c) => !existingNumbers.has(c.circular_number)
    );

    console.log(`${newCirculars.length} new circulars to add`);

    if (newCirculars.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "All circulars already exist", added: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert new circulars
    const toInsert = newCirculars.map((c) => ({
      title: `${c.circular_number} - ${c.title}`,
      original_content: `Official circular from Haj Committee of India: ${c.title}. View the full circular at: ${c.source_url}`,
      circular_number: c.circular_number,
      source_url: c.source_url,
      category: categorizeCircular(c.title),
      priority: detectPriority(c.title),
      is_published: true,
      ai_processed: false,
    }));

    const { error: insertErr } = await supabase
      .from("hajj_circulars")
      .insert(toInsert);

    if (insertErr) throw insertErr;

    console.log(`Successfully added ${toInsert.length} new circulars`);

    // Try to auto-summarize new circulars using AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (LOVABLE_API_KEY) {
      for (const circular of toInsert) {
        try {
          // Fetch the newly inserted circular's ID
          const { data: inserted } = await supabase
            .from("hajj_circulars")
            .select("id")
            .eq("circular_number", circular.circular_number)
            .single();

          if (!inserted) continue;

          const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                {
                  role: "system",
                  content: `You are a Hajj information assistant. Summarize this Haj Committee circular for Indian pilgrims.
Return ONLY valid JSON with these fields:
- "summary_en": English summary (2-3 sentences)
- "summary_hi": Hindi summary in Devanagari
- "summary_ur": Urdu summary in Nastaliq
- "title_hi": Hindi title
- "title_ur": Urdu title
Focus on what pilgrims need to know and any deadlines.`,
                },
                {
                  role: "user",
                  content: `Title: ${circular.title}\nContent: ${circular.original_content}`,
                },
              ],
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const rawContent = aiData.choices?.[0]?.message?.content || "";
            const jsonStr = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            const parsed = JSON.parse(jsonStr);

            await supabase
              .from("hajj_circulars")
              .update({
                summary_en: parsed.summary_en || null,
                summary_hi: parsed.summary_hi || null,
                summary_ur: parsed.summary_ur || null,
                title_hi: parsed.title_hi || null,
                title_ur: parsed.title_ur || null,
                ai_processed: true,
              })
              .eq("id", inserted.id);

            console.log(`AI summary generated for ${circular.circular_number}`);
          }
        } catch (aiErr) {
          console.error(`AI summary failed for ${circular.circular_number}:`, aiErr);
          // Continue - the circular is still added without AI summary
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Added ${toInsert.length} new circulars`,
        added: toInsert.length,
        circulars: toInsert.map((c) => c.circular_number),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fetch-hci-circulars error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function categorizeCircular(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("flight") || t.includes("travel") || t.includes("air charter") || t.includes("embark")) return "travel";
  if (t.includes("medical") || t.includes("screening") || t.includes("immunization") || t.includes("vaccination")) return "health";
  if (t.includes("payment") || t.includes("refund") || t.includes("pricing") || t.includes("qurbani") || t.includes("adahi") || t.includes("hady")) return "finance";
  if (t.includes("visa") || t.includes("passport")) return "visa";
  if (t.includes("training") || t.includes("trainer") || t.includes("orientation")) return "general";
  if (t.includes("waiting list") || t.includes("release")) return "general";
  return "general";
}

function detectPriority(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("urgent") || t.includes("immediate") || t.includes("important")) return "urgent";
  if (t.includes("deadline") || t.includes("last date") || t.includes("final")) return "high";
  if (t.includes("waiting list") || t.includes("release") || t.includes("update")) return "high";
  return "normal";
}
