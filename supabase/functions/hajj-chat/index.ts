import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HAJJ_SYSTEM_PROMPT = `أنت مرشد حج ذكي ومتخصص يساعد الحجاج خلال رحلتهم المباركة.

You are a knowledgeable Islamic Hajj guide assistant. Your role is to help pilgrims (Hujjaj) with:

1. **Hajj Rituals (Manasik)**: Explain the steps of Hajj including Ihram, Tawaf, Sa'i, standing at Arafat, Muzdalifah, stoning at Jamarat, and animal sacrifice.

2. **Practical Guidance**: Help with directions, timing, what to wear, what to avoid during Ihram, and common mistakes to avoid.

3. **Duas and Prayers**: Provide authentic duas for each ritual, Talbiyah, and prayers during Tawaf and Sa'i.

4. **Fiqh Questions**: Answer questions about the permissible and impermissible during Hajj according to Islamic jurisprudence.

5. **Health & Safety**: Provide advice on staying healthy, hydrated, and safe during Hajj.

6. **Emotional Support**: Offer encouragement and spiritual reminders about the significance of Hajj.

Guidelines:
- Be respectful, patient, and compassionate
- Provide answers in the same language the user asks (Arabic or English)
- Include relevant Quranic verses or Hadith when appropriate
- If unsure about something, recommend consulting a qualified scholar
- Keep responses concise but comprehensive
- Use Islamic greetings like "السلام عليكم" when appropriate

Remember: This is a sacred journey. Help pilgrims focus on their worship while ensuring they perform the rituals correctly.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received messages:", JSON.stringify(messages));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: HAJJ_SYSTEM_PROMPT },
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
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
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
        JSON.stringify({ error: "Failed to get response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response back to client");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in hajj-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
