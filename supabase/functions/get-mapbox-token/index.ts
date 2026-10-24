import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Returns the public Mapbox token (pk.*) for maps that are public pages.
 * Restrict the token by URL in the Mapbox dashboard. Do not put a secret sk token here.
 * Login is not required: /map, /mashair-map and /madinah-hotels are public routes.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
  if (!mapboxToken) {
    return new Response(
      JSON.stringify({ error: "MAPBOX_PUBLIC_TOKEN is not configured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({ token: mapboxToken }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
