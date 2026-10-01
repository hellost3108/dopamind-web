-- DOPAMIND — Trang quản trị (/admin)
--
-- Chạy file này MỘT LẦN trong Supabase > SQL Editor. An toàn khi chạy lại.
-- Sau đó chạy thêm câu lệnh "cấp quyền admin" ở cuối file (xem hướng dẫn).
--
-- Thiết kế bảo mật:
--   * Quyền admin nằm ở bảng RIÊNG `admin_users`, KHÔNG nằm trong `profiles`.
--     (profiles cho phép người dùng tự UPDATE hàng của mình, nên nếu để cột
--     role ở đó thì ai cũng tự nâng mình lên admin được.)
--   * Khách KHÔNG ghi được vào admin_users (chỉ đọc đúng hàng của mình).
--     Chỉ bạn thêm admin bằng SQL Editor.
--   * Mọi quyền ghi vào sản phẩm đều qua RLS: chỉ khi public.is_admin() = true.
--   * Không cần service_role key trong code/Vercel.

-- ============================================================================
-- 1. BẢNG admin_users + HÀM is_admin()
-- ============================================================================

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

drop policy if exists "Admins can read own admin row" on public.admin_users;
create policy "Admins can read own admin row"
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- ============================================================================
-- 2. QUYỀN GHI VÀO SẢN PHẨM (chỉ admin)
-- ============================================================================

do $$
declare
  t text;
begin
  -- Các bảng admin được thêm / sửa / xóa
  foreach t in array array[
    'products', 'product_variants', 'product_categories',
    'product_media', 'product_moods', 'product_skin_needs'
  ] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists %I on public.%I', 'Admins manage ' || t, t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      'Admins manage ' || t, t
    );
  end loop;

  -- Các bảng chỉ để admin ĐỌC (kể cả mục đang ẩn)
  foreach t in array array['categories', 'moods', 'skin_needs'] loop
    execute format('drop policy if exists %I on public.%I', 'Admins read ' || t, t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_admin())',
      'Admins read ' || t, t
    );
  end loop;

  -- Đơn hàng: admin đọc tất cả
  foreach t in array array['orders', 'order_items', 'payments'] loop
    execute format('drop policy if exists %I on public.%I', 'Admins read ' || t, t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_admin())',
      'Admins read ' || t, t
    );
  end loop;
end
$$;

-- ============================================================================
-- 3. ĐỔI TRẠNG THÁI ĐƠN HÀNG (admin)
--    Hủy đơn => tự cộng lại tồn kho (create_order đã trừ kho lúc khách đặt).
--    Đơn đã hủy thì không mở lại được (để không bị cộng/trừ kho sai).
-- ============================================================================

create or replace function public.admin_update_order(
  p_order_id uuid,
  p_status text,
  p_payment_status text,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.orders%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Bạn không có quyền thực hiện thao tác này.';
  end if;

  if p_status is null or p_status not in
     ('pending', 'confirmed', 'processing', 'shipping', 'completed', 'cancelled', 'refunded') then
    raise exception 'Trạng thái đơn hàng không hợp lệ.';
  end if;

  if p_payment_status is null or p_payment_status not in
     ('unpaid', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded') then
    raise exception 'Trạng thái thanh toán không hợp lệ.';
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Không tìm thấy đơn hàng.';
  end if;

  if v_order.status = 'cancelled' and p_status <> 'cancelled' then
    raise exception 'Đơn đã hủy nên không thể mở lại. Hãy để khách đặt đơn mới.';
  end if;

  -- Hủy đơn: cộng lại tồn kho
  if p_status = 'cancelled' and v_order.status <> 'cancelled' then
    update public.product_variants pv
    set stock_quantity = pv.stock_quantity + oi.qty
    from (
      select variant_id, sum(quantity)::int as qty
      from public.order_items
      where order_id = p_order_id and variant_id is not null
      group by variant_id
    ) oi
    where pv.id = oi.variant_id;

    update public.orders
    set cancelled_at = now(),
        cancel_reason = coalesce(left(nullif(btrim(p_reason), ''), 500), 'Hủy bởi cửa hàng')
    where id = p_order_id;
  end if;

  update public.orders
  set status = p_status,
      payment_status = p_payment_status
  where id = p_order_id;

  -- Đồng bộ bảng payments theo trạng thái thanh toán mới
  if p_payment_status is distinct from v_order.payment_status then
    update public.payments
    set status = case p_payment_status
                   when 'paid' then 'paid'
                   when 'failed' then 'failed'
                   when 'refunded' then 'refunded'
                   when 'partially_refunded' then 'partially_refunded'
                   else 'pending'
                 end,
        paid_at = case when p_payment_status = 'paid' then coalesce(paid_at, now()) else paid_at end
    where order_id = p_order_id
      and status <> 'cancelled';
  end if;

  -- Đơn hủy mà chưa thu tiền: đóng luôn khoản thanh toán đang chờ
  if p_status = 'cancelled' and p_payment_status not in ('paid', 'refunded', 'partially_refunded') then
    update public.payments
    set status = 'cancelled'
    where order_id = p_order_id
      and status in ('pending', 'authorized');
  end if;
end;
$$;

revoke all on function public.admin_update_order(uuid, text, text, text) from public;
revoke all on function public.admin_update_order(uuid, text, text, text) from anon;
grant execute on function public.admin_update_order(uuid, text, text, text) to authenticated;

-- ============================================================================
-- 4. ẢNH SẢN PHẨM: cho admin tải lên / xóa trong bucket "product-imagess"
--    (bucket đã public nên mọi người vẫn xem ảnh bình thường)
-- ============================================================================

drop policy if exists "Admins can read product images" on storage.objects;
create policy "Admins can read product images"
on storage.objects for select
to authenticated
using (bucket_id = 'product-imagess' and public.is_admin());

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-imagess' and public.is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-imagess' and public.is_admin())
with check (bucket_id = 'product-imagess' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-imagess' and public.is_admin());

-- ============================================================================
-- 5. CẤP QUYỀN ADMIN CHO TÀI KHOẢN CỦA BẠN
--    Đổi email bên dưới thành email bạn dùng đăng nhập trên Dopamind.vn,
--    rồi chạy RIÊNG câu lệnh này (bỏ dấu -- ở đầu 3 dòng).
-- ============================================================================

-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'EMAIL_CUA_BAN@gmail.com'
-- on conflict do nothing;
