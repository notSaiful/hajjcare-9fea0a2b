-- 100-day Hajj training: per-user day completion, synced from the app.
-- NOT YET APPLIED. Review, then apply with `supabase db push` / SQL editor.
-- The app keeps working without this table (localStorage-only fallback).

create table if not exists public.hajj_training_progress (
  user_id      uuid        not null references auth.users(id) on delete cascade,
  programme    text        not null default 'hajj-2027-100-day',
  day          smallint    not null check (day between 1 and 100),
  completed_at timestamptz not null default now(),
  primary key (user_id, programme, day)
);

create index if not exists hajj_training_progress_user_idx
  on public.hajj_training_progress (user_id, programme);

alter table public.hajj_training_progress enable row level security;

drop policy if exists "training progress: read own" on public.hajj_training_progress;
create policy "training progress: read own"
  on public.hajj_training_progress for select
  to authenticated using (auth.uid() = user_id);

drop policy if exists "training progress: insert own" on public.hajj_training_progress;
create policy "training progress: insert own"
  on public.hajj_training_progress for insert
  to authenticated with check (auth.uid() = user_id);

drop policy if exists "training progress: update own" on public.hajj_training_progress;
create policy "training progress: update own"
  on public.hajj_training_progress for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "training progress: delete own" on public.hajj_training_progress;
create policy "training progress: delete own"
  on public.hajj_training_progress for delete
  to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.hajj_training_progress to authenticated;
