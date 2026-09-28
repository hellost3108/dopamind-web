"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useCartSelection } from "@/context/cart-selection";
import { ProductImage } from "@/components/product/ProductImage";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";

const vnd = (n: number) => `${new Intl.NumberFormat("vi-VN").format(n)}đ`;

/** Ô tích hình vuông, bo góc mềm. mixed = đang chọn một phần (hiện dấu gạch ngang). */
function Check({
  checked,
  mixed = false,
  onChange,
  label,
}: {
  checked: boolean;
  mixed?: boolean;
  onChange: () => void;
  label: string;
}) {
  const on = checked || mixed;
  return (
    <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span
        className={`flex h-[22px] w-[22px] items-center justify-center rounded-[7px] border-[1.5px] transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-purple/40 ${
          on ? "border-purple bg-purple text-white" : "border-charcoal/25 bg-white text-transparent hover:border-purple/60"
        }`}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {mixed && !checked ? <path d="M6 12h12" /> : <path d="M20 6L9 17l-5-5" />}
        </svg>
      </span>
    </label>
  );
}

export function CartPageClient() {
  const { lines, itemCount, adjustQuantity, removeItem } = useCart();
  const { selectedLines, selectedCount, selectedSubtotal, allSelected, isSelected, toggle, toggleAll } =
    useCartSelection();

  if (!lines.length)
    return (
      <section className="flex min-h-[52vh] items-center justify-center px-5 py-20 text-center">
        <div className="max-w-xl">
          <p className="text-[clamp(1.75rem,4vw,3rem)] font-medium uppercase leading-[1.25] tracking-[-.02em] text-charcoal">
            Giỏ hàng đang trống
          </p>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-charcoal/60">
            Khám phá các sản phẩm của DOPAMIND và bắt đầu nghi thức 15 phút của bạn.
          </p>
          <Link
            href="/san-pham"
            className="mx-auto mt-10 flex min-h-11 w-fit items-center bg-charcoal px-6 text-xs uppercase tracking-[.13em] text-cloud-milk"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </section>
    );

  const hasSelection = selectedLines.length > 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-lavender/25 via-cloud-milk to-cloud-milk px-[clamp(20px,4vw,64px)] py-[clamp(48px,7vw,100px)]">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-mint/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-charcoal/10 pb-6">
          <div>
            <span className="inline-block rounded-full bg-purple/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[.16em] text-purple">
              {itemCount} sản phẩm
            </span>
            <h1 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] text-charcoal">
              Giỏ hàng của bạn
            </h1>
          </div>
          <Link href="/san-pham" className="hidden text-xs uppercase tracking-[.12em] text-charcoal/50 hover:text-charcoal sm:block">
            ← Tiếp tục mua sắm
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14">
          <div>
            {/* Chọn tất cả */}
            <div className="mb-4 flex items-center gap-1 rounded-2xl border border-charcoal/10 bg-white/70 py-1 pl-2 pr-5">
              <Check
                checked={allSelected}
                mixed={!allSelected && hasSelection}
                onChange={toggleAll}
                label="Chọn tất cả sản phẩm"
              />
              <span className="text-sm font-medium text-charcoal">Chọn tất cả ({lines.length})</span>
            </div>

            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={line.variantId}
                  className={`flex items-center gap-2 rounded-2xl border bg-white/70 p-3 pr-4 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition sm:gap-3 sm:p-4 sm:pr-5 ${
                    isSelected(line.variantId) ? "border-purple/40" : "border-charcoal/10"
                  }`}
                >
                  <Check
                    checked={isSelected(line.variantId)}
                    onChange={() => toggle(line.variantId)}
                    label={`Chọn ${line.nameVi}`}
                  />

                  <Link
                    href={`/san-pham/${line.slug}`}
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-lavender/20 sm:h-32 sm:w-28"
                  >
                    <ProductImage mood={line.mood} className="h-full w-full object-cover" />
                  </Link>

                  <div className="flex h-28 flex-1 flex-col justify-between sm:h-32">
                    <div>
                      <Link href={`/san-pham/${line.slug}`} className="font-medium text-charcoal hover:text-purple">
                        {line.nameVi}
                      </Link>
                      <p className="mt-1.5 text-xs uppercase tracking-[.13em] text-charcoal/45">{vnd(line.price)}</p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-charcoal/15 bg-white">
                        <button
                          className="flex h-9 w-9 items-center justify-center text-charcoal/70 hover:text-purple"
                          onClick={() => adjustQuantity(line.variantId, -1)}
                          aria-label="Giảm số lượng"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium text-charcoal">{line.quantity}</span>
                        <button
                          className="flex h-9 w-9 items-center justify-center text-charcoal/70 hover:text-purple"
                          onClick={() => adjustQuantity(line.variantId, 1)}
                          aria-label="Tăng số lượng"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-serif text-lg text-charcoal">{vnd(line.price * line.quantity)}</span>
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/40 transition-colors hover:bg-red-50 hover:text-red-500"
                          onClick={() => removeItem(line.variantId)}
                          aria-label="Xoá sản phẩm"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-charcoal/10 bg-white/80 p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <h2 className="text-center font-serif text-xl text-charcoal">Tóm tắt đơn hàng</h2>

              <div className="mt-6 flex items-center justify-between gap-2 whitespace-nowrap border-b border-charcoal/10 pb-5">
                <span className="text-base text-charcoal/60">Tạm tính</span>
                <span className="font-serif text-3xl text-purple">{vnd(selectedSubtotal)}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/45">
                {hasSelection
                  ? `Đã chọn ${selectedLines.length} sản phẩm (${selectedCount} món). Phí vận chuyển sẽ được tính ở bước tiếp theo.`
                  : "Hãy tích chọn sản phẩm bạn muốn thanh toán."}
              </p>

              {hasSelection ? (
                <Link
                  href="/thanh-toan"
                  className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-charcoal text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90"
                >
                  Tiến hành thanh toán
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-charcoal/25 text-xs font-medium uppercase tracking-[.13em] text-white"
                >
                  Tiến hành thanh toán
                </button>
              )}

              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-charcoal/10 pt-5 text-center">
                {["Chính hãng", "Giao nhanh", "Hỗ trợ đổi"].map((label) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender/30 text-purple">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span className="text-[9px] uppercase tracking-[.08em] text-charcoal/50">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
