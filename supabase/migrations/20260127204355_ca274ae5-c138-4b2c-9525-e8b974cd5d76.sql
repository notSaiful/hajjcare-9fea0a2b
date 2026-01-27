-- Grant INSERT permission to anon role on applicants table
GRANT INSERT ON public.applicants TO anon;

-- Grant SELECT on the view for status check
GRANT SELECT ON public.applicants_status_check TO anon;

-- Ensure the anon role can use sequences for id generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;