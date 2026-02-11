
-- Create member_link_requests table for consent-based family linking
CREATE TABLE public.member_link_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  message TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '72 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (requester_id, target_user_id, group_id, status)
);

-- Enable RLS
ALTER TABLE public.member_link_requests ENABLE ROW LEVEL SECURITY;

-- Requesters can create link requests
CREATE POLICY "Users can create link requests"
  ON public.member_link_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- Requesters can view their sent requests
CREATE POLICY "Users can view sent requests"
  ON public.member_link_requests FOR SELECT
  USING (auth.uid() = requester_id);

-- Targets can view requests sent to them
CREATE POLICY "Users can view received requests"
  ON public.member_link_requests FOR SELECT
  USING (auth.uid() = target_user_id);

-- Targets can update (approve/reject) requests sent to them
CREATE POLICY "Targets can respond to requests"
  ON public.member_link_requests FOR UPDATE
  USING (auth.uid() = target_user_id AND status = 'pending');

-- Requesters can cancel their pending requests
CREATE POLICY "Requesters can cancel pending requests"
  ON public.member_link_requests FOR DELETE
  USING (auth.uid() = requester_id AND status = 'pending');

-- Admins can manage all requests
CREATE POLICY "Admins can manage all link requests"
  ON public.member_link_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_member_link_requests_updated_at
  BEFORE UPDATE ON public.member_link_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for instant notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.member_link_requests;
