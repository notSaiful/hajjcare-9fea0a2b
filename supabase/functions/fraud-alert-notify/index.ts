import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Minimal Web Push implementation for Deno
async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
) {
  // Import crypto utilities
  const { default: webpush } = await import("https://esm.sh/web-push@3.6.7");
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth },
    },
    payload
  );
}

Deno.serve(async (req) => {
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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { title, severity, alertId } = await req.json();

    if (!title || !severity) {
      return new Response(
        JSON.stringify({ error: "title and severity are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get all push subscriptions using service role
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: subscriptions, error: subError } = await serviceClient
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth");

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscriptions" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;

    const payload = JSON.stringify({
      title: severity === "critical" ? "🚨 CRITICAL FRAUD ALERT" : "⚠️ Fraud Alert",
      body: title,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { url: "/sukoon-rd", alertId },
      tag: `fraud-alert-${alertId}`,
    });

    let sent = 0;
    let failed = 0;
    const staleEndpoints: string[] = [];

    for (const sub of subscriptions || []) {
      try {
        await sendWebPush(
          sub,
          payload,
          vapidPublicKey,
          vapidPrivateKey,
          "mailto:support@hajjcare.app"
        );
        sent++;
      } catch (err: unknown) {
        const error = err as { statusCode?: number };
        console.error("Push failed for endpoint:", sub.endpoint, err);
        failed++;
        // If subscription expired (410 Gone), mark for cleanup
        if (error?.statusCode === 410 || error?.statusCode === 404) {
          staleEndpoints.push(sub.endpoint);
        }
      }
    }

    // Cleanup stale subscriptions
    if (staleEndpoints.length > 0) {
      await serviceClient
        .from("push_subscriptions")
        .delete()
        .in("endpoint", staleEndpoints);
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent,
        failed,
        cleaned: staleEndpoints.length,
        total: (subscriptions || []).length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Fraud alert notify error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
