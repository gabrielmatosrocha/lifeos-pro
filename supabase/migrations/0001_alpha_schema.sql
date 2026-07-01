create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id);

create table if not exists public.actions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  pillar text not null,
  title text not null,
  value numeric,
  unit text,
  occurred_at timestamptz not null default now(),
  source text not null default 'manual',
  notes text,
  created_at timestamptz default now()
);

alter table public.actions enable row level security;

create policy "actions_all_own"
on public.actions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.daily_summaries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  summary_date date not null default current_date,
  rhythm_index int default 0,
  life_score int default 0,
  classification text,
  reflection text,
  created_at timestamptz default now(),
  unique(user_id, summary_date)
);

alter table public.daily_summaries enable row level security;

create policy "daily_summaries_all_own"
on public.daily_summaries for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  pillar text not null default 'Propósito',
  horizon text not null default 'month',
  target_value numeric not null default 1,
  current_value numeric not null default 0,
  unit text not null default 'ações',
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.goals enable row level security;

create policy "goals_all_own"
on public.goals for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  title text not null,
  mood text not null default 'neutral',
  reflection text not null,
  learning text,
  gratitude text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.journal_entries enable row level security;

create policy "journal_entries_all_own"
on public.journal_entries for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists actions_user_occurred_at_idx
on public.actions(user_id, occurred_at desc);

create index if not exists daily_summaries_user_date_idx
on public.daily_summaries(user_id, summary_date desc);
