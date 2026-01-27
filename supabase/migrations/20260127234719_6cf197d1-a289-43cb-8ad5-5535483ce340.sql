-- Fix Security Definer View issue by recreating with security_invoker=on
-- This ensures the view uses the permissions of the querying user, not the view creator

-- Drop and recreate the applicants_status_check view with security_invoker=on
DROP VIEW IF EXISTS public.applicants_status_check;

CREATE VIEW public.applicants_status_check
WITH (security_invoker = on) AS
SELECT 
    application_id,
    status,
    created_at
FROM public.applicants;

-- Grant SELECT on the view to anon and authenticated roles for public status checking
GRANT SELECT ON public.applicants_status_check TO anon;
GRANT SELECT ON public.applicants_status_check TO authenticated;