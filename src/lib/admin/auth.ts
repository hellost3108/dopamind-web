import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Kiểm tra tài khoản hiện tại có phải admin không (hàm SQL is_admin()).
 * Cache theo từng request để layout + page không hỏi lại nhiều lần.
 */
export const getAdminUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || isAdmin !== true) return null;
  return user;
});

/**
 * Dùng trong layout/page của /admin.
 * - Chưa đăng nhập -> chuyển tới trang đăng nhập rồi quay lại /admin.
 * - Đã đăng nhập nhưng không phải admin -> 404 (không để lộ trang tồn tại).
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/tai-khoan?redirect=${encodeURIComponent("/admin")}`);

  const admin = await getAdminUser();
  if (!admin) notFound();
  return admin;
}

/**
 * Dùng ĐẦU MỖI Server Action của admin. Server Action là endpoint công khai,
 * nên không được tin vào việc layout đã chặn — luôn kiểm tra lại ở đây.
 */
export async function assertAdmin(): Promise<void> {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Bạn không có quyền thực hiện thao tác này.");
}
