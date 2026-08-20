import Link from "next/link";
import { MOODS } from "@/lib/moods";
import { getProductsByMood } from "@/lib/products";
import { ProductImage } from "@/components/product/ProductImage";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import type { Mood } from "@/lib/types";

const COLLECTION_BG: Record<Mood["colorToken"], string> = {
  mint: "linear-gradient(160deg, var(--color-mint), var(--color-cloud-milk) 82%)",
  lavender: "linear-gradient(160deg, var(--color-lavender), var(--color-cloud-milk) 82%)",
  butter: "linear-gradient(160deg, var(--color-butter), var(--color-cloud-milk) 82%)",
  peach: "linear-gradient(160deg, var(--color-peach), var(--color-cloud-milk) 82%)",
};

/**
 * Static commerce entry points into each mood, distinct from Mood Finder's
 * expanding-panel interaction — this is a plain link grid, always fully
 * visible, no hover-gated reveal. Reuses MOODS.taglineVi for the emotional
 * line so the copy isn't redefined here — see CLAUDE.md > DATA.
 */
export function Collections() {
  return (
    <section className="relative bg-cloud-milk py-[clamp(72px,10vh,144px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="max-w-[38rem]">
          <h2 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal">
            CHỌN TRẠNG THÁI CỦA BẠN
          </h2>
          <p className="mt-4 text-[clamp(0.95rem,1.3vw,1.0625rem)] text-charcoal/60">
            Một chiếc mặt nạ. Một cảm xúc. Một khoảng thời gian dành cho chính mình.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {MOODS.map((mood, index) => {
            const products = getProductsByMood(mood.slug).slice(0, 2);

            return (
              <Link
                key={mood.slug}
                href={`/san-pham?mood=${mood.slug}`}
                className="group relative flex flex-col overflow-hidden"
                style={{ backgroundImage: COLLECTION_BG[mood.colorToken] }}
              >
                <div
                  className={`relative w-full overflow-hidden ${
                    index % 2 === 0 ? "aspect-[4/3]" : "aspect-[5/4]"
                  }`}
                >
                  <ProductImage
                    mood={mood.slug}
                    className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/45">
                    {mood.labelEn}
                  </span>
                  <h3 className="text-[clamp(1.25rem,2vw,1.625rem)] font-medium uppercase tracking-[-0.01em] text-charcoal">
                    {mood.labelVi}
                  </h3>
                  <p className="text-sm text-charcoal/65">{mood.taglineVi}</p>

                  {products.length > 0 && (
                    <ul className="mt-1 flex flex-col gap-1.5 border-t border-charcoal/10 pt-3">
                      {products.map((product) => (
                        <li
                          key={product.id}
                          className="flex items-center justify-between gap-3 text-xs text-charcoal/60"
                        >
                          <span className="truncate">{product.nameVi}</span>
                          <PriceDisplay price={product.price} className="shrink-0 text-[11px]" />
                        </li>
                      ))}
                    </ul>
                  )}

                  <span className="mt-3 inline-flex w-fit items-center text-xs font-medium uppercase tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors group-hover:text-purple">
                    KHÁM PHÁ {mood.labelVi} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
