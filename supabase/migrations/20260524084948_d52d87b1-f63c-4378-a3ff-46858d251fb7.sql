-- Qurbani coupon lookup table: maps Cover ID / Passport to Coupon ID
CREATE TABLE public.qurbani_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cover_id TEXT,
  passport_no TEXT,
  coupon_id TEXT NOT NULL,
  pilgrim_name TEXT,
  group_no TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  slaughter_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_qurbani_coupons_cover ON public.qurbani_coupons (lower(cover_id));
CREATE INDEX idx_qurbani_coupons_passport ON public.qurbani_coupons (lower(passport_no));
CREATE INDEX idx_qurbani_coupons_coupon ON public.qurbani_coupons (coupon_id);

ALTER TABLE public.qurbani_coupons ENABLE ROW LEVEL SECURITY;

-- Public lookup allowed (non-PII: just coupon id + status). Anyone can search.
CREATE POLICY "Public can lookup qurbani coupons"
ON public.qurbani_coupons FOR SELECT
USING (true);

-- Only admins can write
CREATE POLICY "Admins manage qurbani coupons"
ON public.qurbani_coupons FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_qurbani_coupons_updated_at
BEFORE UPDATE ON public.qurbani_coupons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();