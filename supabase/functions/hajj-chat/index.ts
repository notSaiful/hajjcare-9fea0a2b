import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 2000;
const ALLOWED_ROLES = ["user", "assistant"];

// Building zone data embedded for AI context
const BUILDING_ZONES = [
  { zone: "Old Aziziya (MB, BH, AK)", range: "101-499", lat: 21.3991, lng: 39.8375, landmark: "पुरानी अज़ीज़िया इलाका" },
  { zone: "Main Road Aziziyah", range: "501-530", lat: 21.4015, lng: 39.8350, landmark: "मेन रोड अज़ीज़िया" },
  { zone: "Qatari Masjid", range: "601-625", lat: 21.4030, lng: 39.8340, landmark: "कतरी मस्जिद के पास" },
  { zone: "Near Haram Sharif (Ajyad Sad)", range: "701-720", lat: 21.4195, lng: 39.8265, landmark: "हरम शरीफ से पैदल दूरी" },
  { zone: "King Abdullah Kubri → Jamarat Road", range: "801-830", lat: 21.4135, lng: 39.8730, landmark: "मीना रोड" },
  { zone: "Near Jamarat Bus Station", range: "901-920", lat: 21.4170, lng: 39.8700, landmark: "जमारात बस स्टेशन" },
  { zone: "Al Khansa / Al Jumaysa", range: "1001-1040", lat: 21.4260, lng: 39.8255, landmark: "मस्जिद जिन्न रोड" },
  { zone: "Mahbas Al Jinn", range: "1101-1130", lat: 21.4240, lng: 39.8275, landmark: "अज्याद रोड" },
  { zone: "Rusefa – Ibrahim Khalil Road", range: "1201-1215", lat: 21.4150, lng: 39.8230, landmark: "इब्राहीम खलील रोड" },
  { zone: "Kudai Parking", range: "1301-1315", lat: 21.4050, lng: 39.8200, landmark: "कुदई पार्किंग" },
  { zone: "Batha Quresh", range: "1401-1415", lat: 21.4100, lng: 39.8180, landmark: "बठा कुरेश" },
  { zone: "Jarwal Jed. Makkah Road", range: "1501-1515", lat: 21.3920, lng: 39.8100, landmark: "जरवल, जेद्दा-मक्का रोड" },
  { zone: "Al Diyafah", range: "1601-1615", lat: 21.3950, lng: 39.8150, landmark: "अल दियाफ़ा" },
  { zone: "Rusefah", range: "1701-1715", lat: 21.4160, lng: 39.8210, landmark: "रुसेफ़ा" },
  { zone: "Al Naseem", range: "1801-1880", lat: 21.3880, lng: 39.8320, landmark: "अल नसीम" },
];

function findBuildingZone(num: number) {
  return BUILDING_ZONES.find(z => {
    const [start, end] = z.range.split("-").map(Number);
    return num >= start && num <= end;
  });
}

