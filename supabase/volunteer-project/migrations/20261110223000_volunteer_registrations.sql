-- Apply only on Supabase project vvbbwlfzpfvgyweeggvw (hajjcare-live).
-- Do not apply this on begtqcmwruvwposocnsr. It does not alter public.volunteers.
-- The Edge Function volunteer-register inserts with the service role. The browser has no table access.

create table if not exists public.volunteer_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120 and full_name !~ '[<>]'),
  father_name text not null check (char_length(father_name) between 2 and 120 and father_name !~ '[<>]'),
  age integer not null check (age between 18 and 65),
  mobile text not null check (mobile ~ '^[0-9]{10}$'),
  whatsapp text not null check (whatsapp ~ '^[0-9]{10}$'),
  email text check (
    email is null
    or (char_length(email) between 3 and 120 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
  ),
  full_address text not null check (char_length(full_address) between 2 and 400 and full_address !~ '[<>]'),
  city text not null check (char_length(city) between 2 and 80 and city !~ '[<>]'),
  district text not null check (char_length(district) between 2 and 80 and district !~ '[<>]'),
  state text not null check (state in (
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  )),
  embarkation_point text not null check (embarkation_point in (
    'Srinagar', 'Gaya', 'Guwahati', 'Indore', 'Jaipur', 'Nagpur',
    'Delhi', 'Mumbai', 'Kolkata', 'Bengaluru', 'Hyderabad',
    'Cochin (Kochi)', 'Chennai', 'Ahmedabad', 'Lucknow',
    'Kannur', 'Calicut (Kozhikode)', 'Vijayawada'
  )),
  skills text[] not null check (
    cardinality(skills) between 1 and 7
    and skills <@ array[
      'ground_volunteer', 'helpdesk', 'family_update', 'tech_support',
      'translation', 'medical', 'logistics'
    ]::text[]
  ),
  availability_days text not null check (availability_days in ('3', '7', '15', 'full_season')),
  duty_location text not null check (duty_location in ('embarkation', 'local', 'remote')),
  languages text[] not null check (
    cardinality(languages) between 1 and 5
    and languages <@ array['hindi', 'urdu', 'english', 'arabic', 'marathi']::text[]
  ),
  other_language text check (
    other_language is null
    or (char_length(other_language) between 2 and 40 and other_language !~ '[<>]')
  ),
  declaration_agreed boolean not null check (declaration_agreed),
  consent_privacy boolean not null check (consent_privacy),
  consent_terms boolean not null check (consent_terms),
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'reviewed', 'closed')),
  source text not null default 'web' check (source = 'web'),
  unique (mobile)
);

comment on column public.volunteer_registrations.duty_location is
  'Duty city/location from the /volunteer form: embarkation, local, or remote.';

alter table public.volunteer_registrations enable row level security;
alter table public.volunteer_registrations force row level security;

revoke all on table public.volunteer_registrations from public, anon, authenticated;
grant select, insert on table public.volunteer_registrations to service_role;
