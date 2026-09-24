"use client";

import { useState } from "react";

export function ProductPurchase() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <div className="flex items-center rounded-full border border-charcoal/15">
        <button
          type="button"
          aria-label="Giảm số lượng"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-12 w-12 items-center justify-center text-lg text-charcoal"
        >
          −
        </button>
        <span className="w-8 text-center text-sm text-charcoal" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Tăng số lượng"
          onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          className="flex h-12 w-12 items-center justify-center text-lg text-charcoal"
        >
          +
        </button>
      </div>

      {/* Nút này sẽ được nối với giỏ hàng ở bước sau. */}
      <button
        type="button"
        disabled
        title="Giỏ hàng sẽ được nối ở bước tiếp theo"
        className="min-h-12 flex-1 rounded-full bg-charcoal px-8 text-sm font-medium text-cloud-milk disabled:cursor-not-allowed disabled:opacity-50"
      >
        Thêm vào giỏ
      </button>
    </div>
  );
}