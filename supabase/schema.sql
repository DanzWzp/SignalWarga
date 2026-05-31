create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text check (role in ('citizen', 'admin', 'officer')) default 'citizen',
  phone text,
  created_at timestamp with time zone default now()
);

create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null check (
    category in (
      'jalan_rusak',
      'banjir',
      'sampah',
      'lampu_mati',
      'pohon_tumbang',
      'fasilitas_rusak',
      'lainnya'
    )
  ),
  status text not null check (
    status in (
      'pending',
      'verified',
      'in_progress',
      'resolved',
      'rejected'
    )
  ) default 'pending',
  priority text check (
    priority in (
      'low',
      'medium',
      'high',
      'urgent'
    )
  ) default 'medium',
  latitude double precision not null,
  longitude double precision not null,
  address text,
  photo_url text,
  created_by uuid references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.report_updates (
  id uuid default gen_random_uuid() primary key,
  report_id uuid references public.reports(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  status text check (
    status in (
      'pending',
      'verified',
      'in_progress',
      'resolved',
      'rejected'
    )
  ),
  note text,
  created_at timestamp with time zone default now()
);

create index if not exists reports_created_by_idx on public.reports(created_by);
create index if not exists reports_assigned_to_idx on public.reports(assigned_to);
create index if not exists reports_status_idx on public.reports(status);
create index if not exists reports_category_idx on public.reports(category);
create index if not exists report_updates_report_id_idx on public.report_updates(report_id);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reports_handle_updated_at on public.reports;
create trigger reports_handle_updated_at
before update on public.reports
for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'citizen'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id
     and coalesce(public.current_user_role(), 'citizen') <> 'admin'
     and new.role is distinct from old.role then
    raise exception 'User cannot change their own role';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.report_updates enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles_admin_update_all" on public.profiles;
create policy "profiles_admin_update_all"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "reports_select_authenticated" on public.reports;
create policy "reports_select_authenticated"
on public.reports for select
to authenticated
using (
  true
  or created_by = auth.uid()
  or assigned_to = auth.uid()
  or public.is_admin()
);

drop policy if exists "reports_insert_authenticated_owner" on public.reports;
create policy "reports_insert_authenticated_owner"
on public.reports for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "reports_update_owner_pending" on public.reports;
create policy "reports_update_owner_pending"
on public.reports for update
to authenticated
using (created_by = auth.uid() and status = 'pending')
with check (created_by = auth.uid() and status = 'pending');

drop policy if exists "reports_update_admin_all" on public.reports;
create policy "reports_update_admin_all"
on public.reports for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "reports_update_officer_assigned" on public.reports;
create policy "reports_update_officer_assigned"
on public.reports for update
to authenticated
using (public.current_user_role() = 'officer' and assigned_to = auth.uid())
with check (public.current_user_role() = 'officer' and assigned_to = auth.uid());

drop policy if exists "report_updates_select_accessible" on public.report_updates;
create policy "report_updates_select_accessible"
on public.report_updates for select
to authenticated
using (
  exists (
    select 1
    from public.reports r
    where r.id = report_updates.report_id
  )
);

drop policy if exists "report_updates_insert_admin_officer" on public.report_updates;
create policy "report_updates_insert_admin_officer"
on public.report_updates for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    public.is_admin()
    or (
      public.current_user_role() = 'officer'
      and exists (
        select 1
        from public.reports r
        where r.id = report_updates.report_id
          and r.assigned_to = auth.uid()
      )
    )
  )
);

drop policy if exists "report_updates_insert_owner_initial" on public.report_updates;
create policy "report_updates_insert_owner_initial"
on public.report_updates for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
  and exists (
    select 1
    from public.reports r
    where r.id = report_updates.report_id
      and r.created_by = auth.uid()
  )
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'report-photos',
  'report-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "report_photos_select_authenticated" on storage.objects;
create policy "report_photos_select_authenticated"
on storage.objects for select
to authenticated
using (bucket_id = 'report-photos');

drop policy if exists "report_photos_insert_own_folder" on storage.objects;
create policy "report_photos_insert_own_folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'report-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
);

drop policy if exists "report_photos_update_own_folder" on storage.objects;
create policy "report_photos_update_own_folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'report-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'report-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

do $$
begin
  alter publication supabase_realtime add table public.reports;
exception
  when duplicate_object then null;
end $$;

-- Promote a user manually after registration:
-- update public.profiles set role = 'admin' where id = '<USER_UUID>';
-- update public.profiles set role = 'officer' where id = '<USER_UUID>';
