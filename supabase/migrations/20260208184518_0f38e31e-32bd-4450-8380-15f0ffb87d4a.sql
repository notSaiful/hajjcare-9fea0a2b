
-- =============================================
-- HajjCare AI Brain - Database Schema
-- =============================================

-- 1. AI Sessions table - tracks user AI interactions
CREATE TABLE public.ai_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'general',
  module TEXT NOT NULL DEFAULT 'orchestrator',
  language TEXT NOT NULL DEFAULT 'en',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.ai_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON public.ai_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. AI Intent Logs - records every intent classification
CREATE TABLE public.ai_intent_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.ai_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  raw_input TEXT NOT NULL,
  detected_intent TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 0.0,
  routed_module TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  response_summary TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_intent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own intent logs" ON public.ai_intent_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own intent logs" ON public.ai_intent_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all intent logs" ON public.ai_intent_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 3. Fraud Scores - operator fraud intelligence
CREATE TABLE public.fraud_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES public.verified_operators(id) ON DELETE CASCADE,
  fraud_probability REAL NOT NULL DEFAULT 0.0,
  risk_factors JSONB DEFAULT '[]',
  complaint_count INTEGER NOT NULL DEFAULT 0,
  payment_anomaly_count INTEGER NOT NULL DEFAULT 0,
  recommendation TEXT,
  auto_blacklist_suggested BOOLEAN NOT NULL DEFAULT false,
  last_analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(operator_id)
);

ALTER TABLE public.fraud_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view fraud scores" ON public.fraud_scores
  FOR SELECT USING (public.is_coordinator_or_admin(auth.uid()));
CREATE POLICY "System can manage fraud scores" ON public.fraud_scores
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. Tracking Alerts - movement pattern intelligence
CREATE TABLE public.tracking_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  member_id TEXT,
  group_id UUID REFERENCES public.family_groups(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL, -- 'lost', 'fatigue', 'panic', 'stationary', 'crowd_density'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  details JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tracking_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tracking alerts" ON public.tracking_alerts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Coordinators can view all tracking alerts" ON public.tracking_alerts
  FOR SELECT USING (public.is_coordinator_or_admin(auth.uid()));
CREATE POLICY "Coordinators can update tracking alerts" ON public.tracking_alerts
  FOR UPDATE USING (public.is_coordinator_or_admin(auth.uid()));

-- 5. Emotional Support Logs - anxiety detection & support
CREATE TABLE public.emotional_support_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.ai_sessions(id) ON DELETE SET NULL,
  detected_emotion TEXT NOT NULL, -- 'anxiety', 'fear', 'grief', 'loneliness', 'overwhelmed'
  confidence REAL NOT NULL DEFAULT 0.0,
  support_type TEXT NOT NULL, -- 'dua', 'comfort', 'breathing', 'professional_referral'
  response_given TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.emotional_support_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emotional logs" ON public.emotional_support_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own emotional logs" ON public.emotional_support_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coordinators can view emotional logs" ON public.emotional_support_logs
  FOR SELECT USING (public.is_coordinator_or_admin(auth.uid()));

-- 6. AI Feedback - learning loop
CREATE TABLE public.ai_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intent_log_id UUID REFERENCES public.ai_intent_logs(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  was_helpful BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own feedback" ON public.ai_feedback
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all feedback" ON public.ai_feedback
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_ai_intent_logs_user ON public.ai_intent_logs(user_id, created_at DESC);
CREATE INDEX idx_ai_intent_logs_module ON public.ai_intent_logs(routed_module);
CREATE INDEX idx_fraud_scores_operator ON public.fraud_scores(operator_id);
CREATE INDEX idx_fraud_scores_probability ON public.fraud_scores(fraud_probability DESC);
CREATE INDEX idx_tracking_alerts_status ON public.tracking_alerts(status, severity);
CREATE INDEX idx_tracking_alerts_type ON public.tracking_alerts(alert_type, created_at DESC);
CREATE INDEX idx_emotional_logs_user ON public.emotional_support_logs(user_id, created_at DESC);
CREATE INDEX idx_ai_sessions_user ON public.ai_sessions(user_id, created_at DESC);

-- Triggers for updated_at
CREATE TRIGGER update_ai_sessions_updated_at
  BEFORE UPDATE ON public.ai_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fraud_scores_updated_at
  BEFORE UPDATE ON public.fraud_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
