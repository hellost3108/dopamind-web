"use server";

import { getGuestOrder as getGuestOrderFromDb, type GuestOrder } from "@/lib/supabase/orders";

export async function lookupGuestOrder(
  orderNumber: string,
  phone: string
): Promise<{ ok: true; order: GuestOrder } | { ok: false; error: string }> {
  return getGuestOrderFromDb(orderNumber, phone);
}
