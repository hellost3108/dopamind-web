"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin/auth";
import { validateContent } from "@/lib/cms/fields";
import { getSectionDef } from "@/lib/cms/sections";
import type { SectionContent } from "@/lib/cms/types";
import { untyped } from "@/lib/cms/untyped";
import { createClient } from "@/lib/supabase/server";

export type SaveResult =
  | { ok: true; message: string; content: SectionContent; savedAt: string }
  | { ok: false; error: string };

export type ResetResult = { ok: true; message: string } | { ok: false; error: string };

const KEEP_VERSIONS = 20;

function dbError(error: { code?: string; message?: string }): string {
  console.error("Admin CMS DB error:", error);
  if (error.code === "42P01" || error.code === "PGRST205") {
    return "Chưa tạo bảng nội dung trong Supabase. Hãy chạy file supabase/migrations/20261002090000_site_cms.sql trong SQL Editor rồi thử lại.";
  }
  if (error.code === "42501") {
    return "Không đủ quyền. Hãy kiểm tra tài khoản đã được cấp quyền admin trong Supabase chưa.";
  }
  return "Có lỗi khi lưu dữ liệu. Vui lòng thử lại.";
}

function refreshSite() {
  // Làm mới toàn bộ website (đang cache 60 giây) để nội dung mới hiện ngay.
  revalidatePath("/", "layout");
}

export async function saveSectionAction(key: string, input: unknown): Promise<SaveResult> {
  // Server Action là endpoint công khai -> luôn kiểm tra quyền ở đây.
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: "Bạn không có quyền thực hiện thao tác này." };

  const def = getSectionDef(key);
  if (!def) return { ok: false, error: "Khối nội dung này không tồn tại." };

  const checked = validateContent(def, input);
  if (!checked.ok) return { ok: false, error: checked.error };

  const supabase = untyped(await createClient());
  const savedAt = new Date().toISOString();

  const { error } = await supabase
    .from("site_sections")
    .upsert(
      { key, content: checked.value, updated_at: savedAt, updated_by: admin.id },
      { onConflict: "key" },
    );
  if (error) return { ok: false, error: dbError(error) };

  // Lịch sử phiên bản: lỗi ở đây không làm hỏng việc lưu chính.
  const { error: versionError } = await supabase
    .from("site_section_versions")
    .insert({ section_key: key, content: checked.value, saved_at: savedAt, saved_by: admin.id });
  if (versionError) {
    console.error("Admin CMS: không lưu được lịch sử", versionError);
  } else {
    const { data: old } = await supabase
      .from("site_section_versions")
      .select("id")
      .eq("section_key", key)
      .order("id", { ascending: false })
      .range(KEEP_VERSIONS, KEEP_VERSIONS + 200);
    const ids = (old ?? []).map((r) => r.id as number);
    if (ids.length) await supabase.from("site_section_versions").delete().in("id", ids);
  }

  refreshSite();
  return {
    ok: true,
    message: "Đã lưu. Website đã được cập nhật.",
    content: checked.value,
    savedAt,
  };
}

/** Xóa nội dung đã chỉnh -> website quay về nội dung gốc trong code. */
export async function resetSectionAction(key: string): Promise<ResetResult> {
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: "Bạn không có quyền thực hiện thao tác này." };
  if (!getSectionDef(key)) return { ok: false, error: "Khối nội dung này không tồn tại." };

  const supabase = untyped(await createClient());
  const { error } = await supabase.from("site_sections").delete().eq("key", key);
  if (error) return { ok: false, error: dbError(error) };

  refreshSite();
  return { ok: true, message: "Đã khôi phục nội dung gốc. Website đã được cập nhật." };
}
