
-- Inspector pilgrim groups (each inspector manages up to 150 pilgrims)
CREATE TABLE public.inspector_pilgrim_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspector_user_id UUID NOT NULL,
  group_name TEXT NOT NULL,
  whatsapp_group_link TEXT,
  max_capacity INTEGER NOT NULL DEFAULT 150,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(inspector_user_id)
);

ALTER TABLE public.inspector_pilgrim_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors can manage own group" ON public.inspector_pilgrim_groups
  FOR ALL USING (auth.uid() = inspector_user_id)
  WITH CHECK (auth.uid() = inspector_user_id);

CREATE POLICY "Admins can manage all groups" ON public.inspector_pilgrim_groups
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Inspector pilgrims table
CREATE TABLE public.inspector_pilgrims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.inspector_pilgrim_groups(id) ON DELETE CASCADE,
  inspector_user_id UUID NOT NULL,
  pilgrim_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  father_name TEXT,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  blood_group TEXT,
  phone TEXT,
  emergency_contact TEXT,
  passport_number TEXT,
  state TEXT,
  city TEXT,
  family_tag TEXT,
  wheelchair BOOLEAN NOT NULL DEFAULT false,
  medical_conditions TEXT[] DEFAULT '{}',
  disease TEXT DEFAULT 'None',
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'NORMAL' CHECK (status IN ('NORMAL', 'EMERGENCY', 'MISSING', 'HOSPITAL')),
  is_group_leader BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inspector_pilgrims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors can manage own pilgrims" ON public.inspector_pilgrims
  FOR ALL USING (auth.uid() = inspector_user_id)
  WITH CHECK (auth.uid() = inspector_user_id);

CREATE POLICY "Admins can manage all pilgrims" ON public.inspector_pilgrims
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for performance
CREATE INDEX idx_inspector_pilgrims_group ON public.inspector_pilgrims(group_id);
CREATE INDEX idx_inspector_pilgrims_status ON public.inspector_pilgrims(status);
CREATE INDEX idx_inspector_pilgrims_risk ON public.inspector_pilgrims(risk_level);
CREATE INDEX idx_inspector_pilgrims_inspector ON public.inspector_pilgrims(inspector_user_id);

-- Trigger for updated_at
CREATE TRIGGER update_inspector_pilgrim_groups_updated_at
  BEFORE UPDATE ON public.inspector_pilgrim_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inspector_pilgrims_updated_at
  BEFORE UPDATE ON public.inspector_pilgrims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.inspector_pilgrims;
