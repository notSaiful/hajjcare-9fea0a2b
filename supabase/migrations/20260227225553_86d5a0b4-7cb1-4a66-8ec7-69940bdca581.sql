
-- 1. emotional_support_logs: Remove coordinator access to mental health data
-- Users can still view their own logs; admins are not granted broad view either (only service role for ops)
DROP POLICY IF EXISTS "Coordinators can view emotional logs" ON public.emotional_support_logs;

-- 2. fraud_scores: Remove coordinator view — admin ALL policy already covers admin access
DROP POLICY IF EXISTS "Admins can view fraud scores" ON public.fraud_scores;

-- 3. responder_profiles: Remove broad staff view of sensitive background check info
-- Users can still view own profile; admin ALL policy covers admin access
DROP POLICY IF EXISTS "Staff can view all responder profiles" ON public.responder_profiles;

-- 4. training_records: Remove broad staff view of all training scores
-- Users can still view own records; admin ALL policy covers admin access
DROP POLICY IF EXISTS "Staff can view all training records" ON public.training_records;

-- 5. deployment_logs: Remove broad staff view of all performance ratings
-- Users can still view own deployments; admin ALL policy covers admin access
DROP POLICY IF EXISTS "Staff can view all deployments" ON public.deployment_logs;
