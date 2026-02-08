-- Change invite_code default to 6-digit numeric
ALTER TABLE public.family_groups
  ALTER COLUMN invite_code SET DEFAULT lpad(floor(random() * 1000000)::text, 6, '0');

-- Update the lookup function to handle numeric codes
CREATE OR REPLACE FUNCTION public.lookup_group_by_invite_code(p_invite_code text)
RETURNS TABLE(id uuid, name text, invite_code text)
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