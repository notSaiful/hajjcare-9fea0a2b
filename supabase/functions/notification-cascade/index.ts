import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ─── Stage Labels ────────────────────────────────────────────────────────
const STAGE_LABELS: Record<string, { en: string; ar: string; ur: string; hi: string }> = {
  makkah: { en: "Makkah - Near Haram", ar: "مكة المكرمة - قرب الحرم", ur: "مکہ مکرمہ - حرم کے قریب", hi: "मक्का - हरम के पास" },
  mina: { en: "Mina - Day of Tarwiyah", ar: "منى - يوم التروية", ur: "منی - یوم ترویہ", hi: "मिना - तरविया का दिन" },
  arafat: { en: "Arafat - Day of Standing", ar: "عرفات - يوم الوقوف", ur: "عرفات - یوم وقوف", hi: "अरफात - वुकूफ का दिन" },
  muzdalifah: { en: "Muzdalifah - Night Stay", ar: "مزدلفة - المبيت", ur: "مزدلفہ - رات کا قیام", hi: "मुज़दलिफ़ा - रात का क़याम" },
  jamarat: { en: "Jamarat - Stoning Ritual", ar: "الجمرات - رمي الجمرات", ur: "جمرات - رمی جمرات", hi: "जमरात - कंकड़ मारना" },
  tawaf_ifadah: { en: "Makkah - Tawaf al-Ifadah", ar: "مكة - طواف الإفاضة", ur: "مکہ - طواف افاضہ", hi: "मक्का - तवाफ़ इफ़ाज़ा" },
  completed: { en: "Hajj Completed - Alhamdulillah! 🕋", ar: "اكتمل الحج - الحمد لله! 🕋", ur: "حج مکمل - الحمد للہ! 🕋", hi: "हज मुकम्मल - अलहम्दुलिल्लाह! 🕋" },
};

// ─── Channel Types ───────────────────────────────────────────────────────
type ChannelName = "push" | "whatsapp" | "sms" | "voice";
type ChannelStatus = "sent" | "failed" | "skipped" | "unavailable";

interface ChannelResult {
  channel: ChannelName;
  status: ChannelStatus;
  recipientCount: number;
  error?: string;
}

interface CascadeRequest {
  memberId: string;
  groupId: string;
  newStage: string;
  memberName?: string;
  alertType?: "stage_change" | "emergency" | "health_critical" | "geofence_exit" | "geofence_stationary";
  geofenceDetails?: {
    zoneName: string;
    zoneNameAr?: string;
    violationType: string;
    distanceFromCenter: number;
  };
}

interface Recipient {
  userId: string;
  phone?: string;
  name: string;
}

// ─── Priority map: higher alertType → more channels attempted ─────────
const CHANNEL_PRIORITY: Record<string, ChannelName[]> = {
  stage_change: ["push", "whatsapp"],
  emergency: ["push", "whatsapp", "sms", "voice"],
  health_critical: ["push", "whatsapp", "sms", "voice"],
  geofence_exit: ["push", "whatsapp", "sms", "voice"],
  geofence_stationary: ["push", "whatsapp"],
};

// ─── Web Push sender ─────────────────────────────────────────────────────
async function sendPushNotifications(
  serviceClient: ReturnType<typeof createClient>,
  userIds: string[],
  title: string,
  body: string,
  data: Record<string, string>,
): Promise<ChannelResult> {
  const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY");
  const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY");
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return { channel: "push", status: "unavailable", recipientCount: 0, error: "VAPID keys not configured" };
  }

  const { data: subs } = await serviceClient
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth, user_id")
    .in("user_id", userIds);

  if (!subs || subs.length === 0) {
    return { channel: "push", status: "skipped", recipientCount: 0, error: "No push subscriptions" };
  }

  const { default: webpush } = await import("https://esm.sh/web-push@3.6.7");
  webpush.setVapidDetails("mailto:support@hajjcare.app", VAPID_PUBLIC, VAPID_PRIVATE);

  const payload = JSON.stringify({ title, body, icon: "/favicon.ico", badge: "/favicon.ico", data, tag: `cascade-${Date.now()}` });

  let sent = 0;
  let failed = 0;
  const stale: string[] = [];

  for (const sub of subs) {
    try {
      await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload);
      sent++;
    } catch (err: unknown) {
      failed++;
      const e = err as { statusCode?: number };
      if (e?.statusCode === 410 || e?.statusCode === 404) stale.push(sub.endpoint);
    }
  }

  // Cleanup stale
  if (stale.length > 0) {
    await serviceClient.from("push_subscriptions").delete().in("endpoint", stale);
  }

  return {
    channel: "push",
    status: sent > 0 ? "sent" : "failed",
    recipientCount: sent,
    error: failed > 0 ? `${failed} push deliveries failed` : undefined,
  };
}

