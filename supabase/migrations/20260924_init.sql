-- Slovlog Database Schema Migration
-- Migration: 20260924_init.sql

-- 1. Create Admin Users Table
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null check (role in ('owner', 'admin')) default 'admin',
  created_at timestamptz not null default now()
);

-- Seed Owner (Shawn Shiobara)
insert into public.admin_users (email, role)
values ('shawn.shiobara@gmail.com', 'owner')
on conflict (email) do update set role = 'owner';

-- 2. Create Posts Table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_image text,
  location text default 'Slovenia',
  trip_date date not null default current_date,
  published boolean not null default false,
  featured boolean not null default false,
  gallery_images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_published_trip_date_idx on public.posts (published, trip_date desc);
create index if not exists posts_location_idx on public.posts (location);

-- 3. Create Media Metadata Table
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text not null,
  public_url text not null,
  mime_type text,
  size_bytes bigint,
  caption text,
  location text,
  created_at timestamptz not null default now()
);

create index if not exists media_created_at_idx on public.media (created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.admin_users enable row level security;
alter table public.posts enable row level security;
alter table public.media enable row level security;

-- Helper Function to check if the current user is an admin
create or replace function public.is_admin()
returns boolean security definer as $$
begin
  return exists (
    select 1 from public.admin_users
    where lower(email) = lower(auth.jwt()->>'email')
  );
end;
$$ language plpgsql;

-- 5. Policies for admin_users
drop policy if exists "Admins can view admin list" on public.admin_users;
create policy "Admins can view admin list" on public.admin_users
  for select using (public.is_admin());

drop policy if exists "Admins can insert new admins" on public.admin_users;
create policy "Admins can insert new admins" on public.admin_users
  for insert with check (public.is_admin());

drop policy if exists "Admins can delete non-owner admins" on public.admin_users;
create policy "Admins can delete non-owner admins" on public.admin_users
  for delete using (public.is_admin() and role <> 'owner');

-- 6. Policies for posts
drop policy if exists "Public can view published posts" on public.posts;
create policy "Public can view published posts" on public.posts
  for select using (published = true);

drop policy if exists "Admins have full access to posts" on public.posts;
create policy "Admins have full access to posts" on public.posts
  for all using (public.is_admin());

-- 7. Policies for media
drop policy if exists "Public can view media" on public.media;
create policy "Public can view media" on public.media
  for select using (true);

drop policy if exists "Admins have full access to media" on public.media;
create policy "Admins have full access to media" on public.media
  for all using (public.is_admin());

-- 8. Storage bucket setup
insert into storage.buckets (id, name, public)
values ('slovlog-media', 'slovlog-media', true)
on conflict (id) do nothing;

-- Storage policies for slovlog-media
drop policy if exists "Public Access for slovlog-media" on storage.objects;
create policy "Public Access for slovlog-media" on storage.objects
  for select using (bucket_id = 'slovlog-media');

drop policy if exists "Admin Insert for slovlog-media" on storage.objects;
create policy "Admin Insert for slovlog-media" on storage.objects
  for insert with check (bucket_id = 'slovlog-media' and public.is_admin());

drop policy if exists "Admin Delete for slovlog-media" on storage.objects;
create policy "Admin Delete for slovlog-media" on storage.objects
  for delete using (bucket_id = 'slovlog-media' and public.is_admin());

-- 9. Sample Initial Posts (Draft & Published)
insert into public.posts (slug, title, excerpt, content, cover_image, location, trip_date, published, featured, gallery_images)
values 
(
  'arriving-in-ljubljana-dragons-bridges-and-castle-views',
  'Arriving in Ljubljana: Dragons, Bridges & Castle Views',
  'The emerald waters of the Ljubljanica river, the fierce guardian dragons of Zmajski Most, and a sunset walk up to Ljubljana Castle.',
  '## Welcome to the Dragon City

Crossing the famous **Dragon Bridge** (*Zmajski most*) in the late afternoon sun was our official introduction to Slovenia. The four winged dragons guarding the bridge feel alive against the backdrop of pastel baroque facades and willows trailing into the Ljubljanica river.

### Wandering the Old Town
Ljubljana is remarkably peaceful. The historic center is closed to motorized traffic, filled with lively outdoor cafes, street musicians near Prešeren Square, and the unique architecture of **Jože Plečnik**, who gave this city its distinct columned bridges and riverside promenades.

```
Key Highlights:
- Triple Bridge (Tromostovje)
- Ljubljana Castle Funicular & Panoramic Tower
- Central Market riverside arcades
```

As dusk settled, we rode the funicular up to **Ljubljana Castle**. Looking out over the red rooftops toward the snow-dusted Kamnik–Savinja Alps in the distance, Slovenia felt like stepping directly into an alpine storybook.',
  'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1600&q=80',
  'Ljubljana',
  '2026-09-18',
  true,
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80'
  ]
),
(
  'lake-bled-and-the-emerald-socha-valley',
  'Lake Bled & the Emerald Soča River',
  'Rowing traditional pletna boats across mirror-still alpine waters, tasting Bled cream cake, and crossing Vršič Pass into the turquoise Soča valley.',
  '## Mirror Waters of Lake Bled

Nothing prepares you for the tranquility of **Lake Bled** at sunrise. With mist rising off the glassy water and the church tower rising from the tiny island, the scene is almost surreal.

We chartered a traditional wooden *pletna* boat rowed by a local oarsman to reach the island church of the Assumption of Mary. After ringing the wishing bell in the church tower, we hiked up to Ojstrica for the classic panoramic viewpoint.

### Over the Vršič Pass to Soča
From the Julian Alps, we drove across the dramatic 50 hairpin turns of the **Vršič Pass**, built during World War I, descending into the breathtaking valley of the **Soča River**. The water here is an unreal shade of vibrant aquamarine and emerald—pure glacial runoff cutting through white limestone gorges.',
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80',
  'Lake Bled',
  '2026-09-20',
  true,
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80'
  ]
),
(
  'piran-and-the-slovenian-adriatic-coast',
  'Sunset in Venetian Piran on the Adriatic',
  'Cobblestone alleys, salt flats of Sečovlje, and fresh seafood by the sea in Slovenia’s historic coastal jewel.',
  '## The Venetian Charms of the Adriatic

Slovenia may only have 47 kilometers of coastline, but every meter is packed with character. **Piran** sits on a narrow peninsula jutting into the Adriatic Sea, with architecture heavily shaped by centuries under the Republic of Venice.

Tartini Square opens directly to the harbor, surrounded by Venetian Gothic palaces. We climbed the hillside to the Church of Saint George to watch fishing boats return as the sun melted into the horizon over the Gulf of Trieste.',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
  'Piran',
  '2026-09-22',
  true,
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
  ]
)
on conflict (slug) do nothing;
