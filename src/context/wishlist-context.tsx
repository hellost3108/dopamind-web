"use client";

import { useSyncExternalStore } from "react";
import { createPersistedStore } from "@/lib/persisted-store";

export type WishlistItem = {
  productId: string;
  slug: string;
  nameVi: string;
  price: number;
  imageUrl?: string;
  imageAlt?: string;
};

export type WishlistToggleInput = WishlistItem;

const wishlistStore = createPersistedStore<WishlistItem[]>("dopamind:wishlist:v3", []);
const EMPTY_ITEMS: WishlistItem[] = [];

function toggle(item: WishlistToggleInput) {
  const items = wishlistStore.get();
  const exists = items.some((i) => i.productId === item.productId);

  const next = exists
    ? items.filter((i) => i.productId !== item.productId)
    : [...items, item];

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