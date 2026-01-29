-- Fix security issue: Remove overly permissive INSERT policy on applicants table
-- The free-umrah-apply edge function uses service role key, so it will still work
-- This prevents direct database API bypass attacks

-- Drop the permissive "Public can submit application" policy
DROP POLICY IF EXISTS "Public can submit application" ON public.applicants;

-- Revoke INSERT permission from anon role to prevent direct API access
REVOKE INSERT ON public.applicants FROM anon;

-- Also revoke from authenticated to ensure all inserts go through edge function
REVOKE INSERT ON public.applicants FROM authenticated;