-- Fix 1: inspector_registrations - restrict public PII to authenticated only
DROP POLICY IF EXISTS "Anyone can view verified inspectors" ON public.inspector_registrations;

CREATE POLICY "Authenticated can view verified inspectors"
ON public.inspector_registrations
FOR SELECT
TO authenticated
USING (status = 'verified' AND is_active = true);

-- Fix 2: haj_inspectors - restrict to coordinators/admins only (not all authenticated users)
DROP POLICY IF EXISTS "Authenticated users can view active inspectors" ON public.haj_inspectors;

CREATE POLICY "Staff can view active inspectors"
ON public.haj_inspectors
FOR SELECT
TO authenticated
USING (is_active = true AND is_coordinator_or_admin(auth.uid()));