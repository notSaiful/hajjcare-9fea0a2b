-- Drop the ambiguous function overloads and keep only the one with pilgrim_status
DROP FUNCTION IF EXISTS public.upsert_member_location(uuid, double precision, double precision, text);
DROP FUNCTION IF EXISTS public.upsert_member_location(text, uuid, double precision, double precision, text);