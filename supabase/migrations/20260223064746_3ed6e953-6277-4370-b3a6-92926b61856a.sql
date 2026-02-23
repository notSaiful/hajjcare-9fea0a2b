
-- Fix: Tighten volunteers INSERT policy to require authentication
DROP POLICY IF EXISTS "Anyone can register as volunteer" ON public.volunteers;

CREATE POLICY "Authenticated users can register as volunteer"
ON public.volunteers
FOR INSERT
TO authenticated
WITH CHECK (true);
