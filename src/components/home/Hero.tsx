import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CampaignMedia } from "@/components/home/CampaignMedia";

const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** One line of the kinetic masked-typography reveal — see CLAUDE.md > MOTION. */
function RevealLine({
  children,
  delayMs = 0,
  as: Tag = "span",
  className,
}: {
  children: ReactNode;
  delayMs?: number;
  as?: "span" | "p" | "div";
  className?: string;
}) {
  return (
    <Tag className="block overflow-hidden">
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
 * Compact editorial hero — magazine-cover composition (~50/50 text/media,
 * 78–88svh, controlled max-w-[1600px]) instead of a full 100svh animation
 * showcase. Effect budget is intentionally three things only: masked text
 * entrance, CampaignMedia's existing subtle cinematic zoom, and one soft
 * Lavender atmosphere glow — see CLAUDE.md > HERO EFFECT BUDGET.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-cloud-milk">
      {/* Effect 3 — one soft Lavender atmosphere glow, slow drift */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-[15%] left-[-15%] h-[60%] w-[60%] animate-aurora-drift rounded-full opacity-25 blur-3xl"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-lavender), transparent 70%)",
          }}
        />
      </div>

      {/* Effect — microscopic print grain, static (not part of the motion budget) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "180px 180px" }}
      />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col px-[clamp(20px,4vw,64px)] pb-[clamp(48px,7vh,88px)] pt-[clamp(100px,15vh,152px)] xl:grid xl:min-h-[82svh] xl:grid-cols-12 xl:items-center xl:gap-x-6 xl:pt-[clamp(92px,9vh,128px)]">
        {/* Media — stacked band on mobile/tablet, ~50% dominant right panel from Desktop (xl) up */}
        <div className="relative order-1 -mx-[clamp(20px,4vw,64px)] mb-9 aspect-[4/5] w-[calc(100%+2*clamp(20px,4vw,64px))] sm:aspect-[16/10] lg:aspect-[21/11] xl:absolute xl:inset-y-0 xl:right-[calc(-1*clamp(20px,4vw,64px))] xl:order-none xl:mb-0 xl:aspect-auto xl:w-[50%] 2xl:w-[48%]">
          <CampaignMedia className="h-full w-full" variant="hero" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 xl:block"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-cloud-milk) 0%, rgba(248,247,243,0) 100%)",
            }}
          />
        </div>

        {/* Text column */}
        <div className="relative z-10 order-2 xl:order-none xl:col-span-6">
          <RevealLine
            as="p"
            delayMs={0}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/55 sm:text-xs"
          >
            DOPAMIND MASK STORY / MIND–SKIN CARE
          </RevealLine>

          <h1 className="mt-5 font-serif font-medium tracking-[-0.01em] text-charcoal sm:mt-6">
            <RevealLine delayMs={100} className="text-[clamp(2.75rem,6.2vw,6.25rem)] leading-[1.08]">
              Mask
            </RevealLine>
            <RevealLine
              delayMs={260}
              className="text-[clamp(2.75rem,6.2vw,6.25rem)] italic leading-[1.08] text-purple"
            >
              Skin Mind
            </RevealLine>
          </h1>

          <RevealLine as="div" delayMs={360} className="mt-6 max-w-[30rem] sm:mt-7">
            <p className="text-[clamp(0.95rem,1.3vw,1.0625rem)] leading-relaxed text-charcoal/65">
              Dành 15 phút để làn da được chăm sóc và bạn có một khoảng thời gian thật sự dành cho
              chính mình.
            </p>
          </RevealLine>

          <RevealLine
            as="div"
            delayMs={420}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-10"
          >
            <Link
              href="/san-pham"
              className="group flex min-h-11 items-center gap-2 border border-charcoal px-6 text-xs font-medium tracking-[0.14em] text-charcoal transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-charcoal hover:text-cloud-milk"
            >
              KHÁM PHÁ SẢN PHẨM
              <span className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/cau-chuyen-dopamind"
              className="flex min-h-11 items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple"
            >
              CÂU CHUYỆN CỦA CHÚNG TÔI →
            </Link>
          </RevealLine>
        </div>
      </div>
    </section>
  );
}
