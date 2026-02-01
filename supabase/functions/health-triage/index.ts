import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// Zod schema for validating AI triage response
const TriageSchema = z.object({
  summary: z.string().min(1).max(1000).default("Health concern reported. Awaiting medical review."),
  arabic_translation: z.string().min(1).max(1000).default("تم الإبلاغ عن مشكلة صحية. في انتظار المراجعة الطبية."),
  urgency_level: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  category: z.string().min(1).max(100).default('other'),
  recommendations: z.array(z.string().max(500)).min(1).max(10).default([
    "Rest and stay hydrated",
    "Seek nearby medical tent if symptoms worsen",
    "Keep your phone accessible"
  ]),
  suggested_zone: z.string().min(1).max(100).default('general')
});

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

    const { description, symptoms, language } = await req.json();

    if (!description || typeof description !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Description is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate description length
    if (description.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Description too long. Maximum 2000 characters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate symptoms if provided
    if (symptoms && (!Array.isArray(symptoms) || symptoms.length > 20)) {
      return new Response(
        JSON.stringify({ error: 'Invalid symptoms format or too many symptoms' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare prompt for AI triage
    const prompt = `You are a medical triage assistant for Hajj pilgrims. Analyze the following health concern and provide:

1. A brief summary in English (2-3 sentences)
2. Translation to Arabic (for coordinators)
3. Urgency level: "low", "medium", "high", or "critical"
4. Category: e.g., "respiratory", "cardiac", "dehydration", "injury", "gastrointestinal", "fatigue", "mental_health", "other"
5. 2-3 practical recommendations for immediate care
6. Suggested zone alert: "makkah_medical", "madinah_medical", "mina_medical", "arafat_medical", "general"

Patient's description (in ${language || 'unknown language'}):
"${description}"

${symptoms?.length ? `Reported symptoms: ${symptoms.join(', ')}` : ''}

Respond in this exact JSON format:
{
  "summary": "Brief medical summary in English",
  "arabic_translation": "الترجمة العربية للملخص",
  "urgency_level": "medium",
  "category": "dehydration",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "suggested_zone": "makkah_medical"
}`;

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a medical triage AI assistant. Always respond with valid JSON only, no markdown or extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error('Failed to get AI triage');
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || '';
    
    // Parse and validate JSON from response using zod
    let triageResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate with zod schema - uses defaults for missing/invalid fields
        triageResult = TriageSchema.parse(parsed);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse/validation error:', parseError, 'Content:', content);
      // Fallback triage with safe defaults
      triageResult = TriageSchema.parse({});
    }

    console.log(`Health triage completed for user ${user.id}:`, triageResult.urgency_level);

    return new Response(
      JSON.stringify({
        success: true,
        triage: triageResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in health-triage:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process health triage',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
