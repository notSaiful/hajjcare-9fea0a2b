// Returns the PUBLIC VAPI config (browser SDK public key + assistant id) to a
// signed-in user. These values are public-by-design (safe for the frontend, like
// VITE_SUPABASE_PUBLISHABLE_KEY), but we gate behind a valid user JWT to match the
// app's token pattern and avoid anonymous scraping.
//
// The frontend useVapiCall hook calls this, then starts the VAPI web call with:
//   new Vapi(publicKey).start(assistantId)   (or assistantOverride config)
//
// Secrets (Supabase edge-function env):
//   VAPI_PUBLIC_KEY    — pk_... (browser-safe, from VAPI dashboard)
//   VAPI_ASSISTANT_ID  — the configured Hajj voice assistant id

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
      error: authError,
    } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const publicKey = Deno.env.get("VAPI_PUBLIC_KEY");
    const assistantId = Deno.env.get("VAPI_ASSISTANT_ID");

    if (!publicKey || !assistantId) {
      console.error("Missing VAPI configuration");
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ publicKey, assistantId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in vapi-config:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});