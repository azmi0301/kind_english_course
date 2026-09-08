-- =====================================================
-- KIND ENGLISH COURSE — Safe Schema (bisa dijalankan ulang)
-- Jalankan di: Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. TABEL (semua pakai IF NOT EXISTS, aman dijalankan ulang)
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  email       text unique,
  role        text not null default 'student' check (role in ('student', 'admin')),
  avatar_url  text,
  join_date   date default current_date,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists exam_packages (
  id          text primary key,
  title       text not null,
  description text,
  type        text not null check (type in ('ITP', 'Diagnostic', 'Practice')),
  duration    integer not null default 115,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

create table if not exists questions (
  id          text primary key,
  package_id  text references exam_packages(id) on delete cascade,
  section     text not null check (section in ('listening', 'structure', 'reading')),
  number      integer not null,
  text        text not null,
  options     jsonb not null,
  answer      text not null,
  audio_url   text,
  passage     text,
  created_at  timestamptz default now()
);

create table if not exists exam_sessions (
  id                text primary key default gen_random_uuid()::text,
  title             text not null,
  package_id        text references exam_packages(id),
  start_date        date not null,
  end_date          date not null,
  status            text default 'upcoming' check (status in ('upcoming', 'active', 'completed')),
  participant_count integer default 0,
  created_by        uuid references profiles(id),
  created_at        timestamptz default now()
);

create table if not exists exam_results (
  id                  text primary key default gen_random_uuid()::text,
  user_id             uuid references profiles(id) on delete cascade,
  session_id          text references exam_sessions(id),
  package_id          text references exam_packages(id),
  exam_title          text not null,
  exam_type           text not null check (exam_type in ('ITP', 'Diagnostic', 'Practice')),
  answers             jsonb,
  listening_raw       integer default 0,
  listening_total     integer default 0,
  listening_scaled    integer default 0,
  structure_raw       integer default 0,
  structure_total     integer default 0,
  structure_scaled    integer default 0,
  reading_raw         integer default 0,
  reading_total       integer default 0,
  reading_scaled      integer default 0,
  total_score         integer default 0,
  level               text,
  duration_minutes    integer,
  certificate_ready   boolean default false,
  started_at          timestamptz,
  submitted_at        timestamptz default now(),
  created_at          timestamptz default now()
);

-- 2. TRIGGER
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 3. ROW LEVEL SECURITY
alter table profiles       enable row level security;
alter table exam_results   enable row level security;
alter table exam_sessions  enable row level security;
alter table exam_packages  enable row level security;
alter table questions      enable row level security;

-- Drop policy lama dulu (aman)
drop policy if exists "Users can view own profile"      on profiles;
drop policy if exists "Users can update own profile"    on profiles;
drop policy if exists "Admins can view all profiles"    on profiles;
drop policy if exists "Users can view own results"      on exam_results;
drop policy if exists "Users can insert own results"    on exam_results;
drop policy if exists "Admins can view all results"     on exam_results;
drop policy if exists "Anyone can read packages"        on exam_packages;
drop policy if exists "Anyone can read questions"       on questions;
drop policy if exists "Anyone can read sessions"        on exam_sessions;
drop policy if exists "Admins can manage sessions"      on exam_sessions;
drop policy if exists "Admins can manage packages"      on exam_packages;
drop policy if exists "Admins can manage questions"     on questions;

-- Buat policy baru
create policy "Users can view own profile"   on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Users can view own results"   on exam_results for select using (auth.uid() = user_id);
create policy "Users can insert own results" on exam_results for insert with check (auth.uid() = user_id);
create policy "Admins can view all results"  on exam_results for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Anyone can read packages"  on exam_packages for select using (true);
create policy "Anyone can read questions" on questions     for select using (true);
create policy "Anyone can read sessions"  on exam_sessions for select using (true);

create policy "Admins can manage sessions"  on exam_sessions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage packages"  on exam_packages for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage questions" on questions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 4. SEED data
insert into exam_packages (id, title, description, type, duration) values
  ('itp-full-sim-01', 'TOEFL ITP Full Simulation', 'Simulasi lengkap TOEFL ITP 130 soal', 'ITP', 115),
  ('diagnostic-01',   'TOEFL Diagnostic Test', 'Tes diagnostik kemampuan awal', 'Diagnostic', 60)
on conflict (id) do nothing;
