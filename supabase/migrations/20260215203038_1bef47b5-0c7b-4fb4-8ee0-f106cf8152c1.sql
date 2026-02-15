
-- Table: Track real-time responder locations and availability
CREATE TABLE public.responder_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'medical_staff', -- medical_staff, coordinator, volunteer
  zone TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_responder_user UNIQUE (user_id)
);

-- Table: Emergency assignments linking tickets to responders
CREATE TABLE public.emergency_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.health_tickets(id),
  responder_id UUID NOT NULL REFERENCES public.responder_locations(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  distance_meters DOUBLE PRECISION,
  escalation_level INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'assigned', -- assigned, acknowledged, en_route, on_scene, resolved, escalated
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.responder_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_assignments ENABLE ROW LEVEL SECURITY;

-- Responder locations: responders can manage their own location
CREATE POLICY "Responders manage own location"
  ON public.responder_locations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Coordinators/admins can view all responder locations
CREATE POLICY "Staff can view all responders"
  ON public.responder_locations FOR SELECT
  USING (public.is_coordinator_or_admin(auth.uid()));

-- Emergency assignments: assigned responder can view and update
CREATE POLICY "Responder can view own assignments"
  ON public.emergency_assignments FOR SELECT
  USING (
    responder_id IN (
      SELECT id FROM public.responder_locations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Responder can update own assignments"
  ON public.emergency_assignments FOR UPDATE
  USING (
    responder_id IN (
      SELECT id FROM public.responder_locations WHERE user_id = auth.uid()
    )
  );

-- Coordinators/admins can do everything with assignments
CREATE POLICY "Staff can manage all assignments"
  ON public.emergency_assignments FOR ALL
  USING (public.is_coordinator_or_admin(auth.uid()));

-- The SOS creator (ticket owner) can view their assignment
CREATE POLICY "Ticket owner can view assignment"
  ON public.emergency_assignments FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM public.health_tickets WHERE user_id = auth.uid()
    )
  );

-- Insert policy for service role (edge function creates assignments)
CREATE POLICY "Service can insert assignments"
  ON public.emergency_assignments FOR INSERT
  WITH CHECK (true);

-- Indexes for fast geospatial and lookup queries
CREATE INDEX idx_responder_locations_available ON public.responder_locations (is_available, zone);
CREATE INDEX idx_responder_locations_coords ON public.responder_locations (latitude, longitude) WHERE is_available = true;
CREATE INDEX idx_emergency_assignments_ticket ON public.emergency_assignments (ticket_id);
CREATE INDEX idx_emergency_assignments_responder ON public.emergency_assignments (responder_id, status);

-- Enable realtime for responder locations
ALTER PUBLICATION supabase_realtime ADD TABLE public.responder_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_assignments;

-- Updated_at triggers
CREATE TRIGGER update_responder_locations_updated_at
  BEFORE UPDATE ON public.responder_locations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergency_assignments_updated_at
  BEFORE UPDATE ON public.emergency_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
