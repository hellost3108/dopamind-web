import Link from "next/link";
import { getBestSellers, getAllProducts } from "@/lib/products";
import { getMood } from "@/lib/moods";
import { ProductImage } from "@/components/product/ProductImage";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { AddToBagButton } from "@/components/product/AddToBagButton";

/**
 * Features the catalog's first real best seller (falls back to the first
 * product if none is badged) — never an invented "hero SKU". ~60% visual /
 * 40% commerce split from xl up; stacked below.
 */
export function FeaturedReset() {
  const pool = getBestSellers();
  const featured = pool.length > 0 ? pool[0] : getAllProducts()[0];
  if (!featured) return null;

  const mood = getMood(featured.mood);
  const href = `/san-pham/${featured.slug}`;

  return (
    <section className="relative bg-cloud-milk pb-[clamp(96px,13vh,176px)] pt-[clamp(72px,10vh,144px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-col overflow-hidden bg-charcoal/[0.03] xl:grid xl:grid-cols-[60fr_40fr] xl:items-stretch">
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] xl:aspect-auto">
            <ProductImage mood={featured.mood} className="h-full w-full" />
          </div>

          <div className="flex flex-col justify-center gap-4 p-6 sm:p-10 xl:p-14">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
              FEATURED RESET
            </span>
            <h2 className="text-[clamp(1.75rem,2.6vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal">
              LỰA CHỌN NỔI BẬT
            </h2>

            <div className="mt-1 flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
                {mood.labelVi}
              </span>
              <h3 className="text-xl font-medium text-charcoal">{featured.nameVi}</h3>
              <p className="text-sm italic text-charcoal/60">{mood.taglineVi}</p>
              <p className="text-sm text-charcoal/65">{featured.benefitVi}</p>
              <PriceDisplay
                price={featured.price}
                compareAtPrice={featured.compareAtPrice}
                className="mt-1"
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <AddToBagButton product={featured} />
              <Link
                href={href}
                className="flex min-h-11 items-center px-3 text-xs font-medium tracking-[0.12em] text-charcoal/70 underline underline-offset-4 transition-colors hover:text-charcoal"
              >
                XEM CHI TIẾT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
