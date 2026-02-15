-- Remove public INSERT policy on inspector_registrations
-- All registrations now go through the inspector-register edge function with rate limiting
DROP POLICY IF EXISTS "Anyone can register" ON public.inspector_registrations;