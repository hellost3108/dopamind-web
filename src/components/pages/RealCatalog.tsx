"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RealCategory, RealProduct } from "@/lib/real-products";

export function RealCatalog({
  categories,
  products,
}: {
  categories: RealCategory[];
  products: RealProduct[];
}) {
  const [active, setActive] = useState<string>("all");

  // Chỉ hiện những dòng đã có sản phẩm, để trang không bị các mục trống.
  const groups = useMemo(
    () =>
      categories
        .map((category, index) => ({
          category,
          number: String(index + 1).padStart(2, "0"),
          items: products.filter((p) => p.categorySlug === category.slug),
        }))
        .filter((g) => g.items.length > 0),
    [categories, products]
  );

  const visibleGroups =
    active === "all" ? groups : groups.filter((g) => g.category.slug === active);
  const visibleCount = visibleGroups.reduce((sum, g) => sum + g.items.length, 0);

  const chip =
    "min-h-11 border px-4 text-[11px] font-medium uppercase tracking-[.12em] transition-colors";

  if (products.length === 0) {
    return (
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <p className="mx-auto max-w-[1600px] text-charcoal/60">
          Sản phẩm đang được cập nhật. Bạn quay lại sau nhé.
        </p>
      </section>
    );
  }

  return (
    <section className="px-[clamp(20px,4vw,64px)] py-[clamp(40px,6vw,96px)]">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap gap-2 border-b border-charcoal/10 pb-6">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`${chip} ${
              active === "all"
                ? "border-charcoal bg-charcoal text-cloud-milk"
                : "border-charcoal/15"
            }`}
          >
            Tất cả
          </button>
          {groups.map(({ category }) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActive(category.slug)}
              className={`${chip} ${
                active === category.slug
                  ? "border-charcoal bg-charcoal text-cloud-milk"
                  : "border-charcoal/15"
              }`}
            >
              {category.shortNameVi ?? category.nameVi}
            </button>
          ))}
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[.14em] text-charcoal/50">
          {visibleCount} sản phẩm
        </p>

        <div className="mt-8 flex flex-col">
          {visibleGroups.map(({ category, number, items }) => (
            <section
              key={category.slug}
              className="grid gap-8 border-b border-charcoal/10 py-[clamp(32px,5vw,64px)] lg:grid-cols-[minmax(220px,.3fr)_minmax(0,1fr)] lg:gap-[clamp(32px,4vw,72px)]"
            >
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-[10px] uppercase tracking-[.18em] text-charcoal/45">
                  Dòng {number}
                </p>
                <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] text-charcoal">
                  {category.nameVi}
                </h2>
                {category.descriptionVi && (
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/60">
                    {category.descriptionVi}
                  </p>
                )}
                {active === "all" && (
                  <button
                    type="button"
                    onClick={() => setActive(category.slug)}
                    className="mt-6 min-h-11 text-[11px] font-medium uppercase tracking-[.13em] text-purple"
                  >
                    Xem tất cả sản phẩm →
                  </button>
                )}
              </div>

              <div
                className={`grid gap-x-4 gap-y-10 ${
                  items.length <= 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-2 xl:grid-cols-4"
                }`}
              >
                {items.map((product) => (
                  <ProductTile key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductTile({ product }: { product: RealProduct }) {
  return (
    <article className="group">
      <Link href={`/san-pham/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-lavender/20">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.nameVi}
              fill
              sizes="(min-width: 1181px) 20vw, (min-width: 768px) 30vw, 46vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          )}
        </div>
        <h3 className="mt-4 text-base font-medium text-charcoal">
          {product.nameVi}
        </h3>
        {product.shortDescriptionVi && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-charcoal/60">
            {product.shortDescriptionVi}
          </p>
        )}
        <span className="mt-3 inline-block text-[11px] font-medium uppercase tracking-[.13em] text-purple">
          Xem sản phẩm →
        </span>
      </Link>
    </article>
  );
}