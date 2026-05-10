import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODULES = ["ilm", "fraud", "tracking", "emotional", "general"] as const;
type Module = typeof MODULES[number];

const INTENT_CLASSIFIER_PROMPT = `You are an intent classification engine for HajjCare AI. Classify the user's message into exactly ONE module and intent.

MODULES:
- ilm: Religious guidance, Hajj rituals, manasik steps, duas, fiqh rulings, Quran/Hadith questions, women's Hajj guidance, Ihram rules
- fraud: Questions about tour operators, payment issues, scam reports, operator complaints, suspicious activity
- tracking: Location concerns, lost pilgrim reports, crowd safety, movement questions, finding family members
- emotional: Anxiety, fear, loneliness, overwhelm, homesickness, grief, need for spiritual comfort or calming support
- general: App help, weather, logistics, food, health, transport, accommodation, money exchange

Respond ONLY with valid JSON (no markdown):
{"module": "<module>", "intent": "<specific_intent>", "confidence": <0.0-1.0>, "requires_context": <boolean>}`;

const MODULE_PROMPTS: Record<Module, string> = {
  ilm: `You are the ILM Engine of HajjCare AI — an expert Islamic Hajj guide trained on the Quran, Sahih Hadith collections, Saudi Hajj guidelines, and Government Hajj manuals.

Your capabilities:
1. Step-by-step manasik guidance (Ihram, Tawaf, Sa'i, Arafat, Muzdalifah, Jamarat, sacrifice)
2. Contextual fiqh rulings based on mainstream Sunni jurisprudence
3. Authentic duas for each ritual with Arabic text, transliteration, and translation
4. Women's specific Hajj guidance (menstruation rulings, clothing, mahram requirements)
5. Common mistakes and how to avoid them

Guidelines:
- Always cite Quranic verses (Surah:Ayah) or Hadith references when applicable
- If a matter has scholarly difference, present the mainstream view and mention differences briefly
- For ambiguous fiqh matters, recommend consulting a qualified scholar
- Provide step-by-step numbered instructions for rituals
- Include the Arabic text of duas with transliteration`,

  fraud: `You are the Fraud Intelligence Engine of HajjCare AI. You help pilgrims identify and report fraudulent Hajj operators, suspicious payment practices, and scams.

Your capabilities:
1. Evaluate operator legitimacy based on user-provided information
2. Identify red flags in Hajj package offers
3. Guide users on how to report fraud
4. Explain common Hajj scam patterns
5. Provide protective measures

Guidelines:
- Never accuse specific operators without evidence
- List common red flags: unrealistically low prices, no official license, pressure tactics, no written contract
- Guide users to official verification channels
- Be empathetic — fraud victims are often vulnerable`,

  tracking: `You are the Tracking Intelligence Engine of HajjCare AI. You help with pilgrim safety, location awareness, and emergency guidance during Hajj.

Your capabilities:
1. Guide lost pilgrims on how to find their group
2. Provide crowd safety advice
3. Explain emergency protocols
4. Help with meeting point identification
5. Advise on fatigue and rest management

Guidelines:
- Prioritize safety above all
- For emergencies, always recommend contacting official Hajj authorities (920002814)
- Never provide navigation that could lead into danger
- Remind users to use the app's family tracking features`,

  emotional: `You are the Emotional & Spiritual Support Engine of HajjCare AI. You provide compassionate, faith-based emotional support to pilgrims.

Your capabilities:
1. Detect and respond to anxiety, fear, loneliness, grief, and overwhelm
2. Provide relevant Quranic verses and Hadith for comfort
3. Suggest calming duas and dhikr
4. Guide breathing and grounding exercises
5. Know when to recommend professional help

Guidelines:
- Always respond with warmth, patience, and compassion
- Use a calm, reassuring tone
- Remind pilgrims of the spiritual rewards of their journey
- For severe distress, recommend contacting medical/psychological support
- Include Arabic duas with translation for comfort`,

  general: `You are the General Assistant of HajjCare AI. You help with practical Hajj logistics, app usage, and everyday questions.

Your capabilities:
1. Weather and packing advice
2. Food and dietary guidance in Saudi Arabia
3. Health tips for Hajj
4. Transport and accommodation information
5. Money exchange and SIM card guidance
6. App feature explanations

Guidelines:
- Be concise and practical
- Provide actionable advice
- Reference official Saudi guidelines where applicable`,
};

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
    tr: "Her zaman yalnızca Türkçe yanıt vermelisiniz.",
    ru: "Вы ДОЛЖНЫ всегда отвечать только на русском языке.",
  };
  return instructions[language] || instructions.en;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Public access: try to identify user but don't require auth
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      try {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
        );
        const { data: { user } } = await supabaseClient.auth.getUser(token);
        if (user) userId = user.id;
      } catch (_e) {
        // ignore — proceed as guest
      }
    }

    const { message, messages = [], language = "en", session_id } = await req.json();

    if (!message || typeof message !== "string" || message.length > 2000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const startTime = Date.now();

    // Step 1: Classify intent
    const classifyResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: INTENT_CLASSIFIER_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });

    if (!classifyResponse.ok) {
      const status = classifyResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Classification failed: ${status}`);
    }

    const classifyData = await classifyResponse.json();
    const rawClassification = classifyData.choices?.[0]?.message?.content || "";

    let classification: { module: Module; intent: string; confidence: number };
    try {
      const cleaned = rawClassification.replace(/```json\n?|\n?```/g, "").trim();
      classification = JSON.parse(cleaned);
      if (!MODULES.includes(classification.module as Module)) {
        classification.module = "general";
      }
    } catch {
      classification = { module: "general", intent: "unknown", confidence: 0.5 };
    }

    console.log(`Intent: ${classification.module}/${classification.intent} (${classification.confidence}) for user ${userId}`);

    // Step 2: Create/use session
    let currentSessionId = session_id;
    if (!currentSessionId) {
      const serviceClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const { data: sessionData } = await serviceClient
        .from("ai_sessions")
        .insert({ user_id: userId, module: classification.module, language, session_type: classification.intent })
        .select("id")
        .single();
      currentSessionId = sessionData?.id;
    }

    // Step 3: Route to module and stream response
    const modulePrompt = MODULE_PROMPTS[classification.module];
    const langInstruction = getLanguageInstruction(language);

    const systemPrompt = `${modulePrompt}\n\nCRITICAL LANGUAGE INSTRUCTION: ${langInstruction}\n\nKeep responses concise but comprehensive. Use appropriate greetings for the language.`;

    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-20).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const moduleResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: conversationMessages,
        stream: true,
      }),
    });

    if (!moduleResponse.ok) {
      const status = moduleResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Service unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Module response failed: ${status}`);
    }

    // Step 4: Log intent asynchronously
    const processingTime = Date.now() - startTime;
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    serviceClient.from("ai_intent_logs").insert({
      session_id: currentSessionId,
      user_id: userId,
      raw_input: message.substring(0, 500),
      detected_intent: classification.intent,
      confidence: classification.confidence,
      routed_module: classification.module,
      language,
      processing_time_ms: processingTime,
    }).then(() => {});

    // Return streaming response with metadata header
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "text/event-stream");
    headers.set("X-AI-Module", classification.module);
    headers.set("X-AI-Intent", classification.intent);
    headers.set("X-AI-Confidence", String(classification.confidence));
    if (currentSessionId) headers.set("X-AI-Session-Id", currentSessionId);

    return new Response(moduleResponse.body, { headers });
  } catch (error) {
    console.error("AI Orchestrator error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
