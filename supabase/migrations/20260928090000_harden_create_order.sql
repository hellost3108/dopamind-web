-- DOPAMIND — create_order: đưa bản đang chạy trên Supabase vào repo và vá lỗ hổng.
--
-- Vì hàm là SECURITY DEFINER (bỏ qua RLS), mọi người dùng đã đăng nhập đều có thể
-- gọi thẳng supabase.rpc('create_order', ...) từ trình duyệt với dữ liệu tự chọn.
-- Bản này chặn các trường hợp đó:
--   1) p_shipping_fee do client gửi lên  -> phải đúng phí ship cố định
--   2) quantity <= 0 hoặc không phải số  -> bị từ chối (trước đây quantity âm làm
--      giảm tổng tiền và cộng thêm tồn kho)
--   3) variant_id không tồn tại/ngừng bán -> bị từ chối (trước đây bị bỏ qua im lặng,
--      có thể tạo đơn chỉ gồm tiền ship)
--   4) cùng một variant xuất hiện 2 lần   -> gộp số lượng trước khi kiểm tra tồn kho
--   5) giới hạn số dòng và số lượng mỗi dòng, giới hạn độ dài ghi chú
--   6) chỉ role authenticated được gọi hàm
--
-- LƯU Ý: nếu đổi SHIPPING_FEE trong src/lib/checkout.ts thì phải đổi c_shipping_fee ở đây.

create or replace function public.create_order(
  p_address_id uuid,
  p_payment_method text,
  p_shipping_fee numeric,
  p_items jsonb,
  p_customer_note text default null::text
)
returns table(order_id uuid, order_number text, total_amount numeric)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  c_shipping_fee constant numeric := 30000;
  c_max_lines    constant int := 30;
  c_max_qty      constant int := 20;

  v_user_id uuid := auth.uid();
  v_email text;
  v_address record;
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric := 0;
  v_total numeric;
  v_attempts int := 0;
  v_requested int;
  v_found int;
