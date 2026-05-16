
-- 1. Promo codes: remove public exposure of internal business columns
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON public.promo_codes;

-- Allow authenticated users to read active promo codes (still excludes commission via app usage)
-- Actually, restrict to admins + creators only; redemption happens via SECURITY DEFINER RPC apply_promo_code.
-- Existing policies "Admins can manage promo codes" and "Creators can view their own codes" remain.

-- Safe public view: only non-sensitive columns
CREATE OR REPLACE VIEW public.public_promo_codes
WITH (security_invoker = false) AS
SELECT
  code,
  discount_type,
  discount_value,
  valid_from,
  valid_until,
  max_uses,
  current_uses,
  max_uses_per_user
FROM public.promo_codes
WHERE is_active = true
  AND (valid_until IS NULL OR valid_until > now());

GRANT SELECT ON public.public_promo_codes TO anon, authenticated;

-- 2. Lost & found photo uploads: enforce filename pattern + image extension
DROP POLICY IF EXISTS "Anyone can upload lost-found photos" ON storage.objects;

CREATE POLICY "Anyone can upload lost-found photos with safe name"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'lost-found-photos'
  AND name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|heic|heif)$'
);

-- Tighten bucket: image-only, max 6 MB
UPDATE storage.buckets
SET
  file_size_limit = 6291456,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/heic','image/heif']
WHERE id = 'lost-found-photos';
