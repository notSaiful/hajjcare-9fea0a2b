CREATE TABLE public.staff_role_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  requested_role app_role NOT NULL,
  zone text,
  full_name text,
  email text,
  phone text,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_role_requests_status ON public.staff_role_requests(status, created_at DESC);
CREATE INDEX idx_staff_role_requests_user ON public.staff_role_requests(user_id);

ALTER TABLE public.staff_role_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users create own role requests"
  ON public.staff_role_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own role requests"
  ON public.staff_role_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all role requests"
  ON public.staff_role_requests FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update role requests"
  ON public.staff_role_requests FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_staff_role_requests_updated_at
  BEFORE UPDATE ON public.staff_role_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();