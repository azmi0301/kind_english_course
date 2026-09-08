-- =====================================================
-- FIX: Perbaiki trigger handle_new_user
-- Jalankan di: Supabase Dashboard → SQL Editor
-- =====================================================

-- Drop trigger & function lama dulu
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- Buat ulang function dengan error handling yang lebih robust
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'student'
  )
  on conflict (id) do nothing;
  return new;
exception
  when others then
    -- Jangan gagalkan signup meski insert profile error
    raise warning 'handle_new_user error: %', sqlerrm;
    return new;
end;
$$ language plpgsql security definer;

-- Pasang trigger baru
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Pastikan RLS profiles mengizinkan insert dari trigger (service role)
alter table public.profiles enable row level security;

-- Izinkan service role bypass RLS untuk insert profiles
create policy "Service role can insert profiles" on public.profiles
  for insert with check (true);
