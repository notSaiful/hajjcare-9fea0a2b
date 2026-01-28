import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface RateLimitRequest {
  action: string;
  identifier: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, identifier }: RateLimitRequest = await req.json();

    if (!action || !identifier) {
      return new Response(
        JSON.stringify({ error: 'Missing action or identifier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit configuration per action
    const rateLimits: Record<string, { maxRequests: number; windowMinutes: number }> = {
      'free-umrah-apply': { maxRequests: 3, windowMinutes: 60 }, // 3 applications per hour
      'free-umrah-status': { maxRequests: 10, windowMinutes: 5 }, // 10 status checks per 5 minutes
    };

    const config = rateLimits[action] || { maxRequests: 10, windowMinutes: 60 };

    // Count recent requests
    const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000).toISOString();
    
    const { count, error: countError } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .eq('action', action)
      .gte('created_at', windowStart);

    if (countError) {
      console.error('Rate limit count error:', countError);
      return new Response(
        JSON.stringify({ error: 'Failed to check rate limit' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentCount = count || 0;
    const allowed = currentCount < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - currentCount - 1);

    // If allowed, record this request
    if (allowed) {
      const { error: insertError } = await supabase
        .from('rate_limits')
        .insert({ identifier, action });

      if (insertError) {
        console.error('Rate limit insert error:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        allowed,
        remaining,
        resetIn: config.windowMinutes,
        message: allowed 
          ? 'Request allowed' 
          : `Rate limit exceeded. Please try again in ${config.windowMinutes} minutes.`
      }),
      { 
        status: allowed ? 200 : 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Rate limit error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
