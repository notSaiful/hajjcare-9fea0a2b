-- CRITICAL FIX: Remove the overly permissive anon policy that exposes all data
DROP POLICY IF EXISTS "Anyone can read application status via view" ON public.applicants;

-- Drop and recreate view properly using security definer behavior (default, no security_invoker)
-- This is intentional and safe because the view only exposes non-sensitive fields
DROP VIEW IF EXISTS public.applicants_status_check;

-- Create view WITHOUT security_invoker (defaults to security definer behavior)
-- The view runs with owner privileges and only exposes: application_id, status, created_at
-- This is the ONLY way to allow public status checks while protecting PII in the base table
CREATE VIEW public.applicants_status_check AS
  SELECT 
    application_id,
    status,
    created_at
  FROM public.applicants;

-- Grant access to the view for both anonymous and authenticated users
GRANT SELECT ON public.applicants_status_check TO anon;
GRANT SELECT ON public.applicants_status_check TO authenticated;