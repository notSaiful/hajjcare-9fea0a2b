
-- Fix Error #1: Push notification encryption keys exposed to coordinators
-- Coordinators don't need to view push subscription keys - they only need to send notifications
-- which should be done through edge functions that use service role key
DROP POLICY IF EXISTS "Coordinators can view all subscriptions" ON public.push_subscriptions;

-- Fix Error #3: Health tickets visible across all zones
-- Add zone-based filtering for coordinator/medical staff access
DROP POLICY IF EXISTS "Coordinators can view all tickets" ON public.health_tickets;
DROP POLICY IF EXISTS "Coordinators can update all tickets" ON public.health_tickets;

-- Create zone-aware SELECT policy for health tickets
-- Coordinators can only see tickets in their assigned zone OR unassigned zone tickets
CREATE POLICY "Coordinators can view zone-assigned tickets"
ON public.health_tickets
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'coordinator', 'medical_staff')
      AND (
        ur.zone IS NULL  -- Admins with no zone can see all
        OR ur.zone = health_tickets.zone  -- Zone match
        OR health_tickets.zone IS NULL  -- Unassigned tickets visible to all coordinators
      )
  )
);

-- Create zone-aware UPDATE policy for health tickets
CREATE POLICY "Coordinators can update zone-assigned tickets"
ON public.health_tickets
FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'coordinator', 'medical_staff')
      AND (
        ur.zone IS NULL  -- Admins with no zone can update all
        OR ur.zone = health_tickets.zone  -- Zone match
        OR health_tickets.zone IS NULL  -- Unassigned tickets
      )
  )
);
