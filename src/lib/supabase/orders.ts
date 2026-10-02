import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type OrderSummary = Pick<
  Tables<"orders">,
  "id" | "order_number" | "status" | "payment_status" | "total_amount" | "currency" | "created_at"
>;

export async function listMyOrders(): Promise<OrderSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, payment_status, total_amount, currency, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export type OrderDetail = Tables<"orders"> & {
  order_items: Tables<"order_items">[];
  payments: Tables<"payments">[];
};

export async function getMyOrderByNumber(orderNumber: string): Promise<OrderDetail | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), payments(*)")
    .eq("order_number", orderNumber)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

// ---------------------------------------------------------------------------
// Tra cứu đơn của khách vãng lai (mã đơn + số điện thoại, không cần đăng nhập)
// ---------------------------------------------------------------------------

export type GuestOrderItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type GuestOrder = {
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  recipient_name: string;
  phone: string;
  shipping_address_snapshot: {
    address_line_1?: string;
    address_line_2?: string | null;
    ward?: string;
    district?: string;
    province?: string;
  } | null;
  items: GuestOrderItem[];
};

export async function getGuestOrder(
  orderNumber: string,
  phone: string
): Promise<{ ok: true; order: GuestOrder } | { ok: false; error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_guest_order" as never, {
    p_order_number: orderNumber.trim(),
    p_phone: phone.trim(),
  } as never);

  if (error) {
    console.error("get_guest_order RPC failed:", error);
    return { ok: false, error: "Không thể tra cứu lúc này. Vui lòng thử lại sau ít phút." };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return { ok: false, error: "Không tìm thấy đơn hàng. Kiểm tra lại mã đơn và số điện thoại." };
  }

  return { ok: true, order: row as unknown as GuestOrder };
}

// ---------------------------------------------------------------------------
// Tạo đơn hàng
// ---------------------------------------------------------------------------

export type PaymentMethod = "cod" | "bank_transfer";

export type CreateOrderItem = {
  variant_id: string;
  quantity: number;
};

export type GuestInfo = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  ward: string;
  district: string;
  province: string;
};

export type CreateOrderInput = {
  /** Khách đã đăng nhập: bắt buộc. Khách vãng lai: bỏ trống, dùng `guest` thay thế. */
  addressId?: string;
  guest?: GuestInfo;
  paymentMethod: PaymentMethod;
  shippingFee: number;
  items: CreateOrderItem[];
  customerNote?: string;
};

export type CreateOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_order" as never, {
    p_payment_method: input.paymentMethod,
    p_shipping_fee: input.shippingFee,
    p_items: input.items,
    p_customer_note: input.customerNote ?? null,
    p_address_id: input.addressId ?? null,
    p_guest_name: input.guest?.name ?? null,
    p_guest_phone: input.guest?.phone ?? null,
    p_guest_address_line_1: input.guest?.addressLine1 ?? null,
    p_guest_address_line_2: input.guest?.addressLine2 ?? null,
    p_guest_ward: input.guest?.ward ?? null,
    p_guest_district: input.guest?.district ?? null,
    p_guest_province: input.guest?.province ?? null,
  } as never);

  if (error) {
    console.error("create_order RPC failed:", error);
    return { ok: false, error: toVietnameseOrderError(error) };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const orderNumber =
    typeof row === "string"
      ? row
      : (row as unknown as { order_number?: string; id?: string } | null)?.order_number ??
        (row as unknown as { order_number?: string; id?: string } | null)?.id;

  if (!orderNumber) {
    console.error("create_order RPC returned no order identifier:", data);
    return { ok: false, error: "Không nhận được mã đơn hàng từ server." };
  }

  return { ok: true, orderNumber };
}

function toVietnameseOrderError(error: { code?: string; message?: string }): string {
  if (error.code === "P0001" && error.message) {
    return error.message;
  }
  if (error.code === "42501" || error.code === "PGRST301") {
    return "Không thể đặt hàng lúc này. Vui lòng thử lại.";
  }
  return "Không thể đặt hàng lúc này. Vui lòng thử lại sau ít phút.";
}
