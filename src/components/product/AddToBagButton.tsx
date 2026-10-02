"use client";

import { useState } from "react";
import { useCart, type AddToCartInput } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { cn } from "@/lib/utils";

export function AddToBagButton({
  product,
  quantity = 1,
  className,
}: {
  product: AddToCartInput;
  quantity?: number;
  className?: string;
}) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);

  const outOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;

  function handleClick() {
    if (outOfStock) return;
    addItem(product, quantity);
    showToast(`Đã thêm "${product.nameVi}" vào giỏ hàng`);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      className={cn(
        "min-h-11 flex-1 border border-charcoal px-4 text-xs font-medium tracking-[0.12em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cloud-milk disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
    >
      {outOfStock ? "HẾT HÀNG" : justAdded ? "ĐÃ THÊM" : "THÊM VÀO GIỎ"}
    </button>
  );
}