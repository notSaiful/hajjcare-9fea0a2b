
-- Fix overly permissive INSERT policy on data_processing_logs
DROP POLICY IF EXISTS "System can insert processing logs" ON public.data_processing_logs;
CREATE POLICY "System can insert processing logs"
ON public.data_processing_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = actor_id);

-- Fix overly permissive INSERT policy on inspector_audit_log
DROP POLICY IF EXISTS "System can insert audit logs" ON public.inspector_audit_log;
CREATE POLICY "System can insert audit logs"
ON public.inspector_audit_log
FOR INSERT
TO authenticated
WITH CHECK (is_coordinator_or_admin(auth.uid()));
