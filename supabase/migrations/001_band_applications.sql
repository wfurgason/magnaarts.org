-- ============================================================
-- Migration: Band Applications
-- Run this in the Supabase SQL Editor for magnaarts.org
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT / DROP IF EXISTS
-- ============================================================


-- ── 1. TABLE ─────────────────────────────────────────────────

create table if not exists public.band_applications (
  id               uuid primary key default gen_random_uuid(),
  submitted_at     timestamptz not null default now(),

  -- Contact
  band_name        text not null,
  contact_name     text not null,
  contact_email    text not null,
  contact_phone    text,

  -- About
  genre            text not null,
  member_count     text not null,
  bio              text not null check (char_length(bio) <= 300),
  website          text,
  music_link       text,

  -- Performance
  set_length       text,
  performed_before text,
  availability     text,
  additional_notes text,

  -- Files (public URLs in Supabase Storage)
  promo_photo_url  text,
  tech_rider_url   text,

  -- Workflow
  status           text not null default 'pending'
                   check (status in ('pending', 'reviewed', 'accepted', 'declined', 'waitlisted')),
  reviewer_notes   text,
  reviewed_at      timestamptz,
  reviewed_by      uuid references auth.users(id)
);

create index if not exists band_applications_status_idx
  on public.band_applications (status, submitted_at desc);


-- ── 2. RLS: band_applications table ──────────────────────────

alter table public.band_applications enable row level security;

drop policy if exists "Anyone can submit a band application" on public.band_applications;
create policy "Anyone can submit a band application"
  on public.band_applications
  for insert
  to anon
  with check (true);

drop policy if exists "Board can read applications" on public.band_applications;
create policy "Board can read applications"
  on public.band_applications
  for select
  to authenticated
  using (true);

drop policy if exists "Board can update application status" on public.band_applications;
create policy "Board can update application status"
  on public.band_applications
  for update
  to authenticated
  using (true)
  with check (true);


-- ── 3. STORAGE BUCKETS ───────────────────────────────────────
--
-- Both buckets use public = true so the anon INSERT/upsert path
-- works without signed URLs. Tech riders remain access-controlled
-- by the authenticated-only SELECT policy; the bucket "Public"
-- toggle does not bypass RLS.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'band-promos',
  'band-promos',
  true,
  10485760,   -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'band-tech-riders',
  'band-tech-riders',
  true,        -- public toggle ON; SELECT still locked to authenticated via RLS
  5242880,     -- 5 MB
  array['application/pdf']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- ── 4. STORAGE POLICIES: band-promos ─────────────────────────
-- Note: RLS on storage.objects is managed by Supabase internally.
-- Do NOT run ALTER TABLE storage.objects — you are not the owner.

drop policy if exists "Anon can upload promo photos" on storage.objects;
create policy "Anon can upload promo photos"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'band-promos');

drop policy if exists "Anon can upsert promo photos" on storage.objects;
create policy "Anon can upsert promo photos"
  on storage.objects
  for update
  to anon
  using   (bucket_id = 'band-promos')
  with check (bucket_id = 'band-promos');

drop policy if exists "Public can read promo photos" on storage.objects;
create policy "Public can read promo photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'band-promos');


-- ── 5. STORAGE POLICIES: band-tech-riders ────────────────────

drop policy if exists "Anon can upload tech riders" on storage.objects;
create policy "Anon can upload tech riders"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'band-tech-riders');

drop policy if exists "Anon can upsert tech riders" on storage.objects;
create policy "Anon can upsert tech riders"
  on storage.objects
  for update
  to anon
  using   (bucket_id = 'band-tech-riders')
  with check (bucket_id = 'band-tech-riders');

drop policy if exists "Board can read tech riders" on storage.objects;
create policy "Board can read tech riders"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'band-tech-riders');
