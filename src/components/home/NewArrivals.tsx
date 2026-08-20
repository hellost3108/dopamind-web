"use client";

import Link from "next/link";
import { getNewProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Renders whatever `getNewProducts()` actually returns — same honesty
 * contract as BestSellers.tsx, no products invented to fill the row. Low
 * animation only: the whole grid fades/lifts in once as the section enters
 * the viewport (see useReveal), no per-card stagger or continuous motion.
 */
export function NewArrivals() {
  const newProducts = getNewProducts();
  const [ref, isVisible] = useReveal<HTMLDivElement>();

  return (
    <section className="relative bg-cloud-milk pb-[clamp(80px,11vh,152px)] pt-[clamp(56px,8vh,104px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-[36rem]">
            <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.01em] text-charcoal">
              MỚI TẠI DOPAMIND
            </h2>
            <p className="mt-4 text-[clamp(0.95rem,1.3vw,1.0625rem)] text-charcoal/60">
              Những trải nghiệm mới cho 15 phút của bạn.
            </p>
          </div>

          <Link
            href="/san-pham?badge=new"
            className="hidden shrink-0 whitespace-nowrap text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple sm:inline-flex sm:min-h-11 sm:items-center"
          >
            XEM TẤT CẢ SẢN PHẨM MỚI →
          </Link>
        </div>

        <div
          ref={ref}
          className={cn(
            "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {newProducts.length > 0 ? (
            <div className="[&::-webkit-scrollbar]:hidden -mx-[clamp(20px,4vw,64px)] mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,4vw,64px)] pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-0 md:pb-0">
              {newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="w-[74%] shrink-0 snap-start sm:w-[46%] md:w-auto"
                />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-charcoal/50">
              Chưa có sản phẩm mới nào được đánh dấu.
            </p>
          )}
        </div>

        <Link
          href="/san-pham?badge=new"
          className="mt-10 flex min-h-11 w-fit items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple sm:hidden"
        >
          XEM TẤT CẢ SẢN PHẨM MỚI →
        </Link>
      </div>
    </section>
  );
}
