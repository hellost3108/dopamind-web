"use server";

import { getUser } from "@/lib/supabase/dal";
import { createOrder, type PaymentMethod, type GuestInfo } from "@/lib/supabase/orders";
import { SHIPPING_FEE } from "@/lib/checkout";

export type PlaceOrderState = {
  error?: string;
  orderNumber?: string;
};

const PHONE_RE = /^(0|\+84)[0-9]{9,10}$/;

export async function placeOrder(
  _prevState: PlaceOrderState,
  formData: FormData
): Promise<PlaceOrderState> {
  // Không bắt buộc đăng nhập nữa. Nếu có phiên đăng nhập hợp lệ thì dùng luồng
  // địa chỉ đã lưu, nếu không thì dùng thông tin khách vãng lai nhập tay.
  const user = await getUser();

  const paymentMethod = formData.get("paymentMethod");
  const itemsRaw = formData.get("items");
  const customerNote = formData.get("customerNote");

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

  let addressId: string | undefined;
  let guest: GuestInfo | undefined;

  if (user) {
    const addressIdRaw = formData.get("addressId");
    if (typeof addressIdRaw !== "string" || !addressIdRaw) {
      return { error: "Vui lòng chọn địa chỉ giao hàng." };
    }
    addressId = addressIdRaw;
  } else {
    const name = String(formData.get("guestName") ?? "").trim();
    const phone = String(formData.get("guestPhone") ?? "").trim();
    const addressLine1 = String(formData.get("guestAddressLine1") ?? "").trim();
    const addressLine2 = String(formData.get("guestAddressLine2") ?? "").trim();
    const ward = String(formData.get("guestWard") ?? "").trim();
    const district = String(formData.get("guestDistrict") ?? "").trim();
    const province = String(formData.get("guestProvince") ?? "").trim();

    if (!name) return { error: "Vui lòng nhập họ tên người nhận." };
    if (!PHONE_RE.test(phone)) return { error: "Số điện thoại không hợp lệ." };
    if (!addressLine1) return { error: "Vui lòng nhập địa chỉ chi tiết." };
    if (!ward) return { error: "Vui lòng nhập phường/xã." };
    if (!district) return { error: "Vui lòng nhập quận/huyện." };
    if (!province) return { error: "Vui lòng nhập tỉnh/thành phố." };

    guest = { name, phone, addressLine1, addressLine2: addressLine2 || undefined, ward, district, province };
  }

  const result = await createOrder({
    addressId,
    guest,
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
