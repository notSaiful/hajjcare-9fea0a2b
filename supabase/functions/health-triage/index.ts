import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, symptoms, language } = await req.json();

    if (!description) {
      return new Response(
        JSON.stringify({ error: 'Description is required' }),
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

    // Call Lovable AI
    const response = await fetch('https://api.lovable.dev/api/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error('Failed to get AI triage');
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    let triageResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        triageResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Content:', content);
      // Fallback triage
      triageResult = {
        summary: "Health concern reported. Awaiting medical review.",
        arabic_translation: "تم الإبلاغ عن مشكلة صحية. في انتظار المراجعة الطبية.",
        urgency_level: "medium",
        category: "other",
        recommendations: [
          "Rest and stay hydrated",
          "Seek nearby medical tent if symptoms worsen",
          "Keep your phone accessible"
        ],
        suggested_zone: "general"
      };
    }

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
