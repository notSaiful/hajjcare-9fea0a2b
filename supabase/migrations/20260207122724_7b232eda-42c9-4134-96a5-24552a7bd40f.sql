-- Remove unnecessary anonymous INSERT policy on rate_limits table.
-- The check-rate-limit edge function uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS,
-- so this public INSERT policy is not needed and creates an abuse vector.
DROP POLICY IF EXISTS "Allow anonymous rate limit tracking" ON public.rate_limits;

-- Also revoke INSERT from anon and authenticated roles for defense in depth
REVOKE INSERT ON public.rate_limits FROM anon;
REVOKE INSERT ON public.rate_limits FROM authenticated;