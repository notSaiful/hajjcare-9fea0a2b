-- Create family groups table
CREATE TABLE public.family_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE DEFAULT substring(gen_random_uuid()::text, 1, 8),
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group members table
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  member_id TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, member_id)
);

-- Create member locations table for real-time tracking
CREATE TABLE public.member_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id TEXT NOT NULL,
  group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  current_stage TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(member_id, group_id)
);

-- Enable Row Level Security
ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth is used, we use member_id for identification)
CREATE POLICY "Anyone can create family groups" 
ON public.family_groups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view family groups" 
ON public.family_groups 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can join groups" 
ON public.group_members 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Group members can view other members" 
ON public.group_members 
FOR SELECT 
USING (true);

CREATE POLICY "Members can leave groups" 
ON public.group_members 
FOR DELETE 
USING (true);

CREATE POLICY "Anyone can update location" 
ON public.member_locations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view locations in their groups" 
ON public.member_locations 
FOR SELECT 
USING (true);

CREATE POLICY "Members can update their location" 
ON public.member_locations 
FOR UPDATE 
USING (true);

-- Enable realtime for member_locations
ALTER PUBLICATION supabase_realtime ADD TABLE public.member_locations;

-- Create function to upsert member location
CREATE OR REPLACE FUNCTION public.upsert_member_location(
  p_member_id TEXT,
  p_group_id UUID,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_current_stage TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO member_locations (member_id, group_id, latitude, longitude, current_stage, updated_at)
  VALUES (p_member_id, p_group_id, p_latitude, p_longitude, p_current_stage, now())
  ON CONFLICT (member_id, group_id) 
  DO UPDATE SET 
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    current_stage = EXCLUDED.current_stage,
    updated_at = now();
END;
$$;