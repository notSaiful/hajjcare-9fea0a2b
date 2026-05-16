
DROP VIEW IF EXISTS public.public_promo_codes;

CREATE OR REPLACE FUNCTION public.get_public_promo_code(p_code text)
RETURNS TABLE(
  code text,
  discount_type text,
  discount_value numeric,
  valid_from timestamptz,
  valid_until timestamptz,
  max_uses integer,
  current_uses integer,
  max_uses_per_user integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
  SELECT
    pc.code,
    pc.discount_type,
    pc.discount_value,
    pc.valid_from,
    pc.valid_until,
    pc.max_uses,
    pc.current_uses,
    pc.max_uses_per_user
  FROM public.promo_codes pc
  WHERE pc.code = upper(p_code)
    AND pc.is_active = true
    AND (pc.valid_until IS NULL OR pc.valid_until > now())
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_promo_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_promo_code(text) TO anon, authenticated;
