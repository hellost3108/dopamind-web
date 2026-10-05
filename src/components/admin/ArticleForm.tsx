"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteArticleAction, saveArticleAction } from "@/app/admin/bai-viet/actions";
import { ImageInput } from "@/components/admin/cms/ImageInput";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { btnDanger, btnPrimary, card, inputCls, labelCls } from "@/components/admin/ui";
import type { Article, ArticleStatus } from "@/lib/articles";

type Values = Partial<Article> & { status: ArticleStatus };

function toLocalDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function ArticleForm({ values }: { values: Values }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveArticleAction, undefined);
  const [deleting, startDelete] = useTransition();
  const [image, setImage] = useState(values.image_url ?? "");
  const [content, setContent] = useState(values.content_markdown ?? "");

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={values.id ?? ""} />
      <input type="hidden" name="image_url" value={image} />
      <input type="hidden" name="content_markdown" value={content} />

      <section className={card}>
        <h2 className="font-serif text-xl">Nội dung bài viết</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className={labelCls}>Tiêu đề *</span><input name="title" required defaultValue={values.title ?? ""} className={inputCls} /></label>
          <label><span className={labelCls}>Đường dẫn</span><input name="slug" defaultValue={values.slug ?? ""} placeholder="tự-tạo-theo-tiêu-đề" className={inputCls} /></label>
          <label><span className={labelCls}>Chủ đề</span><input name="category" defaultValue={values.category ?? "Cảm hứng"} list="article-categories" className={inputCls} /><datalist id="article-categories"><option value="Skin Science" /><option value="Mind Reset" /><option value="Mask Technology" /><option value="Rituals" /><option value="Cảm hứng" /></datalist></label>
          <label className="sm:col-span-2"><span className={labelCls}>Mô tả ngắn</span><textarea name="excerpt" rows={3} defaultValue={values.excerpt ?? ""} className={inputCls} /></label>
          <div className="sm:col-span-2"><span className={labelCls}>Nội dung chi tiết</span><MarkdownEditor value={content} onChange={setContent} /></div>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-serif text-xl">Ảnh đại diện</h2>
        <div className="mt-5"><ImageInput id="article-image" value={image} onChange={setImage} /></div>
        <label className="mt-4 block"><span className={labelCls}>Mô tả ảnh</span><input name="image_alt" defaultValue={values.image_alt ?? ""} className={inputCls} /></label>
      </section>

      <section className={card}>
        <h2 className="font-serif text-xl">Xuất bản và SEO</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label><span className={labelCls}>Trạng thái</span><select name="status" defaultValue={values.status} className={inputCls}><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option><option value="archived">Lưu trữ</option></select></label>
          <label><span className={labelCls}>Ngày xuất bản</span><input type="datetime-local" name="published_at" defaultValue={toLocalDate(values.published_at)} className={inputCls} /></label>
          <label><span className={labelCls}>Tác giả</span><input name="author" defaultValue={values.author ?? "DOPAMIND"} className={inputCls} /></label>
          <label><span className={labelCls}>Thời gian đọc (phút)</span><input type="number" min="1" max="120" name="reading_time" defaultValue={values.reading_time ?? 5} className={inputCls} /></label>
          <label><span className={labelCls}>Thứ tự ưu tiên</span><input type="number" min="0" name="sort_order" defaultValue={values.sort_order ?? 0} className={inputCls} /></label>
          <label className="flex items-center gap-3 self-end rounded-xl border border-black/10 px-4 py-3"><input type="checkbox" name="featured" defaultChecked={values.featured ?? false} className="h-5 w-5 accent-[#f52334]" /><span className="text-sm font-semibold">Bài viết nổi bật</span></label>
          <label className="sm:col-span-2"><span className={labelCls}>Tiêu đề SEO</span><input name="seo_title" defaultValue={values.seo_title ?? ""} className={inputCls} /></label>
          <label className="sm:col-span-2"><span className={labelCls}>Mô tả SEO</span><textarea name="seo_description" rows={3} defaultValue={values.seo_description ?? ""} className={inputCls} /></label>
        </div>
      </section>

      {state?.error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{state.ok}</p>}

      <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-black/10 bg-white/95 p-4 shadow-lg backdrop-blur">
        <button type="submit" disabled={pending} className={btnPrimary}>{pending ? "Đang lưu..." : values.id ? "Lưu bài viết" : "Tạo bài viết"}</button>
        {values.id && <button type="button" disabled={deleting} className={`${btnDanger} ml-auto`} onClick={() => { if (!confirm("Xóa vĩnh viễn bài viết này?")) return; startDelete(async () => { await deleteArticleAction(values.id!); router.push("/admin/bai-viet"); }); }}>{deleting ? "Đang xóa..." : "Xóa bài viết"}</button>}
      </div>
    </form>
  );
}

