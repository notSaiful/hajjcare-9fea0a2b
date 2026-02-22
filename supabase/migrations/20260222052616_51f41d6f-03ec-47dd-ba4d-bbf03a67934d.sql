
-- Drop the existing coordinator/admin SELECT policy on volunteers
DROP POLICY IF EXISTS "Admins and coordinators can view all volunteers" ON public.volunteers;

-- Create a new policy: admins see all, coordinators see only their zone
CREATE POLICY "Admins can view all volunteers"
ON public.volunteers
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Coordinators can view zone-scoped volunteers"
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
