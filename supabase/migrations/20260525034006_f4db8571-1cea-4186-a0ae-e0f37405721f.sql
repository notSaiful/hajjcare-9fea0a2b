-- Tighten training_records RLS to prevent self-certification
DROP POLICY IF EXISTS "Users can manage own training records" ON public.training_records;

-- Users can only enroll themselves (status='enrolled', no score/cert)
CREATE POLICY "Users can enroll in training"
ON public.training_records
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND status = 'enrolled'
  AND score IS NULL
  AND certificate_url IS NULL
);

-- Users may not update their own training records (admins/RPCs do completions)
-- Admin ALL policy already covers writes by admins.