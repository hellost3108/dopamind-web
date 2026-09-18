"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

type ConceptPanel = {
  key: string;
  titleVi: string;
  gradient: string;
  conceptsVi: string[];
};

const PANELS: ConceptPanel[] = [
  {
    key: "dopa",
    titleVi: "DOPA",
    gradient: "linear-gradient(150deg, var(--color-peach), var(--color-lavender) 60%, var(--color-cloud-milk) 100%)",
    conceptsVi: ["SKIN SCIENCE", "FOR A BRIGHTER YOU", "Hiệu quả từ khoa học. Thành phần tinh khiết. Làn da khỏe mạnh mỗi ngày"],
  },
  {
    key: "mind",
    titleVi: "MIND",
    gradient: "linear-gradient(150deg, var(--color-mint), var(--color-cloud-milk) 82%)",
    conceptsVi: ["A CALMER MIND", "A BRIGHTER LIFE", 
      ""],
  },
];

/**
 * Compact DOPA × MIND intro — brand concepts as editorial art direction, not
 * clinical claims. One soft reveal only, per CLAUDE.md > DOPA / MIND PANELS.
 */
export function ScienceEmotionIntro() {
  const [ref, isVisible] = useReveal<HTMLDivElement>();

  return (
    <section className="relative bg-cloud-milk py-[clamp(64px,7vw,112px)]">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <div className="flex flex-col gap-10 xl:grid xl:grid-cols-[38fr_62fr] xl:items-center xl:gap-14 2xl:gap-20">
          <div className="max-w-[26rem]">
            <h2 className="font-serif text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal">
              Khoa học
              <br />
              chạm vào cảm xúc.
            </h2>
            <p className="mt-5 text-[clamp(0.95rem,1.2vw,1.0625rem)] leading-relaxed text-charcoal/60">
              Khi làn da khỏe mạnh, tâm trí cũng nhẹ nhàng hơn. Dopamind tin rằng chăm sóc da không chỉ là làm đẹp mà còn là nuôi dưỡng cảm xúc tích cực từ bên trong.
            </p>
            <Link
              href="/cau-chuyen-dopamind"
              className="mt-6 inline-flex min-h-11 items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple"
            >
              TÌM HIỂU TRIẾT LÝ THƯƠNG HIỆU →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {PANELS.map((panel) => (
              <div
                key={panel.key}
                className="flex aspect-[4/3] flex-col justify-between rounded-[10px] p-6 sm:aspect-[3/2] sm:p-8"
                style={{ backgroundImage: panel.gradient }}
              >
                <span className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-medium tracking-[-0.01em] text-charcoal">
                  {panel.titleVi}
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  {panel.conceptsVi.map((concept, index) => (
                    <span key={concept} className="flex items-center gap-2">
                      {index > 0 && <span aria-hidden className="text-charcoal/30">·</span>}
                      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal/70">
                        {concept}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
