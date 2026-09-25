"use client";

import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "@/components/icons";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { getProductBySlug, searchProducts } from "@/lib/products";
import { CatalogCard } from "@/components/pages/Catalog";
import { ProductImage } from "@/components/product/ProductImage";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";

export function SearchPageClient() {
  const [query, setQuery] = useState("");
  const results = query.trim() ? searchProducts(query) : [];
  return (
    <section className="px-[clamp(20px,4vw,64px)] py-[clamp(48px,7vw,100px)]">
      <div className="mx-auto max-w-[1600px]">
        <label className="block text-[10px] uppercase tracking-[.16em] text-charcoal/45" htmlFor="search-page">
          Từ khóa
        </label>
        <input
          id="search-page"
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tên sản phẩm, cảm xúc..."
          className="mt-3 w-full border-b border-charcoal/25 bg-transparent pb-5 text-[clamp(1.5rem,4vw,3.5rem)] outline-none placeholder:text-charcoal/25 focus:border-charcoal"
        />
        <p className="mt-5 text-xs uppercase tracking-[.13em] text-charcoal/45">
          {query.trim() ? `${results.length} kết quả` : "Nhập từ khóa để bắt đầu"}
        </p>
        {results.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => (
              <CatalogCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {query.trim() && results.length === 0 && (
          <Empty
            title="Không tìm thấy kết quả"
            body="Thử tìm theo trạng thái như Bình tâm, Tái tạo, Rạng rỡ hoặc Yêu thương."
          />
        )}
      </div>
    </section>
  );
}

export function WishlistPageClient() {
  const { items, toggle } = useWishlist();

  return items.length ? (
    <section className="px-[clamp(20px,4vw,64px)] py-[clamp(48px,7vw,100px)]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.productId} className="group relative flex flex-col">
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-lavender/20">
              <Link
                href={`/san-pham/${item.slug}`}
                className="absolute inset-0 block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
                aria-label={item.nameVi}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt ?? item.nameVi}
                    fill
                    sizes="(min-width: 1181px) 20vw, (min-width: 768px) 30vw, 46vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="px-4 text-center text-[10px] uppercase tracking-[.18em] text-charcoal/40">
                      Hình ảnh sắp cập nhật
                    </span>
                  </div>
                )}
              </Link>
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-label={`Bỏ ${item.nameVi} khỏi danh sách yêu thích`}
                className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cloud-milk/90 text-purple backdrop-blur-sm transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <HeartIcon className="h-4 w-4 fill-current" />
              </button>
            </div>
            <div className="mt-4 flex flex-1 flex-col gap-1.5">
              <Link href={`/san-pham/${item.slug}`} className="w-fit">
                <h3 className="text-base font-medium text-charcoal">{item.nameVi}</h3>
              </Link>
              <p className="text-sm font-medium text-charcoal/70">
                {new Intl.NumberFormat("vi-VN").format(item.price)}đ
              </p>
              <Link
                href={`/san-pham/${item.slug}`}
                className="mt-3 flex min-h-11 items-center justify-center border border-charcoal px-4 text-xs font-medium tracking-[0.12em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cloud-milk"
              >
                XEM SẢN PHẨM
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  ) : (
    <Empty
      title="Chưa có khoảng nghỉ nào được lưu"
      body="Chạm biểu tượng trái tim trên sản phẩm bạn muốn quay lại sau."
      action="Khám phá sản phẩm"
      href="/san-pham"
    />
  );
}

export function CartPageClient() {
  const { lines, subtotal, adjustQuantity, removeItem } = useCart();

  if (!lines.length)
    return (
      <Empty
        title="Giỏ hàng đang trống"
        body="Khám phá các sản phẩm của DOPAMIND và bắt đầu nghi thức 15 phút của bạn."
        action="Khám phá sản phẩm"
        href="/san-pham"
      />
    );

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-lavender/25 via-cloud-milk to-cloud-milk px-[clamp(20px,4vw,64px)] py-[clamp(48px,7vw,100px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-mint/20 blur-3xl"
      />

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
          <Link
            href="/san-pham"
            className="hidden text-xs uppercase tracking-[.12em] text-charcoal/50 hover:text-charcoal sm:block"
          >
            ← Tiếp tục mua sắm
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14">
          <ul className="space-y-4">
            {lines.map((line) => (
              <li
                key={line.variantId}
                className="flex gap-5 rounded-2xl border border-charcoal/10 bg-white/70 p-4 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-5"
              >
                <Link
                  href={`/san-pham/${line.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-lavender/20 sm:h-32 sm:w-28"
                >
                  <ProductImage mood={line.mood} className="h-full w-full object-cover" />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/san-pham/${line.slug}`}
                      className="font-medium text-charcoal hover:text-purple"
                    >
                      {line.nameVi}
                    </Link>
                    <p className="mt-1.5 text-xs uppercase tracking-[.13em] text-charcoal/45">
                      {new Intl.NumberFormat("vi-VN").format(line.price)}đ
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-charcoal/15 bg-white">
                      <button
                        className="flex h-9 w-9 items-center justify-center text-charcoal/70 hover:text-purple"
                        onClick={() => adjustQuantity(line.variantId, -1)}
                        aria-label="Giảm số lượng"
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-medium text-charcoal">
                        {line.quantity}
                      </span>
                      <button
                        className="flex h-9 w-9 items-center justify-center text-charcoal/70 hover:text-purple"
                        onClick={() => adjustQuantity(line.variantId, 1)}
                        aria-label="Tăng số lượng"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-serif text-lg text-charcoal">
                        {new Intl.NumberFormat("vi-VN").format(line.price * line.quantity)}đ
                      </span>
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

          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-charcoal/10 bg-white/80 p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
  <h2 className="text-center font-serif text-xl text-charcoal">
    Tóm tắt đơn hàng
  </h2>
  <div className="mt-6 flex items-center justify-between gap-2 whitespace-nowrap border-b border-charcoal/10 pb-5">
    <span className="text-base text-charcoal/60">Tạm tính</span>
    <span className="font-serif text-3xl text-purple">
      {new Intl.NumberFormat("vi-VN").format(subtotal)}đ
    </span>
  </div>
  <p className="mt-4 text-sm leading-relaxed text-charcoal/45">
    Phí vận chuyển sẽ được tính ở bước tiếp theo.
  </p>

              <Link
                href="/thanh-toan"
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-charcoal text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90"
              >
                Tiến hành thanh toán
              </Link>

              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-charcoal/10 pt-5 text-center">
                {[{ label: "Chính hãng" }, { label: "Giao nhanh" }, { label: "Hỗ trợ đổi" }].map(
                  (item) => (
                    <div key={item.label} className="flex flex-col items-center gap-1.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender/30 text-purple">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span className="text-[9px] uppercase tracking-[.08em] text-charcoal/50">
                        {item.label}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Empty({
  title,
  body,
  action,
  href,
}: {
  title: string;
  body: string;
  action?: string;
  href?: string;
}) {
  return (
    <section className="flex min-h-[52vh] items-center justify-center px-5 py-20 text-center">
      <div className="max-w-xl">
        <p className="text-balance text-[clamp(1.75rem,4vw,3rem)] font-medium uppercase leading-[1.25] tracking-[-.02em] text-charcoal">
          {title}
        </p>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-charcoal/60">
          {body}
        </p>
        {action && href && (
          <Link
            href={href}
            className="mx-auto mt-10 flex min-h-11 w-fit items-center bg-charcoal px-6 text-xs uppercase tracking-[.13em] text-cloud-milk"
          >
            {action}
          </Link>
        )}
      </div>
    </section>
  );
}