"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const RHYTHM_LABELS = ["DEADLINE", "THIẾU NGỦ", "ĐIỀU HÒA", "ÁNH NẮNG", "SCREEN TIME", "NHỊP SỐNG"];

/**
 * Text-only, asymmetric editorial statement — no image, no cards, so it
 * reads distinctly from the homepage's image-led SkinScience section. One
 * quiet reveal only, per CLAUDE.md > "SECTION 3 — MIND–SKIN CARE" (this
 * page's five-effect motion budget is spent elsewhere).
 */
export function MindSkinCare() {
  const [ref, isVisible] = useReveal<HTMLDivElement>();

  return (
    <section className="relative bg-cloud-milk py-[clamp(88px,12vh,168px)]">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        )}
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end lg:gap-16">
          <h2 className="max-w-[18ch] text-[clamp(2.1rem,5.2vw,4.5rem)] font-medium uppercase leading-[1.05] tracking-[-0.015em] text-charcoal">
            Làn da cũng cảm nhận
            <br />
            nhịp độ của một ngày.
          </h2>

          <div className="max-w-[30rem] lg:justify-self-end lg:pb-1">
            <ul className="flex flex-wrap gap-x-3 gap-y-2 border-t border-charcoal/15 pt-6">
              {RHYTHM_LABELS.map((label, i) => (
                <li
                  key={label}
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-charcoal/45"
                >
                  {label}
                  {i < RHYTHM_LABELS.length - 1 && (
                    <span aria-hidden className="ml-3 text-charcoal/20">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[clamp(1rem,1.4vw,1.1875rem)] leading-relaxed text-charcoal/65">
              DOPAMIND gọi đó là <span className="text-purple">MIND–SKIN CARE</span>: một
              cách nhìn chăm sóc da như một phần của nhịp sống, chứ không phải một nhiệm vụ
              tách biệt khỏi nó.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
