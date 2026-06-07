
-- 1. responder_profiles INSERT: prevent self-elevation
DROP POLICY IF EXISTS "Users can create own profile" ON public.responder_profiles;
CREATE POLICY "Users can create own profile"
ON public.responder_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND rank = 'trainee'
  AND COALESCE(id_verified, false) = false
  AND COALESCE(background_check_status, 'pending') = 'pending'
  AND COALESCE(is_field_ready, false) = false
  AND COALESCE(performance_score, 0) = 0
  AND COALESCE(total_deployments, 0) = 0
  AND COALESCE(total_incidents_resolved, 0) = 0
);

-- 2. wallets INSERT: prevent self-funding
DROP POLICY IF EXISTS "Users can create their own wallet" ON public.wallets;
CREATE POLICY "Users can create their own wallet"
ON public.wallets
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND COALESCE(balance, 0) = 0
  AND COALESCE(reward_credits, 0) = 0
);

-- 3. applicants INSERT: prevent self-approval
DROP POLICY IF EXISTS "Users submit own applications" ON public.applicants;
CREATE POLICY "Users submit own applications"
ON public.applicants
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (user_id IS NULL OR auth.uid() = user_id)
  AND status = 'Applied'
  AND rejection_reason IS NULL
);

-- 4. group_members INSERT: enforce active invite
DROP POLICY IF EXISTS "Authenticated users can join groups" ON public.group_members;
CREATE POLICY "Authenticated users can join groups"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.family_groups fg
    WHERE fg.id = group_members.group_id
      AND (fg.invite_expires_at IS NULL OR fg.invite_expires_at > now())
  )
);

-- 5. member_locations INSERT: must be member of group
DROP POLICY IF EXISTS "Users can update their location" ON public.member_locations;
CREATE POLICY "Users can update their location"
ON public.member_locations
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = member_locations.group_id
      AND gm.user_id = auth.uid()
  )
);

-- 6. responder_locations: require approved responder profile
DROP POLICY IF EXISTS "Responders manage own location" ON public.responder_locations;
CREATE POLICY "Responders can view own location"
ON public.responder_locations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Responders can insert own location"
ON public.responder_locations
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.responder_profiles rp
    WHERE rp.user_id = auth.uid()
      AND rp.is_field_ready = true
      AND rp.background_check_status = 'approved'
  )
);

CREATE POLICY "Responders can update own location"
ON public.responder_locations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Responders can delete own location"
ON public.responder_locations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 7. operator_reviews INSERT: enforce pending, non-fraud
DROP POLICY IF EXISTS "Authenticated users can submit reviews" ON public.operator_reviews;
CREATE POLICY "Authenticated users can submit reviews"
ON public.operator_reviews
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND COALESCE(status, 'pending') = 'pending'
  AND COALESCE(is_fraud_report, false) = false
);

-- 8. tracking_alerts INSERT: must be group member, severity capped
DROP POLICY IF EXISTS "Authenticated users can create tracking alerts" ON public.tracking_alerts;
CREATE POLICY "Authenticated users can create tracking alerts"
ON public.tracking_alerts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = tracking_alerts.group_id
      AND gm.user_id = auth.uid()
  )
  AND COALESCE(severity, 'low') IN ('low', 'medium')
);
