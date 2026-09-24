-- DOPAMIND — Phase 2 final hardening pass.
--
-- Additive only: no drops, no truncates, no data edits, no rewrites of
-- earlier migrations. Addresses the remaining advisor findings left after
-- 20260923073031_dopamind_commerce_phase2_rls_hardening:
--
--   1) public.set_updated_at() still had a mutable search_path (function
--      search_path WARN). Pin it the same way the Phase 2 helper functions
--      already are.
--   2) product_moods.mood_id and product_skin_needs.skin_need_id had no
--      covering index for their foreign keys (performance INFO).
--   3) Catalog tables (products, product_variants, categories,
--      product_categories, product_media, moods, product_moods, skin_needs,
--      product_skin_needs) still carried Supabase's default ALL-privileges
--      grant to anon/authenticated from Phase 1. RLS already restricts
--      actual row access to active/published rows for SELECT and has no
--      write policy at all, so this was not an exploitable hole — but the
--      unused write grants are tightened here anyway (defense in depth),
--      leaving public SELECT access on catalog data untouched.

-- ============================================================================
-- 1. FIX set_updated_at() SEARCH PATH
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 2. MISSING FK INDEXES
-- ============================================================================

create index if not exists idx_product_moods_mood_id on public.product_moods (mood_id);
create index if not exists idx_product_skin_needs_skin_need_id on public.product_skin_needs (skin_need_id);

-- ============================================================================
-- 3. TIGHTEN CATALOG TABLE GRANTS
-- Revoke the default ALL-privileges grant, then grant back SELECT only —
-- the only access any RLS policy on these tables has ever allowed for
-- anon/authenticated. No catalog write policy exists, so this only removes
-- dormant privileges; it does not change what anon/authenticated can
-- actually do today.
-- ============================================================================

revoke all on public.products from anon, authenticated;
revoke all on public.product_variants from anon, authenticated;
revoke all on public.categories from anon, authenticated;
revoke all on public.product_categories from anon, authenticated;
revoke all on public.product_media from anon, authenticated;
revoke all on public.moods from anon, authenticated;
revoke all on public.product_moods from anon, authenticated;
revoke all on public.skin_needs from anon, authenticated;
revoke all on public.product_skin_needs from anon, authenticated;

grant select on public.products to anon, authenticated;
grant select on public.product_variants to anon, authenticated;
grant select on public.categories to anon, authenticated;
grant select on public.product_categories to anon, authenticated;
grant select on public.product_media to anon, authenticated;
grant select on public.moods to anon, authenticated;
grant select on public.product_moods to anon, authenticated;
grant select on public.skin_needs to anon, authenticated;
grant select on public.product_skin_needs to anon, authenticated;
