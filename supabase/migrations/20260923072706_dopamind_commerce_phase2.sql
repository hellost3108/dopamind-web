-- DOPAMIND — Database Phase 2: Customer Accounts, Cart, Orders & Payments
--
-- Scope: customer-facing commerce tables — profiles, addresses, wishlist,
-- cart, orders, order items, payments. Catalog tables from Phase 1
-- (products, product_variants, categories, product_categories,
-- product_media, moods, product_moods, skin_needs, product_skin_needs) are
-- untouched: no drops, renames, or data edits, only new foreign keys
-- pointing INTO them from the new tables.
--
-- Additive: no destructive statements against Phase 1 objects. Re-runnable
-- (create/if not exists, drop-then-create for policies/triggers/functions).
-- No fake users, orders, payments, or customer data are seeded here.
--
-- IMPORTANT SECURITY NOTE ON GRANTS:
-- Supabase's default ACLs on schema `public` grant ALL privileges (select,
-- insert, update, delete, ...) to `anon` and `authenticated` automatically
-- on every newly created table and EXECUTE on every newly created function.
-- RLS alone does not change table-level GRANTs. Because this phase stores
-- real customer/PII/financial data, every table below has its default
-- grants explicitly revoked and replaced with the minimum required by the
-- RLS rules in the spec — in particular `anon` gets ZERO privileges on all
-- 8 tables, and `orders` / `order_items` / `payments` get NO client write
-- privileges at all (server/service_role only).
--
-- gen_random_uuid() is built into PostgreSQL core (Supabase runs PG15+, this
-- project is on PG17), so no pgcrypto/uuid-ossp extension is required.

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- 1.1 profiles — one-to-one with auth.users. No secrets (passwords, access
-- tokens, refresh tokens) are ever stored here; Supabase Auth owns those.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'One row per auth.users id. Never store passwords/tokens here — Supabase Auth owns those. Rows are created by the on_auth_user_created trigger, not by client inserts.';

-- 1.2 addresses
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text,
  recipient_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  ward text,
  district text,
  province text not null,
  postal_code text,
  country_code text not null default 'VN',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 1.3 wishlist_items — a single implicit wishlist per user, so no separate
-- `wishlists` table: the composite primary key already prevents duplicates.
create table if not exists public.wishlist_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- 1.4 carts — only signed-in users' carts. Guest carts live in the
-- frontend's local storage and never touch this table.
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 1.5 cart_items — intentionally has NO price column. Price is always read
-- live from product_variants at display/checkout time so a cart can never
-- go stale relative to real pricing.
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

comment on table public.cart_items is
  'No price/currency columns by design — always read current price from product_variants. Prevents a stale cart price from ever being trusted at checkout.';

-- 1.6 orders — order_number is generated server-side from a sequence (see
-- section 2) so it can never collide and is never client-supplied.
create sequence if not exists public.order_number_seq;

create or replace function public.generate_order_number()
returns text
language sql
volatile
set search_path = public, pg_temp
as $$
  select 'DOPA' || to_char(now(), 'YYYYMMDD') || lpad(nextval('public.order_number_seq')::text, 6, '0');
$$;

comment on function public.generate_order_number() is
  'Sequence-backed, collision-free order number generator (DOPA + date + zero-padded sequence). Used only as the orders.order_number column default — never called directly by client roles (see grants in section 6).';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_order_number(),
  user_id uuid references auth.users (id) on delete set null,
  customer_email text not null,
  recipient_name text not null,
  phone text not null,
  shipping_address_snapshot jsonb not null
    check (jsonb_typeof(shipping_address_snapshot) = 'object'),
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  discount_amount numeric(12, 2) not null default 0 check (discount_amount >= 0),
  shipping_fee numeric(12, 2) not null default 0 check (shipping_fee >= 0),
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  currency text not null default 'VND',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'processing', 'shipping', 'completed', 'cancelled', 'refunded')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  customer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.orders is
  'user_id uses ON DELETE SET NULL so orders survive account deletion. No INSERT/UPDATE/DELETE grant exists for anon or authenticated — totals and status are only ever written by trusted server/service_role code (checkout RPC lands in a later phase), never computed from browser-supplied amounts.';

comment on column public.orders.shipping_address_snapshot is
  'Immutable copy of the address at order time (JSON object) — orders must not change retroactively if the customer later edits or deletes an address.';

-- 1.7 order_items — snapshots product/variant name, SKU, and price at
-- purchase time; never joins live product data for historical accuracy.
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  sku_snapshot text,
  product_name_snapshot text not null,
  variant_name_snapshot text not null,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12, 2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

