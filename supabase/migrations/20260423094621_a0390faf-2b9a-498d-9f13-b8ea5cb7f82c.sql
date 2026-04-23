CREATE OR REPLACE FUNCTION public.get_advisory_ack_stats(p_advisory_key text)
RETURNS TABLE(acknowledged_count bigint, total_inspectors bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog', 'pg_temp'
AS $function$
  SELECT
    (SELECT COUNT(*) FROM public.advisory_acknowledgments WHERE advisory_key = p_advisory_key)::bigint AS acknowledged_count,
    (SELECT COUNT(*) FROM public.inspector_my_profile)::bigint AS total_inspectors;
$function$;

GRANT EXECUTE ON FUNCTION public.get_advisory_ack_stats(text) TO anon, authenticated;