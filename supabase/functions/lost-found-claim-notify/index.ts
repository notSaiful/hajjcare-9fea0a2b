// Notify the owner of a Lost & Found report when someone claims it.
// Sends a WhatsApp message to the reporter_mobile / reporter_whatsapp on file.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
    const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID");

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { claimId, eventType } = await req.json();
    if (!claimId || typeof claimId !== "string") {
      return new Response(JSON.stringify({ error: "claimId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: claim } = await admin
      .from("lost_found_claims")
      .select("*, report:lost_and_found!inner(reporter_mobile, reporter_whatsapp, reporter_name, item_name, person_name, last_seen_location, post_kind)")
      .eq("id", claimId)
      .maybeSingle();

    if (!claim) {
      return new Response(JSON.stringify({ error: "Claim not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Authorization: claimant or owner can trigger
    if (claim.claimant_user_id !== user.id && claim.owner_user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const report = (claim as any).report;
    const subject =
      report?.item_name || report?.person_name || "your found report";
    const phone = (report?.reporter_whatsapp || report?.reporter_mobile || "").replace(/\D/g, "");

    let message = "";
    if (eventType === "new_claim") {
      message =
        `🕌 HajjCare — New claim on ${subject}\n\n` +
        `Claimant: ${claim.claimant_name}\n` +
        `Contact: ${claim.claimant_mobile}\n` +
        `Details: ${claim.claim_description}\n\n` +
        `Open the app to approve or reject this claim.`;
    } else if (eventType === "claim_responded") {
      message =
        `🕌 HajjCare — Your claim on "${subject}" was ${claim.status}.\n` +
        (claim.owner_response_note ? `Note: ${claim.owner_response_note}\n` : "") +
        `\nOpen the app for next steps.`;
    } else {
      message = `🕌 HajjCare — Update on claim for "${subject}".`;
    }

    let waResult: any = { skipped: true };
    if (WHATSAPP_TOKEN && WHATSAPP_PHONE_ID && phone) {
      const res = await fetch(
        `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phone,
            type: "text",
            text: { body: message },
          }),
        }
      );
      waResult = await res.json().catch(() => ({ ok: res.ok }));
    }

    return new Response(JSON.stringify({ success: true, wa: waResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("lost-found-claim-notify error", err);
    return new Response(JSON.stringify({ error: err?.message || "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
