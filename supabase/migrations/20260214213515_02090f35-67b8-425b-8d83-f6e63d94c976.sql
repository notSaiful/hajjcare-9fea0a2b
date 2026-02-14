
-- Drop existing restrictive RLS policies on volunteers
DROP POLICY IF EXISTS "Admins can update volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Admins can view all volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Public volunteer registration" ON public.volunteers;
DROP POLICY IF EXISTS "Users can view own volunteer registration" ON public.volunteers;

-- Simple permissive policies
CREATE POLICY "Anyone can register as volunteer"
ON public.volunteers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view volunteers"
ON public.volunteers FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can update volunteers"
ON public.volunteers FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete volunteers"
ON public.volunteers FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
