"use server";

import { validateContent } from "@/lib/cms/fields";
import { getSectionDef } from "@/lib/cms/sections";

/** Kiểm tra dữ liệu bản thử trên máy chủ, không lưu hoặc gọi Supabase. */
export async function previewHomeSection(key: string, values: unknown) {
  const def = getSectionDef(key);
  if (!def || def.group !== "home") return { ok: false as const, error: "Khối thử không hợp lệ." };
  const checked = validateContent(def, values);
  if (!checked.ok) return checked;
  return { ok: true as const, content: checked.value };
}
