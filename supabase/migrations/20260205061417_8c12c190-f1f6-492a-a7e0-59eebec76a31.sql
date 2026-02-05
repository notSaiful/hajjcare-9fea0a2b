-- Drop and recreate the applicants_status_check view to include state and city
DROP VIEW IF EXISTS public.applicants_status_check;

CREATE VIEW public.applicants_status_check AS
SELECT 
  application_id,
  status,
  state,
  city,
  created_at
FROM public.applicants;

-- Grant select access to anonymous users for status checking
GRANT SELECT ON public.applicants_status_check TO anon;
GRANT SELECT ON public.applicants_status_check TO authenticated;