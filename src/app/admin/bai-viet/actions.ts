"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/admin/auth";
import { untyped } from "@/lib/cms/untyped";
import { createClient } from "@/lib/supabase/server";

export type ArticleFormState = { error?: string; ok?: string } | undefined;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUSES = ["draft", "published", "archived"];

function text(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function refresh() {
  revalidatePath("/admin/bai-viet");
  revalidatePath("/bai-viet", "layout");
}

export async function saveArticleAction(_state: ArticleFormState, data: FormData): Promise<ArticleFormState> {
  await assertAdmin();
  const db = untyped(await createClient());
  const idRaw = text(data, "id");
  const id = UUID_RE.test(idRaw) ? idRaw : "";
  const title = text(data, "title");
  const slug = slugify(text(data, "slug") || title);
  const status = text(data, "status");
  const readingTime = Number(text(data, "reading_time") || "5");

  if (title.length < 3) return { error: "Vui lòng nhập tiêu đề bài viết." };
  if (!slug) return { error: "Đường dẫn bài viết không hợp lệ." };
  if (!STATUSES.includes(status)) return { error: "Trạng thái bài viết không hợp lệ." };
  if (!Number.isInteger(readingTime) || readingTime < 1 || readingTime > 120) {
    return { error: "Thời gian đọc phải từ 1 đến 120 phút." };
  }

  const now = new Date().toISOString();
  const fields = {
    title: title.slice(0, 200),
    slug,
    excerpt: text(data, "excerpt").slice(0, 600) || null,
    content_markdown: text(data, "content_markdown").slice(0, 50000),
    category: text(data, "category").slice(0, 80) || "Cảm hứng",
    author: text(data, "author").slice(0, 100) || null,
    image_url: text(data, "image_url").slice(0, 700) || null,
    image_alt: text(data, "image_alt").slice(0, 240) || null,
    reading_time: readingTime,
    status,
    featured: data.get("featured") === "on",
    sort_order: Math.max(0, Number(text(data, "sort_order") || "0") || 0),
    seo_title: text(data, "seo_title").slice(0, 120) || null,
    seo_description: text(data, "seo_description").slice(0, 300) || null,
    published_at: status === "published" ? text(data, "published_at") || now : null,
  };

  const result = id
    ? await db.from("articles").update(fields).eq("id", id)
    : await db.from("articles").insert(fields).select("id").single();

  if (result.error) {
    console.error("Lưu bài viết lỗi:", result.error);
    if (result.error.code === "23505") return { error: "Đường dẫn này đã được dùng cho bài viết khác." };
    if (result.error.code === "42P01" || result.error.code === "PGRST205") {
      return { error: "Chưa có bảng bài viết. Hãy chạy migration Content Studio trong Supabase trước." };
    }
    return { error: "Không lưu được bài viết. Vui lòng thử lại." };
  }

  refresh();
  if (!id) {
    const created = result.data as { id: string } | null;
    if (!created?.id) return { error: "Bài viết đã lưu nhưng không đọc được mã bản ghi. Hãy tải lại danh sách." };
    redirect(`/admin/bai-viet/${created.id}`);
  }
  return { ok: "Đã lưu bài viết và cập nhật website." };
}

export async function deleteArticleAction(id: string) {
  await assertAdmin();
  if (!UUID_RE.test(id)) return { ok: false, error: "Bài viết không hợp lệ." };
  const db = untyped(await createClient());
  const { error } = await db.from("articles").delete().eq("id", id);
  if (error) return { ok: false, error: "Không xóa được bài viết." };
  refresh();
  redirect("/admin/bai-viet");
}

