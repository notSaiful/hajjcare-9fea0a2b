-- Fix 1: Restrict lost_and_found SELECT so reporter contact PII is only visible to staff and owners.
-- Other authenticated/anonymous users must use the lost_and_found_public view (which excludes PII).
DROP POLICY IF EXISTS "Authenticated can view open reports with contact" ON public.lost_and_found;

CREATE POLICY "Staff and owners can view reports with contact"
ON public.lost_and_found
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_coordinator_or_admin(auth.uid())
);

-- Fix 2: Prevent attribution spoofing on inserts.
DROP POLICY IF EXISTS "Anyone can submit reports" ON public.lost_and_found;

CREATE POLICY "Anyone can submit reports (no spoofed user_id)"
ON public.lost_and_found
FOR INSERT
WITH CHECK (
  user_id IS NULL
  OR auth.uid() = user_id
);