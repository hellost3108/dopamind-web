-- Bảng lưu chữ/ảnh/link của trang web để sửa trong trang admin (không cần sửa code).
-- Chạy file này 1 lần trong Supabase SQL Editor.

create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Ai cũng đọc được (trang web công khai cần hiển thị nội dung).
drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content"
on public.site_content for select
to anon, authenticated
using (true);

-- Chỉ admin được thêm/sửa/xóa.
drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content"
on public.site_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
