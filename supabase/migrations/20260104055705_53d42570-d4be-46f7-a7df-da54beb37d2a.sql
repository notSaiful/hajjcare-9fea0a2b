-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update family_groups to link with auth users
ALTER TABLE public.family_groups ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update group_members to use auth user_id
ALTER TABLE public.group_members ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update member_locations to use auth user_id
ALTER TABLE public.member_locations ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update RLS policies for family groups to use authenticated users
DROP POLICY IF EXISTS "Anyone can create family groups" ON public.family_groups;
DROP POLICY IF EXISTS "Anyone can view family groups" ON public.family_groups;

CREATE POLICY "Authenticated users can create family groups" 
ON public.family_groups 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can view their groups" 
ON public.family_groups 
FOR SELECT 
TO authenticated
USING (
  id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  OR user_id = auth.uid()
);

-- Update group_members policies
DROP POLICY IF EXISTS "Anyone can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Group members can view other members" ON public.group_members;
DROP POLICY IF EXISTS "Members can leave groups" ON public.group_members;

CREATE POLICY "Authenticated users can join groups" 
ON public.group_members 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group members can view other members" 
ON public.group_members 
FOR SELECT 
TO authenticated
USING (
  group_id IN (SELECT group_id FROM public.group_members gm WHERE gm.user_id = auth.uid())
);

CREATE POLICY "Users can leave groups" 
ON public.group_members 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Update member_locations policies
DROP POLICY IF EXISTS "Anyone can update location" ON public.member_locations;
DROP POLICY IF EXISTS "Anyone can view locations in their groups" ON public.member_locations;
DROP POLICY IF EXISTS "Members can update their location" ON public.member_locations;

CREATE POLICY "Users can update their location" 
ON public.member_locations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view locations in their groups" 
ON public.member_locations 
FOR SELECT 
TO authenticated
USING (
  group_id IN (SELECT group_id FROM public.group_members gm WHERE gm.user_id = auth.uid())
);

CREATE POLICY "Users can update their own location" 
ON public.member_locations 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Update the upsert function to use auth
CREATE OR REPLACE FUNCTION public.upsert_member_location(
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
DECLARE
  v_user_id UUID := auth.uid();
  v_member_id TEXT;
BEGIN
  -- Get member_id for the user in this group
  SELECT member_id INTO v_member_id FROM group_members WHERE group_id = p_group_id AND user_id = v_user_id;
  
  IF v_member_id IS NULL THEN
    RAISE EXCEPTION 'User is not a member of this group';
  END IF;

  INSERT INTO member_locations (member_id, group_id, user_id, latitude, longitude, current_stage, updated_at)
  VALUES (v_member_id, p_group_id, v_user_id, p_latitude, p_longitude, p_current_stage, now())
  ON CONFLICT (member_id, group_id) 
  DO UPDATE SET 
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    current_stage = EXCLUDED.current_stage,
    updated_at = now();
END;
$$;