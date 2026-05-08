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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY);

    // Verify caller
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await serviceClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { targetUserId, groupId, action } = await req.json();
    if (!targetUserId || !groupId || !action) {
      return new Response(
        JSON.stringify({ error: "Missing targetUserId, groupId, or action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify a legitimate link request exists between caller and target for this group
    const validActions = ["new_request", "approved", "rejected"];
    if (!validActions.includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let linkReqQuery = serviceClient
      .from("member_link_requests")
      .select("id, status, requester_id, target_user_id, group_id")
      .eq("group_id", groupId);

    if (action === "new_request") {
      // Caller is the requester notifying target
      linkReqQuery = linkReqQuery
        .eq("requester_id", user.id)
        .eq("target_user_id", targetUserId)
        .eq("status", "pending");
    } else {
      // approved/rejected: caller is the target notifying back the requester
      linkReqQuery = linkReqQuery
        .eq("target_user_id", user.id)
        .eq("requester_id", targetUserId)
        .in("status", ["approved", "rejected"]);
    }

    const { data: linkReq } = await linkReqQuery.maybeSingle();
    if (!linkReq) {
      return new Response(
        JSON.stringify({ error: "No matching link request found" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get requester name
    const { data: requesterProfile } = await serviceClient
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single();

    const requesterName = requesterProfile?.full_name || "Someone";

    // Get group name
    const { data: group } = await serviceClient
      .from("family_groups")
      .select("name")
      .eq("id", groupId)
      .single();

    const groupName = group?.name || "Family Group";

    // Build notification content
    let title: string;
    let body: string;

    switch (action) {
      case "new_request":
        title = "🔗 Family Link Request";
        body = `${requesterName} wants to add you to "${groupName}". Tap to review.`;
        break;
      case "approved":
        title = "✅ Link Request Approved";
        body = `Your request to link with "${groupName}" was approved!`;
        break;
      case "rejected":
        title = "❌ Link Request Declined";
        body = `Your request to link with "${groupName}" was declined.`;
        break;
      default:
        title = "🔗 Link Request Update";
        body = `There's an update on your family link request.`;
    }

    // Send push notification
    const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY");
    const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY");

    let pushSent = 0;

    if (VAPID_PUBLIC && VAPID_PRIVATE) {
      const { data: subs } = await serviceClient
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", targetUserId);

      if (subs && subs.length > 0) {
        const { default: webpush } = await import("https://esm.sh/web-push@3.6.7");
        webpush.setVapidDetails(
          "mailto:support@hajjcare.lovable.app",
          VAPID_PUBLIC,
          VAPID_PRIVATE
        );

        const payload = JSON.stringify({
          title,
          body,
          icon: "/favicon.ico",
          data: { url: "/family", action },
          tag: `link-request-${Date.now()}`,
        });

        const stale: string[] = [];

        for (const sub of subs) {
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
              payload
            );
            pushSent++;
          } catch (err: unknown) {
            const e = err as { statusCode?: number };
            if (e?.statusCode === 410 || e?.statusCode === 404) {
              stale.push(sub.endpoint);
            }
          }
        }

        if (stale.length > 0) {
          await serviceClient.from("push_subscriptions").delete().in("endpoint", stale);
        }
      }
    }

    console.log(`[LinkRequestNotify] ${action} → ${targetUserId}: push=${pushSent}`);

    return new Response(
      JSON.stringify({ success: true, pushSent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[LinkRequestNotify] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
