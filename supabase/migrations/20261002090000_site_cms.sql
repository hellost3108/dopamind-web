-- DOPAMIND — Quản lý nội dung website (/admin/noi-dung)
--
-- Chạy file này MỘT LẦN trong Supabase > SQL Editor (sau file admin_panel).
-- An toàn khi chạy lại. Chưa chạy file này thì website vẫn hiển thị bình thường
-- bằng nội dung gốc trong code; chỉ là chưa lưu được chỉnh sửa từ trang admin.
--
-- Thiết kế:
--   * site_sections: mỗi "khối nội dung" (thanh thông báo, hero, footer, ...) là
--     1 hàng, nội dung lưu dạng JSON. Không có hàng => website dùng nội dung gốc.
--   * Khách (anon) chỉ ĐỌC. Chỉ tài khoản có public.is_admin() = true mới ghi.
--   * site_section_versions: lịch sử 20 lần lưu gần nhất của mỗi khối.
--   * Ảnh tải lên dùng lại bucket "product-imagess" (thư mục cms/), quyền admin
--     đã được cấp ở file admin_panel.

create table if not exists public.site_sections (
  key text primary key check (key ~ '^[a-z0-9_.-]{1,60}$'),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.site_section_versions (
  id bigint generated always as identity primary key,
  section_key text not null check (section_key ~ '^[a-z0-9_.-]{1,60}$'),
  content jsonb not null,
  saved_at timestamptz not null default now(),
  saved_by uuid references auth.users (id) on delete set null
);

create index if not exists site_section_versions_key_idx
  on public.site_section_versions (section_key, saved_at desc);

alter table public.site_sections enable row level security;
alter table public.site_section_versions enable row level security;

revoke all on public.site_sections from anon, authenticated;
revoke all on public.site_section_versions from anon, authenticated;

grant select on public.site_sections to anon, authenticated;
grant insert, update, delete on public.site_sections to authenticated;
grant select, insert, delete on public.site_section_versions to authenticated;

drop policy if exists "Public can read site sections" on public.site_sections;
create policy "Public can read site sections"
on public.site_sections for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage site sections" on public.site_sections;
create policy "Admins manage site sections"
on public.site_sections for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage site section versions" on public.site_section_versions;
create policy "Admins manage site section versions"
on public.site_section_versions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