function getGoogleMapsLink(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

const getSystemPrompt = (language: string) => {
  // Build building zone reference string
  const buildingRef = BUILDING_ZONES.map(z => 
    `- Building ${z.range}: ${z.zone} (${z.landmark}) → Google Maps: ${getGoogleMapsLink(z.lat, z.lng)}`
  ).join("\n");

  return `You are "Haj Care AI" – a smart, caring assistant for Indian Hajj pilgrims (Hajj 2026).

Your PRIMARY language is Hindi + Urdu mix (आसान भाषा में). If the user asks in English, respond in English. For Arabic speakers, respond in Arabic.

## YOUR CORE RESPONSIBILITIES:

### 1. BUILDING NUMBER LOOKUP (MOST IMPORTANT)
When a user mentions ANY building number (e.g., "125", "building 701", "mera building 1305"), you MUST:
- Identify the zone from the database below
- Provide the EXACT Google Maps walking direction link
- Give short direction guidance in Hindi/Urdu
- Mention nearby landmarks

**BUILDING DATABASE (Indian Hajj Pilgrims - Makkah 2026):**
${buildingRef}

**Example Response for Building 125:**
🏢 **Building Number: 125**
📍 **Zone:** Old Aziziya (MB, BH, AK) - पुरानी अज़ीज़िया
🗺️ **Google Maps:** [यहाँ क्लिक करें](https://www.google.com/maps/dir/?api=1&destination=21.3991,39.8375&travelmode=walking)
📌 **Direction:** Yeh aapka building Makkah ke Old Aziziya area mein hai. Link par click karke seedha navigation start karein. Paidal rasta dikhega.

### 2. HAJJ RITUALS (Step-by-Step)
Explain rituals in this format:
1. **Kya karna hai** (What to do)
2. **Kaise karna hai** (How to do it)
3. **Galtiyan jo avoid karni hain** (Mistakes to avoid)

Cover: Ihram, Tawaf, Sa'i, Mina, Arafat, Muzdalifah, Rami (Jamarat), Qurbani, Halq/Taqsir

### 3. EMERGENCY SUPPORT
If user mentions: lost, emergency, health problem, police, missing person, crowd:
- 🟢 First: "Ghabrayein nahi, hum aapki madad karenge"
- 🔴 Immediate steps batayein
- 📞 Contact info:
  - Indian Medical Mission: +966-12-574-0636
  - Haj Office Makkah: +966-12-544-6949
  - Indian Embassy Riyadh: +966-11-481-4455
  - Saudi Emergency: 911
  - Ambulance: 997
  - Group Leader se contact karein

### 4. FAMILY TRACKING (Sukoon Connect)
If user asks about family tracking:
- HajCare app mein "Sukoon Connect" feature hai
- Family members real-time location dekh sakte hain
- WhatsApp par automatic updates aate hain (ritual stage)
- Privacy: Sirf aapki ijazat se sharing hoti hai

### 5. TRAVEL & ACCOMMODATION
- Transport guidance between Makkah, Madinah, Mina, Arafat
- Food and water tips
- Heat protection advice
- Shopping and telecom guidance

## RULES:
- NEVER give complicated answers - always simple Hindi/Urdu mix
- Be calm, respectful, and encouraging (like a caring elder)
- Use emojis for clarity: 🕋 🤲 📍 ⚠️ ✅ 📞
- If unsure, say: "Iske baare mein apne Group Leader ya Haj Committee se zaroor poochein"
- When giving building info, ALWAYS include the Google Maps link
- Keep responses concise but complete

## GREETING:
Start first response with: "Assalamu Alaikum! 🕋 Main Haj Care AI hoon, aapki Hajj safar mein madad ke liye. Batayein, kaise madad kar sakta/sakti hoon?"

Remember: Your goal is to make every pilgrim feel SAFE, GUIDED, and CONFIDENT during Hajj. 🤲`;
};

interface ChatMessage {
  role: string;
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
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
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, language = "hi" } = await req.json();
    
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `Too many messages. Maximum ${MAX_MESSAGES} allowed.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const msg of messages as ChatMessage[]) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid message format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!ALLOWED_ROLES.includes(msg.role)) {
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

    // Check if user message contains a building number and enrich context
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const buildingMatch = lastUserMsg.match(/\b(\d{3,4})\b/);
    let enrichedMessages = [...messages];
    
    if (buildingMatch) {
      const buildingNum = parseInt(buildingMatch[1]);
      const zone = findBuildingZone(buildingNum);
      if (zone) {
        const mapLink = getGoogleMapsLink(zone.lat, zone.lng);
        // Inject building context as a system hint
        enrichedMessages = [
          ...messages.slice(0, -1),
          {
            role: "user",
            content: `${lastUserMsg}\n\n[SYSTEM CONTEXT: Building ${buildingNum} is in zone "${zone.zone}" (${zone.landmark}). Google Maps link: ${mapLink}]`
          }
        ];
      }
    }

    console.log("Chat request from user:", user.id, "Language:", language, "Messages:", messages.length);

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
          ...enrichedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
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
    console.error("Error in hajj-chat:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
