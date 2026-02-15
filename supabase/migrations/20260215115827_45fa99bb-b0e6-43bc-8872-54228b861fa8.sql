-- Fix 1: Restrict volunteer PII access
DROP POLICY IF EXISTS "Anyone can view volunteers" ON public.volunteers;

-- Admins and coordinators can view all volunteers
CREATE POLICY "Admins and coordinators can view all volunteers"
ON public.volunteers FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  OR public.has_role(auth.uid(), 'coordinator'::app_role)
);

-- Users can view their own volunteer registration
CREATE POLICY "Users can view own volunteer registration"
ON public.volunteers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Fix 2: Add ownership check to whatsapp_verify_and_join
CREATE OR REPLACE FUNCTION public.whatsapp_verify_and_join(p_phone text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $function$
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
  -- Require authentication
  IF v_caller IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'auth_required', 'message', 'Authentication required');
  END IF;

  -- Ownership check: caller must own this phone number
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE phone = p_phone AND user_id = v_caller
  ) THEN
    RETURN json_build_object('success', false, 'error', 'not_authorized', 'message', 'You can only verify your own phone number');
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
$function$;