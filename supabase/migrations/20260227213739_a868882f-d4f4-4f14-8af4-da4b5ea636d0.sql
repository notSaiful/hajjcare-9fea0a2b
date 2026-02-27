
-- Remove overly permissive upload policy that lets any authenticated user upload
DROP POLICY IF EXISTS "Authenticated users can upload proof documents" ON storage.objects;

-- Only allow uploads via edge functions (service role), ensuring all validation is enforced
CREATE POLICY "Service role can upload proof documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'proof-documents' AND (select auth.role()) = 'service_role');
