
-- Create geofence_zones table for predefined Hajj safety boundaries
CREATE TABLE public.geofence_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  center_lat DOUBLE PRECISION NOT NULL,
  center_lng DOUBLE PRECISION NOT NULL,
  radius_meters INTEGER NOT NULL DEFAULT 2000,
  zone_type TEXT NOT NULL DEFAULT 'hajj_site',
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_stationary_minutes INTEGER DEFAULT 120,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.geofence_zones ENABLE ROW LEVEL SECURITY;

-- Everyone can read active geofence zones
CREATE POLICY "Anyone can view active geofence zones"
  ON public.geofence_zones FOR SELECT
  USING (is_active = true);

-- Only admins can manage geofence zones
CREATE POLICY "Admins can manage geofence zones"
  ON public.geofence_zones FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert predefined Hajj site geofences with accurate coordinates and radii
INSERT INTO public.geofence_zones (name, name_ar, center_lat, center_lng, radius_meters, zone_type, max_stationary_minutes) VALUES
  ('Masjid al-Haram (Makkah)', 'المسجد الحرام (مكة)', 21.4225, 39.8262, 3000, 'hajj_site', 180),
  ('Mina', 'منى', 21.4133, 39.8933, 2500, 'hajj_site', 120),
  ('Arafat', 'عرفات', 21.3549, 39.9842, 3500, 'hajj_site', 120),
  ('Muzdalifah', 'مزدلفة', 21.3875, 39.9325, 2000, 'hajj_site', 90),
  ('Jamarat Bridge', 'جسر الجمرات', 21.4195, 39.8728, 800, 'hajj_site', 60),
  ('Masjid an-Nabawi (Madinah)', 'المسجد النبوي (المدينة)', 24.4672, 39.6112, 2500, 'hajj_site', 180),
  ('Makkah City Zone', 'منطقة مكة المكرمة', 21.4225, 39.8262, 15000, 'city_zone', 240),
  ('Madinah City Zone', 'منطقة المدينة المنورة', 24.4672, 39.6112, 12000, 'city_zone', 240);

-- Allow authenticated users to insert tracking alerts (needed for geofence violations)
CREATE POLICY "Authenticated users can create tracking alerts"
  ON public.tracking_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add geofence_zone_id to tracking_alerts for linking violations
ALTER TABLE public.tracking_alerts ADD COLUMN IF NOT EXISTS geofence_zone_id UUID REFERENCES public.geofence_zones(id);

-- Enable realtime for geofence zones
ALTER PUBLICATION supabase_realtime ADD TABLE public.geofence_zones;
