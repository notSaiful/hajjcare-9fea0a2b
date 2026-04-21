-- 1. Remove inspector_pilgrims from realtime publication (contains passport, phone, emergency_contact, medical data)
ALTER PUBLICATION supabase_realtime DROP TABLE public.inspector_pilgrims;

-- 2. Restrict operator_reviews SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.operator_reviews;

CREATE POLICY "Authenticated users can view approved reviews"
  ON public.operator_reviews
  FOR SELECT
  TO authenticated
  USING (status = 'approved' OR user_id = auth.uid());