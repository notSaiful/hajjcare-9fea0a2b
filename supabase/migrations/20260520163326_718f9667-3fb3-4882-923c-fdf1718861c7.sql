-- Allow admins and coordinators to view all member locations for the Live Tracking command page
CREATE POLICY "Admins can view all member locations"
ON public.member_locations
FOR SELECT
TO authenticated
USING (is_coordinator_or_admin(auth.uid()));