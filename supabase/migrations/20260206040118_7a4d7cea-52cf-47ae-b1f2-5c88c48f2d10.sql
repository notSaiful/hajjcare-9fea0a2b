-- Update the proof_type check constraint to allow the combined value
ALTER TABLE public.applicants DROP CONSTRAINT IF EXISTS applicants_proof_type_check;

ALTER TABLE public.applicants ADD CONSTRAINT applicants_proof_type_check 
CHECK (proof_type IS NULL OR proof_type IN ('Masjid Certificate', 'Masjid Certificate + Passport Photo'));