-- 1.8 payments — never stores card numbers, CVV, tokens/secrets, or a raw
-- provider payload; only the minimal fields needed to reconcile status.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null,
  method text,
  provider_reference text,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'VND',
  status text not null default 'pending'
    check (status in ('pending', 'authorized', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded')),
  paid_at timestamptz,
  failure_code text,
  failure_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.payments is
  'No card numbers, CVV, access/secret tokens, or raw provider payloads are stored — only enough to reconcile status. provider is intentionally generic (no VNPay/MoMo assumption). No INSERT/UPDATE grant for client roles: only service_role/webhooks write payment state.';

-- ============================================================================
-- 2. AUTO-CREATE PROFILE ON NEW auth.users ROW
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, full_name, avatar_path)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'avatar_path', new.raw_user_meta_data ->> 'avatar_url')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

comment on function public.handle_new_user() is
  'SECURITY DEFINER with a locked search_path (public, pg_temp) so it cannot be hijacked by a malicious search_path, and ON CONFLICT DO NOTHING so it never overwrites a profile that already exists. Reads full_name/avatar from auth.users metadata only if present. Fires after insert on auth.users.';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill: create a profile for every pre-existing auth.users row that
-- doesn't have one yet. Safe to re-run (only inserts missing rows).
insert into public.profiles (id, full_name, avatar_path)
select
  u.id,
  u.raw_user_meta_data ->> 'full_name',
  coalesce(u.raw_user_meta_data ->> 'avatar_path', u.raw_user_meta_data ->> 'avatar_url')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- ============================================================================
-- 3. updated_at TRIGGERS (reuses public.set_updated_at() from Phase 1 — not
-- redefined here, and the Phase 1 migration file is left untouched)
-- ============================================================================

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.addresses;
create trigger set_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.carts;
create trigger set_updated_at
before update on public.carts
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.cart_items;
create trigger set_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.orders;
create trigger set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.payments;
create trigger set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

create index if not exists idx_addresses_user_id on public.addresses (user_id);
-- At most one default address per user.
create unique index if not exists uq_addresses_one_default_per_user
  on public.addresses (user_id)
  where is_default;

-- wishlist_items: user_id is already the leading PK column; product_id gets
-- its own index for reverse lookups (e.g. "how many wishlists include X").
create index if not exists idx_wishlist_items_product_id on public.wishlist_items (product_id);

create index if not exists idx_cart_items_cart_id on public.cart_items (cart_id);
create index if not exists idx_cart_items_variant_id on public.cart_items (variant_id);

create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_payment_status on public.orders (payment_status);
create index if not exists idx_orders_created_at on public.orders (created_at);
-- order_number already carries a UNIQUE constraint (backed by its own btree index).

create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);
create index if not exists idx_order_items_variant_id on public.order_items (variant_id);

create index if not exists idx_payments_order_id on public.payments (order_id);
create index if not exists idx_payments_status on public.payments (status);
create index if not exists idx_payments_provider_reference on public.payments (provider_reference);
-- When a provider_reference is present, (provider, provider_reference) must be unique.
create unique index if not exists uq_payments_provider_reference
  on public.payments (provider, provider_reference)
  where provider_reference is not null;

-- ============================================================================
-- 5. ROW LEVEL SECURITY
-- (select auth.uid()) is wrapped as (select (select auth.uid())) in every policy below so
-- Postgres evaluates it once per query instead of once per row (Supabase
-- RLS performance best practice) — access rules are unchanged.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- 5.1 profiles — read/update own row only. No INSERT/DELETE policy: rows
-- are only ever created by the on_auth_user_created trigger (SECURITY
-- DEFINER) and deleted only via the auth.users cascade.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- 5.2 addresses — full CRUD, scoped to owner.
drop policy if exists "Users can read own addresses" on public.addresses;
create policy "Users can read own addresses"
on public.addresses for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users can insert own addresses" on public.addresses;
create policy "Users can insert own addresses"
on public.addresses for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users can update own addresses" on public.addresses;
create policy "Users can update own addresses"
on public.addresses for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Users can delete own addresses" on public.addresses;
create policy "Users can delete own addresses"
on public.addresses for delete
to authenticated
using (user_id = (select auth.uid()));

