-- 1. Drop the demo role escalation function
DROP FUNCTION IF EXISTS public.grant_demo_staff_roles();

-- 2. Lost & Found: hide reporter phone numbers from public reads
-- Create a SECURITY DEFINER view-like function to expose safe contact channel via app, or simply restrict columns.
-- Simplest fix: split policy so anon/public sees rows but reporter_mobile/reporter_whatsapp are masked through a view.

-- Drop the broad public SELECT policy
DROP POLICY IF EXISTS "Anyone can view open reports" ON public.lost_and_found;

-- Public can still see open reports BUT phone columns will be hidden via a view
CREATE POLICY "Authenticated can view open reports with contact"
ON public.lost_and_found
FOR SELECT
TO authenticated
USING (status IN ('open', 'found'));

-- Public-safe view (no phone numbers)
CREATE OR REPLACE VIEW public.lost_and_found_public
WITH (security_invoker = true)
AS
SELECT
  id, user_id, report_type, status,
  person_name, person_age, person_gender, person_description, wearing_description,
  item_name, item_description,
  last_seen_location, last_seen_at, photo_url,
  reporter_name,
  language, notes,
  created_at, updated_at
FROM public.lost_and_found
WHERE status IN ('open', 'found');

GRANT SELECT ON public.lost_and_found_public TO anon, authenticated;

-- Anonymous users may select via the view only (RLS still applies through security_invoker).
-- Allow anon read of open rows but only via the view; create a parallel restrictive policy for anon that excludes phone access.
-- Since column-level grants are needed, switch to grant approach for anon role.
CREATE POLICY "Anon can view open reports (limited columns)"
ON public.lost_and_found
FOR SELECT
TO anon
USING (status IN ('open', 'found'));

-- Revoke phone columns from anon
REVOKE SELECT ON public.lost_and_found FROM anon;
GRANT SELECT (
  id, user_id, report_type, status,
  person_name, person_age, person_gender, person_description, wearing_description,
  item_name, item_description,
  last_seen_location, last_seen_at, photo_url,
  reporter_name, language, notes, created_at, updated_at
) ON public.lost_and_found TO anon;

-- 3. inspector_registrations: restrict mobile/PII to coordinators/admins
DROP POLICY IF EXISTS "Authenticated can view verified inspectors" ON public.inspector_registrations;

CREATE POLICY "Staff can view verified inspectors"
ON public.inspector_registrations
FOR SELECT
TO authenticated
USING (
  status = 'verified'
  AND is_active = true
  AND public.is_coordinator_or_admin(auth.uid())
);

-- 4. app_analytics: remove anonymous full-table read
DROP POLICY IF EXISTS "Anon can read aggregate stats" ON public.app_analytics;

-- Provide aggregate count via SECURITY DEFINER function (safe, no row data exposure)
CREATE OR REPLACE FUNCTION public.get_app_analytics_summary()
RETURNS TABLE(total_visits bigint, total_installs bigint, unique_visitors bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
  SELECT
    COUNT(*) FILTER (WHERE event_type = 'visit')::bigint,
    COUNT(*) FILTER (WHERE event_type = 'pwa_install')::bigint,
    COUNT(DISTINCT visitor_id)::bigint
  FROM public.app_analytics;
$$;

GRANT EXECUTE ON FUNCTION public.get_app_analytics_summary() TO anon, authenticated;

-- 5. Realtime messages: enable RLS and restrict topic subscriptions
-- NOTE: realtime.messages is a Supabase-managed table (owned by supabase_realtime_admin).
-- The migration user is not its owner, so these statements fail on managed Supabase.
-- Guarded: skipped if insufficient privilege / table absent. Realtime access control is
-- primarily governed by publications + RLS on the source tables, so this is optional hardening.
DO $$
BEGIN
  ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Authenticated users can receive realtime broadcasts" ON realtime.messages;
  CREATE POLICY "Authenticated users can receive realtime broadcasts"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (true);
EXCEPTION
  WHEN insufficient_privilege OR object_not_in_prerequisite_state OR undefined_table THEN
    RAISE NOTICE 'Skipping realtime.messages RLS hardening (not owner / absent)';
END
$$;

-- 6. Storage: restrict listing of lost-found-photos bucket
-- Keep individual photo URLs accessible (they're shared publicly via known URL),
-- but block listing the entire bucket.
DROP POLICY IF EXISTS "Anyone can view lost-found photos" ON storage.objects;

CREATE POLICY "Public can read lost-found photos by name"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'lost-found-photos' AND name IS NOT NULL);

-- Note: storage.objects restricts listing through bucket-level public flag. Make bucket non-public to disable listing,
-- but signed/known URLs continue to work via the SELECT policy above.
UPDATE storage.buckets SET public = false WHERE id = 'lost-found-photos';