import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type OrderSummary = Pick<
  Tables<"orders">,
  "id" | "order_number" | "status" | "payment_status" | "total_amount" | "currency" | "created_at"
>;

/** RLS already scopes this to the caller's own orders — the .eq is defense in depth, not the only guard. */
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

/**
 * Looks up an order by its public order_number, scoped to the caller. Never
 * loads an order purely because the caller knows its number — RLS enforces
 * user_id = auth.uid() at the database level, and the explicit .eq below is
 * a second, redundant guard against ever accidentally using a service-role
 * client here in the future.
 */
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
// Tạo đơn hàng
// ---------------------------------------------------------------------------

export type PaymentMethod = "cod" | "bank_transfer";

export type CreateOrderItem = {
  variant_id: string;
  quantity: number;
};

export type CreateOrderInput = {
  addressId: string;
  paymentMethod: PaymentMethod;
  shippingFee: number;
  items: CreateOrderItem[];
  customerNote?: string;
};

export type CreateOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

/**
 * Calls the `create_order` Postgres RPC (owned by backend):
 *   create_order(p_address_id uuid, p_payment_method text,
 *                p_shipping_fee numeric, p_items jsonb,
 *                p_customer_note text DEFAULT NULL)
 *
 * The RPC re-checks auth.uid() and address ownership server-side, and is
 * assumed to re-price items from product_variants itself — this function
 * never sends CartLine.price, only variant_id + quantity.
 *
 * There's a separate `generate_order_number()` function in the schema, which
 * suggests `order_number` (not the raw uuid `id`) is the public-facing
 * identifier — the same one `getMyOrderByNumber` above looks up by. This
 * function returns that. If testing shows the RPC actually returns the raw
 * `id` instead, swap `orderNumber` below for `data.id`.
 *
 * ASSUMPTION to verify: p_items shape is [{ variant_id, quantity }, ...].
 * If orders come back wrong, check the real shape with:
 *   select pg_get_functiondef('create_order'::regproc);
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_order", {
    p_address_id: input.addressId,
    p_payment_method: input.paymentMethod,
    p_shipping_fee: input.shippingFee,
    p_items: input.items,
    p_customer_note: input.customerNote ?? null,
  });

  if (error) {
    console.error("create_order RPC failed:", error);
    return { ok: false, error: error.message };
  }

    // RETURNS TABLE(...) trong Postgres luôn trả về MẢNG các dòng, kể cả khi
  // chỉ có 1 dòng — nên phải lấy data[0] trước khi đọc order_number.
  const row = Array.isArray(data) ? data[0] : data;
  const orderNumber =
    typeof row === "string"
      ? row
      : (row as { order_number?: string; id?: string } | null)?.order_number ??
        (row as { order_number?: string; id?: string } | null)?.id;

  if (!orderNumber) {
    console.error("create_order RPC returned no order identifier:", data);
    return { ok: false, error: "Không nhận được mã đơn hàng từ server." };
  }

  return { ok: true, orderNumber };
}
