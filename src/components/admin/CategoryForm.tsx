"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/danh-muc/actions";
import { ImageInput } from "@/components/admin/cms/ImageInput";
import { btnDanger, btnPrimary, card, inputCls, labelCls } from "@/components/admin/ui";
import type { AdminCategory } from "@/lib/admin/data";

export function CategoryForm({ values }: { values: Partial<AdminCategory> }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveCategoryAction, undefined);
  const [image, setImage] = useState(values.image_path ?? "");
  const [deleting, startDelete] = useTransition();
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={values.id ?? ""} />
      <input type="hidden" name="image_path" value={image} />
      <section className={card}>
        <h2 className="font-serif text-xl">Thông tin danh mục</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label><span className={labelCls}>Tên danh mục *</span><input name="name_vi" required defaultValue={values.name_vi ?? ""} className={inputCls} /></label>
          <label><span className={labelCls}>Tên ngắn trên bộ lọc</span><input name="short_name_vi" defaultValue={values.short_name_vi ?? ""} className={inputCls} /></label>
          <label><span className={labelCls}>Đường dẫn</span><input name="slug" defaultValue={values.slug ?? ""} placeholder="tự-tạo-theo-tên" className={inputCls} /></label>
          <label><span className={labelCls}>Thứ tự hiển thị</span><input type="number" min="0" name="sort_order" defaultValue={values.sort_order ?? 0} className={inputCls} /></label>
          <label className="sm:col-span-2"><span className={labelCls}>Mô tả</span><textarea name="description_vi" rows={4} defaultValue={values.description_vi ?? ""} className={inputCls} /></label>
          <label className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3"><input type="checkbox" name="active" defaultChecked={values.active ?? true} className="h-5 w-5 accent-[#f52334]" /><span className="text-sm font-semibold">Hiển thị danh mục trên website</span></label>
        </div>
      </section>
      <section className={card}><h2 className="font-serif text-xl">Ảnh danh mục</h2><div className="mt-5"><ImageInput id="category-image" value={image} onChange={setImage} /></div></section>
      <section className={card}><h2 className="font-serif text-xl">SEO</h2><div className="mt-5 grid gap-5"><label><span className={labelCls}>Tiêu đề SEO</span><input name="seo_title" defaultValue={values.seo_title ?? ""} className={inputCls} /></label><label><span className={labelCls}>Mô tả SEO</span><textarea name="seo_description" rows={3} defaultValue={values.seo_description ?? ""} className={inputCls} /></label></div></section>
      {state?.error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{state.ok}</p>}
      <div className="sticky bottom-3 z-10 flex flex-wrap gap-3 rounded-2xl border border-black/10 bg-white/95 p-4 shadow-lg backdrop-blur"><button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Đang lưu..." : values.id ? "Lưu danh mục" : "Tạo danh mục"}</button>{values.id && <button type="button" disabled={deleting} className={`${btnDanger} ml-auto`} onClick={() => { if (!confirm("Xóa danh mục này? Sản phẩm sẽ không còn liên kết với danh mục.")) return; startDelete(async () => { await deleteCategoryAction(values.id!); router.push("/admin/danh-muc"); }); }}>{deleting ? "Đang xóa..." : "Xóa danh mục"}</button>}</div>
    </form>
  );
}

