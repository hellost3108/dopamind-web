"use client";

import { useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { MOODS } from "@/lib/moods";
import { getPrimaryProductForMood } from "@/lib/products";
import { ProductImage } from "@/components/product/ProductImage";
import { cn } from "@/lib/utils";
import type { Mood } from "@/lib/types";

const PANEL_BG: Record<Mood["colorToken"], string> = {
  mint: "linear-gradient(172deg, var(--color-mint) 0%, var(--color-cloud-milk) 88%)",
  lavender: "linear-gradient(172deg, var(--color-lavender) 0%, var(--color-cloud-milk) 88%)",
  butter: "linear-gradient(172deg, var(--color-butter) 0%, var(--color-cloud-milk) 88%)",
  peach: "linear-gradient(172deg, var(--color-peach) 0%, var(--color-cloud-milk) 88%)",
};

/**
 * Signature desktop effect: four panels sit at equal width; hovering (or
 * focusing into) one expands it to ~42% while the rest contract, revealing
 * the mood's product. Widths animate via `flex-grow` (a plain number is a
 * valid CSS transition target, so no JS-computed percentages are needed).
 * A soft pointer-following spotlight tracks the cursor inside the active
 * panel only, written straight to CSS vars on the DOM node — same
 * ref-driven, non-React-state pattern as useScrollScrub — to avoid a
 * re-render on every mousemove. See CLAUDE.md > MOTION.
 *
 * Below xl (mobile + tablet) this becomes a touch-first snap carousel with
 * every mood's content always expanded — no hover-only interaction, per
 * CLAUDE.md > RESPONSIVE-FIRST.
 */
export function MoodFinder() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>, index: number) {
    const el = panelRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <section className="relative bg-cloud-milk py-[clamp(72px,10vh,144px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="max-w-[38rem]">
          <h2 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal">
            HÔM NAY BẠN CẢM THẤY THẾ NÀO?
          </h2>
          <p className="mt-4 text-[clamp(0.95rem,1.3vw,1.0625rem)] text-charcoal/60">
            Đừng bắt đầu bằng loại da.
            <br />
            Hãy bắt đầu bằng cảm giác của hôm nay.
          </p>
        </div>

        {/* Desktop (xl+): expanding panel row */}
        <div
          className="mt-12 hidden h-[clamp(480px,50vw,620px)] gap-2 xl:flex"
          onMouseLeave={() => setActiveIndex(null)}
        >
          {MOODS.map((mood, index) => {
            const isActive = activeIndex === index;
            const product = getPrimaryProductForMood(mood.slug);

            return (
              <div
                key={mood.slug}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onPointerMove={(event) => handlePointerMove(event, index)}
                style={{
                  backgroundImage: PANEL_BG[mood.colorToken],
                  flexGrow: isActive ? 2.2 : 1,
                  flexBasis: 0,
                }}
                className="group relative flex min-w-0 flex-col overflow-hidden transition-[flex-grow] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.6), transparent 60%)",
                    mixBlendMode: "soft-light",
                  }}
                />

                <div className="relative flex h-full flex-col p-6 2xl:p-8">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/45">
                    {mood.labelEn}
                  </span>

                  <div className="mt-auto">
                    <span
                      className={cn(
                        "block font-medium uppercase leading-[1.05] text-charcoal transition-[font-size] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isActive
                          ? "text-[clamp(1.75rem,2.6vw,2.75rem)] tracking-[-0.01em]"
                          : "text-[clamp(1.05rem,1.5vw,1.375rem)] tracking-[0.01em]"
                      )}
                    >
                      {mood.labelVi}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive
                        ? "mt-5 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[26ch] text-[0.95rem] italic text-charcoal/70">
                        “{mood.promptVi}”
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-charcoal/50">
                        {mood.taglineVi}
                      </p>

                      {product && (
                        <>
                          <div className="animate-soft-drift relative mt-5 aspect-square w-full max-w-[180px] overflow-hidden">
                            <ProductImage mood={mood.slug} className="h-full w-full" />
                          </div>
                          <p className="mt-4 max-w-[30ch] text-sm text-charcoal/65">
                            {product.benefitVi}
                          </p>
                        </>
                      )}

                      <Link
                        href={`/san-pham?mood=${mood.slug}`}
                        className="mt-5 inline-flex min-h-11 items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple"
                      >
                        TÌM MẶT NẠ PHÙ HỢP →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile + tablet (<xl): touch-first snap carousel, always expanded */}
        <div className="[&::-webkit-scrollbar]:hidden -mx-[clamp(20px,4vw,64px)] mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,4vw,64px)] pb-2 [scrollbar-width:none] xl:hidden">
          {MOODS.map((mood) => {
            const product = getPrimaryProductForMood(mood.slug);

            return (
              <div
                key={mood.slug}
                className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden sm:w-[54%] md:w-[42%]"
                style={{ backgroundImage: PANEL_BG[mood.colorToken] }}
              >
                <div className="flex flex-col gap-4 p-6 sm:p-7">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/45">
                    {mood.labelEn}
                  </span>
                  <span className="text-[clamp(1.5rem,5vw,2rem)] font-medium uppercase leading-[1.05] text-charcoal">
                    {mood.labelVi}
                  </span>
                  <p className="text-[0.95rem] italic text-charcoal/70">“{mood.promptVi}”</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-charcoal/50">
                    {mood.taglineVi}
                  </p>

                  {product && (
                    <>
                      <div className="relative aspect-square w-full max-w-[220px] overflow-hidden">
                        <ProductImage mood={mood.slug} className="h-full w-full" />
                      </div>
                      <p className="text-sm text-charcoal/65">{product.benefitVi}</p>
                    </>
                  )}

                  <Link
                    href={`/san-pham?mood=${mood.slug}`}
                    className="mt-1 inline-flex min-h-11 w-fit items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4"
                  >
                    TÌM MẶT NẠ PHÙ HỢP →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
