"use client";

import { useSyncExternalStore } from "react";
import { createPersistedStore } from "@/lib/persisted-store";
import type { CartLine, Product } from "@/lib/types";

const cartStore = createPersistedStore<CartLine[]>("dopamind:cart", []);
const EMPTY_LINES: CartLine[] = [];

function addItem(product: Product, quantity = 1) {
  const lines = cartStore.get();
  const existing = lines.find((line) => line.productId === product.id);

  const next = existing
    ? lines.map((line) =>
        line.productId === product.id
          ? { ...line, quantity: line.quantity + quantity }
          : line
      )
    : [
        ...lines,
        {
          productId: product.id,
          slug: product.slug,
          nameVi: product.nameVi,
          mood: product.mood,
          price: product.price,
          quantity,
        },
      ];

  cartStore.set(next);
}

function removeItem(productId: string) {
  cartStore.set(cartStore.get().filter((line) => line.productId !== productId));
}

/**
 * Reads the current quantity from the store (not from a component's render
 * closure) before applying `delta`, so rapid clicks each apply against the
 * latest value instead of racing on a stale `line.quantity`.
 */
function adjustQuantity(productId: string, delta: number) {
  const lines = cartStore.get();
  const line = lines.find((l) => l.productId === productId);
  if (!line) return;

  const nextQuantity = line.quantity + delta;
  const next =
    nextQuantity <= 0
      ? lines.filter((l) => l.productId !== productId)
      : lines.map((l) =>
          l.productId === productId ? { ...l, quantity: nextQuantity } : l
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
