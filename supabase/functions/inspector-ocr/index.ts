// Inspector OCR: extracts structured Annexure-I rows from PDF page images
// using Lovable AI Gemini vision + tool-calling for reliable JSON output.
//
// Body:
//   { state: string, images: string[] }   // images are data URLs (image/jpeg|png)
// Returns:
//   { rows: ParsedRow[] }
//
// verify_jwt is enabled (admin-only feature called from authenticated UI).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an OCR extractor for official Hajj Committee of India (HCOI) Annexure-I inspector lists.

Each row contains an Indian Haj Inspector. Extract every row visible in the image(s).

Rules:
- "applicationId" is the 12–16 digit Group Id / Application Id (NOT the small Sr. number).
- "name" = Applicant Name. "fatherName" = Father Name (preserve original casing/spelling).
- "gender" must be exactly "Male" or "Female".
- "cbtMarks", "interviewMarks", "totalMarks" are integers.
- "result" is "Selected" if the row is in the selected list, else "Waitlisted" (WL, WL-1, WL-2 etc. all count as Waitlisted).
- "quota" is the verbatim Selection/Waitlist Quota text (e.g. "50% Open Quota", "25% Reserved Quota").
- "category" must be normalized to one of: "Fresher", "Fresher with Haj", "Repeater", "SHC/Waqf Employee".
- Skip page headers, footers, signatures, totals, and any row that is not a real applicant.
- If a field is unreadable, omit it rather than guessing.`;

const TOOL = {
  type: "function",
  function: {
    name: "submit_inspector_rows",
    description: "Return all extracted inspector rows from the image(s).",
    parameters: {
      type: "object",
      properties: {
        rows: {
          type: "array",
          items: {
            type: "object",
            properties: {
              applicationId: { type: "string" },
              name: { type: "string" },
              fatherName: { type: "string" },
              gender: { type: "string", enum: ["Male", "Female"] },
              cbtMarks: { type: "number" },
              interviewMarks: { type: "number" },
              totalMarks: { type: "number" },
              result: { type: "string", enum: ["Selected", "Waitlisted"] },
              quota: { type: "string" },
              category: {
                type: "string",
                enum: [
                  "Fresher",
                  "Fresher with Haj",
                  "Repeater",
                  "SHC/Waqf Employee",
                ],
              },
            },
            required: ["applicationId", "name", "gender"],
            additionalProperties: false,
          },
        },
      },
      required: ["rows"],
      additionalProperties: false,
    },
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => null);
    const state = typeof body?.state === "string" ? body.state.trim() : "";
    const images: unknown = body?.images;
    if (!state || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({ error: "state and images[] are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (images.length > 12) {
      return new Response(
        JSON.stringify({ error: "Max 12 images per request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    for (const img of images) {
      if (typeof img !== "string" || !img.startsWith("data:image/")) {
        return new Response(
          JSON.stringify({ error: "Each image must be a data URL (data:image/...)" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const userContent: Array<Record<string, unknown>> = [
      {
        type: "text",
        text:
          `Extract every inspector row visible in the following ${images.length} page image(s). ` +
          `These rows belong to the state of "${state}". Use the submit_inspector_rows tool.`,
      },
      ...(images as string[]).map((url) => ({
        type: "image_url",
        image_url: { url },
      })),
    ];

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "submit_inspector_rows" } },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again in a minute." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (aiRes.status === 402) {
      return new Response(
        JSON.stringify({
          error:
            "Lovable AI credits exhausted. Add credits in Settings → Workspace → Usage.",
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error", aiRes.status, t);
      return new Response(
        JSON.stringify({ error: `AI gateway error (${aiRes.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ai = await aiRes.json();
    const toolCall = ai?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = toolCall?.function?.arguments;
    if (!argsStr) {
      console.error("AI returned no tool_call", JSON.stringify(ai)?.slice(0, 800));
      return new Response(
        JSON.stringify({ error: "Model did not return structured rows" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsed: { rows?: unknown };
    try {
      parsed = JSON.parse(argsStr);
    } catch (e) {
      console.error("Failed to parse tool args", e, argsStr?.slice(0, 400));
      return new Response(
        JSON.stringify({ error: "Model returned invalid JSON" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rawRows = Array.isArray(parsed?.rows) ? parsed.rows : [];
    const rows = (rawRows as Array<Record<string, unknown>>)
      .filter((r) => typeof r?.applicationId === "string" && typeof r?.name === "string")
      .map((r) => ({
        applicationId: String(r.applicationId).replace(/\D/g, "").slice(0, 16),
        name: String(r.name).trim(),
        fatherName: typeof r.fatherName === "string" ? r.fatherName.trim() : "",
        gender:
          r.gender === "Female" ? "Female" : r.gender === "Male" ? "Male" : undefined,
        state,
        cbtMarks: Number.isFinite(Number(r.cbtMarks)) ? Number(r.cbtMarks) : undefined,
        interviewMarks: Number.isFinite(Number(r.interviewMarks))
          ? Number(r.interviewMarks)
          : undefined,
        totalMarks: Number.isFinite(Number(r.totalMarks)) ? Number(r.totalMarks) : undefined,
        result:
          r.result === "Waitlisted" ? "Waitlisted" : ("Selected" as const),
        quota: typeof r.quota === "string" ? r.quota.trim() : undefined,
        category: typeof r.category === "string" ? r.category.trim() : undefined,
      }))
      .filter((r) => r.applicationId.length >= 10);

    return new Response(JSON.stringify({ rows }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("inspector-ocr error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
