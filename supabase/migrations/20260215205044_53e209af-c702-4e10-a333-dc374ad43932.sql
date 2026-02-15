
-- =============================================================================
-- DATA PROTECTION & COMPLIANCE FRAMEWORK
-- Compliant with: India DPDP Act 2023, Saudi PDPL, ISO 27001, SOC2
-- =============================================================================

-- 1. CONSENT RECORDS (DPDP Act S.6, Saudi PDPL Art.5)
-- Immutable log of every consent given/withdrawn by data principals
CREATE TABLE public.consent_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- What was consented to
  purpose TEXT NOT NULL,  -- e.g. 'location_tracking', 'family_sharing', 'health_data', 'marketing'
  lawful_basis TEXT NOT NULL DEFAULT 'consent',  -- consent, contract, legal_obligation, vital_interest, public_task
  
  -- Consent state
  status TEXT NOT NULL DEFAULT 'granted',  -- granted, withdrawn, expired
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  withdrawn_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,  -- auto-expiry (DPDP Act requires time-bound consent)
  
  -- Provenance
  consent_version TEXT NOT NULL DEFAULT '1.0',  -- version of privacy policy/terms
  collection_method TEXT NOT NULL DEFAULT 'in_app',  -- in_app, api, manual, migration
  ip_address TEXT,
  user_agent TEXT,
  
  -- Cross-border transfer consent (Saudi PDPL Art.29)
  cross_border_transfer BOOLEAN NOT NULL DEFAULT false,
  transfer_destination TEXT,  -- country code
  
  -- Metadata
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Consent records are APPEND-ONLY (no UPDATE/DELETE by users)
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consent records"
  ON public.consent_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert consent records"
  ON public.consent_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all consent records"
  ON public.consent_records FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- No UPDATE/DELETE policies - consent log is immutable
-- Withdrawal creates a NEW record with status='withdrawn'

CREATE INDEX idx_consent_user_purpose ON public.consent_records(user_id, purpose);
CREATE INDEX idx_consent_status ON public.consent_records(status, expires_at);


-- 2. DATA PROCESSING LOG (ISO 27001 A.8, SOC2 CC6)
-- Records every significant data access/processing event
CREATE TABLE public.data_processing_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Who
  actor_id UUID,  -- user who performed the action (NULL for system)
  actor_role TEXT,  -- role at time of action
  
  -- What
  action TEXT NOT NULL,  -- 'access', 'create', 'update', 'delete', 'export', 'share', 'transfer'
  resource_type TEXT NOT NULL,  -- 'profile', 'location', 'health_ticket', 'family_group'
  resource_id TEXT,  -- ID of affected resource
  
  -- Data categories (DPDP Act S.2, Saudi PDPL Art.2)
  data_categories TEXT[] DEFAULT '{}',  -- 'personal', 'sensitive', 'health', 'biometric', 'financial', 'location'
  
  -- Context
  purpose TEXT,  -- why was this data processed
  lawful_basis TEXT,  -- legal basis for processing
  
  -- Cross-border (Saudi PDPL Art.29)
  cross_border BOOLEAN NOT NULL DEFAULT false,
  destination_country TEXT,
  
  -- Technical metadata
  ip_address TEXT,
  user_agent TEXT,
  request_id TEXT,  -- correlation ID for tracing
  
  -- Outcome
  outcome TEXT NOT NULL DEFAULT 'success',  -- success, denied, error
  denial_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.data_processing_logs ENABLE ROW LEVEL SECURITY;

-- Processing logs are admin-only (SOC2 requirement)
CREATE POLICY "Admins can view processing logs"
  ON public.data_processing_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert processing logs"
  ON public.data_processing_logs FOR INSERT
  WITH CHECK (true);  -- Edge functions insert via service role

-- No UPDATE/DELETE - immutable audit trail (ISO 27001)

