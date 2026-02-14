
-- 1. lookup_user_id_by_phone: require authenticated caller
CREATE OR REPLACE FUNCTION public.lookup_user_id_by_phone(target_phone text)
 RETURNS TABLE(user_id uuid, full_name text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  RETURN QUERY
    SELECT p.user_id, p.full_name 
    FROM public.profiles p
    WHERE p.phone = target_phone 
      AND p.family_sharing_enabled = true
    LIMIT 1;
END;
$$;

-- 2. whatsapp_verify_and_join: require authenticated caller
CREATE OR REPLACE FUNCTION public.whatsapp_verify_and_join(p_phone text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_user_id UUID;
  v_full_name TEXT;
  v_embarkation TEXT;
  v_group_id UUID;
  v_group_name TEXT;
  v_invite_code TEXT;
  v_expires TIMESTAMPTZ;
  v_member_id TEXT;
BEGIN
  IF v_caller IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'auth_required', 'message', 'Authentication required');
  END IF;

  SELECT p.user_id, p.full_name, p.embarkation_point
  INTO v_user_id, v_full_name, v_embarkation
  FROM public.profiles p
  WHERE p.phone = p_phone AND p.family_sharing_enabled = true
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'no_profile', 'message', 'No verified profile found for this phone number');
  END IF;

  SELECT gm.group_id INTO v_group_id
  FROM public.group_members gm
  WHERE gm.user_id = v_user_id
  LIMIT 1;

  IF v_group_id IS NOT NULL THEN
    SELECT fg.name INTO v_group_name FROM public.family_groups fg WHERE fg.id = v_group_id;
    
    v_invite_code := lpad(floor(random() * 1000000)::text, 6, '0');
    v_expires := now() + interval '72 hours';
    
    UPDATE public.family_groups 
    SET invite_code = v_invite_code, invite_expires_at = v_expires
    WHERE id = v_group_id;

    RETURN json_build_object(
      'success', true, 'action', 'existing_group',
      'full_name', v_full_name, 'group_name', v_group_name,
      'invite_code', v_invite_code, 'expires_at', v_expires
    );
  END IF;

  v_group_name := COALESCE(v_embarkation, 'My Family') || ' - ' || COALESCE(v_full_name, 'Group');
  v_invite_code := lpad(floor(random() * 1000000)::text, 6, '0');
  v_expires := now() + interval '72 hours';
  v_member_id := gen_random_uuid()::text;

  INSERT INTO public.family_groups (name, created_by, user_id, invite_code, invite_expires_at, verified_phone)
  VALUES (v_group_name, v_member_id, v_user_id, v_invite_code, v_expires, p_phone)
  RETURNING id INTO v_group_id;

  INSERT INTO public.group_members (group_id, member_name, member_id, user_id)
  VALUES (v_group_id, COALESCE(v_full_name, 'Member'), v_member_id, v_user_id);

  RETURN json_build_object(
    'success', true, 'action', 'created_group',
    'full_name', v_full_name, 'group_name', v_group_name,
    'invite_code', v_invite_code, 'expires_at', v_expires
  );
END;
$$;

-- 3. cleanup_old_rate_limits: require admin role
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  DELETE FROM public.rate_limits WHERE created_at < now() - interval '7 days';
END;
$$;

-- 4. lookup_group_by_invite_code: require authenticated caller
CREATE OR REPLACE FUNCTION public.lookup_group_by_invite_code(p_invite_code text)
 RETURNS TABLE(id uuid, name text, invite_code text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  RETURN QUERY
    SELECT fg.id, fg.name, fg.invite_code
    FROM public.family_groups fg
    WHERE fg.invite_code = p_invite_code
    LIMIT 1;
END;
$$;

-- 5. lookup_volunteer_status: redact full_name to initials for unauthenticated, require auth
CREATE OR REPLACE FUNCTION public.lookup_volunteer_status(p_query text)
 RETURNS TABLE(full_name text, volunteer_id text, status text, city text, skills text[], created_at timestamptz)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
BEGIN
  RETURN QUERY
    SELECT 
      CASE 
        WHEN auth.uid() IS NOT NULL THEN v.full_name
        ELSE left(v.full_name, 1) || '***'
      END,
      v.volunteer_id, v.status, v.city, v.skills, v.created_at
    FROM public.volunteers v
    WHERE v.mobile = p_query OR v.volunteer_id = upper(p_query)
    LIMIT 1;
END;
$$;
