-- Fix: Protect phone and emergency_contact from exposure to group members
-- The current profiles SELECT policy allows group members to see ALL fields including phone/emergency_contact
-- We need field-level security using a view and updated policies

-- Step 1: Create a secure view for group member profile viewing (limited fields only)
CREATE VIEW public.profiles_limited AS
SELECT 
  id,
  user_id,
  created_at,
  updated_at,
  family_sharing_enabled,
  full_name,
  embarkation_point
  -- Intentionally EXCLUDE: phone, emergency_contact
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.profiles_limited TO anon;
GRANT SELECT ON public.profiles_limited TO authenticated;

-- Step 2: Drop the existing permissive policy that exposes all fields to group members
DROP POLICY IF EXISTS "Users can view own profile or consenting group members" ON public.profiles;

-- Step 3: Create a new policy that only allows users to view their OWN full profile
-- This ensures phone and emergency_contact are only visible to the profile owner
CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note: The Admins policy already exists and remains unchanged:
-- "Admins can view all profiles" - USING has_role(auth.uid(), 'admin')

-- Step 4: Create RLS for the limited view for group member access
-- Views inherit RLS from the base table, but we use security_invoker for explicit control
ALTER VIEW public.profiles_limited SET (security_invoker = on);

-- Step 4b: Define shares_group_with here (it is (re)declared in a later migration,
-- but get_group_member_profile below depends on it, so create it first).
CREATE OR REPLACE FUNCTION public.shares_group_with(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog', 'pg_temp'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members gm1
    JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
    WHERE gm1.user_id = auth.uid()
      AND gm2.user_id = target_user_id
      AND gm1.user_id != gm2.user_id
  )
$$;

-- Step 5: Create a secure function to get limited profile data for group members
-- This is safer than a view as it explicitly controls returned fields
CREATE OR REPLACE FUNCTION public.get_group_member_profile(target_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  embarkation_point text,
  family_sharing_enabled boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.embarkation_point,
    p.family_sharing_enabled
  FROM public.profiles p
  WHERE p.user_id = target_user_id
    AND p.family_sharing_enabled = true
    AND shares_group_with(target_user_id);
$$;