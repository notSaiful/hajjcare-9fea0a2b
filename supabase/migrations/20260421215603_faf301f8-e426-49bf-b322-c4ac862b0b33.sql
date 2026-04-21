-- Create lost_and_found table for reporting missing pilgrims or items
CREATE TABLE public.lost_and_found (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  report_type TEXT NOT NULL CHECK (report_type IN ('person', 'item')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'found', 'closed')),
  
  -- Person fields
  person_name TEXT,
  person_age INTEGER,
  person_gender TEXT,
  person_description TEXT,
  wearing_description TEXT,
  
  -- Item fields
  item_name TEXT,
  item_description TEXT,
  
  -- Common fields
  last_seen_location TEXT NOT NULL,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  photo_url TEXT,
  
  -- Reporter contact
  reporter_name TEXT NOT NULL,
  reporter_mobile TEXT NOT NULL,
  reporter_whatsapp TEXT,
  
  language TEXT DEFAULT 'en',
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lost_and_found ENABLE ROW LEVEL SECURITY;

-- Public can view open reports (helps community spot lost people/items)
CREATE POLICY "Anyone can view open reports"
ON public.lost_and_found
FOR SELECT
USING (status IN ('open', 'found'));

-- Anyone can submit a report (public-access model per project policy)
CREATE POLICY "Anyone can submit reports"
ON public.lost_and_found
FOR INSERT
WITH CHECK (true);

-- Reporters (if authenticated) can update their own reports; admins can update all
CREATE POLICY "Owners can update own reports"
ON public.lost_and_found
FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete reports"
ON public.lost_and_found
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_lost_and_found_updated_at
BEFORE UPDATE ON public.lost_and_found
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast filtering
CREATE INDEX idx_lost_and_found_status_type ON public.lost_and_found(status, report_type, created_at DESC);

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('lost-found-photos', 'lost-found-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view lost-found photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'lost-found-photos');

CREATE POLICY "Anyone can upload lost-found photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'lost-found-photos');