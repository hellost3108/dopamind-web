-- DOPAMIND — Database Phase 1: Product Catalog
--
-- Scope: catalog structure only (products, variants, categories, media,
-- moods, skin needs, and their many-to-many mappings) plus RLS for public
-- read access. No auth, cart, order, review, or CMS tables.
--
-- Additive and idempotent: safe to re-run. No destructive statements.
-- Seeds ONLY verified reference data (categories, moods, skin needs) — NO
-- products. src/lib/products.ts is explicitly placeholder/sample data and is
-- intentionally not migrated here.
--
-- gen_random_uuid() is built into PostgreSQL core since v13 (Supabase runs
-- PG15+), so no pgcrypto/uuid-ossp extension is required.

-- ============================================================================
-- 1. TABLES
-- ============================================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_vi text not null,
  short_description_vi text,
  description_vi text,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'archived')),
  featured boolean not null default false,
  is_new boolean not null default false,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text unique,
  name_vi text not null,
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock', 'out_of_stock', 'preorder')),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_vi text not null,
  short_name_vi text,
  description_vi text,
  image_path text,
  sort_order integer not null default 0,
  active boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_categories (
  product_id uuid not null references public.products (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (product_id, category_id)
);

create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_vi text,
  media_type text not null default 'product'
    check (media_type in ('product', 'hero', 'lifestyle', 'detail', 'texture')),
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table if not exists public.moods (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label_vi text not null,
  label_en text not null,
  color_token text not null,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists public.product_moods (
  product_id uuid not null references public.products (id) on delete cascade,
  mood_id uuid not null references public.moods (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (product_id, mood_id)
);

create table if not exists public.skin_needs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label_vi text not null,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists public.product_skin_needs (
  product_id uuid not null references public.products (id) on delete cascade,
  skin_need_id uuid not null references public.skin_needs (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (product_id, skin_need_id)
);

-- ============================================================================
-- 2. updated_at TRIGGER (one reusable function, attached where the column exists)
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.products;
create trigger set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.product_variants;
create trigger set_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.categories;
create trigger set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

-- ============================================================================
-- 3. INDEXES
-- (slug/sku columns already carry a UNIQUE constraint, which Postgres backs
-- with its own btree index — no separate index added for those.)
-- ============================================================================

create index if not exists idx_products_status on public.products (status);
create index if not exists idx_products_featured on public.products (featured);
create index if not exists idx_products_is_new on public.products (is_new);

create index if not exists idx_product_variants_product_id on public.product_variants (product_id);

create index if not exists idx_categories_active on public.categories (active);
create index if not exists idx_categories_sort_order on public.categories (sort_order);

create index if not exists idx_product_categories_product_id on public.product_categories (product_id);
create index if not exists idx_product_categories_category_id on public.product_categories (category_id);

create index if not exists idx_product_media_product_id on public.product_media (product_id);
create index if not exists idx_product_media_sort_order on public.product_media (sort_order);

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- Public (anon + authenticated) may SELECT active/published catalog data
-- only. No public write policy exists on any table — admin writes are a
-- later phase.
-- ============================================================================

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.categories enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_media enable row level security;
alter table public.moods enable row level security;
alter table public.product_moods enable row level security;
alter table public.skin_needs enable row level security;
alter table public.product_skin_needs enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (status = 'active');

drop policy if exists "Public can read active variants of active products" on public.product_variants;
create policy "Public can read active variants of active products"
on public.product_variants
for select
to anon, authenticated
using (
  active = true
  and exists (
    select 1 from public.products p
    where p.id = product_variants.product_id
      and p.status = 'active'
  )
);

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read category mappings for active products and categories" on public.product_categories;
create policy "Public can read category mappings for active products and categories"
on public.product_categories
for select
to anon, authenticated
using (
  exists (select 1 from public.products p where p.id = product_categories.product_id and p.status = 'active')
  and exists (select 1 from public.categories c where c.id = product_categories.category_id and c.active = true)
);

drop policy if exists "Public can read media for active products" on public.product_media;
create policy "Public can read media for active products"
on public.product_media
for select
to anon, authenticated
using (
  exists (select 1 from public.products p where p.id = product_media.product_id and p.status = 'active')
);

drop policy if exists "Public can read active moods" on public.moods;
create policy "Public can read active moods"
on public.moods
for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read mood mappings for active products" on public.product_moods;
create policy "Public can read mood mappings for active products"
on public.product_moods
for select
to anon, authenticated
using (
  exists (select 1 from public.products p where p.id = product_moods.product_id and p.status = 'active')
  and exists (select 1 from public.moods m where m.id = product_moods.mood_id and m.active = true)
);

drop policy if exists "Public can read active skin needs" on public.skin_needs;
create policy "Public can read active skin needs"
on public.skin_needs
for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read skin need mappings for active products" on public.product_skin_needs;
create policy "Public can read skin need mappings for active products"
on public.product_skin_needs
for select
to anon, authenticated
using (
  exists (select 1 from public.products p where p.id = product_skin_needs.product_id and p.status = 'active')
  and exists (select 1 from public.skin_needs s where s.id = product_skin_needs.skin_need_id and s.active = true)
);

-- ============================================================================
-- 5. SEED — reference data only. Zero products, zero variants, zero media.
-- ============================================================================

insert into public.categories (slug, name_vi, short_name_vi, sort_order, active)
values
  ('mts-dual-layer-mask', 'MTS Dual Layer Mask', 'MTS Dual Layer', 1, true),
  ('mat-na-phoi-dua', 'Mặt nạ phôi dừa', null, 2, true),
  ('mat-na-thach', 'Mặt nạ thạch', null, 3, true),
  ('bo-cap-am-hydra-matrix', 'Bộ cấp ẩm Hydra Matrix', 'Bộ cấp ẩm', 4, true),
  ('mat-na-giam-mun-phuc-hoi', 'Mặt nạ giảm mụn phục hồi', 'Giảm mụn phục hồi', 5, true),
  ('mat-na-dat-set', 'Mặt nạ đất sét', null, 6, true)
on conflict (slug) do nothing;

insert into public.moods (slug, label_vi, label_en, color_token, sort_order, active)
values
  ('binh-tam', 'Bình Tâm', 'CALM', 'mint', 1, true),
  ('tai-tao', 'Tái Tạo', 'RESET', 'lavender', 2, true),
  ('rang-ro', 'Rạng Rỡ', 'GLOW', 'butter', 3, true),
  ('yeu-thuong', 'Yêu Thương', 'LOVE', 'peach', 4, true)
on conflict (slug) do nothing;

insert into public.skin_needs (slug, label_vi, sort_order, active)
values
  ('cap-am', 'Cấp ẩm', 1, true),
  ('lam-diu', 'Làm dịu', 2, true),
  ('lam-sang', 'Làm sáng', 3, true),
  ('hang-rao-bao-ve-da', 'Hỗ trợ hàng rào bảo vệ da', 4, true)
on conflict (slug) do nothing;
