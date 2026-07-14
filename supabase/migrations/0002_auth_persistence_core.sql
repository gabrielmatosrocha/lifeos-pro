alter table public.profiles
add column if not exists avatar_url text,
add column if not exists preferences jsonb not null default '{
  "theme": "dark",
  "coachEnabled": true,
  "spiritualContentEnabled": true,
  "notificationFrequency": "normal",
  "primaryFocus": "equilibrio"
}'::jsonb;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do update
  set email = excluded.email,
      updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.dreams (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  why text not null default '',
  deadline text not null default '',
  life_area text not null default 'Propósito',
  priority text not null default 'media',
  progress numeric not null default 0,
  status text not null default 'active',
  next_action text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  frequency text not null default 'daily',
  checklist jsonb not null default '[]'::jsonb,
  streak int not null default 0,
  best_streak int not null default 0,
  weight numeric not null default 1,
  priority text not null default 'media',
  status text not null default 'active',
  dream_id text,
  memory_signal text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.goals
  add column if not exists description text not null default '',
  add column if not exists deadline text not null default '',
  add column if not exists priority text not null default 'media';

create table if not exists public.habit_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  date date not null default current_date,
  status text not null,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.workouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  date text not null,
  muscle_groups jsonb not null default '[]'::jsonb,
  exercises jsonb not null default '[]'::jsonb,
  duration_minutes int not null default 0,
  volume numeric not null default 0,
  status text not null default 'planned',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.activity_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  date text not null,
  distance_km numeric not null default 0,
  duration_minutes int not null default 0,
  pace text not null default '',
  status text not null default 'planned',
  notes text,
  route_preview text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.activity_sessions
  add column if not exists route_points jsonb not null default '[]'::jsonb,
  add column if not exists started_at text,
  add column if not exists ended_at text,
  add column if not exists average_speed_kmh numeric not null default 0,
  add column if not exists calories numeric not null default 0;

create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period text not null,
  title text not null,
  summary text not null,
  wins jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  next_step text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.memories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  origin text not null,
  confidence text not null default 'media',
  updated_label text not null default 'Hoje',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.dreams enable row level security;
alter table public.habits enable row level security;
alter table public.habit_events enable row level security;
alter table public.workouts enable row level security;
alter table public.activity_sessions enable row level security;
alter table public.reviews enable row level security;
alter table public.memories enable row level security;

create policy "dreams_all_own" on public.dreams for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits_all_own" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habit_events_all_own" on public.habit_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workouts_all_own" on public.workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "activity_sessions_all_own" on public.activity_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews_all_own" on public.reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "memories_all_own" on public.memories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists dreams_user_status_idx on public.dreams(user_id, status);
create index if not exists habits_user_status_idx on public.habits(user_id, status);
create index if not exists habit_events_user_date_idx on public.habit_events(user_id, date desc);
create index if not exists workouts_user_date_idx on public.workouts(user_id, date desc);
create index if not exists activity_sessions_user_date_idx on public.activity_sessions(user_id, date desc);

insert into storage.buckets (id, name, public)
values ('lifeos-photos', 'lifeos-photos', false)
on conflict (id) do nothing;
