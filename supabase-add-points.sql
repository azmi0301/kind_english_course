-- =====================================================
-- MIGRATION: Tambah kolom `points` ke tabel questions
-- Jalankan di: Supabase Dashboard ? SQL Editor
-- =====================================================

alter table questions
  add column if not exists points integer not null default 1;
