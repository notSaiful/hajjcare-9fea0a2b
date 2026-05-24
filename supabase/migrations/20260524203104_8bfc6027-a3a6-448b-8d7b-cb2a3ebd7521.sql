
-- 1. Qurbani coupons: remove public SELECT, add safe lookup RPC
DROP POLICY IF EXISTS "Public can lookup qurbani coupons" ON public.qurbani_coupons;

CREATE OR REPLACE FUNCTION public.lookup_qurbani_coupon(p_query text)
RETURNS TABLE(coupon_id text, pilgrim_name text, group_no text, status text, slaughter_date date)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
  SELECT qc.coupon_id, qc.pilgrim_name, qc.group_no, qc.status, qc.slaughter_date
  FROM public.qurbani_coupons qc
  WHERE length(coalesce(p_query,'')) >= 4
    AND (lower(qc.cover_id) = lower(p_query) OR lower(qc.passport_no) = lower(p_query))
  LIMIT 5;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_qurbani_coupon(text) TO anon, authenticated;

-- 2. Responder profiles: lock sensitive columns
DROP POLICY IF EXISTS "Users can update own non-sensitive fields" ON public.responder_profiles;
CREATE POLICY "Users can update own safe fields"
  ON public.responder_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND rank = (SELECT rank FROM public.responder_profiles WHERE user_id = auth.uid())
    AND id_verified = (SELECT id_verified FROM public.responder_profiles WHERE user_id = auth.uid())
    AND background_check_status = (SELECT background_check_status FROM public.responder_profiles WHERE user_id = auth.uid())
    AND is_field_ready = (SELECT is_field_ready FROM public.responder_profiles WHERE user_id = auth.uid())
    AND COALESCE(performance_score, -1) = COALESCE((SELECT performance_score FROM public.responder_profiles WHERE user_id = auth.uid()), -1)
    AND COALESCE(total_deployments, 0) = COALESCE((SELECT total_deployments FROM public.responder_profiles WHERE user_id = auth.uid()), 0)
    AND COALESCE(total_incidents_resolved, 0) = COALESCE((SELECT total_incidents_resolved FROM public.responder_profiles WHERE user_id = auth.uid()), 0)
  );

-- 3. Training records: remove user UPDATE entirely (admins still manage via existing ALL policy)
DROP POLICY IF EXISTS "Users can update own training records" ON public.training_records;

-- 4. Applicants: explicit INSERT rule
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applicants;
DROP POLICY IF EXISTS "Users submit own applications" ON public.applicants;
CREATE POLICY "Users submit own applications"
  ON public.applicants FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- 5. Lost & Found claims: owner_user_id must match report owner
DROP POLICY IF EXISTS "Users create their own claims" ON public.lost_found_claims;
CREATE POLICY "Users create their own claims"
  ON public.lost_found_claims FOR INSERT
  WITH CHECK (
    auth.uid() = claimant_user_id
    AND (
      owner_user_id IS NULL
      OR owner_user_id = (SELECT lf.user_id FROM public.lost_and_found lf WHERE lf.id = report_id)
    )
  );
