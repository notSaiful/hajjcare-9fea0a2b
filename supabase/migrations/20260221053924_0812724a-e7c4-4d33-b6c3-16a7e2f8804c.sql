-- Revoke anonymous access to applicants_status_check view
REVOKE SELECT ON public.applicants_status_check FROM anon;
REVOKE SELECT ON public.applicants_status_check FROM authenticated;