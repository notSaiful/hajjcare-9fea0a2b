
-- ============================================================
-- MILITARY-GRADE HIERARCHY & ACCOUNTABILITY SYSTEM
-- ============================================================

-- 1. RANK SYSTEM (5 levels)
CREATE TYPE public.responder_rank AS ENUM (
  'trainee',           -- Level 1: New recruit, no field deployment
  'field_responder',   -- Level 2: Certified for basic emergencies
  'senior_responder',  -- Level 3: Can lead small teams
  'zone_commander',    -- Level 4: Commands a zone
  'war_room_commander' -- Level 5: Full command authority
);

-- 2. RESPONDER PROFILES (extends responder_locations with hierarchy data)
CREATE TABLE public.responder_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  rank responder_rank NOT NULL DEFAULT 'trainee',
  rank_promoted_at TIMESTAMPTZ DEFAULT now(),
  promoted_by UUID,
  supervisor_id UUID REFERENCES public.responder_profiles(id),
  
  -- Identity verification
  id_document_url TEXT,
  id_document_type TEXT, -- aadhaar, passport, govt_id
  id_verified BOOLEAN NOT NULL DEFAULT false,
  id_verified_at TIMESTAMPTZ,
  id_verified_by UUID,
  background_check_status TEXT NOT NULL DEFAULT 'pending', -- pending, cleared, flagged, rejected
  background_check_notes TEXT,
  background_checked_at TIMESTAMPTZ,
  
  -- Operational
  specialty TEXT[], -- trauma, cardiac, crowd_management, logistics, comms
  languages TEXT[] DEFAULT '{}'::text[],
  total_deployments INTEGER NOT NULL DEFAULT 0,
  total_incidents_resolved INTEGER NOT NULL DEFAULT 0,
  avg_response_time_seconds INTEGER,
  performance_score NUMERIC(3,1) DEFAULT 0.0, -- 0.0 to 10.0
  
  -- Status
  is_field_ready BOOLEAN NOT NULL DEFAULT false,
  field_ready_since TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TRAINING MODULES
CREATE TABLE public.training_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general', -- general, medical, crowd, emergency, comms, leadership
  min_rank_required responder_rank NOT NULL DEFAULT 'trainee',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  passing_score INTEGER NOT NULL DEFAULT 70, -- percentage
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  material_url TEXT, -- PDF/video link
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TRAINING RECORDS (who completed what)
CREATE TABLE public.training_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.training_modules(id),
  status TEXT NOT NULL DEFAULT 'enrolled', -- enrolled, in_progress, completed, failed
  score INTEGER, -- percentage achieved
  attempts INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  certificate_url TEXT,
  expires_at TIMESTAMPTZ, -- certification expiry
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_module UNIQUE (user_id, module_id)
);

-- 5. CERTIFICATION TESTS
CREATE TABLE public.certification_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_type TEXT NOT NULL, -- rank_promotion, specialty, recertification
  target_rank responder_rank,
  target_specialty TEXT,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  evaluated_by UUID,
  evaluation_notes TEXT,
  tested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. DEPLOYMENT LOG (field assignment history)
CREATE TABLE public.deployment_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assignment_id UUID REFERENCES public.emergency_assignments(id),
  deployment_type TEXT NOT NULL DEFAULT 'emergency', -- emergency, scheduled, patrol, standby
  zone TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  outcome TEXT, -- resolved, escalated, handed_off, no_action
  incident_report TEXT,
  performance_rating NUMERIC(3,1), -- 0.0-10.0 per deployment
  rated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. ACCOUNTABILITY AUDIT TRAIL (immutable append-only)
CREATE TABLE public.hierarchy_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- subject
  performed_by UUID, -- actor
  action TEXT NOT NULL, -- rank_change, verification, deployment, certification, discipline, etc.
  details JSONB DEFAULT '{}'::jsonb,
  previous_value TEXT,
  new_value TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.responder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certification_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hierarchy_audit_log ENABLE ROW LEVEL SECURITY;

-- RESPONDER PROFILES
CREATE POLICY "Users can view own responder profile"
  ON public.responder_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own non-sensitive fields"
  ON public.responder_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile"
  ON public.responder_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all responder profiles"
  ON public.responder_profiles FOR SELECT
  USING (public.is_coordinator_or_admin(auth.uid()));

CREATE POLICY "Admins can manage all responder profiles"
  ON public.responder_profiles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- TRAINING MODULES (public read, admin write)
CREATE POLICY "Anyone can view active training modules"
  ON public.training_modules FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage training modules"
  ON public.training_modules FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- TRAINING RECORDS
CREATE POLICY "Users can view own training records"
  ON public.training_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own training records"
  ON public.training_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training records"
  ON public.training_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all training records"
  ON public.training_records FOR SELECT
  USING (public.is_coordinator_or_admin(auth.uid()));

CREATE POLICY "Admins can manage all training records"
  ON public.training_records FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- CERTIFICATION TESTS
CREATE POLICY "Users can view own certifications"
  ON public.certification_tests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all certifications"
  ON public.certification_tests FOR SELECT
  USING (public.is_coordinator_or_admin(auth.uid()));

CREATE POLICY "Staff can create certifications"
  ON public.certification_tests FOR INSERT
  WITH CHECK (public.is_coordinator_or_admin(auth.uid()));

CREATE POLICY "Admins can manage all certifications"
  ON public.certification_tests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- DEPLOYMENT LOGS
