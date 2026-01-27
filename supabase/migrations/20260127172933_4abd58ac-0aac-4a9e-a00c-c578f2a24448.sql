-- Drop existing insert policy and recreate to ensure public submissions work
DROP POLICY IF EXISTS "Anyone can submit application" ON public.applicants;

CREATE POLICY "Anyone can submit application" 
ON public.applicants 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);