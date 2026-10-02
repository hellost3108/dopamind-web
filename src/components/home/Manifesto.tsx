"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Pure typographic statement, no ecommerce UI — see CLAUDE.md > MANIFESTO.
 * One slow reveal only (fade + lift) for the whole block as it enters the
 * viewport, via the same one-shot useReveal used by SkinScience/NewArrivals/
 * DopamindMoments — no per-line stagger, so this doesn't compete with the
 * homepage's six signature motion moments. "15 PHÚT" is the one dramatically
 * oversized element per the brief.
 */
export function Manifesto() {
  const [ref, isVisible] = useReveal<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden bg-cloud-milk py-[clamp(120px,20vh,240px)]">
      <div
        ref={ref}
        className={cn(
          "mx-auto flex max-w-[900px] flex-col items-center px-[clamp(20px,4vw,64px)] text-center transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <p className="max-w-[20ch] text-[clamp(1.5rem,3.6vw,2.75rem)] font-medium leading-[1.25] tracking-[-0.01em] text-charcoal">
          BẠN KHÔNG CẦN
          <br />
          MỘT CUỘC SỐNG HOÀN HẢO
          <br />
          ĐỂ CẢM THẤY TỐT HƠN.
        </p>

        <p className="mt-14 text-[clamp(1.05rem,1.6vw,1.375rem)] font-medium uppercase tracking-[0.08em] text-charcoal/55 sm:mt-16">
          ĐÔI KHI, BẠN CHỈ CẦN
        </p>

        <p className="mt-2 font-sans text-[clamp(5rem,20vw,15rem)] font-medium leading-[0.95] tracking-[-0.02em] text-purple">
          15 PHÚT.
        </p>
      </div>
    </section>
  );
}
