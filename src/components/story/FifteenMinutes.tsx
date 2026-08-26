"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Signature effect: 15:00 BREATHING AURA. The page's most memorable pause —
 * near-full-screen, almost no clutter, one slow aura (`.animate-story-breathe`,
 * scale 0.92→1.08 over 8s) behind the giant timer. See CLAUDE.md > "SECTION 5
 * — 15:00" and "13. 15:00 BREATHING AURA".
 */
export function FifteenMinutes() {
  const [ref, isVisible] = useReveal<HTMLDivElement>();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-cloud-milk">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[min(78vw,78svh,820px)] w-[min(78vw,78svh,820px)] animate-story-breathe rounded-full blur-3xl"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-lavender), var(--color-mint) 55%, transparent 76%)",
          }}
        />
      </div>

      <div
        ref={ref}
        className={cn(
          "relative mx-auto flex w-full max-w-[900px] flex-col items-center px-[clamp(20px,4vw,64px)] py-[clamp(96px,14vh,176px)] text-center transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-charcoal/50">
          15 PHÚT DÀNH CHO BẠN.
        </p>

        <h2 className="mt-3 font-sans text-[clamp(7rem,20vw,19rem)] font-medium leading-none tracking-[-0.02em] text-charcoal tabular-nums">
          15:00
        </h2>

        <p className="mt-6 max-w-[30rem] text-[clamp(0.95rem,1.3vw,1.0625rem)] leading-relaxed text-charcoal/65">
          Không cần biến mất cả ngày.
          <br />
          Chỉ cần một khoảng thời gian thực sự thuộc về bạn.
        </p>

        <Link
          href="/#nghi-thuc-15-phut"
          className="mt-10 flex min-h-11 items-center px-3 text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple sm:mt-12"
        >
          KHÁM PHÁ NGHI THỨC 15 PHÚT →
        </Link>
      </div>
    </section>
  );
}
