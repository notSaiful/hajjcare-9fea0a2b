import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get phone number from request body
    const { phone } = await req.json();
    
    if (!phone || typeof phone !== "string") {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean the phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    // Use the secure function to lookup user by phone
    const { data, error } = await supabase.rpc("lookup_user_id_by_phone", {
      target_phone: cleanPhone,
    });

    if (error) {
      console.error("Error looking up user:", error);
      return new Response(
        JSON.stringify({ error: "Failed to lookup user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user was found
    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ 
          found: false, 
          message: "User not registered or has not enabled family sharing" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const foundUser = data[0];

    return new Response(
      JSON.stringify({
        found: true,
        userId: foundUser.user_id,
        userName: foundUser.full_name || "Family Member",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in lookup-user-by-phone:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
