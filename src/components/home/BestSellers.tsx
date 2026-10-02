import Link from "next/link";
import { getBestSellers } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

/**
 * Renders whatever `getBestSellers()` actually returns — see the Phase 2
 * report for the gap between the ~4-product visual target and the current
 * sample catalog (only 2 products carry the "best-seller" badge). No
 * products are invented to fill the row; see CLAUDE.md > COMMERCE.
 */
export function BestSellers() {
  const bestSellers = getBestSellers();

  return (
    <section className="relative -mt-[clamp(16px,3vh,40px)] bg-cloud-milk pb-[clamp(80px,11vh,152px)] pt-[clamp(56px,8vh,104px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-[36rem]">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
              BÁN CHẠY
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.01em] text-charcoal">
              SẢN PHẨM ĐƯỢC YÊU THÍCH
            </h2>
            <p className="mt-4 text-[clamp(0.95rem,1.3vw,1.0625rem)] text-charcoal/60">
              Những lựa chọn được quay lại nhiều nhất.
            </p>
          </div>

          <Link
            href="/san-pham?badge=best-seller"
            className="hidden shrink-0 whitespace-nowrap text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple sm:inline-flex sm:min-h-11 sm:items-center"
          >
            XEM TẤT CẢ SẢN PHẨM BÁN CHẠY →
          </Link>
        </div>

        {bestSellers.length > 0 ? (
          <div
            className="[&::-webkit-scrollbar]:hidden -mx-[clamp(20px,4vw,64px)] mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,4vw,64px)] pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-0 md:pb-0"
          >
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="w-[74%] shrink-0 snap-start sm:w-[46%] md:w-auto"
              />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-charcoal/50">
            Chưa có sản phẩm bán chạy nào được đánh dấu.
          </p>
        )}

        <Link
          href="/san-pham?badge=best-seller"
          className="mt-10 flex min-h-11 w-fit items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple sm:hidden"
        >
          XEM TẤT CẢ SẢN PHẨM BÁN CHẠY →
        </Link>
      </div>
    </section>
  );
}
