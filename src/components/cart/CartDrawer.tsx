"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { getMood } from "@/lib/moods";
import { formatVnd } from "@/lib/format";
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { ProductImage } from "@/components/product/ProductImage";

export function CartDrawer() {
  const { isCartOpen, close } = useUI();
  const { lines, subtotal, adjustQuantity, removeItem } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Giỏ hàng"
    >
      <button
        type="button"
        aria-label="Đóng giỏ hàng"
        onClick={close}
        className="absolute inset-0 bg-charcoal/40"
      />

      <div className="absolute inset-y-0 right-0 flex w-[min(92vw,440px)] flex-col bg-cloud-milk">
        <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal">
            GIỎ HÀNG
          </h2>
          <button
            type="button"
            autoFocus
            onClick={close}
            aria-label="Đóng giỏ hàng"
            className="flex h-11 w-11 items-center justify-center text-charcoal"
          >
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-sm text-charcoal/60">Giỏ hàng của bạn đang trống.</p>
            <button
              type="button"
              onClick={close}
              className="flex min-h-11 items-center border border-charcoal px-5 text-xs font-medium uppercase tracking-[0.12em] text-charcoal"
            >
              TIẾP TỤC MUA SẮM
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5">
              {lines.map((line) => {
                const mood = getMood(line.mood);
                return (
                  <li
                    key={line.productId}
                    className="flex gap-4 border-b border-charcoal/10 py-4 first:pt-4"
                  >
                    <Link
                      href={`/san-pham/${line.slug}`}
                      onClick={close}
                      className="h-24 w-20 shrink-0 overflow-hidden"
                    >
                      <ProductImage mood={line.mood} className="h-full w-full" />
                    </Link>

                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/san-pham/${line.slug}`}
                          onClick={close}
                          className="text-sm font-medium text-charcoal"
                        >
                          {line.nameVi}
                        </Link>
                        <span className="whitespace-nowrap text-sm font-medium text-charcoal">
                          {formatVnd(line.price * line.quantity)}
                        </span>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.14em] text-charcoal/45">
                        {mood.labelVi}
                      </span>

                      <div className="mt-2 flex items-end justify-between gap-3">
                        <div>
                          <span className="block text-[10px] uppercase tracking-[0.12em] text-charcoal/40">
                            SỐ LƯỢNG
                          </span>
                          <div className="mt-1 flex items-center border border-charcoal/15">
                            <button
                              type="button"
                              aria-label="Giảm số lượng"
                              onClick={() => adjustQuantity(line.productId, -1)}
                              className="flex h-11 w-11 items-center justify-center text-charcoal"
                            >
                              <MinusIcon className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm text-charcoal">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Tăng số lượng"
                              onClick={() => adjustQuantity(line.productId, 1)}
                              className="flex h-11 w-11 items-center justify-center text-charcoal"
                            >
                              <PlusIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(line.productId)}
                          className="flex h-11 items-center gap-1 text-[11px] uppercase tracking-[0.1em] text-charcoal/50 transition-colors hover:text-charcoal"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          XÓA
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-charcoal/10 px-5 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.12em] text-charcoal/60">TẠM TÍNH</span>
                <span className="font-medium text-charcoal">{formatVnd(subtotal)}</span>
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  href="/thanh-toan"
                  onClick={close}
                  className="flex min-h-11 items-center justify-center bg-charcoal text-xs font-medium uppercase tracking-[0.12em] text-cloud-milk transition-opacity hover:opacity-90"
                >
                  THANH TOÁN
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="flex min-h-11 items-center justify-center border border-charcoal text-xs font-medium uppercase tracking-[0.12em] text-charcoal"
                >
                  TIẾP TỤC MUA SẮM
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
