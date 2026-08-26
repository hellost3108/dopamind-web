import Link from "next/link";
import { getMood } from "@/lib/moods";
import { BADGE_LABEL_VI } from "@/lib/badges";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product/ProductImage";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { WishlistButton } from "@/components/product/WishlistButton";
import { AddToBagButton } from "@/components/product/AddToBagButton";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const mood = getMood(product.mood);
  const href = `/san-pham/${product.slug}`;

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Link
          href={href}
          className="absolute inset-0 block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
          aria-label={product.nameVi}
        >
          <ProductImage
            mood={product.mood}
            className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
          />
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 bg-cloud-milk/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-charcoal">
            {BADGE_LABEL_VI[product.badge]}
          </span>
        )}

        <WishlistButton product={product} className="absolute right-3 top-3 z-10" />
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
          {mood.labelVi}
        </span>
        <Link href={href} className="w-fit">
          <h3 className="text-base font-medium text-charcoal">{product.nameVi}</h3>
        </Link>
        <p className="text-sm text-charcoal/60">{product.benefitVi}</p>
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          className="mt-1"
        />

        <div className="mt-3 flex items-center gap-2">
          <AddToBagButton product={product} />
          <Link
            href={href}
            className="min-h-11 flex items-center px-3 text-xs font-medium tracking-[0.12em] text-charcoal/70 underline underline-offset-4 transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-charcoal group-hover:translate-x-1"
          >
            XEM CHI TIẾT
          </Link>
        </div>
      </div>
    </article>
  );
}
