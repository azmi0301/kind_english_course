-- =====================================================
-- KIND ENGLISH COURSE — Supabase Database Schema
-- Jalankan file ini di: Supabase Dashboard → SQL Editor
-- =====================================================

-- ─── 1. PROFILES (data user/siswa) ───────────────────────────────────────────
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

-- Auto-create profile saat user baru register
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── 2. EXAM PACKAGES ─────────────────────────────────────────────────────────
create table if not exists exam_packages (
  id          text primary key,
  title       text not null,
  description text,
  type        text not null check (type in ('ITP', 'Diagnostic', 'Practice')),
  duration    integer not null default 115, -- menit
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ─── 3. QUESTIONS (soal ujian) ────────────────────────────────────────────────
create table if not exists questions (
  id          text primary key,
  package_id  text references exam_packages(id) on delete cascade,
  section     text not null check (section in ('listening', 'structure', 'reading')),
  number      integer not null,
  text        text not null,
  options     jsonb not null,  -- { A: "...", B: "...", C: "...", D: "..." }
  answer      text not null,   -- "A" | "B" | "C" | "D"
  audio_url   text,            -- untuk listening section
  passage     text,            -- untuk reading section
  created_at  timestamptz default now()
);

-- ─── 4. EXAM SESSIONS ─────────────────────────────────────────────────────────
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

-- ─── 5. EXAM RESULTS (hasil ujian siswa) ──────────────────────────────────────
create table if not exists exam_results (
  id                  text primary key default gen_random_uuid()::text,
  user_id             uuid references profiles(id) on delete cascade,
  session_id          text references exam_sessions(id),
  package_id          text references exam_packages(id),
  exam_title          text not null,
  exam_type           text not null check (exam_type in ('ITP', 'Diagnostic', 'Practice')),
  answers             jsonb,   -- { questionId: "A" }
  -- Section scores
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

-- ─── 6. ROW LEVEL SECURITY (RLS) ─────────────────────────────────────────────
alter table profiles enable row level security;
alter table exam_results enable row level security;
alter table exam_sessions enable row level security;
alter table exam_packages enable row level security;
alter table questions enable row level security;

-- Profiles: user hanya bisa lihat/edit profile sendiri
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Admin bisa lihat semua profiles
create policy "Admins can view all profiles" on profiles
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Exam results: user hanya lihat hasil sendiri
create policy "Users can view own results" on exam_results
  for select using (auth.uid() = user_id);
create policy "Users can insert own results" on exam_results
  for insert with check (auth.uid() = user_id);

-- Admin bisa lihat semua results
create policy "Admins can view all results" on exam_results
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Packages & Questions: semua user bisa baca
create policy "Anyone can read packages" on exam_packages
  for select using (true);
create policy "Anyone can read questions" on questions
  for select using (true);

-- Sessions: semua user bisa baca
create policy "Anyone can read sessions" on exam_sessions
  for select using (true);
create policy "Admins can manage sessions" on exam_sessions
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ─── 7. SEED: Insert exam packages ───────────────────────────────────────────
insert into exam_packages (id, title, description, type, duration) values
  ('itp-full-sim-01', 'TOEFL ITP Full Simulation', 'Simulasi lengkap TOEFL ITP dengan 130 soal', 'ITP', 115),
  ('diagnostic-01', 'TOEFL Diagnostic Test', 'Tes diagnostik untuk mengukur kemampuan awal', 'Diagnostic', 60)
on conflict (id) do nothing;
