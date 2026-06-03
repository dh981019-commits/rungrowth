-- Runner's Hi Supabase schema draft.
-- MVP note: these anon policies are for early insert/select testing only.
-- Tighten them before enabling real user data or authentication.

create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  total_hp integer not null default 0,
  current_tier text not null default '브론즈 러너',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.runs (
  id text primary key,
  user_id uuid references public.user_profiles(id) on delete set null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_seconds integer not null check (duration_seconds >= 0),
  distance_meters integer not null check (distance_meters >= 0),
  average_pace_seconds_per_km integer,
  earned_hp integer not null default 0,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.run_points (
  id uuid primary key default gen_random_uuid(),
  run_id text not null references public.runs(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  altitude double precision,
  accuracy double precision,
  speed double precision,
  recorded_at timestamptz not null,
  sequence integer not null check (sequence >= 0)
);

create index if not exists runs_started_at_idx on public.runs(started_at desc);
create index if not exists runs_user_id_idx on public.runs(user_id);
create index if not exists run_points_run_id_sequence_idx on public.run_points(run_id, sequence);

alter table public.user_profiles enable row level security;
alter table public.runs enable row level security;
alter table public.run_points enable row level security;

create policy "anon can select user_profiles for mvp test"
on public.user_profiles
for select
to anon
using (true);

create policy "anon can insert user_profiles for mvp test"
on public.user_profiles
for insert
to anon
with check (true);

create policy "anon can select runs for mvp test"
on public.runs
for select
to anon
using (true);

create policy "anon can insert runs for mvp test"
on public.runs
for insert
to anon
with check (true);

create policy "anon can select run_points for mvp test"
on public.run_points
for select
to anon
using (true);

create policy "anon can insert run_points for mvp test"
on public.run_points
for insert
to anon
with check (true);
