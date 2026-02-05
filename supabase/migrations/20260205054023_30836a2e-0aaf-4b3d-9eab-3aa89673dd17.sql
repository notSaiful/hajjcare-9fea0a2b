-- Add masjid_registration_number column to applicants table
ALTER TABLE public.applicants
ADD COLUMN masjid_registration_number TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.applicants.masjid_registration_number IS 'Masjid Registration Number from the applicant';