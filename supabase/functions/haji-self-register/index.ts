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

    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { inviteCode, fullName, age, gender, bloodGroup, disease, wheelchair, medicalConditions } = body;

    // Validate required fields
    if (!inviteCode || !fullName || !age || !gender) {
      return new Response(
        JSON.stringify({ error: "Invite code, name, age, and gender are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof fullName !== "string" || fullName.trim().length < 2 || fullName.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be 2-100 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      return new Response(
        JSON.stringify({ error: "Invalid age" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["Male", "Female"].includes(gender)) {
      return new Response(
        JSON.stringify({ error: "Invalid gender" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up group by invite code
    const { data: group, error: groupError } = await supabase
      .from("inspector_pilgrim_groups")
      .select("id, inspector_user_id, group_name, max_capacity")
      .eq("invite_code", inviteCode.trim())
      .maybeSingle();

    if (groupError || !group) {
      return new Response(
        JSON.stringify({ error: "Invalid invite code" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user already registered in this group
    const { data: existing } = await supabase
      .from("inspector_pilgrims")
      .select("id")
      .eq("group_id", group.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "You are already registered in this group" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check capacity
    const { count } = await supabase
      .from("inspector_pilgrims")
      .select("id", { count: "exact", head: true })
      .eq("group_id", group.id);

    if ((count ?? 0) >= group.max_capacity) {
      return new Response(
        JSON.stringify({ error: "Group is full" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Compute risk level
    let riskScore = 0;
    if (ageNum > 70) riskScore += 3;
    else if (ageNum > 60) riskScore += 2;
    if (wheelchair) riskScore += 2;
    const conditions = Array.isArray(medicalConditions) ? medicalConditions : [];
    if (conditions.length > 0) riskScore += 1;
    if (disease && disease !== "None") riskScore += 1;
    const riskLevel = riskScore >= 5 ? "critical" : riskScore >= 3 ? "high" : riskScore >= 1 ? "medium" : "low";

    // Generate pilgrim ID
    const pilgrimId = `HCJ-${Date.now().toString(36).toUpperCase()}`;

    const { data: pilgrim, error: insertError } = await supabase
      .from("inspector_pilgrims")
      .insert({
        group_id: group.id,
        inspector_user_id: group.inspector_user_id,
        user_id: user.id,
        pilgrim_id: pilgrimId,
        full_name: fullName.trim(),
        age: ageNum,
        gender,
        blood_group: bloodGroup || null,
        disease: disease || "None",
        wheelchair: wheelchair || false,
        medical_conditions: conditions,
        risk_level: riskLevel,
        status: "NORMAL",
      })
      .select("id, pilgrim_id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to register" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        pilgrimId: pilgrim.pilgrim_id,
        groupName: group.group_name,
        id: pilgrim.id,
      }),
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
