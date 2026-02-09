
-- Fix 1: Health tickets - Only admins can see all zones, coordinators/medical_staff MUST have matching zone
DROP POLICY IF EXISTS "Coordinators can view zone-assigned tickets" ON public.health_tickets;
CREATE POLICY "Coordinators can view zone-assigned tickets"
ON public.health_tickets
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['admin'::app_role, 'coordinator'::app_role, 'medical_staff'::app_role])
      AND (
        ur.role = 'admin'::app_role  -- admins see all
        OR ur.zone = health_tickets.zone  -- others must match zone
        OR health_tickets.zone IS NULL  -- unzoned tickets visible to all staff
      )
  )
);

DROP POLICY IF EXISTS "Coordinators can update zone-assigned tickets" ON public.health_tickets;
CREATE POLICY "Coordinators can update zone-assigned tickets"
ON public.health_tickets
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['admin'::app_role, 'coordinator'::app_role, 'medical_staff'::app_role])
      AND (
        ur.role = 'admin'::app_role
        OR ur.zone = health_tickets.zone
        OR health_tickets.zone IS NULL
      )
  )
);

-- Fix 2: Applicants - Coordinators only see applicants from their assigned zone/state
DROP POLICY IF EXISTS "Coordinators can view all applications" ON public.applicants;
CREATE POLICY "Coordinators can view zone-filtered applications"
ON public.applicants
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['admin'::app_role, 'coordinator'::app_role, 'medical_staff'::app_role])
      AND (
        ur.role = 'admin'::app_role  -- admins see all
        OR ur.zone = applicants.state  -- coordinators see their zone only
      )
  )
);

DROP POLICY IF EXISTS "Coordinators can update applications" ON public.applicants;
CREATE POLICY "Coordinators can update zone-filtered applications"
ON public.applicants
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = ANY (ARRAY['admin'::app_role, 'coordinator'::app_role, 'medical_staff'::app_role])
      AND (
        ur.role = 'admin'::app_role
        OR ur.zone = applicants.state
      )
  )
);
