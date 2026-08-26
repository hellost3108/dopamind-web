"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Cinematic finale — pure typography, no product cards. Three lines reveal
 * in sequence as the reader scrolls down through generous vertical space
 * (each its own one-shot fade+lift), "15 PHÚT." dramatically larger as the
 * payoff. Deliberately NOT scroll-scrubbed/pinned — this page already spends
 * its two scroll-scrub effects on StoryHero and ChaosToCalm; per CLAUDE.md >
 * "16. MOTION BUDGET" everything else stays to subtle opacity/translate.
 */
export function StoryManifesto() {
  const [ref1, v1] = useReveal<HTMLDivElement>();
  const [ref2, v2] = useReveal<HTMLDivElement>();
  const [ref3, v3] = useReveal<HTMLDivElement>();

  const lineClass =
    "max-w-[22ch] text-[clamp(1.5rem,3.8vw,3rem)] font-medium uppercase leading-[1.2] tracking-[-0.01em] text-charcoal transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <section className="relative overflow-hidden bg-cloud-milk py-[clamp(64px,10vh,120px)]">
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-[clamp(56px,10vh,120px)] px-[clamp(20px,4vw,64px)] text-center">
        <p
          ref={ref1}
          className={cn(lineClass, v1 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}
        >
          DOPAMIND KHÔNG YÊU CẦU BẠN
          <br />
          LÀM THÊM.
        </p>

        <p
          ref={ref2}
          className={cn(lineClass, v2 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}
        >
          CHỈ MỜI BẠN
          <br />
          DỪNG LẠI.
        </p>

        <div
          ref={ref3}
          className={cn(
            "flex flex-col items-center transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            v3 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <p className="font-sans text-[clamp(5rem,20vw,15rem)] font-medium leading-[0.95] tracking-[-0.02em] text-purple">
            15 PHÚT.
          </p>
          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.28em] text-charcoal/40">
            DOPAMIND / MIND–SKIN CARE
          </p>
        </div>
      </div>
    </section>
  );
}
