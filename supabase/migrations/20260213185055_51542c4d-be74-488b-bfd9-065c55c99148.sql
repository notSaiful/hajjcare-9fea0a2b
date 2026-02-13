-- Add invite expiry and WhatsApp verification fields to family_groups
ALTER TABLE public.family_groups 
ADD COLUMN IF NOT EXISTS invite_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_phone TEXT;

-- Function to generate a fresh time-limited invite (72 hours)
CREATE OR REPLACE FUNCTION public.generate_timed_invite(p_group_id uuid)
RETURNS TABLE(invite_code text, expires_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
DECLARE
  v_new_code TEXT;
  v_expires TIMESTAMPTZ;
BEGIN
  -- Only allow group members to regenerate
  IF NOT public.is_member_of_group(p_group_id) THEN
    RAISE EXCEPTION 'Not a member of this group';
  END IF;

  v_new_code := lpad(floor(random() * 1000000)::text, 6, '0');
  v_expires := now() + interval '72 hours';

  UPDATE public.family_groups 
  SET invite_code = v_new_code, invite_expires_at = v_expires
  WHERE id = p_group_id;

  RETURN QUERY SELECT v_new_code, v_expires;
END;
$$;

-- Function: verify phone, find/create group by embarkation, return join link
CREATE OR REPLACE FUNCTION public.whatsapp_verify_and_join(p_phone text)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $$
DECLARE
  v_user_id UUID;
  v_full_name TEXT;
  v_embarkation TEXT;
  v_group_id UUID;
  v_group_name TEXT;
  v_invite_code TEXT;
  v_expires TIMESTAMPTZ;
  v_member_id TEXT;
BEGIN
  -- 1. Verify phone against profiles
  SELECT p.user_id, p.full_name, p.embarkation_point
  INTO v_user_id, v_full_name, v_embarkation
  FROM public.profiles p
  WHERE p.phone = p_phone AND p.family_sharing_enabled = true
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'no_profile', 'message', 'No verified profile found for this phone number');
  END IF;

  -- 2. Check if user already in a group
  SELECT gm.group_id INTO v_group_id
  FROM public.group_members gm
  WHERE gm.user_id = v_user_id
  LIMIT 1;

  IF v_group_id IS NOT NULL THEN
    -- Already in a group, generate fresh timed invite
    SELECT fg.name INTO v_group_name FROM public.family_groups fg WHERE fg.id = v_group_id;
    
    v_invite_code := lpad(floor(random() * 1000000)::text, 6, '0');
    v_expires := now() + interval '72 hours';
    
    UPDATE public.family_groups 
    SET invite_code = v_invite_code, invite_expires_at = v_expires
    WHERE id = v_group_id;

    RETURN json_build_object(
      'success', true,
      'action', 'existing_group',
      'full_name', v_full_name,
      'group_name', v_group_name,
      'invite_code', v_invite_code,
      'expires_at', v_expires
    );
  END IF;

  -- 3. Auto-create group based on embarkation point
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
    'success', true,
    'action', 'created_group',
    'full_name', v_full_name,
    'group_name', v_group_name,
    'invite_code', v_invite_code,
    'expires_at', v_expires
  );
END;
$$;