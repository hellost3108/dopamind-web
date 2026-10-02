"use client";

import { useActionState, useState } from "react";
import { saveProductAction, type FormState } from "@/app/admin/actions";
import type { AdminVariant, RefOption } from "@/lib/admin/data";
import { PRODUCT_STATUS_LABEL } from "@/lib/admin/labels";
import { btnGhost, btnPrimary, card, inputCls, labelCls } from "@/components/admin/ui";

export type ProductFormValues = {
  id?: string;
  name_vi: string;
  slug: string;
  status: string;
  short_description_vi: string;
  description_vi: string;
  featured: boolean;
  is_new: boolean;
  seo_title: string;
  seo_description: string;
};

type VariantRow = {
  key: string;
  id?: string;
  name_vi: string;
  sku: string;
  price: string;
  compare_at_price: string;
  stock_quantity: string;
  active: boolean;
};

function newKey() {
  return crypto.randomUUID();
}

function toRow(v: AdminVariant): VariantRow {
  return {
    key: newKey(),
    id: v.id,
    name_vi: v.name_vi,
    sku: v.sku ?? "",
    price: String(v.price),
    compare_at_price: v.compare_at_price == null ? "" : String(v.compare_at_price),
    stock_quantity: String(v.stock_quantity),
    active: v.active,
  };
}

function blankRow(): VariantRow {
  return { key: newKey(), name_vi: "", sku: "", price: "", compare_at_price: "", stock_quantity: "0", active: true };
}

