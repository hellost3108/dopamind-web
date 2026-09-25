"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddToBagButton } from "@/components/product/AddToBagButton";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { HeartIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { MoodSlug } from "@/lib/types";

const DEFAULT_MOOD: MoodSlug = "binh-tam";

export function ProductPurchase({
  productId,
  variantId,
  slug,
  nameVi,
  mood,
  price,
  stockQuantity,
  imageUrl,
  imageAlt,
}: {
  productId: string;
  variantId?: string;
  slug: string;
  nameVi: string;
  mood?: MoodSlug;
  price?: number;
  stockQuantity?: number;
  imageUrl?: string;
  imageAlt?: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();

  const effectiveMood = mood ?? DEFAULT_MOOD;
  const canBuy = Boolean(variantId) && price !== undefined;
  const inWishlist = isInWishlist(productId);

  function handleBuyNow() {
    if (!canBuy) return;
    setIsBuyingNow(true);
    addItem(
      {
        productId,
        variantId: variantId!,
        slug,
        nameVi,
        mood: effectiveMood,
        price: price!,
        stockQuantity,
      },
      quantity
    );
    router.push("/thanh-toan");
  }

  function handleToggleWishlist() {
    toggle({
      productId,
      slug,
      nameVi,
      price: price ?? 0,
      imageUrl,
      imageAlt,
    });
  }

  return (
    <div className="mt-8 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
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
            onClick={() =>
              setQuantity((q) =>
                stockQuantity !== undefined ? Math.min(stockQuantity, q + 1) : Math.min(99, q + 1)
              )
            }
            className="flex h-12 w-12 items-center justify-center text-lg text-charcoal"
          >
            +
          </button>
        </div>

        {canBuy ? (
          <AddToBagButton
            product={{
              productId,
              variantId: variantId!,
              slug,
              nameVi,
              mood: effectiveMood,
              price: price!,
              stockQuantity,
            }}
            quantity={quantity}
            className="min-h-12 flex-1 rounded-full !border !border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-cloud-milk"
          />
        ) : (
          <button
            type="button"
            disabled
            title="Sản phẩm này thiếu dữ liệu để mua (biến thể/giá)"
            className="min-h-12 flex-1 rounded-full bg-charcoal px-8 text-sm font-medium text-cloud-milk disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tạm thời chưa thể mua
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!canBuy || isBuyingNow}
          className="min-h-12 flex-1 rounded-full bg-charcoal px-8 text-sm font-medium text-cloud-milk transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isBuyingNow ? "ĐANG XỬ LÝ..." : "MUA NGAY"}
        </button>

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-pressed={inWishlist}
          className={cn(
            "flex min-h-12 items-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors",
            inWishlist
              ? "border-purple bg-lavender/30 text-purple"
              : "border-charcoal/15 text-charcoal hover:border-charcoal"
          )}
        >
          <HeartIcon className={cn("h-4 w-4", inWishlist && "fill-current")} />
          {inWishlist ? "ĐÃ YÊU THÍCH" : "THÊM VÀO YÊU THÍCH"}
        </button>
      </div>
    </div>
  );
}