CREATE INDEX idx_processing_actor ON public.data_processing_logs(actor_id, created_at DESC);
CREATE INDEX idx_processing_resource ON public.data_processing_logs(resource_type, resource_id);
CREATE INDEX idx_processing_time ON public.data_processing_logs(created_at DESC);


-- 3. DATA SUBJECT REQUESTS (DPDP Act S.11-13, Saudi PDPL Art.4)
-- Right to access, rectification, erasure, portability
CREATE TABLE public.data_subject_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Request details
  request_type TEXT NOT NULL,  -- 'access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, in_progress, completed, rejected, escalated
  
  -- Description
  description TEXT,
  scope TEXT[] DEFAULT '{}',  -- which data categories: 'profile', 'location', 'health', 'family', 'all'
  
  -- Processing
  assigned_to UUID,  -- admin/DPO handling the request
  response TEXT,
  rejection_reason TEXT,
  
  -- Compliance timelines (DPDP: 30 days, Saudi PDPL: 30 days)
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  due_by TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  completed_at TIMESTAMPTZ,
  
  -- Data export (for access/portability requests)
  export_url TEXT,  -- temporary signed URL
  export_expires_at TIMESTAMPTZ,
  export_format TEXT DEFAULT 'json',  -- json, csv
  
  -- Verification
  identity_verified BOOLEAN NOT NULL DEFAULT false,
  verification_method TEXT,  -- 'email_otp', 'phone_otp', 'id_document'
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.data_subject_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own DSR"
  ON public.data_subject_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own DSR"
  ON public.data_subject_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all DSR"
  ON public.data_subject_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_dsr_user ON public.data_subject_requests(user_id, status);
CREATE INDEX idx_dsr_due ON public.data_subject_requests(due_by) WHERE status IN ('pending', 'in_progress');


-- 4. DATA BREACH LOG (DPDP Act S.8, Saudi PDPL Art.20, ISO 27001 A.16)
CREATE TABLE public.data_breach_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Breach details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',  -- low, medium, high, critical
  breach_type TEXT NOT NULL,  -- 'unauthorized_access', 'data_loss', 'data_leak', 'system_compromise', 'social_engineering'
  
  -- Impact assessment
  affected_users_count INTEGER DEFAULT 0,
  data_categories_affected TEXT[] DEFAULT '{}',
  cross_border_impact BOOLEAN NOT NULL DEFAULT false,
  
  -- Timeline
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  occurred_at TIMESTAMPTZ,
  contained_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  -- Notification (DPDP: 72h to DPA, Saudi PDPL: 72h)
  dpa_notified_at TIMESTAMPTZ,  -- Data Protection Authority notification
  users_notified_at TIMESTAMPTZ,
  notification_method TEXT,
  
  -- Response
  reported_by UUID,
  handled_by UUID,
  containment_actions TEXT,
  remediation_steps TEXT,
  root_cause TEXT,
  lessons_learned TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'detected',  -- detected, investigating, contained, resolved, closed
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.data_breach_log ENABLE ROW LEVEL SECURITY;

-- Only admins can access breach logs
CREATE POLICY "Admins can manage breach logs"
  ON public.data_breach_log FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));


-- 5. ENCRYPTION KEY REGISTRY (ISO 27001 A.10, SOC2 CC6.1)
-- Metadata about encryption keys (NEVER stores actual keys)
CREATE TABLE public.encryption_key_registry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  key_alias TEXT NOT NULL UNIQUE,  -- human-readable identifier
  key_type TEXT NOT NULL,  -- 'aes_256_gcm', 'rsa_2048', 'rsa_4096', 'ecdsa_p256'
  purpose TEXT NOT NULL,  -- 'data_at_rest', 'data_in_transit', 'backup', 'signing'
  
  -- Key lifecycle
  status TEXT NOT NULL DEFAULT 'active',  -- active, rotating, retired, compromised
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  activated_at TIMESTAMPTZ DEFAULT now(),
  rotation_due_at TIMESTAMPTZ,  -- ISO 27001 requires key rotation
  rotated_at TIMESTAMPTZ,
  retired_at TIMESTAMPTZ,
  
  -- Compliance
  algorithm TEXT NOT NULL,  -- 'AES-256-GCM', 'RSA-OAEP', etc.
  key_length_bits INTEGER NOT NULL,
  managed_by TEXT NOT NULL DEFAULT 'platform',  -- 'platform', 'kms', 'hsm'
  
  -- Audit
  last_used_at TIMESTAMPTZ,
  usage_count BIGINT DEFAULT 0,
  rotated_by UUID,
  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.encryption_key_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage key registry"
  ON public.encryption_key_registry FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));


