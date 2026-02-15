
-- Table for Haj Inspector / Volunteer / Support Staff registrations via WhatsApp onboarding
CREATE TABLE public.inspector_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('haj_inspector', 'volunteer', 'support_staff')),
  language_preference TEXT NOT NULL DEFAULT 'hi',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'blocked')),
  rejection_reason TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  duty_status TEXT NOT NULL DEFAULT 'available' CHECK (duty_status IN ('available', 'on_duty', 'off_duty')),
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_mobile_registration UNIQUE (mobile)
);

-- Audit log for all registration actions
CREATE TABLE public.inspector_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES public.inspector_registrations(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  performed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inspector_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspector_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inspector_registrations
-- Anyone can read verified inspectors (public directory)
CREATE POLICY "Anyone can view verified inspectors"
  ON public.inspector_registrations
  FOR SELECT
  USING (status = 'verified' AND is_active = true);

-- Authenticated users can also see their own registration regardless of status
CREATE POLICY "Users can view own registration"
  ON public.inspector_registrations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Anyone can insert (public registration form, no auth required)
CREATE POLICY "Anyone can register"
  ON public.inspector_registrations
  FOR INSERT
  WITH CHECK (true);

-- Only admins can update registrations (verify/reject/block)
CREATE POLICY "Admins can update registrations"
  ON public.inspector_registrations
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete registrations"
  ON public.inspector_registrations
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for audit log: admins only
CREATE POLICY "Admins can view audit logs"
  ON public.inspector_audit_log
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
  ON public.inspector_audit_log
  FOR INSERT
  WITH CHECK (true);

-- Auto-update updated_at
CREATE TRIGGER update_inspector_registrations_updated_at
  BEFORE UPDATE ON public.inspector_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast mobile duplicate check
CREATE INDEX idx_inspector_registrations_mobile ON public.inspector_registrations(mobile);
CREATE INDEX idx_inspector_registrations_state ON public.inspector_registrations(state);
CREATE INDEX idx_inspector_registrations_status ON public.inspector_registrations(status);

-- Function to check duplicate mobile (no auth required)
CREATE OR REPLACE FUNCTION public.check_inspector_mobile_exists(p_mobile text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.inspector_registrations WHERE mobile = p_mobile
  );
$$;
