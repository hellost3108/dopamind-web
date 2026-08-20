import Link from "next/link";
import { MOODS } from "@/lib/moods";
import type { Mood } from "@/lib/types";

const TILE_GRADIENT: Record<Mood["colorToken"], string> = {
  mint: "linear-gradient(150deg, var(--color-mint), var(--color-cloud-milk) 78%)",
  lavender: "linear-gradient(150deg, var(--color-lavender), var(--color-cloud-milk) 78%)",
  butter: "linear-gradient(150deg, var(--color-butter), var(--color-cloud-milk) 78%)",
  peach: "linear-gradient(150deg, var(--color-peach), var(--color-cloud-milk) 78%)",
};

/**
 * Compact, commerce-focused mood picker — not the full Mood Finder (later
 * phase). Reuses the Phase 1 MOODS data so labels stay in sync with the
 * mega menu's mood section.
 */
export function QuickShop() {
  return (
    <section
      id="quick-shop"
      className="relative -mt-[clamp(24px,4vh,56px)] bg-cloud-milk pb-[clamp(64px,9vh,128px)] pt-[clamp(64px,9vh,128px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(207,233,223,0.28), rgba(248,247,243,0))",
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="max-w-[36rem]">
          <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.01em] text-charcoal">
            HÔM NAY BẠN CẦN GÌ?
          </h2>
          <p className="mt-4 text-[clamp(0.95rem,1.3vw,1.0625rem)] text-charcoal/60">
            Chọn một trạng thái. DOPAMIND sẽ dẫn bạn đến chiếc mặt nạ phù hợp.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
          {MOODS.map((mood) => (
            <Link
              key={mood.slug}
              href={`/san-pham?mood=${mood.slug}`}
              className="group relative flex min-h-[132px] flex-col justify-between overflow-hidden p-5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 sm:min-h-[168px] sm:p-6"
              style={{ backgroundImage: TILE_GRADIENT[mood.colorToken] }}
            >
              <span className="text-[10px] uppercase tracking-[0.18em] text-charcoal/45">
                {mood.labelEn}
              </span>
              <span className="flex items-end justify-between gap-2">
                <span className="text-lg font-medium uppercase tracking-[0.01em] text-charcoal sm:text-xl">
                  {mood.labelVi}
                </span>
                <span
                  aria-hidden
                  className="text-lg text-charcoal/50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
