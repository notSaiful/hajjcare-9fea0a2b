-- Revoke anonymous access to volunteers_public view
REVOKE SELECT ON public.volunteers_public FROM anon;

-- Grant access only to authenticated users
GRANT SELECT ON public.volunteers_public TO authenticated;