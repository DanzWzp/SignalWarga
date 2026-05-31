-- =============================================================
-- user_locations
-- Lokasi terakhir (latest known) tiap warga, ditangkap saat login.
-- Satu baris per user (upsert berdasarkan user_id).
-- Jalankan di Supabase SQL Editor atau via `supabase db push`.
-- =============================================================

create table if not exists public.user_locations (
  user_id     uuid primary key references public.profiles (id) on delete cascade,
  latitude    double precision not null,
  longitude   double precision not null,
  accuracy    double precision,
  address     text,
  kelurahan   text,
  kecamatan   text,
  city        text,
  province    text,
  source      text not null default 'login',
  recorded_at timestamptz not null default now()
);

create index if not exists user_locations_recorded_at_idx
  on public.user_locations (recorded_at desc);

alter table public.user_locations enable row level security;

-- Warga hanya boleh menulis / membaca lokasinya sendiri.
drop policy if exists "Users can insert own location" on public.user_locations;
create policy "Users can insert own location"
  on public.user_locations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own location" on public.user_locations;
create policy "Users can update own location"
  on public.user_locations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own location" on public.user_locations;
create policy "Users can read own location"
  on public.user_locations
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Admin boleh membaca semua lokasi warga (dashboard + realtime).
drop policy if exists "Admins can read all locations" on public.user_locations;
create policy "Admins can read all locations"
  on public.user_locations
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- Aktifkan realtime untuk tabel ini (abaikan jika sudah aktif).
do $$
begin
  alter publication supabase_realtime add table public.user_locations;
exception
  when duplicate_object then null;
  when undefined_object then null;
end
$$;
