
-- =============================================
-- PROMO CODE + REFERRAL + WALLET REWARD SYSTEM
-- =============================================

-- 1. PROMO CODES TABLE
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  max_uses_per_user INTEGER NOT NULL DEFAULT 1,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  creator_type TEXT NOT NULL DEFAULT 'system',
  creator_user_id UUID,
  commission_percentage NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can read active promo codes (to validate)
CREATE POLICY "Anyone can view active promo codes"
  ON public.promo_codes FOR SELECT
  USING (is_active = true);

-- Admins can manage all promo codes
CREATE POLICY "Admins can manage promo codes"
  ON public.promo_codes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Influencers can view their own codes
CREATE POLICY "Creators can view their own codes"
  ON public.promo_codes FOR SELECT
  USING (auth.uid() = creator_user_id);

-- 2. PROMO CODE USAGE TABLE
CREATE TABLE public.promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  discount_applied NUMERIC NOT NULL DEFAULT 0
);

ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON public.promo_code_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON public.promo_code_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage"
  ON public.promo_code_usage FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 3. REFERRAL CODES TABLE
CREATE TABLE public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referral code"
  ON public.referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral code"
  ON public.referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all referral codes"
  ON public.referral_codes FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 4. REFERRALS TRACKING TABLE
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL,
  referred_id UUID NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_credited BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Admins can manage referrals"
  ON public.referrals FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- 5. WALLETS TABLE
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  reward_credits NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wallet"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet"
  ON public.wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallets"
  ON public.wallets FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 6. WALLET TRANSACTIONS TABLE
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.wallet_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON public.wallet_transactions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 7. TRIGGERS
CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. GENERATE REFERRAL CODE FUNCTION
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'HC-' || upper(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- 9. APPLY PROMO CODE FUNCTION (validates + records usage + increments counter)
CREATE OR REPLACE FUNCTION public.apply_promo_code(p_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_promo RECORD;
  v_usage_count INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT * INTO v_promo FROM promo_codes
    WHERE code = upper(p_code) AND is_active = true;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid promo code');
  END IF;

  IF v_promo.valid_until IS NOT NULL AND now() > v_promo.valid_until THEN
    RETURN json_build_object('success', false, 'error', 'Promo code expired');
  END IF;

  IF v_promo.max_uses IS NOT NULL AND v_promo.current_uses >= v_promo.max_uses THEN
    UPDATE promo_codes SET is_active = false WHERE id = v_promo.id;
    RETURN json_build_object('success', false, 'error', 'Promo code limit reached');
  END IF;

  SELECT count(*) INTO v_usage_count FROM promo_code_usage
    WHERE promo_code_id = v_promo.id AND user_id = v_user_id;

  IF v_usage_count >= v_promo.max_uses_per_user THEN
    RETURN json_build_object('success', false, 'error', 'You have already used this code');
  END IF;

  INSERT INTO promo_code_usage (promo_code_id, user_id, discount_applied)
    VALUES (v_promo.id, v_user_id, v_promo.discount_value);

  UPDATE promo_codes SET current_uses = current_uses + 1 WHERE id = v_promo.id;

  RETURN json_build_object(
    'success', true,
    'discount_type', v_promo.discount_type,
    'discount_value', v_promo.discount_value,
    'code', v_promo.code
  );
END;
$$;

-- 10. PROCESS REFERRAL FUNCTION (anti-fraud + wallet credit)
CREATE OR REPLACE FUNCTION public.process_referral(p_referral_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  SELECT user_id INTO v_referrer_id FROM referral_codes WHERE code = upper(p_referral_code);
  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid referral code');
  END IF;

  -- Anti-fraud: prevent self-referral
  IF v_referrer_id = v_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Cannot refer yourself');
  END IF;

  -- Check if already referred
  SELECT * INTO v_existing FROM referrals WHERE referred_id = v_user_id;
  IF FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Already used a referral code');
  END IF;

  -- Create referral record
  INSERT INTO referrals (referrer_id, referred_id, status, reward_credited, completed_at)
    VALUES (v_referrer_id, v_user_id, 'completed', true, now());

  -- Ensure wallets exist
  INSERT INTO wallets (user_id) VALUES (v_referrer_id)
    ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO wallets (user_id) VALUES (v_user_id)
    ON CONFLICT (user_id) DO NOTHING;

  -- Credit referrer ₹50
  UPDATE wallets SET reward_credits = reward_credits + 50, updated_at = now()
    WHERE user_id = v_referrer_id RETURNING id INTO v_referrer_wallet_id;
  INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, reason, reference_id)
    VALUES (v_referrer_wallet_id, v_referrer_id, 'credit', 50, 'Referral reward', v_user_id::text);

  -- Credit new user ₹50
  UPDATE wallets SET reward_credits = reward_credits + 50, updated_at = now()
    WHERE user_id = v_user_id RETURNING id INTO v_referred_wallet_id;
  INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, reason, reference_id)
    VALUES (v_referred_wallet_id, v_user_id, 'credit', 50, 'Welcome referral bonus', v_referrer_id::text);

  RETURN json_build_object('success', true, 'message', '₹50 credited to your wallet!');
END;
$$;

-- 11. SEED WELCOME PROMO CODE
INSERT INTO public.promo_codes (code, discount_type, discount_value, max_uses, max_uses_per_user, is_active, creator_type, description)
VALUES ('HAJJCARE50', 'percentage', 10, 20000, 1, true, 'system', 'Welcome offer – 10% off for first 20,000 users');
