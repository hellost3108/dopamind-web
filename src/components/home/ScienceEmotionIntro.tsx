"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";
import { itemStr, list, str } from "@/lib/cms/fields";
import type { SectionContent } from "@/lib/cms/types";
import { FormattedText } from "@/components/content/FormattedText";
import { splitRichText } from "@/lib/rich-text/content";

const PANEL_GRADIENTS = [
  "linear-gradient(150deg, var(--color-peach), var(--color-lavender) 60%, var(--color-cloud-milk) 100%)",
  "linear-gradient(150deg, var(--color-mint), var(--color-cloud-milk) 82%)",
];

/**
 * Compact DOPA × MIND intro — brand concepts as editorial art direction, not
 * clinical claims. One soft reveal only, per CLAUDE.md > DOPA / MIND PANELS.
 */
export function ScienceEmotionIntro({ content }: { content: SectionContent }) {
  const [ref, isVisible] = useReveal<HTMLDivElement>();
  const panels = list(content, "panels");

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
            <h2 className="whitespace-pre-line font-serif text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal">
              <FormattedText value={str(content, "title")} mode="block" phrasing />
            </h2>
            <p className="mt-5 text-[clamp(0.95rem,1.2vw,1.0625rem)] leading-relaxed text-charcoal/60">
              <FormattedText value={str(content, "body")} mode="block" phrasing />
            </p>
            <Link
              href={str(content, "ctaHref") || "/cau-chuyen-dopamind"}
              className="mt-6 inline-flex min-h-11 items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple"
            >
              <FormattedText value={str(content, "ctaLabel")} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {panels.map((panel, panelIndex) => {
              const concepts = splitRichText(itemStr(panel, "concepts"), "|");
              return (
              <div
                key={`${itemStr(panel, "title")}-${panelIndex}`}
                className="flex aspect-[4/3] flex-col justify-between rounded-[10px] p-6 sm:aspect-[3/2] sm:p-8"
                style={{ backgroundImage: PANEL_GRADIENTS[panelIndex % PANEL_GRADIENTS.length] }}
              >
                <span className="font-serif text-[clamp(2rem,3.6vw,3rem)] font-medium tracking-[-0.01em] text-charcoal">
                  <FormattedText value={itemStr(panel, "title")} />
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  {concepts.map((concept, index) => (
                    <span key={concept} className="flex items-center gap-2">
                      {index > 0 && <span aria-hidden className="text-charcoal/30">·</span>}
                      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal/70">
                        <FormattedText value={concept} mode="block" phrasing />
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
