"use client";

import { useSyncExternalStore } from "react";
import { createPersistedStore } from "@/lib/persisted-store";
import type { Product, WishlistItem } from "@/lib/types";

const wishlistStore = createPersistedStore<WishlistItem[]>("dopamind:wishlist", []);
const EMPTY_ITEMS: WishlistItem[] = [];

function toggle(product: Product) {
  const items = wishlistStore.get();
  const exists = items.some((item) => item.productId === product.id);

  const next = exists
    ? items.filter((item) => item.productId !== product.id)
    : [
        ...items,
        {
          productId: product.id,
          slug: product.slug,
          nameVi: product.nameVi,
          mood: product.mood,
          price: product.price,
        },
      ];

  wishlistStore.set(next);
}

export function useWishlist() {
  const items = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.get,
    () => EMPTY_ITEMS
  );

  return {
    items,
    count: items.length,
    isInWishlist: (productId: string) =>
      items.some((item) => item.productId === productId),
    toggle,
  };
}
