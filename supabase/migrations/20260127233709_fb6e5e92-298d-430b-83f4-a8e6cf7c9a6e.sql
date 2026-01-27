-- First verify RLS is enabled
-- Then drop ALL policies and recreate them fresh

-- Save the existing policies by listing them first
-- Drop all INSERT policies and create a new one

-- First temporarily disable RLS, then re-enable
ALTER TABLE public.applicants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;

-- Drop the insert policy if it exists
DROP POLICY IF EXISTS "Anyone can submit application" ON public.applicants;

-- Recreate with explicit PUBLIC role  
CREATE POLICY "Public can submit application"
ON public.applicants
FOR INSERT
TO public
WITH CHECK (true);