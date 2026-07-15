import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMOTION_DETECTION_PROMPT = `You are an Emotional Detection Engine. Analyze the user's message for emotional state.

Detect:
- anxiety: worry, nervousness, fear about Hajj rituals or safety
- fear: intense fear, panic about crowds, separation, health
- grief: sadness, missing loved ones, bereavement
- loneliness: feeling isolated, homesick, disconnected
- overwhelmed: too much stimulation, exhaustion, confusion

Respond with JSON (no markdown):
{
  "detected_emotion": "anxiety|fear|grief|loneliness|overwhelmed|none",
  "confidence": <0.0-1.0>,
  "support_type": "dua|comfort|breathing|professional_referral",
  "needs_professional_help": <boolean>
}`;

const SPIRITUAL_SUPPORT_PROMPT = `You are the Emotional & Spiritual Support Engine of HajjCare AI. A pilgrim is experiencing emotional distress. Provide compassionate, faith-based support.

DETECTED EMOTION: {emotion}
SUPPORT TYPE: {support_type}

Guidelines:
1. Begin with bismillah and a warm, compassionate greeting
2. Acknowledge their feelings with empathy — never dismiss
3. Provide a relevant Quranic verse (Arabic + translation) for comfort
4. Share an applicable Hadith for encouragement
5. Suggest a specific dua in Arabic with transliteration and translation
6. If support_type is "breathing": include a guided breathing exercise (4-7-8 technique)
7. If support_type is "professional_referral": gently recommend they speak to a counselor/medical staff
8. End with encouragement about the spiritual rewards of their journey
9. Keep the tone warm, calm, and unhurried

CRITICAL: Respond in the pilgrim's language. Never minimize their feelings.`;

const getLanguageInstruction = (language: string): string => {
  const instructions: Record<string, string> = {
    ar: "يجب أن ترد دائماً باللغة العربية فقط.",
    en: "You MUST always respond in English only.",
    ur: "آپ کو ہمیشہ صرف اردو میں جواب دینا ہوگا۔",
    hi: "आपको हमेशा केवल हिंदी में जवाब देना होगा।",
    bn: "আপনাকে সর্বদা শুধুমাত্র বাংলায় উত্তর দিতে হবে।",
    ta: "நீங்கள் எப்போதும் தமிழில் மட்டுமே பதிலளிக்க வேண்டும்.",
    te: "మీరు ఎల్లప్పుడూ తెలుగులో మాత్రమే సమాధానం ఇవ్వాలి.",
    ml: "നിങ്ങൾ എല്ലായ്പ്പോഴും മലയാളത്തിൽ മാത്രം മറുപടി നൽകണം.",
  };
  return instructions[language] || instructions.en;
};

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

    const { message, language = "en", session_id } = await req.json();

    if (!message || typeof message !== "string" || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LLM_API_KEY = Deno.env.get("LLM_API_KEY");
    const LLM_BASE_URL = (Deno.env.get("LLM_BASE_URL") || "https://openrouter.ai/api/v1").replace(/\/$/, "");
    if (!LLM_API_KEY) throw new Error("LLM_API_KEY not configured");

    // Step 1: Detect emotion
    const detectResponse = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: EMOTION_DETECTION_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });

    if (!detectResponse.ok) {
      if (detectResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Emotion detection failed: ${detectResponse.status}`);
    }

    const detectData = await detectResponse.json();
    const rawDetection = detectData.choices?.[0]?.message?.content || "";

    let detection;
    try {
      const cleaned = rawDetection.replace(/```json\n?|\n?```/g, "").trim();
      detection = JSON.parse(cleaned);
    } catch {
      detection = { detected_emotion: "none", confidence: 0.3, support_type: "comfort", needs_professional_help: false };
    }

    // If no emotion detected, return brief acknowledgment
    if (detection.detected_emotion === "none") {
      return new Response(JSON.stringify({
        emotion: "none",
        confidence: detection.confidence,
        support_provided: false,
        message: "No emotional distress detected.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 2: Generate support response
    const langInstruction = getLanguageInstruction(language);
    const supportPrompt = SPIRITUAL_SUPPORT_PROMPT
      .replace("{emotion}", detection.detected_emotion)
      .replace("{support_type}", detection.support_type);

    const supportResponse = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `${supportPrompt}\n\n${langInstruction}` },
          { role: "user", content: message },
        ],
        stream: true,
      }),
    });

    if (!supportResponse.ok) throw new Error(`Support generation failed: ${supportResponse.status}`);

    // Log emotional support asynchronously
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    serviceClient.from("emotional_support_logs").insert({
      user_id: user.id,
      session_id: session_id || null,
      detected_emotion: detection.detected_emotion,
      confidence: detection.confidence,
      support_type: detection.support_type,
      language,
    }).then(() => {});

    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "text/event-stream");
    headers.set("X-Emotion", detection.detected_emotion);
    headers.set("X-Support-Type", detection.support_type);
    headers.set("X-Needs-Professional", String(detection.needs_professional_help));

    return new Response(supportResponse.body, { headers });
  } catch (error) {
    console.error("Emotional support error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
