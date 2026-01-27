-- Create applicants table for Free Umrah sponsorship applications
CREATE TABLE public.applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id text UNIQUE NOT NULL DEFAULT 'APP-' || substring(gen_random_uuid()::text, 1, 8),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  age integer NOT NULL CHECK (age >= 18 AND age <= 100),
  mobile text NOT NULL,
  state text NOT NULL,
  role text NOT NULL CHECK (role IN ('Imam', 'Muazzin', 'Hafiz')),
  masjid_name text NOT NULL,
  years_of_service integer NOT NULL CHECK (years_of_service >= 0),
  never_umrah boolean NOT NULL DEFAULT false,
  low_income boolean NOT NULL DEFAULT false,
  social_harmony boolean NOT NULL DEFAULT false,
  no_money_paid boolean NOT NULL DEFAULT false,
  proof_type text CHECK (proof_type IN ('Masjid Certificate', 'Self Video')),
  proof_url text,
  status text NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Under Review', 'Approved', 'Rejected', 'Completed')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can apply)
CREATE POLICY "Anyone can submit application"
ON public.applicants FOR INSERT
WITH CHECK (true);

-- Allow public to check status by application_id
CREATE POLICY "Anyone can check application status"
ON public.applicants FOR SELECT
USING (true);

-- Coordinators/admins can update applications
CREATE POLICY "Coordinators can update applications"
ON public.applicants FOR UPDATE
USING (is_coordinator_or_admin(auth.uid()));

-- Admins can delete applications
CREATE POLICY "Admins can delete applications"
ON public.applicants FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_applicants_updated_at
BEFORE UPDATE ON public.applicants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();