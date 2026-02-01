-- Fix overly permissive RLS policy on family_groups table
-- The "Anyone can find groups by invite code" policy exposes user_id and created_by to public

-- Drop the problematic policy
DROP POLICY IF EXISTS "Anyone can find groups by invite code" ON public.family_groups;

-- Create a function to securely lookup group by invite code
-- This function returns only the group id, not sensitive user data
CREATE OR REPLACE FUNCTION public.lookup_group_by_invite_code(p_invite_code text)
RETURNS TABLE(
  id uuid,
  name text,
  invite_code text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT fg.id, fg.name, fg.invite_code
  FROM public.family_groups fg
  WHERE fg.invite_code = p_invite_code
  LIMIT 1;
$$;

-- Grant execute permission to authenticated users (for joining groups)
GRANT EXECUTE ON FUNCTION public.lookup_group_by_invite_code(text) TO authenticated;

-- Add a comment explaining the security design
COMMENT ON FUNCTION public.lookup_group_by_invite_code IS 'Securely lookup family group by invite code without exposing user_id or created_by fields. Used when joining a group via invite code.';