"use client";

import { useWishlist } from "@/context/wishlist-context";
import { HeartIcon } from "@/components/icons";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function WishlistButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { isInWishlist, toggle } = useWishlist();
  const active = isInWishlist(product.id);

  return (
    <button
      type="button"
      onClick={() => toggle({ ...product, productId: product.id })}
      aria-pressed={active}
      aria-label={
        active
          ? `Bỏ ${product.nameVi} khỏi danh sách yêu thích`
          : `Thêm ${product.nameVi} vào danh sách yêu thích`
      }
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full bg-cloud-milk/90 text-charcoal backdrop-blur-sm transition-transform duration-200 hover:scale-105 active:scale-95",
        active && "text-purple",
        className
      )}
    >
      <HeartIcon filled={active} />
    </button>
  );
}