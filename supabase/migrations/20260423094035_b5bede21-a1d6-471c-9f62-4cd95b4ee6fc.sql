-- Track which inspectors acknowledged advisory notices
CREATE TABLE public.advisory_acknowledgments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  advisory_key TEXT NOT NULL,
  acknowledged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  UNIQUE (user_id, advisory_key)
);

CREATE INDEX idx_advisory_ack_advisory_key ON public.advisory_acknowledgments(advisory_key);
CREATE INDEX idx_advisory_ack_user ON public.advisory_acknowledgments(user_id);

ALTER TABLE public.advisory_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Users can record their own acknowledgment
CREATE POLICY "Users can acknowledge advisories"
ON public.advisory_acknowledgments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can see their own acknowledgments
CREATE POLICY "Users can view own acknowledgments"
ON public.advisory_acknowledgments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all acknowledgments
CREATE POLICY "Admins can view all acknowledgments"
ON public.advisory_acknowledgments
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));