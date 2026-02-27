
-- Remove the overly permissive anonymous read policy that exposes all applicant PII
DROP POLICY IF EXISTS "Anyone can read application status via view" ON public.applicants;
