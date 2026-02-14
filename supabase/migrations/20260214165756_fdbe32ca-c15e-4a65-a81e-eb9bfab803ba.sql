
-- Create volunteers table
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  volunteer_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Basic Identity
  full_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  mobile TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  full_address TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  
  -- Skills (multi-select stored as array)
  skills TEXT[] NOT NULL DEFAULT '{}',
  
  -- Availability
  availability_days TEXT NOT NULL, -- '3', '7', '15', 'full_season'
  duty_location TEXT NOT NULL, -- 'embarkation', 'local', 'remote'
  
  -- Languages
  languages TEXT[] NOT NULL DEFAULT '{}',
  
  -- Declaration
  declaration_agreed BOOLEAN NOT NULL DEFAULT false,
  
  -- Status & Tags
  status TEXT NOT NULL DEFAULT 'registered', -- registered, screening, shortlisted, training, assessed, deployed, rejected
  city_tag TEXT,
  skill_tag TEXT,
  availability_tag TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public registration)
CREATE POLICY "Anyone can register as volunteer"
ON public.volunteers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Users can view their own registration
CREATE POLICY "Users can view own volunteer registration"
ON public.volunteers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all
CREATE POLICY "Admins can view all volunteers"
ON public.volunteers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins can update volunteers"
ON public.volunteers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Anon can check duplicate mobile
CREATE POLICY "Anon can check mobile duplicates"
ON public.volunteers
FOR SELECT
TO anon
USING (true);

-- Auto-generate volunteer_id function
CREATE OR REPLACE FUNCTION public.generate_volunteer_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  city_code TEXT;
  skill_code TEXT;
  seq_num INTEGER;
  primary_skill TEXT;
BEGIN
  -- City code: first 3 chars uppercase
  city_code := UPPER(LEFT(REGEXP_REPLACE(NEW.city, '[^a-zA-Z]', '', 'g'), 3));
  IF LENGTH(city_code) < 3 THEN
    city_code := RPAD(city_code, 3, 'X');
  END IF;
  
  -- Skill code from first skill
  primary_skill := COALESCE(NEW.skills[1], 'GEN');
  skill_code := CASE primary_skill
    WHEN 'ground_volunteer' THEN 'EMB'
    WHEN 'helpdesk' THEN 'HLP'
    WHEN 'family_update' THEN 'FAM'
    WHEN 'tech_support' THEN 'TEC'
    WHEN 'translation' THEN 'TRN'
    WHEN 'medical' THEN 'MED'
    WHEN 'logistics' THEN 'LOG'
    ELSE 'GEN'
  END;
  
  -- Sequential number
  SELECT COUNT(*) + 1 INTO seq_num FROM public.volunteers WHERE id != NEW.id;
  
  NEW.volunteer_id := 'V-' || city_code || '-' || skill_code || '-' || LPAD(seq_num::TEXT, 4, '0');
  NEW.city_tag := city_code;
  NEW.skill_tag := skill_code;
  NEW.availability_tag := NEW.availability_days;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_generate_volunteer_id
BEFORE INSERT ON public.volunteers
FOR EACH ROW
EXECUTE FUNCTION public.generate_volunteer_id();

-- Update timestamp trigger
CREATE TRIGGER update_volunteers_updated_at
BEFORE UPDATE ON public.volunteers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
