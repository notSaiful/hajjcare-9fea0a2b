
CREATE TABLE public.app_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL DEFAULT 'visit',
  visitor_id text NOT NULL,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.app_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous tracking)
CREATE POLICY "Anyone can log visits"
  ON public.app_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view analytics"
  ON public.app_analytics FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create a view for public-facing counts (no PII exposed)
CREATE OR REPLACE VIEW public.app_stats AS
SELECT
  (SELECT count(*) FROM public.app_analytics WHERE event_type = 'visit') AS total_visits,
  (SELECT count(DISTINCT visitor_id) FROM public.app_analytics WHERE event_type = 'visit') AS unique_visitors,
  (SELECT count(*) FROM public.app_analytics WHERE event_type = 'pwa_install') AS pwa_installs;

-- Allow anyone to read aggregate stats
GRANT SELECT ON public.app_stats TO anon, authenticated;
