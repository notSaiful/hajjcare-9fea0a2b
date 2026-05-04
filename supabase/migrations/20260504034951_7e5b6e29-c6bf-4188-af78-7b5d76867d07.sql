
ALTER TABLE public.lost_and_found
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by uuid;

-- Update toggle RPC: block changes once verified
CREATE OR REPLACE FUNCTION public.mark_lost_found_status(p_report_id uuid, p_new_status text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
  v_current text;
  v_verified timestamptz;
BEGIN
  IF p_new_status NOT IN ('open','found') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid status');
  END IF;

  SELECT status, verified_at INTO v_current, v_verified
  FROM public.lost_and_found WHERE id = p_report_id;

  IF v_current IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Report not found');
  END IF;
  IF v_current = 'closed' THEN
    RETURN json_build_object('success', false, 'error', 'Report is closed');
  END IF;
  IF v_verified IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'Report is verified and locked');
  END IF;

  UPDATE public.lost_and_found
  SET status = p_new_status, updated_at = now()
  WHERE id = p_report_id;

  RETURN json_build_object('success', true, 'status', p_new_status);
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_lost_found_status(uuid, text) TO anon, authenticated;

-- Verify (lock) a Found report. Only admin or original reporter (matching user_id).
CREATE OR REPLACE FUNCTION public.verify_lost_found_report(p_report_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
  v_status text;
  v_owner uuid;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Sign in required');
  END IF;

  SELECT status, user_id INTO v_status, v_owner
  FROM public.lost_and_found WHERE id = p_report_id;

  IF v_status IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Report not found');
  END IF;
  IF v_status <> 'found' THEN
    RETURN json_build_object('success', false, 'error', 'Only found reports can be verified');
  END IF;
  IF NOT (has_role(v_uid, 'admin'::app_role) OR v_owner = v_uid) THEN
    RETURN json_build_object('success', false, 'error', 'Not authorized to verify');
  END IF;

  UPDATE public.lost_and_found
  SET verified_at = now(), verified_by = v_uid, updated_at = now()
  WHERE id = p_report_id;

  RETURN json_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_lost_found_report(uuid) TO authenticated;

-- Unverify (admin only)
CREATE OR REPLACE FUNCTION public.unverify_lost_found_report(p_report_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL OR NOT has_role(v_uid, 'admin'::app_role) THEN
    RETURN json_build_object('success', false, 'error', 'Admin only');
  END IF;
  UPDATE public.lost_and_found
  SET verified_at = NULL, verified_by = NULL, updated_at = now()
  WHERE id = p_report_id;
  RETURN json_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.unverify_lost_found_report(uuid) TO authenticated;

-- Refresh public view to include verification fields
CREATE OR REPLACE VIEW public.lost_and_found_public AS
SELECT id, user_id, report_type, status,
  person_name, person_age, person_gender, person_description, wearing_description,
  item_name, item_description, last_seen_location, last_seen_at, photo_url,
  reporter_name, language, notes, created_at, updated_at,
  verified_at, verified_by
FROM public.lost_and_found
WHERE status = ANY (ARRAY['open'::text, 'found'::text]);
