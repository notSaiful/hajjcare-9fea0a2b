-- Create rate limiting table for Free Umrah submissions
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX idx_rate_limits_lookup ON public.rate_limits(identifier, action, created_at DESC);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous rate limit tracking"
ON public.rate_limits
FOR INSERT
TO public
WITH CHECK (true);

-- Allow reads for rate limit checks (only recent entries matter)
CREATE POLICY "Allow rate limit checks"
ON public.rate_limits
FOR SELECT
TO public
USING (created_at > now() - interval '24 hours');

-- Grant permissions for anonymous users
GRANT INSERT, SELECT ON public.rate_limits TO anon;

-- Auto-cleanup old entries (older than 7 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE created_at < now() - interval '7 days';
END;
$$;