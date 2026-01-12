import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Voice IDs for different languages - multilingual voices that work well
const VOICE_MAP: Record<string, string> = {
  ur: "pFZP5JQG7iQjIQuC4Bku", // Lily - good for South Asian languages
  hi: "pFZP5JQG7iQjIQuC4Bku", // Lily
  ar: "onwK4e9ZLuTAKqWW03F9", // Daniel - clear articulation
  en: "JBFqnCBsd6RMkjVDRZzb", // George
  ta: "pFZP5JQG7iQjIQuC4Bku", // Lily - good for Indian languages
  te: "pFZP5JQG7iQjIQuC4Bku", // Lily
  mr: "pFZP5JQG7iQjIQuC4Bku", // Lily
  bn: "pFZP5JQG7iQjIQuC4Bku", // Lily
  or: "pFZP5JQG7iQjIQuC4Bku", // Lily
  ml: "pFZP5JQG7iQjIQuC4Bku", // Lily
  pa: "pFZP5JQG7iQjIQuC4Bku", // Lily
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
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

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Auth validation failed:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`TTS request from authenticated user: ${userId}`);

    const { text, language = "en" } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit text length to prevent abuse
    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Text too long. Maximum 5000 characters allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    const voiceId = VOICE_MAP[language] || VOICE_MAP.en;

    console.log(`TTS request - User: ${userId}, Language: ${language}, Voice: ${voiceId}, Text length: ${text.length}`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs TTS API error:", response.status, errorText);
      throw new Error(`ElevenLabs TTS API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = base64Encode(audioBuffer);

    console.log(`Successfully generated TTS audio for user: ${userId}`);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in elevenlabs-tts:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
