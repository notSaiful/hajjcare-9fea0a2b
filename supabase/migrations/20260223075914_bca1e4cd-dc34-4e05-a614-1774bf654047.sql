
-- Fix overly permissive INSERT policy on volunteers table
DROP POLICY IF EXISTS "Authenticated users can register as volunteer" ON public.volunteers;
CREATE POLICY "Authenticated users can register as volunteer"
ON public.volunteers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix overly permissive INSERT policy on emergency_assignments table
DROP POLICY IF EXISTS "Service can insert assignments" ON public.emergency_assignments;
CREATE POLICY "Service can insert assignments"
ON public.emergency_assignments
FOR INSERT
TO authenticated
WITH CHECK (is_coordinator_or_admin(auth.uid()));
