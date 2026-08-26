"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type Belief = {
  number: string;
  headline: string;
  supportVi: string;
  align: "start" | "end";
};

const BELIEFS: Belief[] = [
  {
    number: "01",
    headline: "Chăm da\nkhông cần phải vội.",
    supportVi: "Một nghi thức tốt không cần thêm áp lực vào ngày của bạn.",
    align: "start",
  },
  {
    number: "02",
    headline: "Hiệu quả\nkhông cần được phóng đại.",
    supportVi: "DOPAMIND chỉ công bố những gì có dữ liệu chính thức để chứng minh.",
    align: "end",
  },
  {
    number: "03",
    headline: "Self-care\nkhông cần phải hoàn hảo.",
    supportVi:
      "Không phải ngày nào bạn cũng cần làm thật nhiều. Đôi khi, chỉ cần làm một điều nhỏ cho chính mình.",
    align: "start",
  },
];

function BeliefRow({ belief }: { belief: Belief }) {
  const [ref, isVisible] = useReveal<HTMLDivElement>();
  const isEnd = belief.align === "end";

  return (
    <div
      ref={ref}
      className={cn(
        "border-t border-charcoal/15 pt-8 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:pt-10",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        isEnd ? "text-left lg:text-right" : "text-left"
      )}
    >
      <div className={cn("flex flex-col gap-6", isEnd ? "lg:items-end" : "lg:items-start")}>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/40">
          {belief.number}
        </span>
        <h2
          className={cn(
            "max-w-[20ch] whitespace-pre-line text-[clamp(2rem,5.4vw,4.25rem)] font-medium uppercase leading-[1.05] tracking-[-0.015em] text-charcoal",
            isEnd && "lg:ml-auto"
          )}
        >
          {belief.headline}
        </h2>
        <p className={cn("max-w-[38ch] text-[clamp(0.95rem,1.3vw,1.0625rem)] leading-relaxed text-charcoal/60", isEnd && "lg:ml-auto")}>
          {belief.supportVi}
        </p>
      </div>
    </div>
  );
}

/**
 * "ĐIỀU DOPAMIND TIN VÀO" — three full-width statements, no card borders, no
 * icons. Alternating left/right alignment across the three rows is the only
 * asymmetry device, per CLAUDE.md > "SECTION 6". Each row is its own quiet
 * one-shot reveal — this section spends none of the page's five primary
 * effects.
 */
export function Beliefs() {
  return (
    <section className="relative bg-cloud-milk py-[clamp(88px,12vh,168px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
          ĐIỀU DOPAMIND TIN VÀO
        </p>

        <div className="mt-10 flex flex-col gap-16 sm:mt-12 sm:gap-20">
          {BELIEFS.map((belief) => (
            <BeliefRow key={belief.number} belief={belief} />
          ))}
        </div>
      </div>
    </section>
  );
}
