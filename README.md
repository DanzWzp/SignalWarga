# SignalWarga

SignalWarga adalah aplikasi civic-tech untuk laporan masalah lingkungan berbasis lokasi: warga membuat laporan dengan titik peta dan foto, admin mengelola status, petugas memperbarui progres, dan marker peta diperbarui realtime.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Supabase Auth, PostgreSQL, Storage, Realtime
- Leaflet.js untuk map picker dan map laporan
- Vercel-ready deployment

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Salin `.env.example` menjadi `.env.local`, lalu isi:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Buka Supabase SQL Editor dan jalankan `supabase/schema.sql`.

4. Jalankan aplikasi:

```bash
npm run dev
```

5. Buka `http://localhost:3000`.

## Role

- `citizen`: membuat laporan, melihat laporan, memantau status.
- `admin`: melihat semua laporan, update status, assign officer.
- `officer`: melihat laporan yang ditugaskan dan update progres.

Setelah user daftar, role default adalah `citizen`. Untuk admin/officer, jalankan SQL manual:

```sql
update public.profiles set role = 'admin' where id = '<USER_UUID>';
update public.profiles set role = 'officer' where id = '<USER_UUID>';
```

## Supabase

Schema dan policy ada di `supabase/schema.sql`, termasuk:

- `profiles`, `reports`, `report_updates`
- Trigger profile saat user mendaftar
- Row Level Security
- Storage bucket `report-photos`
- Realtime untuk tabel `reports`

Pastikan Authentication email/password aktif di Supabase. Jika email confirmation aktif, user perlu konfirmasi email sebelum masuk.

## Deployment Vercel

1. Push project ke GitHub/GitLab.
2. Import repo di Vercel.
3. Tambahkan environment variables yang sama seperti `.env.local`.
4. Set `NEXT_PUBLIC_SITE_URL` ke domain Vercel, misalnya `https://signalwarga.vercel.app`.
5. Deploy.

## Script

```bash
npm run dev
npm run lint
npm run build
```
