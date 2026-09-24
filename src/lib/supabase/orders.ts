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
