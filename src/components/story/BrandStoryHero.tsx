import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Orb } from "@/components/story/StoryArt";

const LABELS = ["SKIN SCIENCE", "MIND RESET", "MASK EXPERIENCE"] as const;

/** One masked line: rises through an overflow mask (reuses the site's reveal-up keyframes, 900ms). */
function MaskLine({
  children,
  delayMs = 0,
  headline = false,
  as: Tag = "span",
  className,
}: {
  children: ReactNode;
  delayMs?: number;
  headline?: boolean;
  as?: "span" | "p" | "div";
  className?: string;
}) {
  return (
    <Tag className={headline ? "bs-hl" : "block overflow-hidden"}>
      <span
        className={cn("block animate-reveal-up", className)}
        style={{ animationDelay: `${delayMs}ms` }}
      >
        {children}
      </span>
    </Tag>
  );
}

/**
 * Story hero — Cloud Milk editorial cover. ~40% type / ~60% photograph from
 * Tablet Landscape up; stacked (type first, photo second) below. Effect budget
 * is exactly three: (1) masked headline reveal, (2) 30s image breathing,
 * (3) one optical light layer drifting a few pixels. Orbs are static.
 */
export function BrandStoryHero() {
  return (
    <section aria-labelledby="bs-hero-title" className="relative isolate overflow-hidden bg-cloud-milk">
      <div className="bs-wrap">
        <div className="relative grid lg:min-h-[min(78svh,800px)] lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] xl:grid-cols-[minmax(0,40fr)_minmax(0,60fr)]">
          {/* Type column */}
          <div className="relative z-10 flex flex-col justify-center pb-9 pt-[clamp(40px,9vw,72px)] lg:py-[clamp(56px,7vh,96px)] lg:pb-[clamp(56px,7vh,96px)] lg:pr-[clamp(20px,2.6vw,48px)]">
            <div className="bs-cq max-w-[36rem] lg:max-w-none">
              <MaskLine
                as="p"
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/60 sm:text-xs"
              >
                DOPAMIND / MIND–SKIN CARE
              </MaskLine>

              <h1
                id="bs-hero-title"
                className="mt-5 font-serif text-[clamp(2.4rem,15cqi,6.25rem)] font-normal leading-[1.03] tracking-[-0.03em] text-charcoal sm:mt-6"
              >
                <MaskLine headline delayMs={90}>
                  DOPAMIND
                </MaskLine>
                <MaskLine headline delayMs={180}>
                  Hơn cả
                </MaskLine>
                <MaskLine headline delayMs={270} className="bs-accent italic">
                  một chiếc
                </MaskLine>
                <MaskLine headline delayMs={360} className="bs-accent italic">
                  mặt nạ.
                </MaskLine>
              </h1>

              <MaskLine
                as="div"
                delayMs={440}
                className="mt-7 max-w-[30rem] sm:mt-9"
              >
                <p className="text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-charcoal/70">
                  DOPAMIND được tạo nên từ DOPA + MIND — nơi chăm sóc da không chỉ là một bước
                  trong routine, mà còn là một khoảng thời gian để bạn chậm lại và trở về với chính
                  mình.
                </p>
              </MaskLine>

              <MaskLine as="div" delayMs={520} className="mt-5 max-w-[30rem]">
                <p className="flex items-center gap-3 text-[13px] font-medium tracking-[0.02em] text-charcoal/60">
                  <span aria-hidden className="h-px w-8 shrink-0 bg-purple" />
                  Một chiếc mặt nạ là sản phẩm. 15 phút mới là trải nghiệm.
                </p>
              </MaskLine>
            </div>
          </div>

          {/* Photograph — full-bleed band when stacked, bleeds to the right edge from lg */}
          <div className="bs-hero-media relative -mx-[clamp(20px,4vw,64px)] aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/10] lg:mx-0 lg:-mr-[clamp(20px,4vw,64px)] lg:aspect-auto">
            <div className="bs-breathe absolute inset-0">
              <Image
                src="/images/homepage/hero/H02.png"
                alt="Một người phụ nữ nhắm mắt thư giãn, đặt tay lên má với mặt nạ giấy trong nghi thức chăm sóc da DOPAMIND, giữa ánh sáng lavender dịu nhẹ và những đóa hoa nhỏ"
                fill
                preload
                sizes="(min-width: 1600px) 960px, (min-width: 835px) 58vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "68% 30%" }}
              />
            </div>
            <div aria-hidden className="bs-light pointer-events-none absolute -inset-[4%]" />
            {/* Mobile / tablet-portrait: one pearl in the photo's left haze, clear of the face and hands */}
            <Orb tint="lavender" className="bottom-[12%] left-[7%] w-[16%] lg:hidden" />
          </div>

          {/* Tablet portrait — the text block is narrow, so a pearl pair balances its open right side */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] hidden h-[46%] md:block lg:hidden"
          >
            <Orb tint="lavender" className="right-[1%] top-[28%] w-[clamp(110px,20vw,170px)]" />
            <Orb tint="peach" className="right-[13%] top-[14%] w-[clamp(26px,4vw,38px)]" />
          </div>

          {/* Desktop optical forms — straddle the seam so the photo feels lit from within */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] hidden lg:block">
            <Orb tint="lavender" className="left-[43%] top-[57%] w-[clamp(96px,11vw,190px)]" />
            <Orb tint="peach" className="left-[41%] top-[47%] w-[clamp(26px,2.8vw,48px)]" />
            <Orb tint="purple" className="left-[60%] top-[10%] w-[clamp(38px,4.6vw,80px)] opacity-70" />
          </div>
        </div>

        {/* Editorial labels — brand language only, not certifications */}
        <ul className="grid grid-cols-3 gap-x-3 border-t border-charcoal/10 py-4 text-[10px] font-medium uppercase leading-snug tracking-[0.18em] text-charcoal/60 sm:text-[11px] lg:py-5">
          {LABELS.map((label, i) => (
            <li key={label} className="flex items-baseline gap-2">
              <span aria-hidden className="text-purple">
                0{i + 1}
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
