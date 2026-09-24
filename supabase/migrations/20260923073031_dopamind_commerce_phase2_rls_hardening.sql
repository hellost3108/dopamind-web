-- DOPAMIND — Phase 2 hardening pass, applied right after phase2 based on
-- Supabase advisor findings:
--   1) PostgreSQL grants EXECUTE on every new function to the PUBLIC
--      pseudo-role by default. REVOKE ... FROM anon, authenticated does NOT
--      remove that PUBLIC grant (anon/authenticated still inherit it via
--      PUBLIC), so both SECURITY DEFINER-adjacent helper functions were
--      still callable directly over PostgREST RPC. Revoke EXECUTE from
--      PUBLIC explicitly, keeping only postgres/service_role able to call
--      them (matches the "internal helper, not a public API" intent).
--   2) Rewrite auth.uid() as (select auth.uid()) inside every Phase 2 RLS
--      policy so Postgres evaluates it once per query instead of once per
--      row (Supabase RLS performance best practice). Pure performance
--      change — the access rules themselves are unchanged.

revoke all on function public.handle_new_user() from public;
revoke all on function public.generate_order_number() from public;

-- profiles
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

-- addresses
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

-- wishlist_items
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

-- carts
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

-- cart_items
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

-- orders
drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
on public.orders for select
to authenticated
using (user_id = (select auth.uid()));

-- order_items
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

-- payments
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
