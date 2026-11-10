-- Apply only on Supabase project vvbbwlfzpfvgyweeggvw (hajjcare-live).
-- Do not apply this on begtqcmwruvwposocnsr or uorfprlfpqdpjtrcaqrt.
-- It does not alter public.volunteers, public.volunteer_registrations, or public.training_enrollments.
-- The Edge Function training-register inserts with the service role. The browser has no table access.

create table if not exists public.training_registrations (
  id uuid primary key default gen_random_uuid(),
  receipt_code text not null unique check (receipt_code ~ '^TR-[A-Z0-9]{8}$'),
  cover_number text not null check (char_length(cover_number) between 4 and 32 and cover_number ~ '^[A-Z0-9-]+$'),
  name text not null check (char_length(name) between 2 and 120 and name !~ '[<>]'),
  phone_number text not null check (phone_number ~ '^[0-9]{10,15}$'),
  language text not null check (language in (
    'ur', 'hi', 'bn', 'ta', 'te', 'kn', 'ml', 'ks', 'gu', 'mr', 'en',
    'as', 'brx', 'doi', 'kok', 'mai', 'mni', 'ne', 'or', 'pa', 'sa', 'sat', 'sd'
  )),
  state text not null check (char_length(state) between 2 and 80 and state !~ '[<>]'),
  embarkation_point text not null check (embarkation_point in (
    'Srinagar', 'Gaya', 'Guwahati', 'Indore', 'Jaipur', 'Nagpur',
    'Delhi', 'Mumbai', 'Kolkata', 'Bengaluru', 'Hyderabad',
    'Cochin (Kochi)', 'Chennai', 'Ahmedabad', 'Lucknow',
    'Kannur', 'Calicut (Kozhikode)', 'Vijayawada'
  )),
  email text check (
    email is null
    or (char_length(email) between 3 and 120 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
  ),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'reviewed', 'closed')),
  source text not null default 'web' check (source = 'web'),
  unique (cover_number, phone_number)
);

comment on table public.training_registrations is
  'Login-free Hajj training registration. Separate from public.training_enrollments.';

alter table public.training_registrations enable row level security;
alter table public.training_registrations force row level security;

revoke all on table public.training_registrations from public, anon, authenticated;
grant select, insert on table public.training_registrations to service_role;
