import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { getSectionDef } from "@/lib/cms/sections";
import { resolveContent } from "@/lib/cms/fields";
import type { SectionContent } from "@/lib/cms/types";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase-env";

/**
 * Đọc nội dung khối CMS cho website công khai.
 *  - Dùng client ẩn danh (không cookie) -> trang vẫn cache được như trước.
 *  - Kết quả cache 60 giây, và admin bấm Lưu sẽ làm mới ngay (revalidatePath).
 *  - Bảng chưa tạo / Supabase lỗi / chưa có dữ liệu -> trả về nội dung gốc, website không bao giờ vỡ.
 *  - Mỗi request chỉ hỏi database 1 lần cho tất cả khối (React cache).
 */
const loadAllSections = cache(async (): Promise<Record<string, unknown>> => {
  try {
    const client = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
      },
    });
    const { data, error } = await client.from("site_sections").select("key, content");
    if (error || !data) return {};
    return Object.fromEntries(data.map((row) => [row.key as string, row.content as unknown]));
  } catch (error) {
    console.error("CMS: không đọc được site_sections, dùng nội dung gốc.", error);
    return {};
  }
});

export async function getSection(key: string): Promise<SectionContent> {
  const def = getSectionDef(key);
  if (!def) throw new Error(`CMS: chưa định nghĩa khối "${key}" trong src/lib/cms/sections.ts`);
  const all = await loadAllSections();
  return resolveContent(def, all[key]);
}
