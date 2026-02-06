-- Fix 1: Remove public SELECT access from rate_limits table
-- The check-rate-limit edge function uses service role key, so public access is unnecessary
DROP POLICY IF EXISTS "Allow rate limit checks" ON public.rate_limits;

-- Fix 2: Recreate applicants_status_check view with security_invoker = on
-- This ensures the view runs with caller privileges instead of definer privileges
DROP VIEW IF EXISTS public.applicants_status_check;

CREATE VIEW public.applicants_status_check
WITH (security_invoker = on) AS
SELECT 
  application_id,
  status,
  state,
  city,
  created_at
FROM public.applicants;

-- Grant SELECT access to the view for public status checking
GRANT SELECT ON public.applicants_status_check TO anon;
GRANT SELECT ON public.applicants_status_check TO authenticated;