-- Add rejection_reason column to applicants table
ALTER TABLE public.applicants 
ADD COLUMN rejection_reason TEXT NULL;

-- Create a sequence for application IDs
CREATE SEQUENCE IF NOT EXISTS public.applicants_id_seq START 1;

-- Update the default application_id format to UMR-YYYY-NNNNNN
ALTER TABLE public.applicants 
ALTER COLUMN application_id SET DEFAULT ('UMR-' || EXTRACT(YEAR FROM now())::text || '-' || LPAD(nextval('public.applicants_id_seq')::text, 6, '0'));