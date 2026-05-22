
-- Restore column SELECT to authenticated; row-level access is
-- still controlled by RLS policies (admin-only for PII rows via
-- "Admins can view all volunteers"; coordinators are blocked
-- from base table now and must use the safe view).
GRANT SELECT ON public.volunteers TO authenticated;

-- Drop the coordinator base-table policy entirely — coordinators
-- must read through volunteers_zone_safe view, which excludes PII.
DROP POLICY IF EXISTS "Coordinators can view zone volunteers (safe)" ON public.volunteers;

-- The safe view runs with security_invoker = true, so it needs
-- a base-table policy that lets the coordinator's session read
-- the underlying rows. Use a policy that only matches when the
-- caller is a coordinator for the volunteer's zone. Since
-- PostgREST cannot select sensitive columns through the view
-- (view doesn't expose them), PII stays protected.
CREATE POLICY "Coordinators read via zone safe view"
  ON public.volunteers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'coordinator'::app_role
        AND (ur.zone = volunteers.state OR ur.zone = volunteers.embarkation_point)
    )
  );

-- To prevent coordinators from querying the base table directly
-- and reading PII, revoke their direct table SELECT and force
-- view usage. We keep authenticated GRANT for admin/own-record
-- access; coordinator policy above limits rows but not columns.
-- For column-level enforcement, revoke ONLY sensitive columns
-- from authenticated; admins read via SECURITY DEFINER helper.
REVOKE SELECT (mobile, whatsapp, email, full_address, father_name)
  ON public.volunteers FROM authenticated;

-- Admin helper to fetch full volunteer rows including PII.
CREATE OR REPLACE FUNCTION public.admin_list_volunteers()
RETURNS SETOF public.volunteers
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  RETURN QUERY SELECT * FROM public.volunteers ORDER BY created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_volunteers() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_volunteers() TO authenticated;
