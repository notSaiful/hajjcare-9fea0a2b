
-- Fix 1: Remove state/city from public status check view
DROP VIEW IF EXISTS public.applicants_status_check;
CREATE VIEW public.applicants_status_check WITH (security_invoker = on) AS
  SELECT application_id, status, created_at
  FROM public.applicants;

GRANT SELECT ON public.applicants_status_check TO anon;
GRANT SELECT ON public.applicants_status_check TO authenticated;

-- Fix 2: Remove unnecessary storage upload policy (uploads use service role via edge functions)
DROP POLICY IF EXISTS "Authenticated users can upload proof documents" ON storage.objects;
