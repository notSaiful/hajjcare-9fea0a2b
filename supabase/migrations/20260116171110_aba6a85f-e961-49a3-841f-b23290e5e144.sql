-- Create a security definer function to check if two users share a group
CREATE OR REPLACE FUNCTION public.shares_group_with(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
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

-- Drop and recreate the SELECT policy to allow group members to view profiles with consent
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view own profile or consenting group members"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id
  OR (
    family_sharing_enabled = true
    AND public.shares_group_with(user_id)
  )
);