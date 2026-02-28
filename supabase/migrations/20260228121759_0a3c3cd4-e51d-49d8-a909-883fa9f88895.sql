
-- Inspector personal profile table
CREATE TABLE public.inspector_my_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  cover_number TEXT DEFAULT '',
  batch TEXT DEFAULT '',
  embarkation_point TEXT DEFAULT '',
  mobile TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  departure_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inspector_my_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inspector profile"
  ON public.inspector_my_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inspector profile"
  ON public.inspector_my_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inspector profile"
  ON public.inspector_my_profile FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all inspector profiles"
  ON public.inspector_my_profile FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_inspector_my_profile_updated_at
  BEFORE UPDATE ON public.inspector_my_profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
