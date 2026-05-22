
-- ============================================================
-- 1. inspector_pilgrims: tighten RLS to authenticated + NOT NULL
-- ============================================================
DROP POLICY IF EXISTS "Hajis can view own pilgrim record" ON public.inspector_pilgrims;
DROP POLICY IF EXISTS "Inspectors can manage own pilgrims" ON public.inspector_pilgrims;
DROP POLICY IF EXISTS "Admins can manage all pilgrims" ON public.inspector_pilgrims;

CREATE POLICY "Hajis can view own pilgrim record"
  ON public.inspector_pilgrims
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL AND user_id IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Inspectors can manage own pilgrims"
  ON public.inspector_pilgrims
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL AND inspector_user_id IS NOT NULL AND auth.uid() = inspector_user_id)
  WITH CHECK (auth.uid() IS NOT NULL AND inspector_user_id IS NOT NULL AND auth.uid() = inspector_user_id);

CREATE POLICY "Admins can manage all pilgrims"
  ON public.inspector_pilgrims
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 2. volunteers: remove broad coordinator PII access, expose
--    only operationally necessary columns via a safe view
-- ============================================================
DROP POLICY IF EXISTS "Coordinators can view zone-scoped volunteers" ON public.volunteers;

-- Safe coordinator view: NO mobile, whatsapp, email, full_address, father_name
CREATE OR REPLACE VIEW public.volunteers_zone_safe
WITH (security_invoker = true)
AS
SELECT
  v.id,
  v.volunteer_id,
  v.full_name,
  v.city,
  v.state,
  v.embarkation_point,
  v.skills,
  v.availability_days,
  v.status,
  v.city_tag,
  v.skill_tag,
  v.availability_tag,
  v.created_at,
  v.updated_at
FROM public.volunteers v
WHERE
  -- Admins can see all rows through the view
  public.has_role(auth.uid(), 'admin'::app_role)
  -- Coordinators can see volunteers in their zone (state or embarkation point)
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'coordinator'::app_role
      AND (ur.zone = v.state OR ur.zone = v.embarkation_point)
  );

-- Grant select on the view to authenticated users (RLS on base
-- table + WHERE clause above enforce row-level access).
REVOKE ALL ON public.volunteers_zone_safe FROM anon, authenticated;
GRANT SELECT ON public.volunteers_zone_safe TO authenticated;

-- We need a base-table policy so the view's underlying SELECT
-- succeeds for coordinators. Use a tightly-scoped policy that
-- only matches when the caller is querying through the safe
-- view's logic (coordinator for matching zone).
CREATE POLICY "Coordinators can view zone volunteers (safe)"
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

-- NOTE: Above policy still grants row access. To enforce column
-- restriction at the DB level we revoke column-level SELECT on
-- sensitive PII columns from authenticated role for non-admins.
-- PostgREST honours column GRANTs.
REVOKE SELECT (mobile, whatsapp, email, full_address, father_name)
  ON public.volunteers FROM authenticated;

-- Re-grant non-sensitive columns to authenticated so existing
-- own-record and admin reads keep working through the table.
GRANT SELECT (
  id, volunteer_id, full_name, city, state, embarkation_point,
  skills, availability_days, status, city_tag, skill_tag,
  availability_tag, user_id, created_at, updated_at
) ON public.volunteers TO authenticated;

-- Admins still need PII access; they hold the admin role and
-- can query via a SECURITY DEFINER function when needed.
CREATE OR REPLACE FUNCTION public.admin_get_volunteer_pii(p_volunteer_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  mobile text,
  whatsapp text,
  email text,
  full_address text,
  father_name text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  RETURN QUERY
    SELECT v.id, v.full_name, v.mobile, v.whatsapp, v.email,
           v.full_address, v.father_name
    FROM public.volunteers v
    WHERE v.id = p_volunteer_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_volunteer_pii(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_get_volunteer_pii(uuid) TO authenticated;
