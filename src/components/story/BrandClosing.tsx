import { StoryReveal } from "@/components/story/StoryReveal";
import { str } from "@/lib/cms/fields";
import type { SectionContent } from "@/lib/cms/types";

/**
 * Closing brand statement — copy left (~40%), photograph right (~60%) from
 * Desktop; stacked below (split only where there is room for a large
 * statement). Single effect: the photo resolves from a ~26% mask to the full
 * frame on viewport entry (see .bs-mask) — no parallax. The quote is manifesto
 * copy, overlaid on the photo from tablet up and set below it on mobile.
 */
export function BrandClosing({ content }: { content: SectionContent }) {
  const titleLines = str(content, "title").split("\n").filter(Boolean);
  return (
    <section
      aria-labelledby="bs-closing-title"
      className="bg-cloud-milk py-[clamp(72px,8vw,120px)]"
    >
      <div className="bs-wrap grid items-center gap-10 md:gap-12 xl:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] xl:gap-[clamp(40px,5vw,96px)]">
        {/* Copy */}
        <div className="bs-cq max-w-[40rem] xl:max-w-none">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/60 sm:text-xs">
            {str(content, "eyebrow")}
          </p>
          <h2
            id="bs-closing-title"
            className="mt-5 font-serif text-[clamp(1.875rem,9.6cqi,4.5rem)] font-normal leading-[1.08] tracking-[-0.02em] text-charcoal"
          >
            {titleLines.map((line, index) => (
              <span key={`${line}-${index}`} className={index === titleLines.length - 1 ? "bs-accent block italic" : "block"}>{line}</span>
            ))}
          </h2>
          <p className="mt-7 max-w-[32rem] text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-charcoal/70">
            {str(content, "body")}
          </p>
        </div>

        {/* Photograph + quote */}
        <StoryReveal className="relative">
          <div className="bs-mask relative aspect-[4/5] overflow-hidden rounded-[12px] sm:aspect-[4/3] xl:aspect-[5/4]">
            <picture>
              <source media="(min-width: 431px)" srcSet={str(content, "image")} />
              <img src={str(content, "mobileImage")} alt={str(content, "imageAlt")} className="absolute inset-0 h-full w-full object-cover [object-position:50%_22%] sm:[object-position:62%_30%]" />
            </picture>
          </div>

          <figure className="mt-4 border-l-2 border-purple bg-cloud-milk py-1 pl-5 md:absolute md:bottom-[clamp(16px,2.4vw,36px)] md:left-[clamp(16px,2.4vw,36px)] md:mt-0 md:max-w-[22rem] md:border-l-0 md:p-[clamp(18px,2vw,28px)] xl:-left-[clamp(32px,3.6vw,64px)]">
            <blockquote>
              <p className="font-serif text-[clamp(1.0625rem,1.5vw,1.3125rem)] font-normal italic leading-snug text-charcoal">
                “{str(content, "quote")}”
              </p>
            </blockquote>
            <figcaption className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/60">
              {str(content, "quoteAuthor")}
            </figcaption>
          </figure>
        </StoryReveal>
      </div>
    </section>
  );
}