// ─── WhatsApp sender ─────────────────────────────────────────────────────
async function sendWhatsAppNotifications(
  recipients: Recipient[],
  message: string,
): Promise<ChannelResult> {
  const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
  const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID");

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    return { channel: "whatsapp", status: "unavailable", recipientCount: 0, error: "WhatsApp not configured" };
  }

  const phonedRecipients = recipients.filter(r => r.phone && r.phone.length >= 10);
  if (phonedRecipients.length === 0) {
    return { channel: "whatsapp", status: "skipped", recipientCount: 0, error: "No phone numbers" };
  }

  const results = await Promise.allSettled(
    phonedRecipients.map(async ({ phone }) => {
      const res = await fetch(`https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone!.replace(/[^0-9]/g, ""),
          type: "text",
          text: { body: message },
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`WhatsApp ${res.status}: ${errText}`);
      }
      return await res.json();
    }),
  );

  const sent = results.filter(r => r.status === "fulfilled").length;
  const failed = results.filter(r => r.status === "rejected").length;

  return {
    channel: "whatsapp",
    status: sent > 0 ? "sent" : "failed",
    recipientCount: sent,
    error: failed > 0 ? `${failed} WhatsApp deliveries failed` : undefined,
  };
}

// ─── SMS placeholder ─────────────────────────────────────────────────────
async function sendSmsNotifications(
  _recipients: Recipient[],
  _message: string,
): Promise<ChannelResult> {
  const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
  const TWILIO_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
  const TWILIO_FROM = Deno.env.get("TWILIO_PHONE_NUMBER");

  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) {
    return { channel: "sms", status: "unavailable", recipientCount: 0, error: "Twilio SMS not configured — add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER" };
  }

  // TODO: Implement Twilio SMS when keys are added
  // const phonedRecipients = _recipients.filter(r => r.phone);
  // for (const { phone } of phonedRecipients) {
  //   await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Basic ${btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)}`,
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({ To: phone!, From: TWILIO_FROM, Body: _message }),
  //   });
  // }

  return { channel: "sms", status: "unavailable", recipientCount: 0, error: "SMS channel not yet activated" };
}

// ─── Voice call placeholder ──────────────────────────────────────────────
async function sendVoiceCallNotifications(
  _recipients: Recipient[],
  _message: string,
): Promise<ChannelResult> {
  const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
  const TWILIO_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
  const TWILIO_FROM = Deno.env.get("TWILIO_PHONE_NUMBER");

  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) {
    return { channel: "voice", status: "unavailable", recipientCount: 0, error: "Twilio Voice not configured — add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER" };
  }

  // TODO: Implement Twilio Voice when keys are added
  // for (const { phone } of _recipients.filter(r => r.phone)) {
  //   await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Calls.json`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Basic ${btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)}`,
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({
  //       To: phone!,
  //       From: TWILIO_FROM,
  //       Twiml: `<Response><Say voice="alice">${_message}</Say></Response>`,
  //     }),
  //   });
  // }

  return { channel: "voice", status: "unavailable", recipientCount: 0, error: "Voice channel not yet activated" };
}

// ─── Channel dispatch map ────────────────────────────────────────────────
const CHANNEL_HANDLERS: Record<ChannelName, (
  recipients: Recipient[],
  message: string,
  serviceClient: ReturnType<typeof createClient>,
  userIds: string[],
  title: string,
  pushData: Record<string, string>,
) => Promise<ChannelResult>> = {
  push: async (_r, _m, sc, uids, title, pushData) => sendPushNotifications(sc, uids, title, _m, pushData),
  whatsapp: async (r, m) => sendWhatsAppNotifications(r, m),
  sms: async (r, m) => sendSmsNotifications(r, m),
  voice: async (r, m) => sendVoiceCallNotifications(r, m),
};

// ─── Main handler ────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await serviceClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Parse request
    const { memberId, groupId, newStage, memberName, alertType = "stage_change", geofenceDetails }: CascadeRequest = await req.json();
    if (!memberId || !groupId) {
      return new Response(JSON.stringify({ error: "memberId and groupId are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Authorization: caller must be a member of the target group OR a staff role
    const [{ data: membership }, { data: roles }] = await Promise.all([
      serviceClient.from("group_members").select("id").eq("group_id", groupId).eq("user_id", user.id).maybeSingle(),
      serviceClient.from("user_roles").select("role").eq("user_id", user.id),
    ]);
    const isStaff = roles?.some((r: { role: string }) => ["admin", "coordinator", "medical_staff"].includes(r.role));
    if (!membership && !isStaff) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Resolve Haji name
    let hajiName = memberName;
    if (!hajiName) {
      const { data: md } = await serviceClient.from("group_members").select("member_name").eq("member_id", memberId).eq("group_id", groupId).single();
      hajiName = md?.member_name || "Your Haji";
    }

    // Get group members to notify (exclude the Haji)
    const { data: groupMembers } = await serviceClient
      .from("group_members")
      .select("user_id, member_name")
      .eq("group_id", groupId)
      .neq("member_id", memberId);

    if (!groupMembers || groupMembers.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No family members to notify", channels: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get phone numbers for recipients
    const userIds = groupMembers.map(m => m.user_id).filter(Boolean) as string[];
    const { data: profiles } = await serviceClient
      .from("profiles")
      .select("phone, full_name, user_id")
      .in("user_id", userIds)
      .eq("family_sharing_enabled", true);

    const recipients: Recipient[] = (profiles || []).map(p => ({
      userId: p.user_id,
      phone: p.phone || undefined,
      name: p.full_name || "Family Member",
    }));

    // Build messages based on alert type
    let pushTitle: string;
    let whatsAppMessage: string;
    let smsMessage: string;
    let pushData: Record<string, string>;

    const isGeofenceAlert = alertType === "geofence_exit" || alertType === "geofence_stationary";

    if (isGeofenceAlert && geofenceDetails) {
      const zoneName = geofenceDetails.zoneNameAr || geofenceDetails.zoneName;
      const distKm = (geofenceDetails.distanceFromCenter / 1000).toFixed(1);

      if (alertType === "geofence_exit") {
        pushTitle = `🚨 ${hajiName} — Left Safe Zone!`;
        whatsAppMessage = `🚨 *Sukoon Safety Alert*\n\nAssalamu Alaikum! ⚠️\n\n*${hajiName}* has left the designated safe zone.\n\n📍 *Zone:* ${geofenceDetails.zoneName}\n🇸🇦 ${zoneName}\n📏 *Distance:* ${distKm} km from zone center\n\nPlease check on them. 🤲\n\n_HajjCare AI — Sukoon Safety_`;
        smsMessage = `HajjCare ALERT: ${hajiName} left safe zone (${geofenceDetails.zoneName}), ${distKm}km away. Please check.`;
      } else {
        pushTitle = `⚠️ ${hajiName} — Not Moving`;
        whatsAppMessage = `⚠️ *Sukoon Safety Alert*\n\nAssalamu Alaikum! 🤲\n\n*${hajiName}* has not moved for an extended period.\n\n📍 *Zone:* ${geofenceDetails.zoneName}\n🇸🇦 ${zoneName}\n\nThey may need assistance. 🤲\n\n_HajjCare AI — Sukoon Safety_`;
        smsMessage = `HajjCare ALERT: ${hajiName} hasn't moved at ${geofenceDetails.zoneName}. They may need help.`;
      }
      pushData = { url: "/family", alertType, zone: geofenceDetails.zoneName };
    } else {
      const stageInfo = STAGE_LABELS[newStage] || { en: newStage, ar: newStage, ur: newStage, hi: newStage };
      pushTitle = `🕋 ${hajiName} — ${stageInfo.en}`;
      whatsAppMessage = `🕋 *Sukoon Tracking Update*\n\nAssalamu Alaikum! 🤲\n\n*${hajiName}* has reached:\n\n📍 *${stageInfo.en}*\n🇸🇦 ${stageInfo.ar}\n\nMay Allah accept their Hajj. 🤲\n\n_HajjCare AI — Sukoon Tracking_`;
      smsMessage = `HajjCare: ${hajiName} has reached ${stageInfo.en}. May Allah accept their Hajj.`;
      pushData = { url: "/hajj-progress", stage: newStage };
    }

    // ─── Cascade: try channels in priority order ───
    const channels = CHANNEL_PRIORITY[alertType] || CHANNEL_PRIORITY.stage_change;
    const results: ChannelResult[] = [];
    let delivered = false;

    for (const channel of channels) {
      const handler = CHANNEL_HANDLERS[channel];
      const message = channel === "whatsapp" ? whatsAppMessage : smsMessage;

      const result = await handler(recipients, message, serviceClient, userIds, pushTitle, pushData);
      results.push(result);

      console.log(`[Cascade] ${channel}: ${result.status} (${result.recipientCount} recipients)${result.error ? ` — ${result.error}` : ""}`);

      if (result.status === "sent") {
        delivered = true;
        // For stage_change/stationary, stop after first successful channel
        // For emergency/critical/geofence_exit, continue to ALL channels
        if (alertType === "stage_change" || alertType === "geofence_stationary") break;
      }
    }

    return new Response(
      JSON.stringify({
        success: delivered,
        alertType,
        stage: newStage,
        hajiName,
        channels: results,
        totalRecipients: recipients.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Notification cascade error:", error);
    return new Response(
      JSON.stringify({ error: "Notification cascade failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
