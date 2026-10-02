import "server-only";
import { createClient } from "@/lib/supabase/server";
import { untyped } from "@/lib/cms/untyped";
import { formatDateTime } from "@/lib/admin/format";

export type StoredSection = { content: unknown; updatedAt: string };
export type SectionVersion = { id: number; savedLabel: string; content: unknown };

type DbError = { code?: string; message?: string } | null;

/** Bảng chưa được tạo (chưa chạy file SQL). */
export function isMissingTable(error: DbError): boolean {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /site_section/i.test(error.message ?? "")
  );
}

/** Mọi khối đã được lưu trong database (khối chưa có hàng = đang dùng nội dung gốc). */
export async function getStoredSections(): Promise<{
  rows: Record<string, StoredSection>;
  tableMissing: boolean;
}> {
  const supabase = untyped(await createClient());
  const { data, error } = await supabase.from("site_sections").select("key, content, updated_at");
  if (error) {
    if (!isMissingTable(error)) console.error("Admin CMS: lỗi đọc site_sections", error);
    return { rows: {}, tableMissing: isMissingTable(error) };
  }
  const rows: Record<string, StoredSection> = {};
  for (const r of data ?? []) {
    rows[r.key as string] = { content: r.content as unknown, updatedAt: r.updated_at as string };
  }
  return { rows, tableMissing: false };
}

/** 20 lần lưu gần nhất của 1 khối. */
export async function getSectionVersions(key: string): Promise<SectionVersion[]> {
  const supabase = untyped(await createClient());
  const { data, error } = await supabase
    .from("site_section_versions")
    .select("id, content, saved_at")
    .eq("section_key", key)
    .order("id", { ascending: false })
    .limit(20);
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id as number,
    savedLabel: formatDateTime(r.saved_at as string),
    content: r.content as unknown,
  }));
}
