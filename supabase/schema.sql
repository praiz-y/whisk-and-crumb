-- supabase/schema.sql
-- Enables gen_random_uuid(); safe to run even if already enabled.
create extension if not exists pgcrypto;

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price integer not null check (price > 0),
  category_id uuid not null references categories(id) on delete restrict,
  image_url text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table gallery_images enable row level security;

-- Single-row table: application code always queries/updates id = 1.
create table business_settings (
  id integer primary key default 1,
  whatsapp_number text not null,
  phone text,
  email text,
  address text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  x_url text,
  -- Owner-uploaded satellite screenshot of the area around the shop.
  -- Null until she uploads one via the admin Settings page (Plan 2).
  map_image_url text,
  constraint business_settings_single_row check (id = 1)
);

alter table business_settings enable row level security;

-- Atomic drag-and-drop reorder: rewrites sort_order for every id in the
-- dropped order in a single statement, so a crash mid-write can't leave a
-- partial order the way the old client-side per-row loop could.
create or replace function reorder_categories(ids uuid[])
returns void
language sql
as $$
  update categories
  set sort_order = t.ord - 1
  from unnest(ids) with ordinality as t(id, ord)
  where categories.id = t.id;
$$;

create or replace function reorder_gallery_images(ids uuid[])
returns void
language sql
as $$
  update gallery_images
  set sort_order = t.ord - 1
  from unnest(ids) with ordinality as t(id, ord)
  where gallery_images.id = t.id;
$$;

grant execute on function reorder_categories(uuid[]) to service_role;
grant execute on function reorder_gallery_images(uuid[]) to service_role;

-- Single-row table: application code always queries/updates id = 1.
-- Stored in the DB (not an env var) so the admin can change their own
-- password from Settings without needing a Vercel redeploy.
create table admin_credentials (
  id integer primary key default 1,
  password_hash text not null,
  constraint admin_credentials_single_row check (id = 1)
);

-- App code only ever touches this table via the service-role key, which
-- bypasses RLS regardless. Enabling it with no policies means an anon/
-- authenticated key (should one ever leak) gets zero access by default.
alter table admin_credentials enable row level security;
