-- Allow authenticated users to find groups by invite code (needed for joining)
CREATE POLICY "Anyone can find groups by invite code"
ON public.family_groups
FOR SELECT
USING (true);