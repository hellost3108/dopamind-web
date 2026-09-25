"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { createOrder, type PaymentMethod } from "@/lib/supabase/orders";
import { SHIPPING_FEE } from "@/lib/checkout";

export type PlaceOrderState = {
  error?: string;
  orderNumber?: string;
};

export async function placeOrder(
  _prevState: PlaceOrderState,
  formData: FormData
): Promise<PlaceOrderState> {
  // Re-checks auth on the server; never trust the client's session state.
  await requireUser("/thanh-toan");

  const addressId = formData.get("addressId");
  const paymentMethod = formData.get("paymentMethod");
  const itemsRaw = formData.get("items");
  const customerNote = formData.get("customerNote");

  if (typeof addressId !== "string" || !addressId) {
    return { error: "Vui lòng chọn địa chỉ giao hàng." };
  }
  if (paymentMethod !== "cod" && paymentMethod !== "bank_transfer") {
    return { error: "Vui lòng chọn phương thức thanh toán." };
  }
  if (typeof itemsRaw !== "string" || !itemsRaw) {
    return { error: "Giỏ hàng đang trống." };
  }

  let items: { variant_id: string; quantity: number }[];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    return { error: "Dữ liệu giỏ hàng không hợp lệ." };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Giỏ hàng đang trống." };
  }

   const result = await createOrder({
    addressId,
    paymentMethod: paymentMethod as PaymentMethod,
    shippingFee: SHIPPING_FEE,
    items,
    customerNote: typeof customerNote === "string" && customerNote.trim() ? customerNote : undefined,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  return { orderNumber: result.orderNumber };
}