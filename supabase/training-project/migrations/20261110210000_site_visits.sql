-- Follow-up only. Do not run this during development.
-- Anonymous website visit counts for uorfprlfpqdpjtrcaqrt only.
-- Do not run this against other projects (begtqcmwruvwposocnsr, pwtmrddreqmhyluqbfgi, vvbbwlfzpfvgyweeggvw).
-- No IP, name, email, phone, or user agent is stored.

create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  visitor_id uuid not null,
  path text not null,
  visited_on date not null,
  created_at timestamptz not null default now(),
  unique (visitor_id, path, visited_on)
);

create index if not exists site_visits_visited_on_idx
  on public.site_visits (visited_on);

alter table public.site_visits enable row level security;
alter table public.site_visits force row level security;
revoke all on table public.site_visits from public, anon, authenticated;
grant select, insert on table public.site_visits to service_role;
grant usage, select on sequence public.site_visits_id_seq to service_role;
