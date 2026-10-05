"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export type CategoryFormState = { error?: string; ok?: string } | undefined;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function text(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugify(input: string) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function refresh() {
  revalidatePath("/admin/danh-muc");
  revalidatePath("/admin/san-pham", "layout");
  revalidatePath("/san-pham", "layout");
}

export async function saveCategoryAction(_state: CategoryFormState, data: FormData): Promise<CategoryFormState> {
  await assertAdmin();
  const supabase = await createClient();
  const idRaw = text(data, "id");
  const id = UUID_RE.test(idRaw) ? idRaw : "";
  const name = text(data, "name_vi");
  const slug = slugify(text(data, "slug") || name);
  if (name.length < 2) return { error: "Vui lòng nhập tên danh mục." };
  if (!slug) return { error: "Đường dẫn danh mục không hợp lệ." };

  const fields = {
    name_vi: name.slice(0, 140),
    short_name_vi: text(data, "short_name_vi").slice(0, 80) || null,
    slug,
    description_vi: text(data, "description_vi").slice(0, 1200) || null,
    image_path: text(data, "image_path").slice(0, 700) || null,
    sort_order: Math.max(0, Number(text(data, "sort_order") || "0") || 0),
    active: data.get("active") === "on",
    seo_title: text(data, "seo_title").slice(0, 120) || null,
    seo_description: text(data, "seo_description").slice(0, 300) || null,
  };

  const result = id
    ? await supabase.from("categories").update(fields).eq("id", id)
    : await supabase.from("categories").insert(fields).select("id").single();
  if (result.error) {
    console.error("Lưu danh mục lỗi:", result.error);
    if (result.error.code === "23505") return { error: "Đường dẫn này đã được dùng cho danh mục khác." };
    if (result.error.code === "42501") return { error: "Chưa có quyền sửa danh mục. Hãy chạy migration Content Studio trong Supabase." };
    return { error: "Không lưu được danh mục. Vui lòng thử lại." };
  }
  refresh();
  if (!id) {
    const created = result.data as { id: string } | null;
    if (!created?.id) return { error: "Danh mục đã lưu nhưng không đọc được mã bản ghi. Hãy tải lại danh sách." };
    redirect(`/admin/danh-muc/${created.id}`);
  }
  return { ok: "Đã lưu danh mục và cập nhật trang sản phẩm." };
}

export async function deleteCategoryAction(id: string) {
  await assertAdmin();
  if (!UUID_RE.test(id)) return { ok: false, error: "Danh mục không hợp lệ." };
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: "Không xóa được danh mục. Có thể danh mục vẫn đang được dùng." };
  refresh();
  redirect("/admin/danh-muc");
}

