-- =====================================================
-- Izinkan admin CRUD soal di tabel questions
-- Jalankan di: Supabase Dashboard → SQL Editor
-- =====================================================

-- Admin bisa tambah, edit, hapus soal
create policy "Admins can manage questions" on questions
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Admin bisa manage exam packages
create policy "Admins can manage packages" on exam_packages
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
