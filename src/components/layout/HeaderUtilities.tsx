"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useUI } from "@/context/ui-context";
import { SearchIcon, UserIcon, HeartIcon, BagIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const iconButton =
  "relative flex h-11 w-11 items-center justify-center text-charcoal transition-colors hover:text-purple";

function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center bg-purple px-1 text-[9px] font-medium leading-none text-cloud-milk">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function HeaderUtilities({ className }: { className?: string }) {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { openSearch, openCart } = useUI();

  return (
    <div className={cn("flex items-center", className)}>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Tìm kiếm"
        className={iconButton}
      >
        <SearchIcon />
      </button>

      <Link
        href="/tai-khoan"
        aria-label="Tài khoản"
        className={cn(iconButton, "hidden xl:flex")}
      >
        <UserIcon />
      </Link>

      <Link
        href="/yeu-thich"
        aria-label="Yêu thích"
        className={cn(iconButton, "hidden xl:flex")}
      >
        <HeartIcon />
        {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
      </Link>

      <button
        type="button"
        onClick={openCart}
        aria-label="Giỏ hàng"
        className={iconButton}
      >
        <BagIcon />
        {itemCount > 0 && <CountBadge count={itemCount} />}
      </button>
    </div>
  );
}
