-- Create a security definer function to safely lookup user_id by phone
-- Only returns user_id if family_sharing_enabled is true (consent)
CREATE OR REPLACE FUNCTION public.lookup_user_id_by_phone(target_phone TEXT)
RETURNS TABLE(user_id UUID, full_name TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.full_name 
  FROM profiles p
  WHERE p.phone = target_phone 
    AND p.family_sharing_enabled = true
  LIMIT 1;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.lookup_user_id_by_phone(TEXT) TO authenticated;