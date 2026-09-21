import { getImageProps } from "next/image";
import { StoryReveal } from "@/components/story/StoryReveal";

const CLOSING_ALT =
  "Người phụ nữ mặc áo len kem ngồi thư thả, tay đặt lên má và nhìn xa xăm trong ánh sáng ấm áp — một khoảng thời gian dành cho bản thân";

/* Art direction via <picture>: only the crop that matches the viewport is
   fetched. Portrait fills a full-width phone frame; landscape takes over from
   Large Mobile (sm, 431px) up. Both resolve to the same alt (same scene, same
   subject). The single <img> carries both focal points: 50% 22% on phones,
   62% 30% from sm up. */
const { props: landscape } = getImageProps({
  src: "/images/homepage/moments/M02.png",
  alt: CLOSING_ALT,
  fill: true,
  sizes: "(min-width: 1600px) 900px, (min-width: 1181px) 58vw, 100vw",
});
const { props: portrait } = getImageProps({
  src: "/images/homepage/ritual/R05.png",
  alt: CLOSING_ALT,
  fill: true,
  sizes: "100vw",
  className: "object-cover [object-position:50%_22%] sm:[object-position:62%_30%]",
});

/**
 * Closing brand statement — copy left (~40%), photograph right (~60%) from
 * Desktop; stacked below (split only where there is room for a large
 * statement). Single effect: the photo resolves from a ~26% mask to the full
 * frame on viewport entry (see .bs-mask) — no parallax. The quote is manifesto
 * copy, overlaid on the photo from tablet up and set below it on mobile.
 */
export function BrandClosing() {
  return (
    <section
      aria-labelledby="bs-closing-title"
      className="bg-cloud-milk py-[clamp(72px,8vw,120px)]"
    >
      <div className="bs-wrap grid items-center gap-10 md:gap-12 xl:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] xl:gap-[clamp(40px,5vw,96px)]">
        {/* Copy */}
        <div className="bs-cq max-w-[40rem] xl:max-w-none">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/60 sm:text-xs">
            CHĂM DA, NHƯNG KHÔNG CHỈ LÀ CHĂM DA
          </p>
          <h2
            id="bs-closing-title"
            className="mt-5 font-serif text-[clamp(1.875rem,9.6cqi,4.5rem)] font-normal leading-[1.08] tracking-[-0.02em] text-charcoal"
          >
            <span className="block">Một khoảng thời gian</span>
            <span className="block">dành cho làn da.</span>
            <span className="bs-accent block italic">Và dành cho bạn.</span>
          </h2>
          <p className="mt-7 max-w-[32rem] text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-charcoal/70">
            DOPAMIND muốn mỗi nghi thức chăm sóc da trở thành một khoảnh khắc bạn có thể chậm lại,
            chăm sóc bản thân và bước tiếp với cảm giác dễ chịu hơn.
          </p>
        </div>

        {/* Photograph + quote */}
        <StoryReveal className="relative">
          <div className="bs-mask relative aspect-[4/5] overflow-hidden rounded-[12px] sm:aspect-[4/3] xl:aspect-[5/4]">
            <picture>
              <source media="(min-width: 431px)" srcSet={landscape.srcSet} sizes={landscape.sizes} />
              <img {...portrait} alt={CLOSING_ALT} />
            </picture>
          </div>

          <figure className="mt-4 border-l-2 border-purple bg-cloud-milk py-1 pl-5 md:absolute md:bottom-[clamp(16px,2.4vw,36px)] md:left-[clamp(16px,2.4vw,36px)] md:mt-0 md:max-w-[22rem] md:border-l-0 md:p-[clamp(18px,2vw,28px)] xl:-left-[clamp(32px,3.6vw,64px)]">
            <blockquote>
              <p className="font-serif text-[clamp(1.0625rem,1.5vw,1.3125rem)] font-normal italic leading-snug text-charcoal">
                “Đôi khi, điều chúng ta cần không phải là làm thêm — mà chỉ là một khoảng thời
                gian thật sự dành cho mình.”
              </p>
            </blockquote>
            <figcaption className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/60">
              DOPAMIND
            </figcaption>
          </figure>
        </StoryReveal>
      </div>
    </section>
  );
}
