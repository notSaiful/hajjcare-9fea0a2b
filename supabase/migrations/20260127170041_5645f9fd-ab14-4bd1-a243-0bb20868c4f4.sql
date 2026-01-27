-- Fix security issues: applicants PII exposure and status check view security

-- Drop existing view first
DROP VIEW IF EXISTS public.applicants_status_check;

-- Recreate view with security_barrier to prevent data leakage
-- security_invoker=off means the view runs with definer privileges, not caller privileges
-- This allows public access to the view while the base table remains protected
CREATE VIEW public.applicants_status_check
WITH (security_barrier=true) AS
  SELECT 
    application_id,
    status,
    created_at
  FROM public.applicants;

-- Grant access to the view for both anonymous and authenticated users
GRANT SELECT ON public.applicants_status_check TO anon;
GRANT SELECT ON public.applicants_status_check TO authenticated;

-- Now fix the base table RLS policies
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public can only check application status" ON public.applicants;

-- Create strict policy: Only coordinators/admins can view all applications
-- Users can only view their own applications
CREATE POLICY "Coordinators can view all applications"
ON public.applicants
FOR SELECT
TO authenticated
USING (is_coordinator_or_admin(auth.uid()));

CREATE POLICY "Users can view their own applications"
ON public.applicants
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);