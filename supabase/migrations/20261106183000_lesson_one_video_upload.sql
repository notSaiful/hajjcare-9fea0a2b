-- Video 1 only: admin MP4 upload for course hajj-training, lesson_number 1.
-- Does not change lessons 2-100, other buckets, or existing video_links policies.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hajj-training-videos',
  'hajj-training-videos',
  true,
  41943040,
  ARRAY['video/mp4']::text[]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Admins upload hajj training video 1" ON storage.objects;
CREATE POLICY "Admins upload hajj training video 1"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hajj-training-videos'
  AND name LIKE 'lesson-1/%.mp4'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Admins update hajj training video 1" ON storage.objects;
CREATE POLICY "Admins update hajj training video 1"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'hajj-training-videos'
  AND name LIKE 'lesson-1/%.mp4'
  AND public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'hajj-training-videos'
  AND name LIKE 'lesson-1/%.mp4'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Admins delete hajj training video 1" ON storage.objects;
CREATE POLICY "Admins delete hajj training video 1"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'hajj-training-videos'
  AND name LIKE 'lesson-1/%.mp4'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- If a platform check already lists the external providers, also allow the
-- uploaded Video 1 value. Do not invent a check when none exists.
DO $$
DECLARE
  r record;
  dropped boolean := false;
  skipped text := '';
BEGIN
  IF to_regclass('public.video_links') IS NULL THEN
    RAISE EXCEPTION 'public.video_links is missing; Video 1 upload was not changed';
  END IF;

  FOR r IN
    SELECT conname, pg_get_constraintdef(oid) AS def
    FROM pg_constraint
    WHERE conrelid = 'public.video_links'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%platform%'
  LOOP
    IF r.def ILIKE '%uploaded%' THEN
      CONTINUE;
    ELSIF r.def ILIKE '%youtube%'
      AND r.def ILIKE '%vimeo%'
      AND r.def NOT ILIKE '%published%'
      AND r.def NOT ILIKE '%lesson_number%'
      AND r.def NOT ILIKE '%external_url%' THEN
      EXECUTE format('ALTER TABLE public.video_links DROP CONSTRAINT %I', r.conname);
      dropped := true;
    ELSE
      skipped := skipped || r.conname || ': ' || r.def || E'\n';
    END IF;
  END LOOP;

  IF skipped <> '' THEN
    RAISE EXCEPTION 'Refusing to rewrite an unexpected video_links platform constraint: %', skipped;
  END IF;

  IF dropped AND NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.video_links'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%uploaded%'
  ) THEN
    ALTER TABLE public.video_links
      ADD CONSTRAINT video_links_platform_includes_uploaded
      CHECK (platform IN ('youtube', 'vimeo', 'cloudflare_stream', 'aws_cloudfront', 'mux', 'uploaded'))
      NOT VALID;
  END IF;
END $$;
