
-- Lookup a user by email (from auth.users) or user_id (uuid), return profile + current roles
CREATE OR REPLACE FUNCTION public.lookup_user_for_role_assignment(p_identifier text)
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  current_roles jsonb
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_user_id uuid;
  v_email text;
  v_full_name text;
  v_roles jsonb;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT public.has_role(v_caller, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  -- Try as UUID first, fallback to email lookup
  BEGIN
    v_user_id := p_identifier::uuid;
  EXCEPTION WHEN OTHERS THEN
    v_user_id := NULL;
  END;

  IF v_user_id IS NULL THEN
    SELECT u.id, u.email INTO v_user_id, v_email
    FROM auth.users u
    WHERE lower(u.email) = lower(trim(p_identifier))
    LIMIT 1;
  ELSE
    SELECT u.email INTO v_email
    FROM auth.users u
    WHERE u.id = v_user_id
    LIMIT 1;
  END IF;

  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  SELECT p.full_name INTO v_full_name
  FROM public.profiles p
  WHERE p.user_id = v_user_id
  LIMIT 1;

  SELECT COALESCE(
    jsonb_agg(jsonb_build_object('id', ur.id, 'role', ur.role, 'zone', ur.zone)),
    '[]'::jsonb
  ) INTO v_roles
  FROM public.user_roles ur
  WHERE ur.user_id = v_user_id;

  RETURN QUERY SELECT v_user_id, v_email, v_full_name, v_roles;
END;
$$;

-- Assign a role to a user identified by email or UUID. Admin-only.
CREATE OR REPLACE FUNCTION public.assign_user_role(
  p_identifier text,
  p_role app_role,
  p_zone text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_user_id uuid;
  v_email text;
  v_existing_id uuid;
BEGIN
  IF v_caller IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
  END IF;

  IF NOT public.has_role(v_caller, 'admin'::app_role) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Admin access required');
  END IF;

  -- Resolve user
  BEGIN
    v_user_id := p_identifier::uuid;
  EXCEPTION WHEN OTHERS THEN
    v_user_id := NULL;
  END;

  IF v_user_id IS NULL THEN
    SELECT u.id, u.email INTO v_user_id, v_email
    FROM auth.users u
    WHERE lower(u.email) = lower(trim(p_identifier))
    LIMIT 1;
  ELSE
    SELECT u.email INTO v_email
    FROM auth.users u WHERE u.id = v_user_id LIMIT 1;

    IF v_email IS NULL THEN
      v_user_id := NULL;
    END IF;
  END IF;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Prevent duplicate (user_id + role) — table has UNIQUE(user_id, role)
  SELECT id INTO v_existing_id
  FROM public.user_roles
  WHERE user_id = v_user_id AND role = p_role
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Update zone if provided and different
    IF p_zone IS NOT NULL THEN
      UPDATE public.user_roles SET zone = p_zone WHERE id = v_existing_id;
    END IF;

    INSERT INTO public.admin_audit_logs (admin_id, action, target_table, target_id, details)
    VALUES (v_caller, 'role_zone_updated', 'user_roles', v_existing_id::text,
            jsonb_build_object('user_id', v_user_id, 'email', v_email, 'role', p_role, 'zone', p_zone));

    RETURN jsonb_build_object(
      'success', true,
      'already_existed', true,
      'user_id', v_user_id,
      'email', v_email,
      'role', p_role
    );
  END IF;

  INSERT INTO public.user_roles (user_id, role, zone)
  VALUES (v_user_id, p_role, p_zone)
  RETURNING id INTO v_existing_id;

  INSERT INTO public.admin_audit_logs (admin_id, action, target_table, target_id, details)
  VALUES (v_caller, 'role_assigned', 'user_roles', v_existing_id::text,
          jsonb_build_object('user_id', v_user_id, 'email', v_email, 'role', p_role, 'zone', p_zone));

  RETURN jsonb_build_object(
    'success', true,
    'already_existed', false,
    'user_id', v_user_id,
    'email', v_email,
    'role', p_role,
    'role_id', v_existing_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_user_for_role_assignment(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_user_role(text, app_role, text) TO authenticated;
