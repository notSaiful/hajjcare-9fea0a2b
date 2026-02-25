
-- Table for Hajj circulars from Haj Committee of India
CREATE TABLE public.hajj_circulars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_hi TEXT,
  title_ur TEXT,
  original_content TEXT NOT NULL,
  summary_en TEXT,
  summary_hi TEXT,
  summary_ur TEXT,
  source_url TEXT,
  circular_number TEXT,
  circular_date DATE,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_published BOOLEAN NOT NULL DEFAULT false,
  ai_processed BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hajj_circulars ENABLE ROW LEVEL SECURITY;

-- Everyone can read published circulars
CREATE POLICY "Anyone can view published circulars"
  ON public.hajj_circulars FOR SELECT
  USING (is_published = true);

-- Admins can manage circulars
CREATE POLICY "Admins can manage circulars"
  ON public.hajj_circulars FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Track which users have read which circulars
CREATE TABLE public.circular_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circular_id UUID NOT NULL REFERENCES public.hajj_circulars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(circular_id, user_id)
);

ALTER TABLE public.circular_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own circular reads"
  ON public.circular_reads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark circulars as read"
  ON public.circular_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_hajj_circulars_updated_at
  BEFORE UPDATE ON public.hajj_circulars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for circulars
ALTER PUBLICATION supabase_realtime ADD TABLE public.hajj_circulars;

-- Index for performance
CREATE INDEX idx_hajj_circulars_published ON public.hajj_circulars (is_published, created_at DESC);
CREATE INDEX idx_circular_reads_user ON public.circular_reads (user_id);
