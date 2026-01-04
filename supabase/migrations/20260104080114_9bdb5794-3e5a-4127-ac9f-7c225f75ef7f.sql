-- Add pilgrim_status column to member_locations table for family dashboard
-- Three fixed statuses: 'normal', 'assisted', 'emergency_managed'
ALTER TABLE public.member_locations 
ADD COLUMN IF NOT EXISTS pilgrim_status text NOT NULL DEFAULT 'normal';

-- Add check constraint for valid status values
ALTER TABLE public.member_locations
DROP CONSTRAINT IF EXISTS member_locations_pilgrim_status_check;

ALTER TABLE public.member_locations
ADD CONSTRAINT member_locations_pilgrim_status_check 
CHECK (pilgrim_status IN ('normal', 'assisted', 'emergency_managed'));

-- Add family_sharing_enabled column to profiles for consent management
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS family_sharing_enabled boolean NOT NULL DEFAULT false;

-- Create index for efficient status lookups
CREATE INDEX IF NOT EXISTS idx_member_locations_status ON public.member_locations(pilgrim_status);

-- Update the upsert_member_location function to include pilgrim_status
CREATE OR REPLACE FUNCTION public.upsert_member_location(
  p_group_id uuid, 
  p_latitude double precision, 
  p_longitude double precision, 
  p_current_stage text,
  p_pilgrim_status text DEFAULT 'normal'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

  INSERT INTO member_locations (member_id, group_id, user_id, latitude, longitude, current_stage, pilgrim_status, updated_at)
  VALUES (v_member_id, p_group_id, v_user_id, p_latitude, p_longitude, p_current_stage, COALESCE(p_pilgrim_status, 'normal'), now())
  ON CONFLICT (member_id, group_id) 
  DO UPDATE SET 
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    current_stage = EXCLUDED.current_stage,
    pilgrim_status = EXCLUDED.pilgrim_status,
    updated_at = now();
END;
$$;