
CREATE TABLE public.circular_fetch_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'HCI',
  success boolean NOT NULL DEFAULT true,
  added_count integer NOT NULL DEFAULT 0,
  message text,
  triggered_by text NOT NULL DEFAULT 'cron',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.circular_fetch_log TO authenticated;
GRANT ALL ON public.circular_fetch_log TO service_role;

ALTER TABLE public.circular_fetch_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view fetch log"
  ON public.circular_fetch_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_circular_fetch_log_ran_at ON public.circular_fetch_log (ran_at DESC);
