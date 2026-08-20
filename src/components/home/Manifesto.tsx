"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Pure typographic statement, no ecommerce UI — see CLAUDE.md > MANIFESTO.
 * Three staged reveal groups (fade + lift, staggered by transition-delay)
 * fire once as the section enters the viewport, via the same one-shot
 * useReveal used by SkinScience/NewArrivals/DopamindMoments. "15 PHÚT" is
 * the one dramatically oversized element per the brief.
 */
export function Manifesto() {
  const [ref, isVisible] = useReveal<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden bg-cloud-milk py-[clamp(120px,20vh,240px)]">
      <div
        ref={ref}
        className="mx-auto flex max-w-[900px] flex-col items-center px-[clamp(20px,4vw,64px)] text-center"
      >
        <p
          className={cn(
            "max-w-[20ch] text-[clamp(1.5rem,3.6vw,2.75rem)] font-medium leading-[1.25] tracking-[-0.01em] text-charcoal transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          BẠN KHÔNG CẦN
          <br />
          MỘT CUỘC SỐNG HOÀN HẢO
          <br />
          ĐỂ CẢM THẤY TỐT HƠN.
        </p>

        <p
          className={cn(
            "mt-14 text-[clamp(1.05rem,1.6vw,1.375rem)] font-medium uppercase tracking-[0.08em] text-charcoal/55 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-16",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
          style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
        >
          ĐÔI KHI, BẠN CHỈ CẦN
        </p>

        <p
          className={cn(
            "mt-2 font-sans text-[clamp(5rem,20vw,15rem)] font-medium leading-[0.95] tracking-[-0.02em] text-purple transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ transitionDelay: isVisible ? "420ms" : "0ms" }}
        >
          15 PHÚT.
        </p>
      </div>
    </section>
  );
}
