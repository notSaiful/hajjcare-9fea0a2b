-- Create enum for ticket status
CREATE TYPE public.health_ticket_status AS ENUM (
  'submitted',
  'ai_triaged', 
  'coordinator_reviewing',
  'whatsapp_alerted',
  'professional_responding',
  'action_taken',
  'resolved',
  'closed'
);

-- Create enum for urgency level
CREATE TYPE public.urgency_level AS ENUM (
  'low',
  'medium', 
  'high',
  'critical'
);

-- Create health tickets table
CREATE TABLE public.health_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Submission details
  description TEXT NOT NULL,
  symptoms TEXT[],
  original_language TEXT DEFAULT 'en',
  zone TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  
  -- AI Triage results
  ai_triage_summary TEXT,
  ai_translated_text TEXT,
  ai_urgency_level urgency_level DEFAULT 'medium',
  ai_category TEXT,
  ai_recommendations TEXT[],
  
  -- Workflow tracking
  status health_ticket_status DEFAULT 'submitted',
  coordinator_notes TEXT,
  professional_response TEXT,
  action_taken TEXT,
  outcome TEXT,
  
  -- WhatsApp alert tracking
  whatsapp_group_alerted TEXT,
  alert_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.health_tickets ENABLE ROW LEVEL SECURITY;

-- Users can view their own tickets
CREATE POLICY "Users can view their own tickets"
ON public.health_tickets
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create tickets
CREATE POLICY "Users can create tickets"
ON public.health_tickets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own tickets (limited fields)
CREATE POLICY "Users can update their own tickets"
ON public.health_tickets
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_health_tickets_updated_at
BEFORE UPDATE ON public.health_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_tickets;