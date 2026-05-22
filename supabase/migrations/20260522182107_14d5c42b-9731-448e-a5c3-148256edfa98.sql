DROP POLICY IF EXISTS "Users can create tickets" ON public.health_tickets;
CREATE POLICY "Users can create tickets"
ON public.health_tickets
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND user_id IS NOT NULL AND auth.uid() = user_id);