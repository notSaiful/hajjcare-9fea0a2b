-- Drop the old status check constraint first
ALTER TABLE public.applicants DROP CONSTRAINT IF EXISTS applicants_status_check;