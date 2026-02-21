import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Zone-based WhatsApp group mappings loaded from environment variables
// Configure via secrets: WHATSAPP_ZONE_MAKKAH_MEDICAL, WHATSAPP_ZONE_MADINAH_MEDICAL, etc.
const parsePhoneList = (envVar: string): string[] =>
  (Deno.env.get(envVar) || '').split(',').map(s => s.trim()).filter(Boolean);

const ZONE_GROUPS: Record<string, string[]> = {
  makkah_medical: parsePhoneList('WHATSAPP_ZONE_MAKKAH_MEDICAL'),
  madinah_medical: parsePhoneList('WHATSAPP_ZONE_MADINAH_MEDICAL'),
  mina_medical: parsePhoneList('WHATSAPP_ZONE_MINA_MEDICAL'),
  arafat_medical: parsePhoneList('WHATSAPP_ZONE_ARAFAT_MEDICAL'),
  general: parsePhoneList('WHATSAPP_ZONE_GENERAL'),
};

interface AlertRequest {
  ticketId: string;
  zone: string;
  urgencyLevel: string;
  summary: string;
  arabicText: string;
  category: string;
  location?: { lat: number; lng: number };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
    const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!WHATSAPP_TOKEN) {
      throw new Error('WHATSAPP_TOKEN is not configured');
    }
    if (!WHATSAPP_PHONE_ID) {
      throw new Error('WHATSAPP_PHONE_ID is not configured');
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    // Validate caller is authenticated
    const supabaseClient = createClient(
      SUPABASE_URL,
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

    // Use service role for database updates
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { ticketId, zone, urgencyLevel, summary, arabicText, category, location }: AlertRequest = await req.json();

    if (!ticketId || !zone) {
      return new Response(
        JSON.stringify({ error: 'ticketId and zone are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate ticketId format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ticketId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid ticketId format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get phone numbers for the zone
    const targetZone = zone in ZONE_GROUPS ? zone : 'general';
    const phoneNumbers = ZONE_GROUPS[targetZone];

    if (phoneNumbers.length === 0) {
      console.log(`No phone numbers configured for zone: ${targetZone}`);
      // Still update the ticket to mark alert as attempted
      await supabase
        .from('health_tickets')
        .update({
          status: 'whatsapp_alerted',
          whatsapp_group_alerted: targetZone,
          alert_sent_at: new Date().toISOString(),
          coordinator_notes: `[Auto] WhatsApp alert skipped - no numbers configured for ${targetZone}`
        })
        .eq('id', ticketId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No phone numbers configured for zone',
          zone: targetZone 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct alert message
    const urgencyEmoji = {
      critical: '🚨🚨🚨',
      high: '⚠️⚠️',
      medium: '⚠️',
      low: 'ℹ️'
    }[urgencyLevel] || '⚠️';

    const locationText = location 
      ? `📍 Location: https://maps.google.com/?q=${location.lat},${location.lng}`
      : '';

    const message = `${urgencyEmoji} *HEALTH ALERT - ${urgencyLevel.toUpperCase()}*

🏷️ Category: ${category || 'General'}
📍 Zone: ${targetZone.replace('_', ' ').toUpperCase()}

📋 *Summary:*
${summary}

🇸🇦 *Arabic:*
${arabicText}

${locationText}

🆔 Ticket: ${ticketId.slice(0, 8)}
⏰ Time: ${new Date().toLocaleString('en-SA', { timeZone: 'Asia/Riyadh' })}

Please respond via the Coordinator Dashboard.`;

    // Send WhatsApp messages to all numbers in the zone
    const sendResults = await Promise.allSettled(
      phoneNumbers.map(async (phoneNumber) => {
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
              to: phoneNumber.replace(/[^0-9]/g, ''),
              type: 'text',
              text: { body: message }
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`WhatsApp API error for ${phoneNumber}: ${response.status} - ${errorText}`);
        }

        return await response.json();
      })
    );

    // Count successes and failures
    const successes = sendResults.filter(r => r.status === 'fulfilled').length;
    const failures = sendResults.filter(r => r.status === 'rejected').length;

    console.log(`WhatsApp alerts sent by user ${user.id}: ${successes} success, ${failures} failed`);

    // Update ticket status
    const { error: updateError } = await supabase
      .from('health_tickets')
      .update({
        status: 'whatsapp_alerted',
        whatsapp_group_alerted: targetZone,
        alert_sent_at: new Date().toISOString(),
        coordinator_notes: `[Auto] WhatsApp alert sent to ${successes}/${phoneNumbers.length} numbers in ${targetZone}`
      })
      .eq('id', ticketId);

    if (updateError) {
      console.error('Error updating ticket:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        zone: targetZone,
        alertsSent: successes,
        alertsFailed: failures,
        totalRecipients: phoneNumbers.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in whatsapp-alert:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send WhatsApp alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
