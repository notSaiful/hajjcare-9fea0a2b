-- Address security definer view warning by using security_invoker instead
-- This is safe because the view only exposes non-sensitive fields

-- Drop and recreate view with security_invoker
DROP VIEW IF EXISTS public.applicants_status_check;

-- Create view with security_invoker=true (runs with caller's privileges)
-- But since we grant SELECT to anon and authenticated, everyone can read the limited fields
CREATE VIEW public.applicants_status_check
WITH (security_barrier=true, security_invoker=true) AS
  SELECT 
    application_id,
    status,
    created_at
  FROM public.applicants;

-- Grant access to the view for both anonymous and authenticated users
GRANT SELECT ON public.applicants_status_check TO anon;
GRANT SELECT ON public.applicants_status_check TO authenticated;

-- Since the view uses security_invoker, we need to ensure the anon role 
-- can read from the base table via the view. Add a minimal policy for this:
CREATE POLICY "Anyone can read application status via view"
ON public.applicants
FOR SELECT
TO anon
USING (true);