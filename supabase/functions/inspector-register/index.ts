import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const body = await req.json();
    const { fullName, mobile, city, state, role, languagePreference } = body;

    // Validate required fields
    if (!fullName || !mobile || !city || !state || !role || !languagePreference) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate field formats
    if (typeof fullName !== "string" || fullName.trim().length < 3 || fullName.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be 3-100 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!/^\d{10}$/.test(mobile)) {
      return new Response(
        JSON.stringify({ error: "Invalid 10-digit mobile number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["haj_inspector", "volunteer", "support_staff"].includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof city !== "string" || city.trim().length < 2 || city.length > 50) {
      return new Response(
        JSON.stringify({ error: "Invalid city" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit by mobile number (strongest identifier - 1 registration per mobile per hour)
    const rateLimitResponse = await fetch(
      `${supabaseUrl}/functions/v1/check-rate-limit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          action: "inspector-register",
          identifier: `mobile:${mobile}`,
        }),
      }
    );

    const rateLimitResult = await rateLimitResponse.json();
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: "Too many registration attempts. Please try again later.", resetIn: rateLimitResult.resetIn }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check duplicate mobile
    const { data: existing } = await supabase
      .from("inspector_registrations")
      .select("id")
      .eq("mobile", mobile)
      .not("status", "in", '("rejected","blocked")')
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "This mobile number is already registered" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert registration
    const { data: reg, error: insertError } = await supabase
      .from("inspector_registrations")
      .insert({
        full_name: fullName.trim(),
        mobile,
        city: city.trim(),
        state,
        role,
        language_preference: languagePreference,
        status: role === "haj_inspector" ? "verified" : "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return new Response(
          JSON.stringify({ error: "This mobile number is already registered" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to submit registration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Audit log
    await supabase.from("inspector_audit_log").insert({
      registration_id: reg.id,
      action: "registration_submitted",
      details: { role, state, city: city.trim() },
      performed_by: "self",
    });

    return new Response(
      JSON.stringify({ success: true, id: reg.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