-- 5.3 wishlist_items — full CRUD, scoped to owner.
drop policy if exists "Users can read own wishlist items" on public.wishlist_items;
create policy "Users can read own wishlist items"
on public.wishlist_items for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users can insert own wishlist items" on public.wishlist_items;
create policy "Users can insert own wishlist items"
on public.wishlist_items for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users can delete own wishlist items" on public.wishlist_items;
create policy "Users can delete own wishlist items"
on public.wishlist_items for delete
to authenticated
using (user_id = (select auth.uid()));

-- 5.4 carts — full CRUD, scoped to owner.
drop policy if exists "Users can read own cart" on public.carts;
create policy "Users can read own cart"
on public.carts for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users can insert own cart" on public.carts;
create policy "Users can insert own cart"
on public.carts for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users can update own cart" on public.carts;
create policy "Users can update own cart"
on public.carts for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Users can delete own cart" on public.carts;
create policy "Users can delete own cart"
on public.carts for delete
to authenticated
using (user_id = (select auth.uid()));

-- 5.5 cart_items — full CRUD, scoped to items in a cart owned by the caller.
drop policy if exists "Users can read own cart items" on public.cart_items;
create policy "Users can read own cart items"
on public.cart_items for select
to authenticated
using (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can insert own cart items" on public.cart_items;
create policy "Users can insert own cart items"
on public.cart_items for insert
to authenticated
with check (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can update own cart items" on public.cart_items;
create policy "Users can update own cart items"
on public.cart_items for update
to authenticated
using (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
  )
);

drop policy if exists "Users can delete own cart items" on public.cart_items;
create policy "Users can delete own cart items"
on public.cart_items for delete
to authenticated
using (
  exists (
    select 1 from public.carts c
    where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
  )
);

-- 5.6 orders — READ ONLY. No insert/update/delete policy exists for any
-- client role: totals/status are only ever written by trusted server code.
-- Scoped strictly to user_id = (select auth.uid()) — never by email or phone, so a
-- guest order (user_id is null) can never be read this way.
drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
on public.orders for select
to authenticated
using (user_id = (select auth.uid()));

-- 5.7 order_items — READ ONLY, scoped through the parent order's owner.
drop policy if exists "Users can read own order items" on public.order_items;
create policy "Users can read own order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = (select auth.uid())
  )
);

-- 5.8 payments — READ ONLY, scoped through the parent order's owner. No
-- client role may ever write a payment row.
drop policy if exists "Users can read own payments" on public.payments;
create policy "Users can read own payments"
on public.payments for select
to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = payments.order_id and o.user_id = (select auth.uid())
  )
);

-- ============================================================================
-- 6. GRANTS
-- Supabase grants ALL privileges on new tables/functions to anon and
-- authenticated by default (see note at top of file). Revoke everything
-- first, then grant back only what the RLS policies above are meant to
-- allow. anon gets nothing on any of these 8 tables — none of them ever
-- have an anon-facing policy.
-- ============================================================================

revoke all on public.profiles from anon, authenticated;
revoke all on public.addresses from anon, authenticated;
revoke all on public.wishlist_items from anon, authenticated;
revoke all on public.carts from anon, authenticated;
revoke all on public.cart_items from anon, authenticated;
revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;
revoke all on public.payments from anon, authenticated;
revoke all on public.order_number_seq from anon, authenticated;
revoke all on function public.generate_order_number() from anon, authenticated;
revoke all on function public.handle_new_user() from anon, authenticated;

-- PostgreSQL grants EXECUTE on every new function to the PUBLIC pseudo-role
-- by default, which anon/authenticated inherit even after the explicit
-- revokes above (PUBLIC is not the same as anon/authenticated). Revoke it
-- explicitly so neither internal helper is callable over PostgREST RPC —
-- generate_order_number() is only used as a column default (invoked by the
-- inserting role, i.e. service_role), and handle_new_user() is only ever
-- invoked by its own SECURITY DEFINER trigger on auth.users.
revoke all on function public.generate_order_number() from public;
revoke all on function public.handle_new_user() from public;

grant select, update on public.profiles to authenticated;

grant select, insert, update, delete on public.addresses to authenticated;

grant select, insert, delete on public.wishlist_items to authenticated;

grant select, insert, update, delete on public.carts to authenticated;

grant select, insert, update, delete on public.cart_items to authenticated;

-- Orders, order items, and payments: authenticated may only ever SELECT its
-- own rows (enforced by the RLS policies above). No insert/update/delete
-- grant is given here — writes happen exclusively through service_role /
-- a future trusted server-side checkout RPC.
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;
grant select on public.payments to authenticated;
