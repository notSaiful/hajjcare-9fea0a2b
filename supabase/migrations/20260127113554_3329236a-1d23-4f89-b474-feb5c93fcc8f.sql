-- Create storage bucket for proof documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('proof-documents', 'proof-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload proof documents
CREATE POLICY "Anyone can upload proof documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'proof-documents');

-- Allow anyone to view proof documents
CREATE POLICY "Anyone can view proof documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'proof-documents');

-- Allow admins/coordinators to delete proof documents
CREATE POLICY "Admins can delete proof documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'proof-documents' AND is_coordinator_or_admin(auth.uid()));

-- Add city and pincode columns to applicants table
ALTER TABLE public.applicants
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT;