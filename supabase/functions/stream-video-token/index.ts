import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { StreamClient } from "https://esm.sh/@stream-io/node-sdk@0.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;

    // Fetch user profile for display name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .single();

    const streamApiKey = Deno.env.get("STREAM_API_KEY");
    const streamApiSecret = Deno.env.get("STREAM_API_SECRET");

    if (!streamApiKey || !streamApiSecret) {
      return new Response(
        JSON.stringify({ error: "Stream API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const streamClient = new StreamClient(streamApiKey, streamApiSecret);
    
    // Generate token valid for 24 hours
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;
    
    const streamToken = streamClient.createToken(userId, expirationTime, issuedAt);

    return new Response(
      JSON.stringify({
        token: streamToken,
        userId,
        userName: profile?.full_name || "Pilgrim",
        apiKey: streamApiKey,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating Stream token:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate token" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
