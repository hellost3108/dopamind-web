"use client";

import { useSyncExternalStore } from "react";
import { createPersistedStore } from "@/lib/persisted-store";
import { useCart } from "@/context/cart-context";

// Lưu danh sách variantId đang được tích chọn (giữ lại khi chuyển trang / tải lại)
const selectedStore = createPersistedStore<string[]>("dopamind:cart-selected:v1", []);
const EMPTY_IDS: string[] = [];

export function useCartSelection() {
  const { lines, removeItem } = useCart();
  const ids = useSyncExternalStore(selectedStore.subscribe, selectedStore.get, () => EMPTY_IDS);

  // Chỉ tính các món còn trong giỏ và đang được tích
  const selectedLines = lines.filter((l) => ids.includes(l.variantId));
  const selectedCount = selectedLines.reduce((s, l) => s + l.quantity, 0);
  // Cộng dồn: đơn giá x số lượng của từng món, rồi cộng các món lại
  const selectedSubtotal = selectedLines.reduce((s, l) => s + l.price * l.quantity, 0);
  const allSelected = lines.length > 0 && selectedLines.length === lines.length;

  const isSelected = (variantId: string) => ids.includes(variantId);

  const toggle = (variantId: string) => {
    const cur = selectedStore.get();
    selectedStore.set(cur.includes(variantId) ? cur.filter((x) => x !== variantId) : [...cur, variantId]);
  };

  const toggleAll = () => selectedStore.set(allSelected ? [] : lines.map((l) => l.variantId));

  // Dùng sau khi đặt hàng thành công: chỉ xóa các món đã mua, giữ lại món chưa chọn
  const removeSelected = () => {
    selectedLines.forEach((l) => removeItem(l.variantId));
    selectedStore.set([]);
  };

  return {
    selectedLines,
    selectedCount,
    selectedSubtotal,
    allSelected,
    isSelected,
    toggle,
    toggleAll,
    removeSelected,
  };
}
