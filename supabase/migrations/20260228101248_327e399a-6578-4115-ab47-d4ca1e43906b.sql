
-- 1. Add invite_code to inspector_pilgrim_groups for haji self-join
ALTER TABLE public.inspector_pilgrim_groups 
  ADD COLUMN IF NOT EXISTS invite_code text UNIQUE DEFAULT lpad(floor(random() * 1000000)::text, 6, '0');

-- Generate invite codes for existing groups
UPDATE public.inspector_pilgrim_groups SET invite_code = lpad(floor(random() * 1000000)::text, 6, '0') WHERE invite_code IS NULL;

-- 2. Khidmat (service delivery) logs table
CREATE TABLE public.khidmat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.inspector_pilgrim_groups(id) ON DELETE CASCADE,
  inspector_user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL, -- meals_served, health_check, complaint_resolved, guidance_given, transport_arranged, other
  description text,
  pilgrim_count integer DEFAULT 0,
  pilgrim_id uuid REFERENCES public.inspector_pilgrims(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.khidmat_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors can manage own khidmat logs"
  ON public.khidmat_logs FOR ALL
  USING (auth.uid() = inspector_user_id)
  WITH CHECK (auth.uid() = inspector_user_id);

CREATE POLICY "Admins can manage all khidmat logs"
  ON public.khidmat_logs FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Group announcements table
CREATE TABLE public.group_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.inspector_pilgrim_groups(id) ON DELETE CASCADE,
  inspector_user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'normal', -- normal, urgent, emergency
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.group_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors can manage own announcements"
  ON public.group_announcements FOR ALL
  USING (auth.uid() = inspector_user_id)
  WITH CHECK (auth.uid() = inspector_user_id);

CREATE POLICY "Admins can manage all announcements"
  ON public.group_announcements FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Pilgrims in the group can view announcements
CREATE POLICY "Group pilgrims can view announcements"
  ON public.group_announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.inspector_pilgrims ip
      WHERE ip.group_id = group_announcements.group_id
        AND ip.phone IS NOT NULL
    )
  );

-- 4. Add user_id to inspector_pilgrims for self-registered hajis
ALTER TABLE public.inspector_pilgrims 
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- Policy for self-registered hajis to view their own record
CREATE POLICY "Hajis can view own pilgrim record"
  ON public.inspector_pilgrims FOR SELECT
  USING (auth.uid() = user_id);

-- Index for invite code lookups
CREATE INDEX IF NOT EXISTS idx_inspector_groups_invite_code ON public.inspector_pilgrim_groups(invite_code);

-- Index for khidmat log queries
CREATE INDEX IF NOT EXISTS idx_khidmat_logs_group_date ON public.khidmat_logs(group_id, log_date);

-- Enable realtime for announcements
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_announcements;