-- 6. BACKUP REGISTRY (ISO 27001 A.12.3, SOC2 A1.2)
CREATE TABLE public.backup_registry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  backup_type TEXT NOT NULL,  -- 'full', 'incremental', 'differential', 'schema_only'
  scope TEXT NOT NULL,  -- 'full_database', 'user_data', 'audit_logs', 'config'
  
  -- Status
  status TEXT NOT NULL DEFAULT 'in_progress',  -- in_progress, completed, failed, verified, expired
  
  -- Details
  size_bytes BIGINT,
  record_count INTEGER,
  encryption_key_id UUID REFERENCES public.encryption_key_registry(id),
  checksum TEXT,  -- SHA-256 hash for integrity verification
  storage_location TEXT,  -- 'primary', 'dr_site', 'cold_archive'
  
  -- Retention (Saudi PDPL: data minimization)
  retention_days INTEGER NOT NULL DEFAULT 90,
  expires_at TIMESTAMPTZ,
  
  -- Recovery testing (ISO 27001)
  last_restore_test_at TIMESTAMPTZ,
  restore_test_result TEXT,  -- 'success', 'partial', 'failed'
  restore_time_seconds INTEGER,
  
  -- Timeline
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  initiated_by UUID,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.backup_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage backup registry"
  ON public.backup_registry FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));


-- 7. AUTO-EXPIRE CONSENTS (DPDP Act requires time-bound consent)
CREATE OR REPLACE FUNCTION public.expire_stale_consents()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE consent_records
  SET status = 'expired'
  WHERE status = 'granted'
    AND expires_at IS NOT NULL
    AND expires_at < now();
END;
$$;


-- 8. TRIGGER: Auto-log data processing events for sensitive tables
CREATE OR REPLACE FUNCTION public.log_data_processing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO data_processing_logs (
    actor_id, action, resource_type, resource_id,
    data_categories, purpose, outcome
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id::text
      ELSE NEW.id::text
    END,
    CASE TG_TABLE_NAME
      WHEN 'profiles' THEN ARRAY['personal']
      WHEN 'health_tickets' THEN ARRAY['personal', 'health', 'sensitive']
      WHEN 'member_locations' THEN ARRAY['personal', 'location']
      WHEN 'responder_profiles' THEN ARRAY['personal']
      ELSE ARRAY['personal']
    END,
    'application_operation',
    'success'
  );
  
  IF TG_OP = 'DELETE' THEN RETURN OLD;
  ELSE RETURN NEW;
  END IF;
END;
$$;

-- Attach audit triggers to sensitive tables
CREATE TRIGGER audit_profiles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_data_processing();

CREATE TRIGGER audit_health_tickets_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.health_tickets
  FOR EACH ROW EXECUTE FUNCTION public.log_data_processing();

CREATE TRIGGER audit_member_locations_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.member_locations
  FOR EACH ROW EXECUTE FUNCTION public.log_data_processing();


-- 9. HELPER: Check if user has active consent for a purpose
CREATE OR REPLACE FUNCTION public.has_active_consent(p_user_id UUID, p_purpose TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM consent_records
    WHERE user_id = p_user_id
      AND purpose = p_purpose
      AND status = 'granted'
      AND (expires_at IS NULL OR expires_at > now())
    ORDER BY granted_at DESC
    LIMIT 1
  );
$$;
