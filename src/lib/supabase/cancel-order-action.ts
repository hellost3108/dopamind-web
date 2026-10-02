"use server";

import { createClient } from "@/lib/supabase/server";

export type CancelOrderResult =
  | { ok: true; needsRefund: boolean }
  | { ok: false; error: string };

/**
 * Hủy đơn hàng.
 * - Khách đã đăng nhập: chỉ cần mã đơn.
 * - Khách vãng lai: cần thêm số điện thoại đã đặt hàng.
 * Quyền hủy được kiểm tra hoàn toàn trong hàm SQL `cancel_order`.
 */
export async function cancelOrderAction(
  orderNumber: string,
  reason: string,
  phone?: string
): Promise<CancelOrderResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("cancel_order" as never, {
    p_order_number: orderNumber.trim(),
    p_reason: reason.trim() || null,
    p_phone: phone?.trim() || null,
  } as never);

  if (error) {
    console.error("cancel_order RPC failed:", error);
    if (error.code === "P0001" && error.message) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Không thể hủy đơn lúc này. Vui lòng thử lại sau ít phút." };
  }

  const row = data as unknown as { needs_refund?: boolean } | null;
  return { ok: true, needsRefund: !!row?.needs_refund };
}
