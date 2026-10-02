"use client";

import Image from "next/image";
import Link from "next/link";
import { getBestSellers, getAllProducts } from "@/lib/products";
import { getMood } from "@/lib/moods";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Features the catalog's first real best seller (falls back to the first
 * product if none is badged) — never an invented "hero SKU". ~60% visual /
 * 40% commerce split from xl up; stacked below. Restrained motion: a single
 * text reveal and a subtle desktop-only media hover, nothing else.
 *
 * NOTE: not currently imported/rendered anywhere (verified via grep). Kept
 * type-safe rather than deleted in case it's wired up later. Still reads
 * from the placeholder catalog (`@/lib/products`), so the add-to-cart button
 * is intentionally omitted here — see ProductCard.tsx for the same call.
 */
export function FeaturedReset() {
  const pool = getBestSellers();
  const featured = pool.length > 0 ? pool[0] : getAllProducts()[0];
  const [ref, isVisible] = useReveal<HTMLDivElement>();
  if (!featured) return null;

  const mood = getMood(featured.mood);
  const href = `/san-pham/${featured.slug}`;

  return (
    <section className="relative bg-cloud-milk pb-[clamp(96px,13vh,176px)] pt-[clamp(72px,10vh,144px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-col overflow-hidden bg-charcoal/[0.03] xl:grid xl:grid-cols-[60fr_40fr] xl:items-stretch">
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9] xl:aspect-auto">
            <Image
              src="/images/homepage/featured/FR01.png"
              alt="Khoảnh khắc sử dụng mặt nạ Dopamind Mask Story trong nghi thức chăm sóc da"
              fill
              sizes="(min-width: 1181px) 60vw, 100vw"
              className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]"
              style={{ objectPosition: "55% 25%" }}
            />
          </div>

          <div
            ref={ref}
            className={cn(
              "flex flex-col justify-center gap-4 p-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 xl:p-14",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
              SẢN PHẨM NỔI BẬT
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
              <Link
                href={href}
                className="flex min-h-11 items-center bg-charcoal px-6 text-xs font-medium uppercase tracking-[0.12em] text-cloud-milk"
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