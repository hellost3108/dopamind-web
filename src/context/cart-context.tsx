"use client";

import { useSyncExternalStore } from "react";
import { createPersistedStore } from "@/lib/persisted-store";
import type { MoodSlug } from "@/lib/types";

export type CartLine = {
  productId: string;
  variantId: string;
  slug: string;
  nameVi: string;
  mood: MoodSlug;
  price: number;
  quantity: number;
};

/** Dữ liệu tối thiểu cần để thêm 1 sản phẩm thật vào giỏ. */
export type AddToCartInput = {
  productId: string;
  variantId: string;
  slug: string;
  nameVi: string;
  mood: MoodSlug;
  price: number;
  /** Nếu có, giới hạn số lượng thêm vào không vượt quá tồn kho. */
  stockQuantity?: number;
};

const cartStore = createPersistedStore<CartLine[]>("dopamind:cart:v2", []);
const EMPTY_LINES: CartLine[] = [];

function addItem(item: AddToCartInput, quantity = 1) {
  if (!item.variantId) {
    console.error("Thiếu variantId, không thể thêm vào giỏ:", item);
    return;
  }

  const lines = cartStore.get();
  const existing = lines.find((line) => line.variantId === item.variantId);
  const cap = item.stockQuantity;

  const next = existing
    ? lines.map((line) =>
        line.variantId === item.variantId
          ? {
              ...line,
              quantity:
                cap != null
                  ? Math.min(line.quantity + quantity, cap)
                  : line.quantity + quantity,
            }
          : line
      )
    : [
        ...lines,
        {
          productId: item.productId,
          variantId: item.variantId,
          slug: item.slug,
          nameVi: item.nameVi,
          mood: item.mood,
          price: item.price,
          quantity: cap != null ? Math.min(quantity, cap) : quantity,
        },
      ];

  cartStore.set(next);
}

function removeItem(variantId: string) {
  cartStore.set(cartStore.get().filter((line) => line.variantId !== variantId));
}

/**
 * Reads the current quantity from the store (not from a component's render
 * closure) before applying `delta`, so rapid clicks each apply against the
 * latest value instead of racing on a stale `line.quantity`.
 */
function adjustQuantity(variantId: string, delta: number) {
  const lines = cartStore.get();
  const line = lines.find((l) => l.variantId === variantId);
  if (!line) return;

  const nextQuantity = line.quantity + delta;
  const next =
    nextQuantity <= 0
      ? lines.filter((l) => l.variantId !== variantId)
      : lines.map((l) =>
          l.variantId === variantId ? { ...l, quantity: nextQuantity } : l
        );
  cartStore.set(next);
}

function clear() {
  cartStore.set([]);
}

export function useCart() {
  const lines = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.get,
    () => EMPTY_LINES
  );

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return { lines, itemCount, subtotal, addItem, removeItem, adjustQuantity, clear };
}