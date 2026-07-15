// Rumik TTS for browser read-aloud (per-message / page-content TTS).
//
// Auth-gated by the user's Supabase JWT (same pattern as the old elevenlabs-tts).
// Body: { text, language }. We call Rumik Silk /v1/tts with the `muga` model
// (or whatever RUMIK_MODEL is set to) and return the 24 kHz mono WAV directly,
// Content-Type: audio/wav — the browser plays it via a blob URL on an <audio>
// element. On any failure we return 503 so the client can fall back to Web Speech.
//
// ⚠ Language coverage note: Rumik `muga` is Hinglish-first (hi/ur/en). Quality on
// ar/ta/te/mr/bn/or/ml/pa is UNVERIFIED — test and, if needed, set RUMIK_MODEL per
// language via a future RUMIK_LANG_CONFIG map (mulberry + description). For now
// all languages route to muga, matching "all voice Rumik".

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RUMIK_BASE_URL = "https://silk-api.rumik.ai";
const RUMIK_TEXT_LIMIT = 5000;
const RUMIK_TIMEOUT_MS = 20_000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate user JWT.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, language = "en" } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (text.length > RUMIK_TEXT_LIMIT) {
      return new Response(
        JSON.stringify({ error: `Text too long. Maximum ${RUMIK_TEXT_LIMIT} characters.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RUMIK_API_KEY = Deno.env.get("RUMIK_API_KEY");
    if (!RUMIK_API_KEY) {
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const model = Deno.env.get("RUMIK_MODEL") || "muga";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), RUMIK_TIMEOUT_MS);

    try {
      // Rumik returns a 24 kHz mono 16-bit WAV for the HTTP endpoint.
      const res = await fetch(`${RUMIK_BASE_URL}/v1/tts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RUMIK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, text }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error(`Rumik TTS error (${res.status}):`, errText.slice(0, 200));
        return new Response(JSON.stringify({ error: "TTS failed" }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const wav = await res.arrayBuffer();
      return new Response(wav, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "audio/wav",
          "Content-Length": String(wav.byteLength),
        },
      });
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.error("Error in rumik-tts:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});