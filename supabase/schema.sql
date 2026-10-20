-- Run this once in Supabase → SQL Editor → New query → paste → Run.
-- It creates the table for daily logs and locks it so only you can see your rows.

create table if not exists public.logs (
  user_id        uuid not null references auth.users (id) on delete cascade,
  date           date not null,
  weight         numeric(5,1),
  waist          numeric(5,1),
  am_session     text,          -- full | minimum | skipped | rest
  am_minutes     int,
  am_km          numeric(5,2),
  pm_session     text,          -- full | minimum | skipped | rest
  meals_on_plan  int,           -- 0 to 3 (lunch, snack, dinner)
  water_l        numeric(3,1),
  energy         int,           -- 1 to 5
  sleep_time     text,          -- e.g. 22:30
  cigarettes     int,
  iqos           int,
  vape           boolean,
  notes          text,
  updated_at     timestamptz not null default now(),
  primary key (user_id, date)
);

alter table public.logs enable row level security;

drop policy if exists "own rows: read"   on public.logs;
drop policy if exists "own rows: insert" on public.logs;
drop policy if exists "own rows: update" on public.logs;
drop policy if exists "own rows: delete" on public.logs;

create policy "own rows: read"   on public.logs for select using (auth.uid() = user_id);
create policy "own rows: insert" on public.logs for insert with check (auth.uid() = user_id);
create policy "own rows: update" on public.logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows: delete" on public.logs for delete using (auth.uid() = user_id);
