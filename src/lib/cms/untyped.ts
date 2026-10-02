import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Bảng site_sections / site_section_versions chưa có trong database.types.ts
 * (file đó do `supabase gen types` sinh ra). Dùng client không gắn kiểu cho 2 bảng này.
 * Sau khi chạy migration, có thể sinh lại database.types.ts rồi bỏ hàm này.
 */
export function untyped(client: unknown): SupabaseClient {
  return client as SupabaseClient;
}
