-- Additive classroom schedule. No existing table, policy, or grant is changed.
-- Public clients have no SELECT. Released days are served by /api/classroom.
-- Writes are limited to the existing admin role.

CREATE TABLE public.classroom_days (
  day_number integer PRIMARY KEY CHECK (day_number >= 1 AND day_number <= 100),
  unlock_date date NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.classroom_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read classroom days"
  ON public.classroom_days
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins insert classroom days"
  ON public.classroom_days
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update classroom days"
  ON public.classroom_days
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
