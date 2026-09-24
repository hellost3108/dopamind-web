"use server";

import { createClient } from "@/lib/supabase/server";

export type GuestCartLine = { slug: string; quantity: number };

/**
 * Best-effort merge of guest (localStorage) cart/wishlist selections into
 * the authenticated customer's Supabase rows, called once right after
 * login/signup. Only ever touches rows that can be matched to a real,
 * active catalog product by slug — an unmatched guest item (today, that's
 * effectively all of them: the guest cart/wishlist run on Phase 1 sample
 * data with slugs that don't exist in the real catalog yet) is left alone
 * in localStorage rather than turned into a fabricated relationship. Never
 * throws — a failed merge should never block login.
 */
export async function mergeGuestData(
  cartLines: GuestCartLine[],
  wishlistSlugs: string[],
): Promise<{ cartMerged: number; wishlistMerged: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { cartMerged: 0, wishlistMerged: 0 };

  const [wishlistMerged, cartMerged] = await Promise.all([
    mergeWishlist(supabase, user.id, wishlistSlugs),
    mergeCart(supabase, user.id, cartLines),
  ]);

  return { cartMerged, wishlistMerged };
}

async function mergeWishlist(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  slugs: string[],
): Promise<number> {
  if (slugs.length === 0) return 0;

  const { data: products, error } = await supabase
    .from("products")
    .select("id")
    .eq("status", "active")
    .in("slug", slugs);
  if (error || !products || products.length === 0) return 0;

  const rows = products.map((p) => ({ user_id: userId, product_id: p.id }));
  const { error: upsertError } = await supabase
    .from("wishlist_items")
    .upsert(rows, { onConflict: "user_id,product_id", ignoreDuplicates: true });

  return upsertError ? 0 : rows.length;
}

async function mergeCart(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  lines: GuestCartLine[],
): Promise<number> {
  if (lines.length === 0) return 0;

  const slugs = lines.map((l) => l.slug);
  const { data: products, error } = await supabase
    .from("products")
    .select("slug, product_variants(id, active, sort_order)")
    .eq("status", "active")
    .in("slug", slugs);
  if (error || !products || products.length === 0) return 0;

  const variantBySlug = new Map<string, string>();
  for (const product of products) {
    const activeVariants = (product.product_variants ?? [])
      .filter((v) => v.active)
      .sort((a, b) => a.sort_order - b.sort_order);
    if (activeVariants[0]) variantBySlug.set(product.slug, activeVariants[0].id);
  }
  if (variantBySlug.size === 0) return 0;

  let { data: cart } = await supabase.from("carts").select("id").eq("user_id", userId).maybeSingle();
  if (!cart) {
    const { data: newCart, error: cartError } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();
    if (cartError || !newCart) return 0;
    cart = newCart;
  }

  const variantIds = [...variantBySlug.values()];
  const { data: existingItems } = await supabase
    .from("cart_items")
    .select("variant_id, quantity")
    .eq("cart_id", cart.id)
    .in("variant_id", variantIds);
  const existingQuantity = new Map((existingItems ?? []).map((i) => [i.variant_id, i.quantity]));

  const rows = lines
    .map((line) => {
      const variantId = variantBySlug.get(line.slug);
      if (!variantId) return null;
      const guestQuantity = Math.max(1, Math.floor(line.quantity) || 1);
      const merged = (existingQuantity.get(variantId) ?? 0) + guestQuantity;
      return { cart_id: cart.id, variant_id: variantId, quantity: merged };
    })
    .filter((row): row is { cart_id: string; variant_id: string; quantity: number } => row !== null);

  if (rows.length === 0) return 0;

  const { error: upsertError } = await supabase
    .from("cart_items")
    .upsert(rows, { onConflict: "cart_id,variant_id" });

  return upsertError ? 0 : rows.length;
}
