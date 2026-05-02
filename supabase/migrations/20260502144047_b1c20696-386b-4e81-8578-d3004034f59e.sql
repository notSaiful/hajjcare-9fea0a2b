
ALTER TABLE public.hajj_circulars 
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'HCI',
  ADD COLUMN IF NOT EXISTS source_name_display text,
  ADD COLUMN IF NOT EXISTS auto_scraped boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS external_id text;

UPDATE public.hajj_circulars 
SET source_name_display = 'Haj Committee of India' 
WHERE source = 'HCI' AND source_name_display IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS hajj_circulars_source_external_idx 
  ON public.hajj_circulars(source, external_id) 
  WHERE external_id IS NOT NULL;