function OptionChecks({
  title,
  name,
  options,
  selected,
}: {
  title: string;
  name: string;
  options: RefOption[];
  selected: string[];
}) {
  return (
    <fieldset>
      <legend className={labelCls}>{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.length === 0 && <p className="text-xs text-charcoal/45">Chưa có dữ liệu.</p>}
        {options.map((o) => (
          <label
            key={o.id}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-charcoal/15 bg-white px-3.5 py-2 text-[13px] text-charcoal has-[:checked]:border-purple has-[:checked]:bg-lavender/50"
          >
            <input type="checkbox" name={name} value={o.id} defaultChecked={selected.includes(o.id)} className="accent-[#9688ff]" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ProductForm({
  values,
  variants,
  categories,
  moods,
  skinNeeds,
  categoryIds,
  moodIds,
  skinNeedIds,
}: {
  values: ProductFormValues;
  variants: AdminVariant[];
  categories: RefOption[];
  moods: RefOption[];
  skinNeeds: RefOption[];
  categoryIds: string[];
  moodIds: string[];
  skinNeedIds: string[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveProductAction, undefined);
  const [rows, setRows] = useState<VariantRow[]>(() => (variants.length ? variants.map(toRow) : [blankRow()]));

  // Sau khi lưu, biến thể mới có id thật từ database -> nạp lại để lần lưu sau
  // cập nhật đúng biến thể đó (không tạo trùng / không xóa nhầm).
  const syncKey = variants.map((v) => v.id).join(",");
  const [lastSyncKey, setLastSyncKey] = useState(syncKey);
  if (syncKey !== lastSyncKey) {
    setLastSyncKey(syncKey);
    setRows(variants.length ? variants.map(toRow) : [blankRow()]);
  }

  const update = (key: string, patch: Partial<VariantRow>) =>
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const variantsJson = JSON.stringify(
    rows.map((r) => ({
      id: r.id,
      name_vi: r.name_vi,
      sku: r.sku,
      price: r.price,
      compare_at_price: r.compare_at_price,
      stock_quantity: r.stock_quantity,
      active: r.active,
    })),
  );

  return (
    <form action={formAction} className="space-y-5">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <input type="hidden" name="variants" value={variantsJson} />

      <section className={card}>
        <h2 className="font-serif text-xl text-charcoal">Thông tin chung</h2>
        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="name_vi" className={labelCls}>Tên sản phẩm *</label>
            <input id="name_vi" name="name_vi" required defaultValue={values.name_vi} className={inputCls} placeholder="Ví dụ: Mặt nạ MTS Dual Layer – Bình Tâm" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="slug" className={labelCls}>Đường dẫn (slug)</label>
              <input id="slug" name="slug" defaultValue={values.slug} className={inputCls} placeholder="Để trống = tự tạo từ tên" />
              <p className="mt-1 text-[11px] text-charcoal/45">Dùng trong link sản phẩm. Đổi slug sẽ đổi link cũ.</p>
            </div>
            <div>
              <label htmlFor="status" className={labelCls}>Trạng thái</label>
              <select id="status" name="status" defaultValue={values.status} className={inputCls}>
                {Object.entries(PRODUCT_STATUS_LABEL).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-charcoal/45">Chỉ “Đang bán” mới hiện ra cho khách.</p>
            </div>
          </div>
          <div>
            <label htmlFor="short_description_vi" className={labelCls}>Mô tả ngắn</label>
            <input id="short_description_vi" name="short_description_vi" defaultValue={values.short_description_vi} maxLength={400} className={inputCls} placeholder="Hiện dưới tên sản phẩm ở thẻ sản phẩm" />
          </div>
          <div>
            <label htmlFor="description_vi" className={labelCls}>Mô tả chi tiết</label>
            <textarea id="description_vi" name="description_vi" rows={6} defaultValue={values.description_vi} className={inputCls} />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" name="featured" defaultChecked={values.featured} className="h-4 w-4 accent-[#9688ff]" />
              Sản phẩm nổi bật
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" name="is_new" defaultChecked={values.is_new} className="h-4 w-4 accent-[#9688ff]" />
              Đánh dấu “Mới”
            </label>
          </div>
        </div>
      </section>

      <section className={card}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-charcoal">Giá &amp; tồn kho</h2>
          <button type="button" onClick={() => setRows((p) => [...p, blankRow()])} className={btnGhost + " !h-9 !px-4"}>
            + Thêm biến thể
          </button>
        </div>
        <p className="mt-1 text-xs text-charcoal/50">
          Mỗi biến thể là một lựa chọn mua (ví dụ: hộp 5 miếng, hộp 10 miếng). Giá tính bằng đồng (VNĐ).
        </p>
        <div className="mt-5 space-y-4">
          {rows.map((r, i) => (
            <div key={r.key} className="rounded-xl border border-charcoal/10 bg-cloud-milk/60 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Tên biến thể *</label>
                  <input value={r.name_vi} onChange={(e) => update(r.key, { name_vi: e.target.value })} className={inputCls} placeholder="Hộp 5 miếng" />
                </div>
                <div>
                  <label className={labelCls}>Giá bán (đ) *</label>
                  <input type="number" min={0} step={1000} inputMode="numeric" value={r.price} onChange={(e) => update(r.key, { price: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Giá gạch ngang (đ)</label>
                  <input type="number" min={0} step={1000} inputMode="numeric" value={r.compare_at_price} onChange={(e) => update(r.key, { compare_at_price: e.target.value })} className={inputCls} placeholder="Không bắt buộc" />
                </div>
                <div>
                  <label className={labelCls}>Tồn kho</label>
                  <input type="number" min={0} step={1} inputMode="numeric" value={r.stock_quantity} onChange={(e) => update(r.key, { stock_quantity: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mã SKU</label>
                  <input value={r.sku} onChange={(e) => update(r.key, { sku: e.target.value })} className={inputCls} placeholder="Không bắt buộc" />
                </div>
                <div className="flex items-end justify-between gap-3 sm:col-span-2">
                  <label className="flex items-center gap-2 pb-2.5 text-sm text-charcoal">
                    <input type="checkbox" checked={r.active} onChange={(e) => update(r.key, { active: e.target.checked })} className="h-4 w-4 accent-[#9688ff]" />
                    Đang bán
                  </label>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Xóa biến thể ${i + 1}? Việc này có hiệu lực sau khi bạn bấm “Lưu sản phẩm”.`)) {
                          setRows((p) => p.filter((x) => x.key !== r.key));
                        }
                      }}
                      className="pb-2.5 text-xs text-red-600 underline-offset-4 hover:underline"
                    >
                      Xóa biến thể
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={card}>
        <h2 className="font-serif text-xl text-charcoal">Phân loại</h2>
        <div className="mt-5 space-y-5">
          <OptionChecks title="Dòng sản phẩm (danh mục)" name="category_ids" options={categories} selected={categoryIds} />
          <OptionChecks title="Cảm xúc" name="mood_ids" options={moods} selected={moodIds} />
          <OptionChecks title="Nhu cầu da" name="skin_need_ids" options={skinNeeds} selected={skinNeedIds} />
        </div>
      </section>

      <section className={card}>
        <h2 className="font-serif text-xl text-charcoal">SEO (tuỳ chọn)</h2>
        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="seo_title" className={labelCls}>Tiêu đề SEO</label>
            <input id="seo_title" name="seo_title" defaultValue={values.seo_title} maxLength={120} className={inputCls} />
          </div>
          <div>
            <label htmlFor="seo_description" className={labelCls}>Mô tả SEO</label>
            <textarea id="seo_description" name="seo_description" rows={2} defaultValue={values.seo_description} maxLength={300} className={inputCls} />
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-4 rounded-2xl border border-charcoal/10 bg-white/95 p-4 backdrop-blur">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Đang lưu..." : values.id ? "Lưu sản phẩm" : "Tạo sản phẩm"}
        </button>
        {state?.error && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
        {state?.ok && <p role="status" className="text-sm text-emerald-700">{state.ok}</p>}
      </div>
    </form>
  );
}
