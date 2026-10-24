-- Sukoon: status updates must not move a pilgrim to 0,0, and invite lookup
-- must honour the 72-hour expiry the UI already promises.
-- Apply on the production project (see DEPLOY.md). The client falls back to a
-- direct pilgrim_status update if set_pilgrim_status is not deployed yet.

CREATE OR REPLACE FUNCTION public.upsert_member_location(
  p_group_id uuid,
  p_latitude double precision,
  p_longitude double precision,
  p_current_stage text,
  p_pilgrim_status text DEFAULT 'normal'::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_member_id TEXT;
  v_status TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT member_id INTO v_member_id
  FROM public.group_members
  WHERE group_id = p_group_id AND user_id = v_user_id;

  IF v_member_id IS NULL THEN
    RAISE EXCEPTION 'User is not a member of this group';
  END IF;

  v_status := CASE lower(COALESCE(p_pilgrim_status, 'normal'))
    WHEN 'emergency' THEN 'emergency_managed'
    WHEN 'missing' THEN 'emergency_managed'
    WHEN 'help' THEN 'assisted'
    WHEN 'needs_help' THEN 'assisted'
    WHEN 'hospital' THEN 'assisted'
    WHEN 'assisted' THEN 'assisted'
    WHEN 'emergency_managed' THEN 'emergency_managed'
    ELSE 'normal'
  END;

  INSERT INTO public.member_locations (
    member_id, group_id, user_id, latitude, longitude, current_stage, pilgrim_status, updated_at
  )
  VALUES (
    v_member_id, p_group_id, v_user_id, p_latitude, p_longitude, p_current_stage, v_status, now()
  )
  ON CONFLICT (member_id, group_id)
  DO UPDATE SET
    -- A status-only caller used to send 0,0 and wipe the real fix.
    latitude = CASE
      WHEN EXCLUDED.latitude = 0 AND EXCLUDED.longitude = 0
           AND NOT (member_locations.latitude = 0 AND member_locations.longitude = 0)
      THEN member_locations.latitude
      ELSE EXCLUDED.latitude
    END,
    longitude = CASE
      WHEN EXCLUDED.latitude = 0 AND EXCLUDED.longitude = 0
           AND NOT (member_locations.latitude = 0 AND member_locations.longitude = 0)
      THEN member_locations.longitude
      ELSE EXCLUDED.longitude
    END,
    current_stage = COALESCE(EXCLUDED.current_stage, member_locations.current_stage),
    pilgrim_status = EXCLUDED.pilgrim_status,
    updated_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_pilgrim_status(
  p_group_id uuid,
  p_pilgrim_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_status TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'User is not a member of this group';
  END IF;

  v_status := CASE lower(COALESCE(p_pilgrim_status, 'normal'))
    WHEN 'emergency' THEN 'emergency_managed'
    WHEN 'missing' THEN 'emergency_managed'
    WHEN 'help' THEN 'assisted'
    WHEN 'needs_help' THEN 'assisted'
    WHEN 'hospital' THEN 'assisted'
    WHEN 'assisted' THEN 'assisted'
    WHEN 'emergency_managed' THEN 'emergency_managed'
    ELSE 'normal'
  END;

  UPDATE public.member_locations
  SET pilgrim_status = v_status,
      updated_at = now()
  WHERE group_id = p_group_id
    AND user_id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No location yet. Share location before setting status.';
  END IF;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.set_pilgrim_status(uuid, text) TO authenticated;

-- Invite links say they last 72 hours. lookup previously ignored invite_expires_at.
-- NULL expiry stays valid so groups created before the column existed still join.
CREATE OR REPLACE FUNCTION public.lookup_group_by_invite_code(p_invite_code text)
RETURNS TABLE(id uuid, name text, invite_code text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT fg.id, fg.name, fg.invite_code
  FROM public.family_groups fg
  WHERE fg.invite_code = p_invite_code
    AND (fg.invite_expires_at IS NULL OR fg.invite_expires_at > now())
  LIMIT 1;
END;
$function$;
