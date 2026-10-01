import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { DEFAULTS } from "@/lib/site-content-schema";

/**
 * Đọc nội dung trang web đã sửa trong admin. Ô nào chưa sửa (hoặc database lỗi)
 * thì dùng giá trị mặc định, nên web không bao giờ bị trống.
 */
export const getSiteContent = cache(async (): Promise<Record<string, string>> => {
  const content: Record<string, string> = { ...DEFAULTS };
  try {
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) return content;
    for (const row of data as { key: string; value: string }[]) {
      if (row.key in DEFAULTS && typeof row.value === "string") content[row.key] = row.value;
    }
  } catch (e) {
    console.error("Không đọc được site_content:", e);
  }
  return content;
});
