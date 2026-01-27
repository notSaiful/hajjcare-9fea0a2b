-- Grant INSERT permission to anon role on applicants table
GRANT INSERT ON public.applicants TO anon;

-- Ensure the anon role can use the sequence for id generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;