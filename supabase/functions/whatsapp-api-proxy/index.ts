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
    // Authenticate caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
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
        JSON.stringify({ error: "Authentication failed" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin role
    const { data: roles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, endpoint, method, body } = await req.json();

    const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
    const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID");

    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
      return new Response(
        JSON.stringify({
          error: "WhatsApp API not configured",
          details: {
            token_set: !!WHATSAPP_TOKEN,
            phone_id_set: !!WHATSAPP_PHONE_ID,
          },
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: validate - check if credentials work
    if (action === "validate") {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}`,
        {
          headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
        }
      );

      const data = await response.json();

      return new Response(
        JSON.stringify({
          success: response.ok,
          status: response.status,
          status_text: response.statusText,
          data: response.ok ? data : undefined,
          error: !response.ok ? data : undefined,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: send_message - convenience for sending a message
    if (action === "send_message") {
      const targetUrl = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;
      console.log(`[whatsapp-api-proxy] Admin ${user.id} -> send_message`);

      const startTime = Date.now();
      try {
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const responseData = await response.json();
        return new Response(
          JSON.stringify({
            success: response.ok,
            status: response.status,
            status_text: response.statusText,
            latency_ms: Date.now() - startTime,
            data: response.ok ? responseData : undefined,
            error: !response.ok ? responseData : undefined,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (fetchErr) {
        return new Response(
          JSON.stringify({
            success: false,
            network_error: true,
            error: fetchErr instanceof Error ? fetchErr.message : "Network error",
            latency_ms: Date.now() - startTime,
          }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Action: proxy - forward a request to WhatsApp Cloud API
    if (action === "proxy") {
      if (!endpoint || typeof endpoint !== "string") {
        return new Response(
          JSON.stringify({ error: "Missing or invalid 'endpoint' field" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Whitelist allowed endpoint prefixes
      const allowedPrefixes = [
        `/v18.0/${WHATSAPP_PHONE_ID}/messages`,
        `/v18.0/${WHATSAPP_PHONE_ID}/message_templates`,
        `/v18.0/${WHATSAPP_PHONE_ID}`,
      ];

      const isAllowed = allowedPrefixes.some((prefix) => endpoint.startsWith(prefix));
      if (!isAllowed) {
        return new Response(
          JSON.stringify({ error: "Endpoint not allowed. Must target your configured phone ID." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const targetUrl = `https://graph.facebook.com${endpoint}`;
      const fetchMethod = (method || "GET").toUpperCase();

      console.log(`[whatsapp-api-proxy] Admin ${user.id} -> ${fetchMethod} ${targetUrl}`);

      const startTime = Date.now();
      let response: Response;
      let responseData: unknown;
      let networkError: string | null = null;

      try {
        response = await fetch(targetUrl, {
          method: fetchMethod,
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: body && fetchMethod !== "GET" ? JSON.stringify(body) : undefined,
        });

        responseData = await response.json();
      } catch (fetchErr) {
        networkError = fetchErr instanceof Error ? fetchErr.message : "Network error";
        return new Response(
          JSON.stringify({
            success: false,
            network_error: true,
            error: networkError,
            hint: "This is a server-side network error reaching graph.facebook.com. Check that your token and phone ID are correct.",
            latency_ms: Date.now() - startTime,
          }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: response!.ok,
          status: response!.status,
          status_text: response!.statusText,
          latency_ms: Date.now() - startTime,
          data: response!.ok ? responseData : undefined,
          error: !response!.ok ? responseData : undefined,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'validate' or 'proxy'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("whatsapp-api-proxy error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
