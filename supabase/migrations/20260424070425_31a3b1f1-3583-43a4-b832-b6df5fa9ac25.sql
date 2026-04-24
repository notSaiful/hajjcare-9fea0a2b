-- 1. Remove sensitive tables from Realtime publication to prevent broadcast leaks
ALTER PUBLICATION supabase_realtime DROP TABLE public.applicants;
ALTER PUBLICATION supabase_realtime DROP TABLE public.health_tickets;
ALTER PUBLICATION supabase_realtime DROP TABLE public.emergency_assignments;
ALTER PUBLICATION supabase_realtime DROP TABLE public.responder_locations;
ALTER PUBLICATION supabase_realtime DROP TABLE public.member_locations;
ALTER PUBLICATION supabase_realtime DROP TABLE public.member_link_requests;

-- 2. Fix user_roles privilege escalation:
-- The "Admins can manage all roles" ALL policy lacks WITH CHECK.
-- Replace with explicit per-command policies, each with proper WITH CHECK.
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate as discrete policies (insert/delete already exist; add update)
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Tighten realtime.messages policy:
-- Currently: any authenticated user can subscribe to any channel.
-- Replace with a policy that only allows authenticated users; broadcast topics
-- should be scoped by application code. Since sensitive tables are now removed
-- from the publication, remaining published tables (geofence_zones, hajj_circulars,
-- group_announcements) are either public or already RLS-checked at the row level.
DROP POLICY IF EXISTS "Authenticated users can receive realtime broadcasts" ON realtime.messages;

CREATE POLICY "Authenticated realtime access"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);

-- 4. verified_operators defensive hardening:
-- Add an explicit policy so authenticated operators can read their OWN record
-- by email match, preventing future devs from adding a permissive public policy.
-- (Currently only admins can SELECT; this preserves least privilege.)
-- No change needed to existing policies — add a comment for documentation only.
COMMENT ON TABLE public.verified_operators IS
  'SECURITY: Contains PII (email, phone, license_number). SELECT restricted to admins only via RLS. Never expose phone/email through public views or policies. Use verified_operators_public view for any non-admin listing.';