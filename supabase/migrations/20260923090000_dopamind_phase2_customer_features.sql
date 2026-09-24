-- DOPAMIND — Phase 2 customer feature schema additions.
--
-- Additive only: no drops, no truncates, no data edits, no rewrites of
-- earlier migrations. Adds exactly one RPC needed by the customer address
-- book so "only one default address per customer" can be enforced without
-- race-prone client-only logic (two sequential UPDATE statements from the
-- browser could interleave with a concurrent request).
--
-- public.set_default_address(p_address_id):
--   - SECURITY INVOKER (the default — stated explicitly): runs as the
--     calling role, so the existing RLS policies on public.addresses still
--     apply to both UPDATEs inside it. No privilege escalation.
--   - Ownership is checked explicitly before doing anything, and every
--     WHERE clause is additionally scoped to (select auth.uid()), so a
--     caller can only ever change their own rows even if RLS were somehow
--     bypassed.
--   - Runs both UPDATEs in one function body (one implicit transaction),
--     and the pre-existing partial unique index
--     uq_addresses_one_default_per_user (from the Phase 2 base migration)
--     remains as a hard backstop: if two calls ever race, the database
--     itself rejects the losing one with a unique violation instead of
--     silently leaving two default addresses.
create or replace function public.set_default_address(p_address_id uuid)
returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.addresses
    where id = p_address_id and user_id = (select auth.uid())
  ) then
    raise exception 'Address not found or not owned by the current user';
  end if;

  update public.addresses
  set is_default = false
  where user_id = (select auth.uid())
    and is_default = true
    and id <> p_address_id;

  update public.addresses
  set is_default = true
  where id = p_address_id
    and user_id = (select auth.uid());
end;
$$;

comment on function public.set_default_address(uuid) is
  'Atomically clears any other default address for the calling user and sets p_address_id as the new default. SECURITY INVOKER — relies on the existing RLS policies on public.addresses, never escalates privilege.';

revoke all on function public.set_default_address(uuid) from public;
revoke all on function public.set_default_address(uuid) from anon;
grant execute on function public.set_default_address(uuid) to authenticated;
