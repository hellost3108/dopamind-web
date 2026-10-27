-- Thêm thư viện ảnh, vị trí ảnh và thùng rác. Không sửa hoặc xóa file đang dùng.
begin;
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 240),
  alt text not null default '' check (length(alt)<=500),
  original_bucket text not null default 'brand-originals',
  original_path text not null,
  width integer not null default 0, height integer not null default 0, bytes bigint not null default 0,
  ready boolean not null default true,
  variants jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(), deleted_at timestamptz,
  unique(original_bucket,original_path)
);
create table if not exists public.media_placements (
  slot text primary key check(length(slot) between 1 and 300),
  asset_id uuid references public.media_assets(id),
  url text not null default '', alt text not null default '' check(length(alt)<=500),
  desktop jsonb not null default '{"x":50,"y":50}'::jsonb,
  mobile jsonb not null default '{"x":50,"y":50}'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  disabled boolean not null default false,
  updated_at timestamptz not null default now(), updated_by uuid references auth.users(id)
);
create table if not exists public.media_trash (
  id uuid primary key default gen_random_uuid(),
  slot text, asset_id uuid references public.media_assets(id), snapshot jsonb,
  deleted_at timestamptz not null default now(), deleted_by uuid references auth.users(id), restored_at timestamptz
);
create index if not exists media_assets_name_idx on public.media_assets(name);
create index if not exists media_placements_asset_idx on public.media_placements(asset_id);
create index if not exists media_trash_date_idx on public.media_trash(deleted_at desc);
alter table public.media_assets enable row level security;
alter table public.media_placements enable row level security;
alter table public.media_trash enable row level security;
revoke all on public.media_assets,public.media_placements,public.media_trash from public,anon,authenticated;
grant select,insert,update,delete on public.media_assets,public.media_placements,public.media_trash to authenticated;
grant select on public.media_placements to anon;
drop policy if exists "Admins manage media assets" on public.media_assets;
create policy "Admins manage media assets" on public.media_assets for all to authenticated using(public.is_admin()) with check(public.is_admin());
drop policy if exists "Admins manage media placements" on public.media_placements;
create policy "Admins manage media placements" on public.media_placements for all to authenticated using(public.is_admin()) with check(public.is_admin());
drop policy if exists "Public image placements" on public.media_placements;
create policy "Public image placements" on public.media_placements for select to anon,authenticated using(
 slot like 'cms:%' or slot like 'home.%' or slot like 'static:%'
 or (slot like 'article:%' and exists(select 1 from public.articles a where a.id::text=substring(slot from 9) and a.status='published'))
 or (slot like 'category:%' and exists(select 1 from public.categories c where c.id::text=substring(slot from 10) and c.active))
 or (slot like 'product-media:%' and exists(select 1 from public.product_media m join public.products p on p.id=m.product_id where m.id::text=substring(slot from 15) and p.status='active'))
);
drop policy if exists "Admins manage media trash" on public.media_trash;
create policy "Admins manage media trash" on public.media_trash for all to authenticated using(public.is_admin()) with check(public.is_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('brand-originals','brand-originals',false,20971520,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
do $$ begin
 if exists(select 1 from storage.buckets where id='brand-originals' and public) then raise exception 'Bucket brand-originals đang công khai; cần dùng một bucket riêng tư cho bản gốc.'; end if;
end $$;
drop policy if exists "Admins manage private image originals" on storage.objects;
create policy "Admins manage private image originals" on storage.objects for all to authenticated
using(bucket_id='brand-originals' and public.is_admin()) with check(bucket_id='brand-originals' and public.is_admin());

-- Đăng ký các ảnh cũ trong bucket hiện tại; không chuyển, ghi đè hay xóa file.
insert into public.media_assets(name,original_bucket,original_path,bytes)
select left(regexp_replace(name,'^.*/',''),240),bucket_id,name,coalesce((metadata->>'size')::bigint,0)
from storage.objects where bucket_id='product-imagess' and name not like 'managed/%' and lower(name) ~ '\.(jpg|jpeg|png|webp)$'
on conflict(original_bucket,original_path) do nothing;

-- Một transaction cho lưu, gỡ ảnh hoặc khôi phục. Kiểm tra admin cả trong RPC.
create or replace function public.manage_media_placement(p_operation text,p_slot text,p_value jsonb,p_expected text default null)
returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare current_row public.media_placements; saved public.media_placements; trash public.media_trash;
begin
  if not public.is_admin() then raise exception 'Bạn không có quyền quản lý ảnh.'; end if;
  perform pg_advisory_xact_lock(hashtextextended(coalesce(p_slot,p_value->>'id'),0));
  if p_operation='restore' then
    select * into trash from public.media_trash where id=(p_value->>'id')::uuid for update;
    if not found or trash.restored_at is not null or trash.deleted_at < now()-interval '30 days' then raise exception 'Ảnh không còn trong thời hạn khôi phục 30 ngày.'; end if;
    if trash.slot is null then
      update public.media_assets set deleted_at=null where id=trash.asset_id;
    else
      if trash.asset_id is not null then
        update public.media_assets set deleted_at=null where id=trash.asset_id and (deleted_at is null or deleted_at>=now()-interval '30 days');
        if not found then raise exception 'Ảnh đã quá thời hạn khôi phục.'; end if;
        update public.media_trash set restored_at=now() where slot is null and asset_id=trash.asset_id and restored_at is null;
      end if;
      select * into current_row from public.media_placements where slot=trash.slot for update;
      if not found or not current_row.disabled or current_row.updated_at<>trash.deleted_at then raise exception 'Vị trí này đã có thay đổi mới. Hãy chọn lại ảnh từ thư viện.'; end if;
      insert into public.media_placements(slot,asset_id,url,alt,desktop,mobile,variants,disabled,updated_by)
      values(trash.slot,(trash.snapshot->>'asset_id')::uuid,coalesce(trash.snapshot->>'url',''),coalesce(trash.snapshot->>'alt',''),coalesce(trash.snapshot->'desktop','{"x":50,"y":50}'),coalesce(trash.snapshot->'mobile','{"x":50,"y":50}'),coalesce(trash.snapshot->'variants','[]'),false,auth.uid())
      on conflict(slot) do update set asset_id=excluded.asset_id,url=excluded.url,alt=excluded.alt,desktop=excluded.desktop,mobile=excluded.mobile,variants=excluded.variants,disabled=false,updated_at=now(),updated_by=auth.uid();
    end if;
    update public.media_trash set restored_at=now() where id=trash.id;
    return jsonb_build_object('ok',true);
  end if;
  select * into current_row from public.media_placements where slot=p_slot for update;
  if (p_expected is null and current_row.updated_at is not null) or (p_expected is not null and current_row.updated_at is distinct from p_expected::timestamptz) then raise exception 'Ảnh đã được người khác sửa. Hãy tải lại trang trước khi lưu.'; end if;
  if p_operation='reset' then
    delete from public.media_placements where slot=p_slot;
    return jsonb_build_object('ok',true);
  end if;
  if p_value->>'asset_id' is not null then
    perform 1 from public.media_assets where id=(p_value->>'asset_id')::uuid and deleted_at is null and ready for update;
    if not found then raise exception 'Ảnh không còn trong thư viện.'; end if;
  end if;
  if p_operation='delete' then
    insert into public.media_trash(slot,asset_id,snapshot,deleted_by)
    values(p_slot,(p_value->>'asset_id')::uuid,p_value,auth.uid());
  elsif p_operation<>'save' then raise exception 'Thao tác ảnh không hợp lệ.';
  end if;
  insert into public.media_placements(slot,asset_id,url,alt,desktop,mobile,variants,disabled,updated_by)
  values(p_slot,(p_value->>'asset_id')::uuid,coalesce(p_value->>'url',''),coalesce(p_value->>'alt',''),p_value->'desktop',p_value->'mobile',coalesce(p_value->'variants','[]'),(p_operation='delete' or coalesce((p_value->>'disabled')::boolean,false)),auth.uid())
  on conflict(slot) do update set asset_id=excluded.asset_id,url=excluded.url,alt=excluded.alt,desktop=excluded.desktop,mobile=excluded.mobile,variants=excluded.variants,disabled=excluded.disabled,updated_at=now(),updated_by=auth.uid()
  returning * into saved;
  return to_jsonb(saved);
end $$;
revoke all on function public.manage_media_placement(text,text,jsonb,text) from public,anon;
grant execute on function public.manage_media_placement(text,text,jsonb,text) to authenticated;

create or replace function public.trash_media_asset(p_id uuid) returns void language plpgsql security invoker set search_path=public,pg_temp as $$
begin
 if not public.is_admin() then raise exception 'Bạn không có quyền quản lý ảnh.'; end if;
 perform 1 from public.media_assets where id=p_id and deleted_at is null for update;
 if not found then raise exception 'Ảnh không còn trong thư viện.'; end if;
 if exists(select 1 from public.media_placements where asset_id=p_id and not disabled) then raise exception 'Ảnh vẫn đang được dùng. Hãy gỡ ảnh khỏi vị trí đó trước.'; end if;
 update public.media_assets set deleted_at=now() where id=p_id;
 insert into public.media_trash(asset_id,snapshot,deleted_by) select p_id,jsonb_build_object('name',name),auth.uid() from public.media_assets where id=p_id;
end $$;
revoke all on function public.trash_media_asset(uuid) from public,anon;
grant execute on function public.trash_media_asset(uuid) to authenticated;


create or replace function public.attach_library_product_media(p_product uuid,p_asset uuid,p_value jsonb) returns uuid language plpgsql security invoker set search_path=public,pg_temp as $$
declare asset public.media_assets; media_id uuid:=gen_random_uuid(); storage_path_value text; order_value integer; primary_value boolean;
begin
 if not public.is_admin() then raise exception 'Bạn không có quyền quản lý ảnh.'; end if;
 perform 1 from public.products where id=p_product for update;
 if not found then raise exception 'Không tìm thấy sản phẩm.'; end if;
 select * into asset from public.media_assets where id=p_asset and ready and deleted_at is null for update;
 if not found then raise exception 'Không tìm thấy ảnh trong thư viện.'; end if;
 storage_path_value:=coalesce(asset.variants -> -1 ->> 'path',case when asset.original_bucket='product-imagess' then asset.original_path end);
 if storage_path_value is null then raise exception 'Ảnh chưa được xử lý xong.'; end if;
 select coalesce(max(sort_order),-1)+1,not coalesce(bool_or(is_primary),false) into order_value,primary_value from public.product_media where product_id=p_product;
 insert into public.product_media(id,product_id,storage_path,alt_vi,media_type,sort_order,is_primary)
 values(media_id,p_product,storage_path_value,left(coalesce(p_value->>'alt',''),200),'product',order_value,primary_value);
 insert into public.media_placements(slot,asset_id,url,alt,desktop,mobile,variants,updated_by)
 values('product-media:'||media_id::text,p_asset,p_value->>'url',left(coalesce(p_value->>'alt',''),500),p_value->'desktop',p_value->'mobile',p_value->'variants',auth.uid());
 return media_id;
end $$;
revoke all on function public.attach_library_product_media(uuid,uuid,jsonb) from public,anon;
grant execute on function public.attach_library_product_media(uuid,uuid,jsonb) to authenticated;

commit;
