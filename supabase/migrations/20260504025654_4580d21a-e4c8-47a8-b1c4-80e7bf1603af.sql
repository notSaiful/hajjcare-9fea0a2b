
CREATE OR REPLACE FUNCTION public.mark_lost_found_status(p_report_id uuid, p_new_status text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
  v_current text;
BEGIN
  IF p_new_status NOT IN ('open','found') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid status');
  END IF;

  SELECT status INTO v_current FROM public.lost_and_found WHERE id = p_report_id;
  IF v_current IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Report not found');
  END IF;
  IF v_current = 'closed' THEN
    RETURN json_build_object('success', false, 'error', 'Report is closed');
  END IF;

  UPDATE public.lost_and_found
  SET status = p_new_status, updated_at = now()
  WHERE id = p_report_id;

  RETURN json_build_object('success', true, 'status', p_new_status);
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_lost_found_status(uuid, text) TO anon, authenticated;
