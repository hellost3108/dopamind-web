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

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-cloud-milk">
      {/* Effect 3 — soft Lavender/Peach/Mint aurora, slow drift */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-[15%] left-[-15%] h-[65%] w-[65%] animate-aurora-drift rounded-full opacity-70 blur-3xl"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-lavender), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-8%] h-[60%] w-[60%] animate-aurora-drift rounded-full opacity-60 blur-3xl"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-peach), transparent 70%)",
            animationDelay: "-12s",
          }}
        />
        <div
          className="absolute left-[30%] top-[25%] h-[42%] w-[42%] animate-aurora-drift rounded-full opacity-50 blur-3xl"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-mint), transparent 70%)",
            animationDelay: "-24s",
          }}
        />
      </div>

      {/* Effect 5 — microscopic grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "180px 180px" }}
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col px-[clamp(20px,4vw,64px)] pb-[clamp(56px,8vh,104px)] pt-[clamp(108px,16vh,168px)] xl:grid xl:grid-cols-12 xl:items-center xl:gap-x-6 xl:pt-[clamp(96px,9vh,136px)]">
        {/* Media — stacked band on mobile/tablet, dominant absolute right panel from Desktop (xl) up */}
        <div
          className="relative order-1 -mx-[clamp(20px,4vw,64px)] mb-10 aspect-[4/5] w-[calc(100%+2*clamp(20px,4vw,64px))] sm:aspect-[16/10] lg:aspect-[21/11] xl:absolute xl:inset-y-0 xl:right-[calc(-1*clamp(20px,4vw,64px))] xl:order-none xl:mb-0 xl:aspect-auto xl:w-[58%] 2xl:w-[54%]"
        >
          <CampaignMedia className="h-full w-full" />
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
        <div className="relative z-10 order-2 xl:order-none xl:col-span-7">
          <RevealLine
            as="p"
            delayMs={0}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/55 sm:text-xs"
          >
            DOPAMIND / MIND–SKIN CARE
          </RevealLine>

          <h1 className="mt-5 font-sans font-medium tracking-[-0.01em] text-charcoal sm:mt-6">
            <RevealLine
              delayMs={120}
              className="text-[clamp(2.5rem,6vw,7.5rem)] leading-[1.3]"
            >
              HÔM NAY,
            </RevealLine>
            <RevealLine
              delayMs={220}
              className="text-[clamp(2.5rem,6vw,7.5rem)] leading-[1.3]"
            >
              BẠN ĐÃ CỐ GẮNG ĐỦ RỒI.
            </RevealLine>
          </h1>

          <RevealLine
            as="p"
            delayMs={380}
            className="mt-6 text-[clamp(1.25rem,2.6vw,1.75rem)] font-medium text-purple sm:mt-8"
          >
            Dành 15 phút cho chính mình.
          </RevealLine>

          <RevealLine as="div" delayMs={460} className="mt-5 max-w-[34rem] sm:mt-6">
            <p className="text-[clamp(0.95rem,1.4vw,1.0625rem)] leading-relaxed text-charcoal/65">
              15 phút để làn da được chăm sóc, tâm trí được thả lỏng và bạn có thể chậm lại sau
              một ngày dài.
            </p>
          </RevealLine>

          <RevealLine as="div" delayMs={560} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-10">
            <Link
              href="#quick-shop"
              className="flex min-h-11 items-center bg-charcoal px-6 text-xs font-medium tracking-[0.14em] text-cloud-milk transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-purple"
            >
              BẮT ĐẦU RESET ↗
            </Link>
            <Link
              href="/san-pham"
              className="flex min-h-11 items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple"
            >
              KHÁM PHÁ MẶT NẠ →
            </Link>
          </RevealLine>

          <RevealLine as="div" delayMs={660} className="mt-10 xl:mt-14">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
                <span
                  aria-hidden
                  className="absolute inset-0 animate-breathe rounded-full"
                  style={{
                    backgroundImage: "radial-gradient(circle, var(--color-purple), transparent 72%)",
                  }}
                />
                <span className="relative text-xl font-medium tracking-[0.04em] text-charcoal sm:text-2xl">
                  15:00
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/55 sm:text-xs">
                15 PHÚT DÀNH CHO BẠN
              </p>
            </div>
          </RevealLine>
        </div>
      </div>
    </section>
  );
}
