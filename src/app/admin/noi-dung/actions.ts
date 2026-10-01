"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { assertAdmin } from "@/lib/admin/auth";
import { SECTIONS } from "@/lib/site-content-schema";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseUrl } from "@/lib/supabase-env";

export type SaveState = { error?: string; ok?: string } | undefined;

const LINK_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;

export async function saveSectionAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Bạn không có quyền thực hiện thao tác này." };
  }

  const sectionId = formData.get("sectionId");
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return { error: "Không tìm thấy khu vực cần lưu." };

  const rows: { key: string; value: string; updated_at: string }[] = [];
  const resetKeys: string[] = [];
  const now = new Date().toISOString();

  for (const field of section.fields) {
    const raw = formData.get(field.key);
    const value = typeof raw === "string" ? raw.trim() : "";

    // Ô bắt buộc mà để trống -> quay về nội dung mặc định.
    if (value === "" && !field.optional) {
      resetKeys.push(field.key);
      continue;
    }

    if (value.length > (field.type === "textarea" ? 1000 : 400)) {
      return { error: `“${field.label}” quá dài.` };
    }
    if (field.type === "link" && value !== "" && !LINK_RE.test(value)) {
      return { error: `“${field.label}” phải bắt đầu bằng /, https:// hoặc #.` };
    }
    if (field.type === "image" && !(value.startsWith("/") || value.startsWith(`${getSupabaseUrl()}/storage/v1/object/public/`))) {
      return { error: `“${field.label}”: ảnh không hợp lệ. Hãy tải ảnh lên bằng nút bên dưới.` };
    }
    rows.push({ key: field.key, value, updated_at: now });
  }

  const supabase = (await createClient()) as unknown as SupabaseClient;

  if (rows.length > 0) {
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
    if (error) {
      console.error("Lưu site_content lỗi:", error);
      return {
        error:
          error.code === "42501"
            ? "Không đủ quyền. Hãy chắc bạn đã chạy file SQL site_content và đang đăng nhập tài khoản admin."
            : error.code === "42P01"
              ? "Chưa có bảng site_content. Hãy chạy file SQL 20261001120000_site_content.sql trong Supabase."
              : "Có lỗi khi lưu. Vui lòng thử lại.",
      };
    }
  }
  if (resetKeys.length > 0) {
    const { error } = await supabase.from("site_content").delete().in("key", resetKeys);
    if (error) console.error("Xóa site_content lỗi:", error);
  }

  revalidatePath("/", "layout");
  return { ok: "Đã lưu. Trang web đã cập nhật." };
}
