
-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view verified operators" ON public.verified_operators;

-- Only admins can SELECT from the base table (which has phone/email)
CREATE POLICY "Only admins can view full operator details"
ON public.verified_operators
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create a public view WITHOUT phone/email
CREATE VIEW public.verified_operators_public
WITH (security_invoker = on) AS
SELECT
  id, company_name, name, license_number,
  city, state, website,
  is_verified, is_blacklisted, blacklist_reason,
  verification_date, avg_rating, total_reviews,
  created_at, updated_at
FROM public.verified_operators;
