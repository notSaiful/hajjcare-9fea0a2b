-- Drop the problematic policy
DROP POLICY IF EXISTS "Group members can view other members" ON public.group_members;

-- Create a security definer function to check group membership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_member_of_group(p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = p_group_id
      AND user_id = auth.uid()
  )
$$;

-- Recreate the SELECT policy using the function
CREATE POLICY "Group members can view other members"
ON public.group_members
FOR SELECT
TO authenticated
USING (public.is_member_of_group(group_id));