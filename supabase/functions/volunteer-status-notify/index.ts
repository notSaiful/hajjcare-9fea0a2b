import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Auth check - admin only
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    // Verify admin role
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roles?.length) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const { volunteer_id, volunteer_name, mobile, new_status, whatsapp_number } = await req.json();

    if (!volunteer_id || !new_status || !whatsapp_number) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
    }

    const statusMessages: Record<string, string> = {
      registered: `✅ Your volunteer registration (${volunteer_id}) has been received. We will review it shortly. - HajCare AI`,
      screening: `🔍 Your volunteer application (${volunteer_id}) is now under screening. Please keep your documents ready. - HajCare AI`,
      shortlisted: `🎉 Congratulations! Your application (${volunteer_id}) has been shortlisted for Hajj volunteer service. Training details will follow. - HajCare AI`,
      training: `📚 Dear ${volunteer_name}, you are now enrolled for volunteer training (${volunteer_id}). Check the app for schedule. - HajCare AI`,
      assessed: `✅ Your training assessment for ${volunteer_id} is complete. Results will be shared soon. - HajCare AI`,
      deployed: `🕋 Alhamdulillah! You (${volunteer_id}) have been deployed for Hajj duty. Report to your assigned location. - HajCare AI`,
      rejected: `We regret to inform you that your volunteer application (${volunteer_id}) could not be accepted at this time. - HajCare AI`,
    };

    const message = statusMessages[new_status] || `Your volunteer status (${volunteer_id}) has been updated to: ${new_status}. - HajCare AI`;

    const whatsappToken = Deno.env.get("WHATSAPP_TOKEN");
    const phoneId = Deno.env.get("WHATSAPP_PHONE_ID");

    if (!whatsappToken || !phoneId) {
      return new Response(JSON.stringify({ success: true, whatsapp_sent: false, reason: "WhatsApp not configured" }), { headers: corsHeaders });
    }

    // Clean phone number
    const cleanPhone = whatsapp_number.replace(/[^0-9]/g, "");
    const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

    const waRes = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${whatsappToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: fullPhone,
        type: "text",
        text: { body: message },
      }),
    });

    const waData = await waRes.json();

    return new Response(JSON.stringify({
      success: true,
      whatsapp_sent: waRes.ok,
      whatsapp_response: waData,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
