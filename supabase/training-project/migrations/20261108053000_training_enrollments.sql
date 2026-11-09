-- Follow-up only. Do not run this during development.
-- public.training_enrollments already exists on pwtmrddreqmhyluqbfgi.
-- Do not CREATE TABLE again: that returns 42P07.
-- This alters the existing table to the six visible fields
-- (cover number, name, phone, language, state, embarkation point)
-- plus id and created_at.

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'training_enrollments' and column_name = 'mobile_number'
  ) then
    alter table public.training_enrollments rename column mobile_number to phone_number;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'training_enrollments' and column_name = 'preferred_language'
  ) then
    alter table public.training_enrollments rename column preferred_language to language;
  end if;
end $$;

alter table public.training_enrollments
  add column if not exists embarkation_point text;

alter table public.training_enrollments drop column if exists email;
alter table public.training_enrollments drop column if exists madhhab;
alter table public.training_enrollments drop column if exists question_or_consultation;

alter table public.training_enrollments drop constraint if exists training_enrollments_person_key;
alter table public.training_enrollments
  add constraint training_enrollments_person_key unique (cover_number, phone_number);

alter table public.training_enrollments
  alter column embarkation_point set not null;

alter table public.training_enrollments drop constraint if exists training_enrollments_embarkation_chk;
alter table public.training_enrollments
  add constraint training_enrollments_embarkation_chk check (
    embarkation_point in (
      'Srinagar', 'Gaya', 'Guwahati', 'Indore', 'Jaipur', 'Nagpur',
      'Delhi', 'Mumbai', 'Kolkata', 'Bengaluru', 'Hyderabad',
      'Cochin (Kochi)', 'Chennai', 'Ahmedabad', 'Lucknow',
      'Kannur', 'Calicut (Kozhikode)', 'Vijayawada'
    )
  );

alter table public.training_enrollments enable row level security;
alter table public.training_enrollments force row level security;
revoke all on table public.training_enrollments from public, anon, authenticated;
grant select, insert on table public.training_enrollments to service_role;
