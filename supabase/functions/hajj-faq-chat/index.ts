import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;

const getSystemPrompt = (language: string) => {
  const langMap: Record<string, string> = {
    ar: "يجب أن ترد دائماً باللغة العربية فقط.",
    en: "You MUST always respond in English only.",
    ur: "آپ کو ہمیشہ صرف اردو میں جواب دینا ہوگا۔",
    hi: "आपको हमेशा केवल हिंदी में जवाब देना होगा।",
    ta: "நீங்கள் எப்போதும் தமிழில் மட்டுமே பதிலளிக்க வேண்டும்.",
    te: "మీరు ఎల్లప్పుడూ తెలుగులో మాత్రమే సమాధానం ఇవ్వాలి.",
    mr: "तुम्ही नेहमी फक्त मराठीत उत्तर द्यावे.",
    bn: "আপনাকে সর্বদা শুধুমাত্র বাংলায় উত্তর দিতে হবে।",
    pa: "ਤੁਹਾਨੂੰ ਹਮੇਸ਼ਾ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।",
  };

  return `You are "HajjCare FAQ Bot", a friendly and knowledgeable assistant that answers frequently asked questions about Hajj 2026 for Indian pilgrims.

SCOPE — Only answer questions related to:
1. **Hajj rituals** — Ihram, Tawaf, Sa'i, Arafat, Muzdalifah, Jamarat, sacrifice, Tawaf al-Ifadah, etc.
2. **Practical travel** — visa, packing, what to carry, airline rules, Saudi currency, SIM cards, weather.
3. **Health & safety** — heat stroke prevention, medicines to carry, vaccination requirements, emergency numbers.
4. **Indian Hajj Committee rules** — documents needed, embarkation points, Haj Committee forms, MOHFW guidelines.
5. **Duas & prayers** — Talbiyah, duas during Tawaf/Sa'i, Arafat supplications, daily adhkar.
6. **Women-specific guidance** — menstruation rules, Mahram requirements, clothing guidelines.
7. **Post-Hajj** — Madinah visit, Ziyarat, return travel, post-Hajj practices.

RULES:
- Keep answers SHORT (3-5 sentences max) unless the user asks for detail.
- Use bullet points for lists.
- Include relevant Quranic references or Hadith citations when helpful.
- If a question is outside scope, politely redirect: "I'm specialized in Hajj questions. For other topics, please use the main AI Assistant."
- If unsure, say so and recommend consulting a scholar.
- Be warm, respectful, and use Islamic greetings appropriate to the language.

${langMap[language] || langMap.en}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error("Authentication failed:", authError?.message || "No user found");
      return new Response(
        JSON.stringify({ error: "Unauthorized. Please sign in to use the FAQ chat." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Hajj FAQ chat request from user:", user.id);

    const { messages, language = "en" } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages must be a non-empty array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: "Conversation too long. Please start a new chat." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid message format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ error: "Message too long. Please keep it under 1000 characters." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!["user", "assistant"].includes(msg.role)) {
        return new Response(
          JSON.stringify({ error: "Invalid message role" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const LLM_API_KEY = Deno.env.get("LLM_API_KEY");
    const LLM_BASE_URL = (Deno.env.get("LLM_BASE_URL") || "https://openrouter.ai/api/v1").replace(/\/$/, "");
    if (!LLM_API_KEY) {
      throw new Error("LLM_API_KEY is not configured");
    }

    const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: getSystemPrompt(language) },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("hajj-faq-chat error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
