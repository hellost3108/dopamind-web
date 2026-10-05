import Link from "next/link";
import { str } from "@/lib/cms/fields";
import type { SectionContent } from "@/lib/cms/types";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal";

/**
 * Compact closing action — heading left, copy + two links right from Tablet
 * Portrait; stacked with full-width buttons on phones. No motion by design.
 */
export function BrandStoryCTA({ content }: { content: SectionContent }) {
  const titleLines = str(content, "title").split("\n").filter(Boolean);
  return (
    <section
      aria-labelledby="bs-cta-title"
      className="bg-[color-mix(in_srgb,var(--color-lavender)_34%,var(--color-cloud-milk))] py-[clamp(64px,7vw,104px)]"
    >
      <div className="bs-wrap grid items-end gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-[clamp(32px,5vw,96px)]">
        <div className="bs-cq">
          <h2
            id="bs-cta-title"
            className="font-serif text-[clamp(1.875rem,9.4cqi,4.5rem)] font-normal leading-[1.08] tracking-[-0.02em] text-charcoal"
          >
            {titleLines.map((line, index) => (
              <span key={`${line}-${index}`} className={index === titleLines.length - 1 ? "bs-accent block italic" : "block"}>{line}</span>
            ))}
          </h2>
        </div>

        <div>
          <p className="max-w-[28rem] text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-charcoal/70">
            {str(content, "body")}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={str(content, "primaryHref") || "/san-pham"}
              className={`group flex min-h-12 items-center justify-center gap-2 bg-charcoal px-7 text-xs font-medium tracking-[0.14em] text-cloud-milk transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-purple sm:justify-start ${FOCUS}`}
            >
              {str(content, "primaryLabel")}
              <span
                aria-hidden
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href={str(content, "secondaryHref") || "/#nghi-thuc-15-phut"}
              className={`flex min-h-12 items-center justify-center border border-charcoal px-7 text-xs font-medium tracking-[0.14em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cloud-milk sm:justify-start ${FOCUS}`}
            >
              {str(content, "secondaryLabel")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
