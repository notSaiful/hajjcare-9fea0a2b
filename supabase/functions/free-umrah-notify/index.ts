import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotifyRequest {
  applicationId: string;
  applicantName: string;
  mobile: string;
  status: 'Approved' | 'Rejected';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
    const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID');

    if (!WHATSAPP_TOKEN) {
      throw new Error('WHATSAPP_TOKEN is not configured');
    }
    if (!WHATSAPP_PHONE_ID) {
      throw new Error('WHATSAPP_PHONE_ID is not configured');
    }

    const { applicationId, applicantName, mobile, status }: NotifyRequest = await req.json();

    if (!applicationId || !mobile || !status) {
      return new Response(
        JSON.stringify({ error: 'applicationId, mobile, and status are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format phone number - ensure it has country code (India default)
    let formattedPhone = mobile.replace(/[^0-9]/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone; // Add India country code
    }

    // Construct message based on status
    const statusEmoji = status === 'Approved' ? '✅🎉' : '❌';
    const statusMessage = status === 'Approved' 
      ? `Alhamdulillah! Your application has been APPROVED! 

🕋 You have been selected for the Free Umrah program. Our team will contact you soon with further details about your blessed journey.

May Allah accept your Umrah and make it a source of barakah for you and your family. Ameen.`
      : `We regret to inform you that your application has been REJECTED at this time.

This may be due to high volume of applications or eligibility criteria. You may re-apply in the next cycle.

May Allah grant you the opportunity for Umrah soon. Ameen.`;

    const message = `${statusEmoji} *FREE UMRAH APPLICATION UPDATE*

Assalamu Alaikum ${applicantName},

🆔 Application ID: *${applicationId}*
📋 Status: *${status.toUpperCase()}*

${statusMessage}

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
    console.log(`WhatsApp notification sent to ${formattedPhone} for application ${applicationId}`);

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
        error: 'Failed to send WhatsApp notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
