-- Add post_kind to distinguish "Lost" reports from "Found" reports
ALTER TABLE public.lost_and_found
  ADD COLUMN IF NOT EXISTS post_kind text NOT NULL DEFAULT 'lost';

ALTER TABLE public.lost_and_found
  DROP CONSTRAINT IF EXISTS lost_and_found_post_kind_check;

ALTER TABLE public.lost_and_found
  ADD CONSTRAINT lost_and_found_post_kind_check
  CHECK (post_kind = ANY (ARRAY['lost'::text, 'found'::text]));

CREATE INDEX IF NOT EXISTS idx_lost_and_found_kind_status
  ON public.lost_and_found (post_kind, status, created_at DESC);

-- Rebuild the public view to expose post_kind
DROP VIEW IF EXISTS public.lost_and_found_public;
CREATE VIEW public.lost_and_found_public
WITH (security_invoker = true)
AS
SELECT
  id, user_id, report_type, post_kind, status,
  person_name, person_age, person_gender, person_description, wearing_description,
  item_name, item_description,
  last_seen_location, last_seen_at, photo_url,
  reporter_name, language, notes,
  created_at, updated_at, verified_at, verified_by
FROM public.lost_and_found;

GRANT SELECT ON public.lost_and_found_public TO anon, authenticated;