
DROP POLICY "Anyone can view active inspectors" ON public.haj_inspectors;

CREATE POLICY "Authenticated users can view active inspectors"
  ON public.haj_inspectors FOR SELECT
  TO authenticated
  USING (is_active = true);
