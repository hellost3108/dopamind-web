-- Chỉ thêm nơi lưu định dạng; không chuyển đổi hoặc ghi đè chữ đang có.
-- Các cột name_vi/title/category cũ tiếp tục chứa chữ thuần cho SQL đơn hàng/bộ lọc.
begin;
alter table public.products add column if not exists rich_text jsonb not null default '{}'::jsonb;
alter table public.product_variants add column if not exists rich_text jsonb not null default '{}'::jsonb;
alter table public.categories add column if not exists rich_text jsonb not null default '{}'::jsonb;
alter table public.articles add column if not exists rich_text jsonb not null default '{}'::jsonb;
commit;
