
-- Sub-groups for sub-dividing inspector pilgrim groups during movements
CREATE TABLE public.inspector_sub_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.inspector_pilgrim_groups(id) ON DELETE CASCADE,
  inspector_user_id UUID NOT NULL,
  name TEXT NOT NULL,
  leader_pilgrim_id UUID REFERENCES public.inspector_pilgrims(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sub_groups_group ON public.inspector_sub_groups(group_id);
CREATE INDEX idx_sub_groups_inspector ON public.inspector_sub_groups(inspector_user_id);

ALTER TABLE public.inspector_sub_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors manage own sub-groups"
  ON public.inspector_sub_groups FOR ALL
  USING (auth.uid() = inspector_user_id)
  WITH CHECK (auth.uid() = inspector_user_id);

CREATE POLICY "Admins manage all sub-groups"
  ON public.inspector_sub_groups FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add sub_group_id to pilgrims for membership
ALTER TABLE public.inspector_pilgrims
  ADD COLUMN sub_group_id UUID REFERENCES public.inspector_sub_groups(id) ON DELETE SET NULL;

CREATE INDEX idx_pilgrims_sub_group ON public.inspector_pilgrims(sub_group_id);

-- Movement check-ins (per sub-group, per location/movement)
CREATE TABLE public.sub_group_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sub_group_id UUID NOT NULL REFERENCES public.inspector_sub_groups(id) ON DELETE CASCADE,
  inspector_user_id UUID NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'all_present',
  missing_pilgrim_ids UUID[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_checkins_sub_group ON public.sub_group_checkins(sub_group_id);

ALTER TABLE public.sub_group_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors manage own check-ins"
  ON public.sub_group_checkins FOR ALL
  USING (auth.uid() = inspector_user_id)
  WITH CHECK (auth.uid() = inspector_user_id);

CREATE POLICY "Admins view all check-ins"
  ON public.sub_group_checkins FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_inspector_sub_groups_updated_at
  BEFORE UPDATE ON public.inspector_sub_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
