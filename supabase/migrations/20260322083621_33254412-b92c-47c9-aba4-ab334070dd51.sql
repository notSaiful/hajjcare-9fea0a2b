
-- Fix security definer view by making it SECURITY INVOKER
DROP VIEW IF EXISTS public.app_stats;

CREATE OR REPLACE VIEW public.app_stats
WITH (security_invoker = true) AS
SELECT
  (SELECT count(*) FROM public.app_analytics WHERE event_type = 'visit') AS total_visits,
  (SELECT count(DISTINCT visitor_id) FROM public.app_analytics WHERE event_type = 'visit') AS unique_visitors,
  (SELECT count(*) FROM public.app_analytics WHERE event_type = 'pwa_install') AS pwa_installs;

GRANT SELECT ON public.app_stats TO anon, authenticated;

-- Add a select policy for anon to read app_analytics (needed for the view)
CREATE POLICY "Anon can read aggregate stats"
  ON public.app_analytics FOR SELECT
  TO anon
  USING (true);
