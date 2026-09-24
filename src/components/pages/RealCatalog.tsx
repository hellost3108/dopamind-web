"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RealCategory, RealMood, RealProduct, RealSkinNeed } from "@/lib/real-products";

export function RealCatalog({
  categories,
  moods,
  skinNeeds,
  products,
}: {
  categories: RealCategory[];
  moods: RealMood[];
  skinNeeds: RealSkinNeed[];
  products: RealProduct[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeMood, setActiveMood] = useState<string>("all");
  const [activeSkinNeed, setActiveSkinNeed] = useState<string>("all");

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          (activeMood === "all" || p.moodSlugs.includes(activeMood)) &&
          (activeSkinNeed === "all" || p.skinNeedSlugs.includes(activeSkinNeed)),
      ),
    [products, activeMood, activeSkinNeed],
  );

  // Chỉ hiện những dòng đã có sản phẩm, để trang không bị các mục trống.
  const groups = useMemo(
    () =>
      categories
        .map((category, index) => ({
          category,
          number: String(index + 1).padStart(2, "0"),
          items: filteredProducts.filter((p) => p.categorySlug === category.slug),
        }))
        .filter((g) => g.items.length > 0),
    [categories, filteredProducts]
  );

  const visibleGroups =
    activeCategory === "all" ? groups : groups.filter((g) => g.category.slug === activeCategory);
  const visibleCount = visibleGroups.reduce((sum, g) => sum + g.items.length, 0);

  const chip =
    "products-filter-chip min-h-11 border px-4 text-[11px] font-medium uppercase tracking-[.12em]";

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
        <div className="products-filter-row flex flex-wrap gap-2 border-b border-charcoal/10 pb-6">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`${chip} ${
              activeCategory === "all"
                ? "products-filter-chip--active border-charcoal bg-charcoal text-cloud-milk"
                : "border-charcoal/15"
            }`}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={`${chip} ${
                activeCategory === category.slug
                  ? "products-filter-chip--active border-charcoal bg-charcoal text-cloud-milk"
                  : "border-charcoal/15"
              }`}
            >
              {category.shortNameVi ?? category.nameVi}
            </button>
          ))}
        </div>

        {(moods.length > 0 || skinNeeds.length > 0) && (
          <div className="grid gap-6 border-b border-charcoal/10 py-6 sm:grid-cols-2">
            {moods.length > 0 && (
              <FilterGroup
                label="Cảm xúc"
                value={activeMood}
                onChange={setActiveMood}
                options={moods.map((m) => ({ value: m.slug, label: m.labelVi }))}
                chip={chip}
                delayMs={70}
              />
            )}
            {skinNeeds.length > 0 && (
              <FilterGroup
                label="Nhu cầu da"
                value={activeSkinNeed}
                onChange={setActiveSkinNeed}
                options={skinNeeds.map((s) => ({ value: s.slug, label: s.labelVi }))}
                chip={chip}
                delayMs={140}
              />
            )}
          </div>
        )}

        <p key={visibleCount} className="products-count mt-6 text-[10px] uppercase tracking-[.14em] text-charcoal/50">
          {visibleCount} sản phẩm
        </p>

        {visibleCount === 0 ? (
          <div className="products-empty mt-16 flex min-h-[24vh] flex-col items-center justify-center text-center">
            <span aria-hidden className="products-empty__line" />
            <p className="text-[clamp(1.4rem,3vw,2rem)] font-medium uppercase leading-[.95] tracking-[-.03em] text-charcoal">
              Không có sản phẩm phù hợp
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-charcoal/55">
              Hãy thử chọn cảm xúc hoặc nhu cầu da khác.
            </p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col">
            {visibleGroups.map(({ category, number, items }) => (
              <section
                key={category.slug}
                className="products-category grid gap-8 border-b border-charcoal/10 py-[clamp(32px,5vw,64px)] lg:grid-cols-[minmax(220px,.3fr)_minmax(0,1fr)] lg:gap-[clamp(32px,4vw,72px)]"
              >
                <div className="products-category__sidebar lg:sticky lg:top-28 lg:self-start">
                  <p className="products-category__eyebrow text-[10px] uppercase tracking-[.18em] text-charcoal/45">
                    Dòng {number}
                  </p>
                  <h2 className="products-category__title mt-3 font-serif text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] text-charcoal">
                    {category.nameVi}
                  </h2>
                  {category.descriptionVi && (
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/60">
                      {category.descriptionVi}
                    </p>
                  )}
                  {activeCategory === "all" && (
                    <button
                      type="button"
                      onClick={() => setActiveCategory(category.slug)}
                      className="mt-6 min-h-11 text-[11px] font-medium uppercase tracking-[.13em] text-purple"
                    >
                      Xem tất cả sản phẩm →
                    </button>
                  )}
                </div>

                <div
                  key={`${activeMood}-${activeSkinNeed}`}
                  className={`products-tile-grid grid gap-x-4 gap-y-10 ${
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
        )}
      </div>
    </section>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
  chip,
  delayMs = 0,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  chip: string;
  delayMs?: number;
}) {
  return (
    <div className="products-filter-group" style={{ animationDelay: `${delayMs}ms` }}>
      <p className="mb-3 text-[10px] uppercase tracking-[.16em] text-charcoal/45">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`${chip} ${value === "all" ? "products-filter-chip--active border-charcoal bg-charcoal text-cloud-milk" : "border-charcoal/15"}`}
          onClick={() => onChange("all")}
        >
          Tất cả
        </button>
        {options.map((o) => (
          <button
            type="button"
            key={o.value}
            className={`${chip} ${value === o.value ? "products-filter-chip--active border-charcoal bg-charcoal text-cloud-milk" : "border-charcoal/15"}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductTile({ product }: { product: RealProduct }) {
  return (
    <article className="products-tile group">
      <Link href={`/san-pham/${product.slug}`} className="block">
        <div className="products-tile__frame relative aspect-square overflow-hidden bg-lavender/20">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.nameVi}
              fill
              sizes="(min-width: 1181px) 20vw, (min-width: 768px) 30vw, 46vw"
              className="products-tile__image object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label={`Hình ảnh ${product.nameVi} sắp cập nhật`}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                aria-hidden="true"
                className="absolute inset-3 border border-charcoal/10"
              />
              <span className="px-4 text-center text-[10px] uppercase tracking-[.18em] text-charcoal/40">
                Hình ảnh sắp cập nhật
              </span>
            </div>
          )}
          <span aria-hidden className="products-tile__overlay" />
          <span aria-hidden className="products-tile__border" />
        </div>
        <h3 className="products-tile__title mt-4 text-base font-medium text-charcoal">
          {product.nameVi}
        </h3>
        {product.shortDescriptionVi && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-charcoal/60">
            {product.shortDescriptionVi}
          </p>
        )}
        <span className="products-tile__cta mt-3 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[.13em] text-purple">
          Xem sản phẩm
          <span aria-hidden className="products-tile__arrow">
            →
          </span>
        </span>
      </Link>
    </article>
  );
}
