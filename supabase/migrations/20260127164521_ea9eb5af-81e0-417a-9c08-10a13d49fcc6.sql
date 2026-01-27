-- Fix applicants table: Restrict public SELECT to only return application_id and status
-- This prevents exposure of PII (names, phone numbers, addresses)

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can check application status" ON public.applicants;

-- Create a restricted view for public status checks (only non-sensitive fields)
CREATE OR REPLACE VIEW public.applicants_status_check
WITH (security_invoker=on) AS
  SELECT application_id, status, created_at
  FROM public.applicants;

-- Create new policy: Unauthenticated/public can only check status via the view
-- The base table should not allow public SELECT of all columns
CREATE POLICY "Public can only check application status"
ON public.applicants
FOR SELECT
USING (
  -- Coordinators and admins can see all data
  is_coordinator_or_admin(auth.uid())
  OR
  -- Users can see their own applications if they have user_id set
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- Fix proof-documents storage bucket: Make it private
UPDATE storage.buckets
SET public = false
WHERE id = 'proof-documents';

-- Drop overly permissive storage policies
DROP POLICY IF EXISTS "Anyone can view proof documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload proof documents" ON storage.objects;

-- Create secure storage policies
-- Only authenticated users can upload (organized by application_id folder)
CREATE POLICY "Authenticated users can upload proof documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'proof-documents'
);

-- Only coordinators/admins can view proof documents
CREATE POLICY "Coordinators and admins can view proof documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'proof-documents'
  AND is_coordinator_or_admin(auth.uid())
);