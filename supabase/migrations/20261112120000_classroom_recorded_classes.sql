-- Preview only. This file is NOT applied.
-- Intended later for Supabase project begtqcmwruvwposocnsr.
-- Do not run it against any database as part of the classroom preview.
--
-- Recorded classes, their downloadable materials, and per-student progress.
-- Public (anon + authenticated) may read published classes and the materials
-- of those published classes. A student may read and write only their own
-- progress rows. No live-class, chat, or payment tables.

create table public.classroom_classes (
  id uuid primary key default gen_random_uuid(),
  day integer not null check (day > 0),
  title_hi text not null,
  title_en text not null,
  youtube_id text,
  teacher_name text,
  teacher_title text,
  teacher_photo_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classroom_classes_day_key unique (day)
);

create table public.classroom_materials (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classroom_classes (id) on delete cascade,
  label_hi text not null,
  label_en text not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.classroom_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  class_id uuid not null references public.classroom_classes (id) on delete cascade,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint classroom_progress_user_class_key unique (user_id, class_id)
);

create index classroom_classes_published_day_idx
  on public.classroom_classes (published, day);

create index classroom_materials_class_id_idx
  on public.classroom_materials (class_id);

alter table public.classroom_classes enable row level security;
alter table public.classroom_materials enable row level security;
alter table public.classroom_progress enable row level security;

revoke all on table public.classroom_classes from anon, authenticated;
revoke all on table public.classroom_materials from anon, authenticated;
revoke all on table public.classroom_progress from anon, authenticated;

grant select on table public.classroom_classes to anon, authenticated;
grant select on table public.classroom_materials to anon, authenticated;
grant select, insert, update, delete on table public.classroom_progress to authenticated;

create policy "Public can read published classes"
  on public.classroom_classes
  for select
  to anon, authenticated
  using (published = true);

create policy "Public can read materials of published classes"
  on public.classroom_materials
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.classroom_classes as class_row
      where class_row.id = classroom_materials.class_id
        and class_row.published = true
    )
  );

create policy "Students read own classroom progress"
  on public.classroom_progress
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Students insert own classroom progress"
  on public.classroom_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Students update own classroom progress"
  on public.classroom_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Students delete own classroom progress"
  on public.classroom_progress
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
