"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { WishlistButton } from "@/components/product/WishlistButton";
import { getMood } from "@/lib/moods";
import { formatVnd } from "@/lib/format";
import type { Product } from "@/lib/types";
import type { CatalogProduct, CatalogMood, CatalogSkinNeed } from "@/lib/supabase/catalog";

/**
 * `/san-pham`'s own catalog data — real Supabase rows, not the placeholder
 * `Product` type (a real product can have several moods/variants, which the
 * placeholder single-mood/single-price shape can't represent without
 * fabricating a "which one" answer — see src/lib/supabase/catalog.ts).
 * `CatalogCard` below stays on the placeholder `Product` type because it's
 * shared with search/wishlist (CommercePages.tsx), which still run on
 * placeholder data — do not change its signature.
 */
export function Catalog({
  products,
  moods,
  skinNeeds,
}: {
  products: CatalogProduct[];
  moods: CatalogMood[];
  skinNeeds: CatalogSkinNeed[];
}) {
  const [mood, setMood] = useState<string>("all");
  const [need, setNeed] = useState<string>("all");
  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (mood === "all" || p.moods.some((m) => m.slug === mood)) &&
          (need === "all" || p.skinNeeds.some((s) => s.slug === need)),
      ),
    [products, mood, need],
  );
  const chip = "min-h-11 border px-4 text-[11px] font-medium uppercase tracking-[.12em] transition-colors";
  return (
    <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-6 border-b border-charcoal/10 pb-8 lg:grid-cols-2">
          <Filter label="Cảm xúc" value={mood} onChange={setMood} options={moods.map((m) => ({ value: m.slug, label: m.label_vi }))} chip={chip} />
          <Filter label="Nhu cầu da" value={need} onChange={setNeed} options={skinNeeds.map((n) => ({ value: n.slug, label: n.label_vi }))} chip={chip} />
        </div>
        <div className="mt-7 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[.14em] text-charcoal/50"><span>{visible.length} lựa chọn</span><span className="text-right">Dữ liệu sản phẩm đang chờ xác minh</span></div>
        {visible.length === 0 ? (
          <div className="mt-16 flex min-h-[32vh] flex-col items-center justify-center text-center">
            <p className="text-[clamp(1.6rem,4vw,2.75rem)] font-medium uppercase leading-[.95] tracking-[-.03em]">Sản phẩm đang được cập nhật</p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-charcoal/55">DOPAMIND đang xác minh dữ liệu sản phẩm chính thức. Danh mục, cảm xúc và nhu cầu da phía trên đã sẵn sàng — sản phẩm sẽ xuất hiện ngay khi được duyệt.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-7 xl:grid-cols-4">
            {visible.map((product) => <RealCatalogCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Card for real Supabase products. Deliberately does not reuse the shared
 * `CatalogCard` below: that one requires the placeholder `Product` shape
 * (single mood, single price) and is still wired to WishlistButton/
 * ProductImage, which assume that shape — forcing a real multi-mood/
 * multi-variant product into it would mean guessing "which mood" or "which
 * price" to show. Wishlist integration for real products is deferred to a
 * later phase (see Phase 2 report). No product_media.storage_path is
 * rendered as an image yet — there is no Storage bucket wired up (Phase 1
 * explicitly defers that), so this shows a neutral placeholder instead of
 * inventing a public URL.
 */
function RealCatalogCard({ product }: { product: CatalogProduct }) {
  const primaryMood = product.moods[0];
  const primaryVariant = product.variants[0];
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-lavender/25">
        <Link href={`/san-pham/${product.slug}`} className="block h-full" />
      </div>
      <div className="mt-4">
        {primaryMood && <p className="text-[10px] uppercase tracking-[.17em] text-charcoal/45">{primaryMood.labelVi}</p>}
        <Link href={`/san-pham/${product.slug}`}><h2 className="mt-2 text-base font-medium">{product.nameVi}</h2></Link>
        {product.shortDescriptionVi && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-charcoal/60">{product.shortDescriptionVi}</p>}
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[.13em] text-purple">{primaryVariant ? formatVnd(primaryVariant.price) : "Giá đang cập nhật"}</p>
      </div>
    </article>
  );
}

function Filter({label,value,onChange,options,chip}:{label:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[];chip:string}) {
  return <div><p className="mb-3 text-[10px] uppercase tracking-[.16em] text-charcoal/45">{label}</p><div className="flex flex-wrap gap-2"><button type="button" className={`${chip} ${value === "all" ? "border-charcoal bg-charcoal text-cloud-milk" : "border-charcoal/15"}`} onClick={()=>onChange("all")}>Tất cả</button>{options.map(o=><button type="button" key={o.value} className={`${chip} ${value === o.value ? "border-charcoal bg-charcoal text-cloud-milk" : "border-charcoal/15"}`} onClick={()=>onChange(o.value)}>{o.label}</button>)}</div></div>
}

export function CatalogCard({ product }: { product: Product }) {
  const mood = getMood(product.mood);
  return <article className="group relative"><div className="relative aspect-[4/5] overflow-hidden"><Link href={`/san-pham/${product.slug}`} className="block h-full transition-transform duration-500 group-hover:scale-[1.025]"><ProductImage mood={product.mood} className="h-full" /></Link><WishlistButton product={product} className="absolute right-3 top-3" /></div><div className="mt-4"><p className="text-[10px] uppercase tracking-[.17em] text-charcoal/45">{mood.labelVi}</p><Link href={`/san-pham/${product.slug}`}><h2 className="mt-2 text-base font-medium">{product.nameVi}</h2></Link><p className="mt-1 line-clamp-2 text-sm leading-relaxed text-charcoal/60">{product.benefitVi}</p><p className="mt-4 text-[11px] font-medium uppercase tracking-[.13em] text-purple">Thông tin bán hàng đang cập nhật</p></div></article>;
}
