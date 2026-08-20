"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AddToBagButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const { openCart } = useUI();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    addItem(product, 1);
    openCart();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "min-h-11 flex-1 border border-charcoal px-4 text-xs font-medium tracking-[0.12em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cloud-milk",
        className
      )}
    >
      {justAdded ? "ĐÃ THÊM" : "THÊM VÀO GIỎ"}
    </button>
  );
}
