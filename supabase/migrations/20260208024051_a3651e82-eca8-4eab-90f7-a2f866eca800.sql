
-- Verified Hajj/Umrah tour operators
CREATE TABLE public.verified_operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  license_number TEXT,
  city TEXT,
  state TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_blacklisted BOOLEAN NOT NULL DEFAULT false,
  blacklist_reason TEXT,
  verification_date TIMESTAMPTZ,
  avg_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.verified_operators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified operators"
  ON public.verified_operators FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage operators"
  ON public.verified_operators FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Operator reviews
CREATE TABLE public.operator_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES public.verified_operators(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_fraud_report BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.operator_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
  ON public.operator_reviews FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Authenticated users can submit reviews"
  ON public.operator_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage reviews"
  ON public.operator_reviews FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fraud alerts
CREATE TABLE public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'warning',
  location TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active fraud alerts"
  ON public.fraud_alerts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage fraud alerts"
  ON public.fraud_alerts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_verified_operators_updated_at
  BEFORE UPDATE ON public.verified_operators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fraud_alerts_updated_at
  BEFORE UPDATE ON public.fraud_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
