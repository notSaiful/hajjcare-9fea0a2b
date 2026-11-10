-- Follow-up only. Do not run this during development.
-- Adds the signed-in training user on public.training_enrollments for uorfprlfpqdpjtrcaqrt.
-- Do not run this against other projects (begtqcmwruvwposocnsr, pwtmrddreqmhyluqbfgi, vvbbwlfzpfvgyweeggvw).
-- Does not change grants. RLS stays enabled and forced.
-- anon and authenticated keep no access. The service role already has select, insert.

alter table public.training_enrollments
  add column if not exists user_id uuid null references auth.users (id) on delete set null;

create index if not exists training_enrollments_user_id_idx
  on public.training_enrollments (user_id);
