
-- Create haj_inspectors table for the directory
CREATE TABLE public.haj_inspectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  father_name TEXT,
  state TEXT NOT NULL,
  cover_number TEXT,
  mobile TEXT,
  duty_location TEXT NOT NULL DEFAULT 'Makkah',
  language TEXT NOT NULL DEFAULT 'Hindi',
  photo_url TEXT,
  gender TEXT DEFAULT 'Male',
  category TEXT,
  quota TEXT,
  cbt_marks INTEGER,
  interview_marks INTEGER,
  total_marks INTEGER,
  result TEXT DEFAULT 'Selected',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.haj_inspectors ENABLE ROW LEVEL SECURITY;

-- Public read for active inspectors (directory is public-facing)
CREATE POLICY "Anyone can view active inspectors"
ON public.haj_inspectors
FOR SELECT
USING (is_active = true);

-- Admins can manage all inspectors
CREATE POLICY "Admins can manage all inspectors"
ON public.haj_inspectors
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Index for common filters
CREATE INDEX idx_haj_inspectors_state ON public.haj_inspectors(state);
CREATE INDEX idx_haj_inspectors_duty_location ON public.haj_inspectors(duty_location);
CREATE INDEX idx_haj_inspectors_cover_number ON public.haj_inspectors(cover_number);

-- Update trigger
CREATE TRIGGER update_haj_inspectors_updated_at
BEFORE UPDATE ON public.haj_inspectors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
