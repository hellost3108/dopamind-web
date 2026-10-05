-- DOPAMIND Content Studio: bài viết + quyền quản lý danh mục.
-- Chạy sau 20261001090000_admin_panel.sql và 20261002090000_site_cms.sql.

create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content_markdown text not null default '',
  category text not null default 'Cảm hứng',
  author text,
  image_url text,
  image_alt text,
  reading_time integer not null default 5 check (reading_time between 1 and 120),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_public_idx
on public.articles (status, featured desc, published_at desc, sort_order, created_at desc);

alter table public.articles enable row level security;

grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;

drop policy if exists "Published articles are public" on public.articles;
create policy "Published articles are public"
on public.articles for select
to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins manage articles" on public.articles;
create policy "Admins manage articles"
on public.articles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Admin cần được thêm/sửa danh mục ngay trong Content Studio.
grant select, insert, update, delete on public.categories to authenticated;
drop policy if exists "Admins read categories" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.touch_article_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
before update on public.articles
for each row execute function public.touch_article_updated_at();

