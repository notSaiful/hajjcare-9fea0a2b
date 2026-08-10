import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotifyRequest {
  applicationId: string;
  applicantName: string;
  mobile: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SELECTED';
  rejectionReason?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication - only coordinators/admins should send notifications
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message || "No user found");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has coordinator or admin role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'coordinator'])
      .maybeSingle();

    if (!roleData) {
      console.error("User is not a coordinator or admin:", user.id);
      return new Response(
        JSON.stringify({ error: "Forbidden - Coordinator access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
    const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID');

    if (!WHATSAPP_TOKEN) {
      throw new Error('WHATSAPP_TOKEN is not configured');
    }
    if (!WHATSAPP_PHONE_ID) {
      throw new Error('WHATSAPP_PHONE_ID is not configured');
    }

    const { applicationId, applicantName, mobile, status, rejectionReason }: NotifyRequest = await req.json();

    if (!applicationId || !mobile || !status) {
      return new Response(
        JSON.stringify({ error: 'applicationId, mobile, and status are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate status
    const validStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SELECTED'];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format phone number - ensure it has country code (India default)
    let formattedPhone = mobile.replace(/[^0-9]/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone; // Add India country code
    }

    // Validate phone number length
    if (formattedPhone.length < 10 || formattedPhone.length > 15) {
      return new Response(
        JSON.stringify({ error: 'Invalid mobile number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct message based on status
    const getStatusDetails = (status: string, rejectionReason?: string) => {
      switch (status) {
        case 'SUBMITTED':
          return {
            emoji: '📝',
            title: 'APPLICATION RECEIVED',
            message: `Your application has been successfully submitted. 

🔍 Our team will review your application shortly. Please keep this Application ID safe for future reference.

JazakAllahu Khair for your patience.`
          };
        case 'UNDER_REVIEW':
          return {
            emoji: '🔍',
            title: 'UNDER REVIEW',
            message: `Great news! Your application is now under review by our team.

📋 We are verifying your documents and eligibility. You will be notified once the review is complete.

Please continue to make dua. May Allah make this journey possible for you.`
          };
        case 'VERIFIED':
          return {
            emoji: '✅',
            title: 'VERIFIED',
            message: `Alhamdulillah! Your application has been VERIFIED.

📋 Your documents and eligibility have been confirmed. You are now in the selection pool for the Free Umrah program.

Final selection will be announced soon. InshaAllah!`
          };
        case 'REJECTED':
          return {
            emoji: '❌',
            title: 'NOT SELECTED',
            message: `We regret to inform you that your application could not be approved at this time.

${rejectionReason ? `📝 Reason: ${rejectionReason}\n\n` : ''}This may be due to high volume of applications or eligibility criteria. You may re-apply in the next cycle.

May Allah grant you the opportunity for Umrah soon. Ameen.`
          };
        case 'SELECTED':
          return {
            emoji: '🎉🕋',
            title: 'SELECTED - CONGRATULATIONS!',
            message: `Alhamdulillah! MUBARAK HO! 🎊

🕋 You have been SELECTED for the Free Umrah program! Our team will contact you very soon with further details about your blessed journey.

Please keep your phone reachable and documents ready.

May Allah accept your Umrah and make it a source of barakah for you and your family. Ameen.`
          };
        default:
          return {
            emoji: '📢',
            title: 'STATUS UPDATE',
            message: `Your application status has been updated to: ${status}`
          };
      }
    };

    const statusDetails = getStatusDetails(status, rejectionReason);

    const message = `${statusDetails.emoji} *FREE UMRAH ${statusDetails.title}*

Assalamu Alaikum ${applicantName},

🆔 Application ID: *${applicationId}*
📋 Status: *${status}*

${statusDetails.message}

---
Haj Care AI - Deeni Khidmat Program
🌐 Visit: hajjcare.lovable.app`;

    // Send WhatsApp message
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
          to: formattedPhone,
          type: 'text',
          text: { body: message }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WhatsApp API error:', errorText);
      throw new Error(`WhatsApp API error: ${response.status}`);
    }

    const result = await response.json();
    console.log(`WhatsApp notification sent by ${user.id} to ${formattedPhone} for application ${applicationId}`);

    return new Response(
      JSON.stringify({
        success: true,
        applicationId,
        status,
        messageSent: true,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in free-umrah-notify:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send WhatsApp notification'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
