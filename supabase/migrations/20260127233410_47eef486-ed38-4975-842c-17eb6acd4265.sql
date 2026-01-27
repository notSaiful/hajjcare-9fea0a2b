-- Drop the existing INSERT policy and recreate it more explicitly
DROP POLICY IF EXISTS "Anyone can submit application" ON public.applicants;

-- Create a fresh INSERT policy specifically targeting both roles
CREATE POLICY "Anyone can submit application"
ON public.applicants
FOR INSERT
TO anon, authenticated
WITH CHECK (true);