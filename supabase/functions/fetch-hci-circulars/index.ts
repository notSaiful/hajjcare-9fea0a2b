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
    let triggeredBy: "cron" | "admin" | "service" | "unknown" = "unknown";

    if (cronSecret && providedCronSecret && providedCronSecret === cronSecret) {
      authorized = true;
      triggeredBy = "cron";
    } else if (providedCronSecret) {
      // Fallback: compare against vault-stored cron secret (set by pg_cron)
      try {
        const { data: vaultSecret } = await supabase.rpc("get_hci_cron_secret");
        if (vaultSecret && providedCronSecret === vaultSecret) {
          authorized = true;
          triggeredBy = "cron";
        }
      } catch (_e) {
        // ignore, fall through
      }
    }

    if (!authorized && bearer && bearer === serviceKey) {
      authorized = true;
      triggeredBy = "service";
    } else if (!authorized && bearer) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(bearer);
      if (!authError && user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);
        if (roles?.some((r: { role: string }) => r.role === "admin")) {
          authorized = true;
          triggeredBy = "admin";
        }
      }
    }

    const logRun = async (success: boolean, added: number, message: string) => {
      try {
        await supabase.from("circular_fetch_log").insert({
          source: "HCI",
          success,
          added_count: added,
          message,
          triggered_by: triggeredBy,
        });
      } catch (logErr) {
        console.error("fetch-log insert failed:", logErr);
      }
    };


    if (!authorized) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching Haj Committee of India website...");

    // Fetch homepage + Haj-2027 archive page
    const PAGES = [
      { url: HCI_URL, year: null as string | null },
      { url: `${HCI_URL}/circulars-haj-2027/`, year: "2027" },
    ];

    const foundCirculars: Array<{
      circular_number: string;
      title: string;
      source_url: string;
    }> = [];

    const pushUnique = (c: { circular_number: string; title: string; source_url: string }) => {
      if (!foundCirculars.some((x) => x.circular_number === c.circular_number)) {
        foundCirculars.push(c);
      }
    };

    const absolutize = (u: string) =>
      u.startsWith("/") ? `https://hajcommittee.gov.in${u}` : u;

    const detectYear = (s: string, fallback: string | null) => {
      const m = s.match(/20(2[5-9]|3\d)/);
      return m ? m[0] : fallback;
    };

    for (const page of PAGES) {
      const resp = await fetch(page.url, {
        headers: {
          "User-Agent": "HajCare-AI/1.0 (Circular Monitor)",
          "Accept": "text/html",
        },
      });
      if (!resp.ok) {
        console.warn(`Skip ${page.url}: ${resp.status}`);
        continue;
      }
      const html = await resp.text();
      console.log(`Fetched ${page.url} (${html.length} chars)`);

      // Pattern A: Circular-XX | Title
      const regexA = /href="((?:https?:\/\/hajcommittee\.gov\.in)?\/uploads\/circulars\/[^"]+)"[^>]*>\s*Circular[-\s]*No?\.?\s*(\d+)\s*[|\-–]\s*([^<]+)/gi;
      let m: RegExpExecArray | null;
      while ((m = regexA.exec(html)) !== null) {
        const url = absolutize(decodeURIComponent(m[1].trim()));
        const num = m[2].trim().padStart(2, "0");
        const rawTitle = m[3].trim().replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        const year = detectYear(rawTitle + " " + url, page.year) ?? "unknown";
        pushUnique({
          circular_number: `Circular-${num}-Haj${year}`,
          title: rawTitle,
          source_url: url,
        });
      }

      // Pattern B: <a href="...pdf" ...><i...></i><span>Title</span></a>  (2027 archive layout)
      const regexB = /<a[^>]*href="((?:https?:\/\/hajcommittee\.gov\.in)?\/uploads\/circulars\/[^"]+\.pdf)"[^>]*>[\s\S]*?<span>([^<]+)<\/span>\s*<\/a>/gi;
      while ((m = regexB.exec(html)) !== null) {
        const url = absolutize(decodeURIComponent(m[1].trim()));
        const title = m[2].trim().replace(/\s+/g, " ");
        const year = detectYear(title + " " + url, page.year) ?? "unknown";
        // Derive stable key from filename (strip numeric prefix + extension)
        const fname = url.split("/").pop() || title;
        const slug = fname
          .replace(/\.pdf$/i, "")
          .replace(/^\d+/, "")
          .replace(/[^A-Za-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .toUpperCase()
          .slice(0, 60);
        pushUnique({
          circular_number: `HAJ${year}-${slug}`,
          title,
          source_url: url,
        });
      }
    }

    console.log("Parsed circulars count:", foundCirculars.length);





    console.log(`Found ${foundCirculars.length} circulars on HCI website`);

    if (foundCirculars.length === 0) {
      await logRun(true, 0, "No circulars found on page");
      return new Response(
        JSON.stringify({ success: true, message: "No circulars found on page", added: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Dedupe against existing rows by circular_number OR source_url (URLs are stable
    // even if our numbering scheme changes over time)
    const { data: existingCirculars, error: fetchErr } = await supabase
      .from("hajj_circulars")
      .select("circular_number, source_url");

    if (fetchErr) throw fetchErr;

    const existingNumbers = new Set(
      (existingCirculars || []).map((c: any) => c.circular_number).filter(Boolean)
    );
    const existingUrls = new Set(
      (existingCirculars || []).map((c: any) => c.source_url).filter(Boolean)
    );

    const newCirculars = foundCirculars.filter(
      (c) => !existingNumbers.has(c.circular_number) && !existingUrls.has(c.source_url)
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
      source: "HCI",
      source_name_display: "Haj Committee of India",
      auto_scraped: true,
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