CREATE POLICY "Users can view own deployments"
  ON public.deployment_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all deployments"
  ON public.deployment_logs FOR SELECT
  USING (public.is_coordinator_or_admin(auth.uid()));

CREATE POLICY "Staff can create deployment logs"
  ON public.deployment_logs FOR INSERT
  WITH CHECK (public.is_coordinator_or_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Admins can manage all deployments"
  ON public.deployment_logs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- AUDIT LOG (append-only: insert for all staff, read for admins)
CREATE POLICY "Staff can insert audit logs"
  ON public.hierarchy_audit_log FOR INSERT
  WITH CHECK (public.is_coordinator_or_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Admins can view audit logs"
  ON public.hierarchy_audit_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own audit logs"
  ON public.hierarchy_audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_responder_profiles_rank ON public.responder_profiles (rank, is_field_ready);
CREATE INDEX idx_responder_profiles_user ON public.responder_profiles (user_id);
CREATE INDEX idx_training_records_user ON public.training_records (user_id, status);
CREATE INDEX idx_certification_tests_user ON public.certification_tests (user_id, test_type);
CREATE INDEX idx_deployment_logs_user ON public.deployment_logs (user_id, deployment_type);
CREATE INDEX idx_hierarchy_audit_user ON public.hierarchy_audit_log (user_id, action);
CREATE INDEX idx_hierarchy_audit_time ON public.hierarchy_audit_log (created_at DESC);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER update_responder_profiles_updated_at
  BEFORE UPDATE ON public.responder_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at
  BEFORE UPDATE ON public.training_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_records_updated_at
  BEFORE UPDATE ON public.training_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- SEED: Default training modules
-- ============================================================
INSERT INTO public.training_modules (title, title_ar, description, category, min_rank_required, duration_minutes, passing_score, is_mandatory, sort_order) VALUES
  ('Emergency First Response', 'الاستجابة الأولى للطوارئ', 'Basic emergency response protocols for Hajj pilgrims', 'emergency', 'trainee', 90, 70, true, 1),
  ('Crowd Management Fundamentals', 'أساسيات إدارة الحشود', 'Handling large crowd situations at Hajj sites', 'crowd', 'trainee', 60, 75, true, 2),
  ('Medical Triage Protocol', 'بروتوكول الفرز الطبي', 'Medical prioritization and triage for field responders', 'medical', 'field_responder', 120, 80, true, 3),
  ('Communication & Reporting', 'الاتصالات والتقارير', 'Radio protocols, incident reporting, and chain of command', 'comms', 'field_responder', 45, 70, true, 4),
  ('Advanced Emergency Leadership', 'القيادة المتقدمة في الطوارئ', 'Team leadership during multi-casualty incidents', 'leadership', 'senior_responder', 90, 85, true, 5),
  ('Heat Stroke & Dehydration Response', 'الاستجابة لضربة الشمس والجفاف', 'Critical protocol for desert heat emergencies', 'medical', 'trainee', 60, 75, true, 6),
  ('Sacred Site Protocols', 'بروتوكولات المواقع المقدسة', 'Respectful emergency response at Masjid al-Haram and other sites', 'general', 'trainee', 30, 70, true, 7),
  ('Zone Command Operations', 'عمليات قيادة المنطقة', 'Multi-team coordination and resource allocation', 'leadership', 'zone_commander', 120, 90, false, 8);

-- ============================================================
-- PROMOTION FUNCTION (with audit trail)
-- ============================================================
CREATE OR REPLACE FUNCTION public.promote_responder(
  p_target_user_id UUID,
  p_new_rank responder_rank,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_current_rank responder_rank;
  v_caller_rank responder_rank;
  v_rank_order JSONB := '{"trainee":1,"field_responder":2,"senior_responder":3,"zone_commander":4,"war_room_commander":5}'::jsonb;
BEGIN
  -- Only admins and zone_commander+ can promote
  IF NOT public.has_role(v_caller, 'admin') THEN
    -- Check if caller is zone_commander or higher
    SELECT rank INTO v_caller_rank FROM public.responder_profiles WHERE user_id = v_caller;
    IF v_caller_rank IS NULL OR (v_rank_order->>v_caller_rank::text)::int < 4 THEN
      RETURN json_build_object('success', false, 'error', 'Insufficient rank to promote');
    END IF;
  END IF;

  -- Get current rank
  SELECT rank INTO v_current_rank FROM public.responder_profiles WHERE user_id = p_target_user_id;
  IF v_current_rank IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Responder profile not found');
  END IF;

  -- Cannot demote to same or lower without admin
  IF (v_rank_order->>p_new_rank::text)::int <= (v_rank_order->>v_current_rank::text)::int 
     AND NOT public.has_role(v_caller, 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'Only admins can demote');
  END IF;

  -- Perform promotion
  UPDATE public.responder_profiles
  SET rank = p_new_rank, rank_promoted_at = now(), promoted_by = v_caller
  WHERE user_id = p_target_user_id;

  -- Audit trail
  INSERT INTO public.hierarchy_audit_log (user_id, performed_by, action, previous_value, new_value, details)
  VALUES (
    p_target_user_id, v_caller, 'rank_change',
    v_current_rank::text, p_new_rank::text,
    jsonb_build_object('notes', p_notes, 'promoted_by', v_caller)
  );

  RETURN json_build_object(
    'success', true,
    'previous_rank', v_current_rank,
    'new_rank', p_new_rank
  );
END;
$$;
