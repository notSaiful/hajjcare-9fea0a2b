
-- Fix: Replace the overly permissive announcement policy with proper user_id check
DROP POLICY IF EXISTS "Group pilgrims can view announcements" ON public.group_announcements;

CREATE POLICY "Authenticated pilgrims can view group announcements"
  ON public.group_announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.inspector_pilgrims ip
      WHERE ip.group_id = group_announcements.group_id
        AND ip.user_id = auth.uid()
    )
  );
