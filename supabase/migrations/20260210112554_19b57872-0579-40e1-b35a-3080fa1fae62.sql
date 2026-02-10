
-- Harden all SECURITY DEFINER functions with proper search_path

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.upsert_member_location(p_group_id uuid, p_latitude double precision, p_longitude double precision, p_current_stage text, p_pilgrim_status text DEFAULT 'normal'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_member_id TEXT;
BEGIN
  SELECT member_id INTO v_member_id FROM public.group_members WHERE group_id = p_group_id AND user_id = v_user_id;
  
  IF v_member_id IS NULL THEN
    RAISE EXCEPTION 'User is not a member of this group';
  END IF;

  INSERT INTO public.member_locations (member_id, group_id, user_id, latitude, longitude, current_stage, pilgrim_status, updated_at)
  VALUES (v_member_id, p_group_id, v_user_id, p_latitude, p_longitude, p_current_stage, COALESCE(p_pilgrim_status, 'normal'), now())
  ON CONFLICT (member_id, group_id) 
  DO UPDATE SET 
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    current_stage = EXCLUDED.current_stage,
    pilgrim_status = EXCLUDED.pilgrim_status,
    updated_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.lookup_group_by_invite_code(p_invite_code text)
RETURNS TABLE(id uuid, name text, invite_code text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
  SELECT fg.id, fg.name, fg.invite_code
  FROM public.family_groups fg
  WHERE fg.invite_code = p_invite_code
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.get_group_member_profile(target_user_id uuid)
RETURNS TABLE(id uuid, user_id uuid, full_name text, embarkation_point text, family_sharing_enabled boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.embarkation_point,
    p.family_sharing_enabled
  FROM public.profiles p
  WHERE p.user_id = target_user_id
    AND p.family_sharing_enabled = true
    AND public.shares_group_with(target_user_id);
$function$;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'HC-' || upper(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.apply_promo_code(p_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_promo RECORD;
  v_usage_count INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT * INTO v_promo FROM public.promo_codes
    WHERE code = upper(p_code) AND is_active = true;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid promo code');
  END IF;

  IF v_promo.valid_until IS NOT NULL AND now() > v_promo.valid_until THEN
    RETURN json_build_object('success', false, 'error', 'Promo code expired');
  END IF;

  IF v_promo.max_uses IS NOT NULL AND v_promo.current_uses >= v_promo.max_uses THEN
    UPDATE public.promo_codes SET is_active = false WHERE id = v_promo.id;
    RETURN json_build_object('success', false, 'error', 'Promo code limit reached');
  END IF;

  SELECT count(*) INTO v_usage_count FROM public.promo_code_usage
    WHERE promo_code_id = v_promo.id AND user_id = v_user_id;

  IF v_usage_count >= v_promo.max_uses_per_user THEN
    RETURN json_build_object('success', false, 'error', 'You have already used this code');
  END IF;

  INSERT INTO public.promo_code_usage (promo_code_id, user_id, discount_applied)
    VALUES (v_promo.id, v_user_id, v_promo.discount_value);

  UPDATE public.promo_codes SET current_uses = current_uses + 1 WHERE id = v_promo.id;

  RETURN json_build_object(
    'success', true,
    'discount_type', v_promo.discount_type,
    'discount_value', v_promo.discount_value,
    'code', v_promo.code
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_referral(p_referral_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_referrer_id UUID;
  v_referrer_wallet_id UUID;
  v_referred_wallet_id UUID;
  v_existing RECORD;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT user_id INTO v_referrer_id FROM public.referral_codes WHERE code = upper(p_referral_code);
  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid referral code');
  END IF;

  IF v_referrer_id = v_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Cannot refer yourself');
  END IF;

  SELECT * INTO v_existing FROM public.referrals WHERE referred_id = v_user_id;
  IF FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Already used a referral code');
  END IF;

  INSERT INTO public.referrals (referrer_id, referred_id, status, reward_credited, completed_at)
    VALUES (v_referrer_id, v_user_id, 'completed', true, now());

  INSERT INTO public.wallets (user_id) VALUES (v_referrer_id)
    ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.wallets (user_id) VALUES (v_user_id)
    ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.wallets SET reward_credits = reward_credits + 50, updated_at = now()
    WHERE user_id = v_referrer_id RETURNING id INTO v_referrer_wallet_id;
  INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, reason, reference_id)
    VALUES (v_referrer_wallet_id, v_referrer_id, 'credit', 50, 'Referral reward', v_user_id::text);

  UPDATE public.wallets SET reward_credits = reward_credits + 50, updated_at = now()
    WHERE user_id = v_user_id RETURNING id INTO v_referred_wallet_id;
  INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, reason, reference_id)
    VALUES (v_referred_wallet_id, v_user_id, 'credit', 50, 'Welcome referral bonus', v_referrer_id::text);

  RETURN json_build_object('success', true, 'message', '₹50 credited to your wallet!');
END;
$function$;

-- Also harden the other SECURITY DEFINER functions that already have correct search_path but let's ensure consistency
CREATE OR REPLACE FUNCTION public.is_member_of_group(p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = p_group_id
      AND user_id = auth.uid()
  )
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_coordinator_or_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('coordinator', 'admin', 'medical_staff')
  )
$function$;

CREATE OR REPLACE FUNCTION public.shares_group_with(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members gm1
    JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
    WHERE gm1.user_id = auth.uid()
      AND gm2.user_id = target_user_id
      AND gm1.user_id != gm2.user_id
  )
$function$;

CREATE OR REPLACE FUNCTION public.lookup_user_id_by_phone(target_phone text)
RETURNS TABLE(user_id uuid, full_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
  SELECT p.user_id, p.full_name 
  FROM public.profiles p
  WHERE p.phone = target_phone 
    AND p.family_sharing_enabled = true
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $function$
BEGIN
  DELETE FROM public.rate_limits WHERE created_at < now() - interval '7 days';
END;
$function$;
