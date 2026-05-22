import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Hajj stage labels for notifications
const STAGE_LABELS: Record<string, { en: string; ar: string; ur: string; hi: string }> = {
  makkah: {
    en: "Makkah - Near Haram",
    ar: "مكة المكرمة - قرب الحرم",
    ur: "مکہ مکرمہ - حرم کے قریب",
    hi: "मक्का - हरम के पास"
  },
  mina: {
    en: "Mina - Day of Tarwiyah",
    ar: "منى - يوم التروية",
    ur: "منی - یوم ترویہ",
    hi: "मिना - तरविया का दिन"
  },
  arafat: {
    en: "Arafat - Day of Standing (Wuquf)",
    ar: "عرفات - يوم الوقوف",
    ur: "عرفات - یوم وقوف",
    hi: "अरफात - वुकूफ का दिन"
  },
  muzdalifah: {
    en: "Muzdalifah - Night Stay",
    ar: "مزدلفة - المبيت",
    ur: "مزدلفہ - رات کا قیام",
    hi: "मुज़दलिफ़ा - रात का क़याम"
  },
  jamarat: {
    en: "Jamarat - Stoning Ritual",
    ar: "الجمرات - رمي الجمرات",
    ur: "جمرات - رمی جمرات",
    hi: "जमरात - कंकड़ मारना"
  },
  tawaf_ifadah: {
    en: "Makkah - Tawaf al-Ifadah",
    ar: "مكة - طواف الإفاضة",
    ur: "مکہ - طواف افاضہ",
    hi: "मक्का - तवाफ़ इफ़ाज़ा"
  },
  completed: {
    en: "Hajj Completed - Alhamdulillah! 🕋",
    ar: "اكتمل الحج - الحمد لله! 🕋",
    ur: "حج مکمل - الحمد للہ! 🕋",
    hi: "हज मुकम्मल - अलहम्दुलिल्लाह! 🕋"
  }
};

interface NotifyRequest {
  memberId: string;
  groupId: string;
  newStage: string;
  memberName?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
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

    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
    const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
      throw new Error('WhatsApp credentials not configured');
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    // Validate caller using the service role client to verify the token
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Extract and verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth validation failed:', authError?.message || 'No user found');
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log('Authenticated user:', user.id, user.email);

    const supabase = supabaseAdmin; // Use the admin client for data operations

    const { memberId, groupId, newStage, memberName }: NotifyRequest = await req.json();

    if (!memberId || !groupId || !newStage) {
      return new Response(
        JSON.stringify({ error: 'memberId, groupId, and newStage are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Authorization: caller must be a member of the target group OR a staff role
    const [{ data: membership }, { data: roles }] = await Promise.all([
      supabase.from('group_members').select('id').eq('group_id', groupId).eq('user_id', user.id).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', user.id),
    ]);
    const isStaff = roles?.some((r: { role: string }) => ['admin', 'coordinator', 'medical_staff'].includes(r.role));
    if (!membership && !isStaff) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the Haji's name from group_members if not provided
    let hajiName = memberName;
    if (!hajiName) {
      const { data: memberData } = await supabase
        .from('group_members')
        .select('member_name')
        .eq('member_id', memberId)
        .eq('group_id', groupId)
        .single();
      hajiName = memberData?.member_name || 'Your Haji';
    }

    // Get family members in the same group (those who should be notified)
    // We need profiles with phone numbers and family_sharing_enabled
    const { data: groupMembers } = await supabase
      .from('group_members')
      .select('user_id, member_name')
      .eq('group_id', groupId)
      .neq('member_id', memberId); // Exclude the Haji themselves

    if (!groupMembers || groupMembers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No family members to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get phone numbers for family members
    const userIds = groupMembers.map(m => m.user_id).filter(Boolean);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('phone, full_name, user_id')
      .in('user_id', userIds)
      .eq('family_sharing_enabled', true);

    const phoneNumbers = profiles
      ?.filter(p => p.phone && p.phone.length >= 10)
      .map(p => ({ phone: p.phone!, name: p.full_name || 'Family Member' })) || [];

    if (phoneNumbers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No phone numbers available for notification' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get stage labels
    const stageInfo = STAGE_LABELS[newStage] || {
      en: newStage,
      ar: newStage,
      ur: newStage,
      hi: newStage
    };

    // Construct WhatsApp message
    const message = `🕋 *Sukoon Tracking Update*

Assalamu Alaikum! 🤲

*${hajiName}* has reached a new stage in their blessed Hajj journey:

📍 *${stageInfo.en}*
🇸🇦 ${stageInfo.ar}

May Allah accept their Hajj and keep them safe. 🤲

---
_HajjCare AI - Sukoon Tracking System_
_"Haji Saudi mein, Ghar wale sukoon mein"_`;

    // Send WhatsApp messages
    const sendResults = await Promise.allSettled(
      phoneNumbers.map(async ({ phone }) => {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: phone.replace(/[^0-9]/g, ''),
              type: 'text',
              text: { body: message }
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`WhatsApp API error: ${response.status} - ${errorText}`);
        }

        return await response.json();
      })
    );

    const successes = sendResults.filter(r => r.status === 'fulfilled').length;
    const failures = sendResults.filter(r => r.status === 'rejected').length;

    console.log(`Sukoon stage notifications sent: ${successes} success, ${failures} failed for stage: ${newStage}`);

    return new Response(
      JSON.stringify({
        success: true,
        stage: newStage,
        hajiName,
        alertsSent: successes,
        alertsFailed: failures,
        totalRecipients: phoneNumbers.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sukoon-stage-notify:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send stage notification'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