begin
  if v_user_id is null then
    raise exception 'Bạn cần đăng nhập để đặt hàng.';
  end if;

  if p_payment_method is null or p_payment_method not in ('cod', 'bank_transfer') then
    raise exception 'Phương thức thanh toán không hợp lệ.';
  end if;

  if p_shipping_fee is distinct from c_shipping_fee then
    raise exception 'Phí vận chuyển không hợp lệ. Vui lòng tải lại trang.';
  end if;

  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'Giỏ hàng đang trống.';
  end if;

  if jsonb_array_length(p_items) > c_max_lines then
    raise exception 'Giỏ hàng có quá nhiều sản phẩm.';
  end if;

  -- Kiểm tra hình dạng từng dòng TRƯỚC khi ép kiểu, để không lộ lỗi kỹ thuật.
  if exists (
    select 1
    from jsonb_array_elements(p_items) as i
    where jsonb_typeof(i) <> 'object'
       or coalesce(i->>'variant_id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
       or coalesce(i->>'quantity', '') !~ '^[0-9]{1,3}$'
       or case when coalesce(i->>'quantity', '') ~ '^[0-9]{1,3}$'
               then (i->>'quantity')::int else 0 end < 1
  ) then
    raise exception 'Dữ liệu giỏ hàng không hợp lệ.';
  end if;

  select * into v_address
  from public.addresses
  where id = p_address_id and user_id = v_user_id;

  if not found then
    raise exception 'Địa chỉ giao hàng không hợp lệ.';
  end if;

  select email into v_email from auth.users where id = v_user_id;

  -- Khóa các dòng biến thể (theo thứ tự id để tránh deadlock) để 2 đơn cùng lúc
  -- không bán vượt tồn kho. Đọc tồn kho ở câu lệnh SAU khóa để thấy số mới nhất.
  perform 1
  from public.product_variants
  where id in (select (i->>'variant_id')::uuid from jsonb_array_elements(p_items) as i)
  order by id
  for update;

  -- Gộp các dòng trùng variant_id, lấy giá và tồn kho từ database (không tin client).
  create temporary table _order_lines on commit drop as
  select
    r.variant_id,
    r.quantity,
    pv.price,
    pv.stock_quantity,
    p.id as product_id,
    p.name_vi as product_name
  from (
    select (i->>'variant_id')::uuid as variant_id,
           sum((i->>'quantity')::int)::int as quantity
    from jsonb_array_elements(p_items) as i
    group by 1
  ) r
  join public.product_variants pv on pv.id = r.variant_id and pv.active
  join public.products p on p.id = pv.product_id and p.status = 'active';

  select count(distinct (i->>'variant_id')::uuid) into v_requested
  from jsonb_array_elements(p_items) as i;

  select count(*) into v_found from _order_lines;

  if v_found <> v_requested then
    raise exception 'Một số sản phẩm không còn được bán. Vui lòng cập nhật giỏ hàng.';
  end if;

  if exists (select 1 from _order_lines where quantity > c_max_qty) then
    raise exception 'Số lượng mỗi sản phẩm tối đa là % .', c_max_qty;
  end if;

  if exists (select 1 from _order_lines where quantity > stock_quantity) then
    raise exception 'Một số sản phẩm trong giỏ đã vượt quá tồn kho hiện có. Vui lòng cập nhật giỏ hàng.';
  end if;

  select coalesce(sum(price * quantity), 0) into v_subtotal from _order_lines;
  v_total := v_subtotal + c_shipping_fee;

  loop
    v_order_number := 'DPM' || to_char(now(), 'YYMMDD')
      || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 5));
    exit when not exists (select 1 from public.orders o where o.order_number = v_order_number);
    v_attempts := v_attempts + 1;
    if v_attempts > 5 then
      raise exception 'Không thể tạo mã đơn hàng, vui lòng thử lại.';
    end if;
  end loop;

  insert into public.orders (
    order_number, user_id, customer_email, recipient_name, phone,
    shipping_address_snapshot, subtotal, discount_amount, shipping_fee,
    total_amount, currency, status, payment_status, customer_note
  ) values (
    v_order_number, v_user_id, v_email, v_address.recipient_name, v_address.phone,
    jsonb_build_object(
      'recipient_name', v_address.recipient_name,
      'phone', v_address.phone,
      'address_line_1', v_address.address_line_1,
      'address_line_2', v_address.address_line_2,
      'ward', v_address.ward,
      'district', v_address.district,
      'province', v_address.province,
      'postal_code', v_address.postal_code,
      'country_code', v_address.country_code
    ),
    v_subtotal, 0, c_shipping_fee, v_total, 'VND', 'pending', 'unpaid',
    left(nullif(btrim(p_customer_note), ''), 500)
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id, product_id, variant_id, product_name_snapshot,
    variant_name_snapshot, unit_price, quantity, line_total
  )
  select
    v_order_id, ol.product_id, ol.variant_id, ol.product_name,
    ol.product_name, ol.price, ol.quantity, ol.price * ol.quantity
  from _order_lines ol;

  update public.product_variants pv
  set stock_quantity = pv.stock_quantity - ol.quantity
  from _order_lines ol
  where pv.id = ol.variant_id;

  insert into public.payments (order_id, provider, method, amount, currency, status)
  values (v_order_id, 'manual', p_payment_method, v_total, 'VND', 'pending');

  return query select v_order_id, v_order_number, v_total;
end;
$function$;

-- Chỉ người dùng đã đăng nhập được gọi (hàm vẫn tự kiểm tra auth.uid()).
revoke all on function public.create_order(uuid, text, numeric, jsonb, text) from public;
revoke all on function public.create_order(uuid, text, numeric, jsonb, text) from anon;
grant execute on function public.create_order(uuid, text, numeric, jsonb, text) to authenticated;
