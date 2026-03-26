-- ============================================================
-- Migration: Band Applications
-- Run this in the Supabase SQL Editor for magnaarts.org
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

-- Handy index for the board dashboard review queue
create index if not exists band_applications_status_idx
  on public.band_applications (status, submitted_at desc);


-- ── 2. ROW-LEVEL SECURITY ────────────────────────────────────

alter table public.band_applications enable row level security;

-- Public (anon key) can INSERT only — no reads, no updates
create policy "Anyone can submit a band application"
  on public.band_applications
  for insert
  to anon
  with check (true);

-- Authenticated board members can read all applications
create policy "Board can read applications"
  on public.band_applications
  for select
  to authenticated
  using (true);

-- Authenticated board members can update status / reviewer notes
create policy "Board can update application status"
  on public.band_applications
  for update
  to authenticated
  using (true)
  with check (true);


-- ── 3. STORAGE BUCKETS ───────────────────────────────────────
-- Run these in the Supabase dashboard → Storage → New bucket,
-- OR execute via the REST API / Supabase CLI.
-- The SQL below uses the storage schema if available.

-- Bucket: band-promos (promotional photos)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'band-promos',
  'band-promos',
  true,            -- public read (images shown on event pages)
  10485760,        -- 10 MB
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do nothing;

-- Bucket: band-tech-riders (PDF tech riders — not public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'band-tech-riders',
  'band-tech-riders',
  false,           -- private — board only
  5242880,         -- 5 MB
  array['application/pdf']
)
on conflict (id) do nothing;


-- ── 4. STORAGE POLICIES ─────────────────────────────────────

-- Anyone (anon) can upload to band-promos
create policy "Anon can upload promo photos"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'band-promos');

-- Anyone (anon) can upload tech riders
create policy "Anon can upload tech riders"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'band-tech-riders');

-- Public read for promo photos (so they can be embedded in pages)
create policy "Public can read promo photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'band-promos');

-- Authenticated board can read tech riders
create policy "Board can read tech riders"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'band-tech-riders');
