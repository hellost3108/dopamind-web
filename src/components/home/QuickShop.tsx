import Link from "next/link";
import type { MoodSlug } from "@/lib/types";

/**
 * QuickShop-only display config. Reuses the existing mood slugs purely for
 * navigation/filtering (`/san-pham?mood=...`) but overrides the label and
 * color shown on these four tiles, so Mood Finder, the mega menu, and
 * product filtering — which read the real labels/colors from
 * src/lib/moods.ts — stay unaffected.
 */
const QUICK_SHOP_ITEMS: {
  moodSlug: MoodSlug;
  eyebrow: string;
  label: string;
  gradient: string;
}[] = [
  {
    moodSlug: "binh-tam",
    eyebrow: "MTS",
    label: "CALMING",
    gradient: "linear-gradient(150deg, var(--color-mint), var(--color-cloud-milk) 78%)",
  },
  {
    moodSlug: "tai-tao",
    eyebrow: "MTS",
    label: "HYDRATING",
    gradient: "linear-gradient(150deg, #CFE4F3, var(--color-cloud-milk) 78%)",
  },
  {
    moodSlug: "rang-ro",
    eyebrow: "MTS",
    label: "BRIGHTENING",
    gradient: "linear-gradient(150deg, var(--color-butter), var(--color-cloud-milk) 78%)",
  },
  {
    moodSlug: "yeu-thuong",
    eyebrow: "MTS",
    label: "GLOWING",
    gradient: "linear-gradient(150deg, var(--color-lavender), var(--color-cloud-milk) 78%)",
  },
];

/**
 * Compact, commerce-focused mood picker — not the full Mood Finder (later
 * phase). Tile labels/colors are QuickShop-specific (see QUICK_SHOP_ITEMS
 * above); underlying mood slugs still drive filtering.
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
            Chọn một trạng thái. Dopamind Mask Story sẽ dẫn bạn đến chiếc mặt nạ phù hợp.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
          {QUICK_SHOP_ITEMS.map((item) => (
            <Link
              key={item.moodSlug}
              href={`/san-pham?mood=${item.moodSlug}`}
              className="group relative flex min-h-[132px] flex-col justify-between overflow-hidden p-5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 sm:min-h-[168px] sm:p-6"
              style={{ backgroundImage: item.gradient }}
            >
              <span className="text-[10px] uppercase tracking-[0.18em] text-charcoal/45">
                {item.eyebrow}
              </span>
              <span className="flex items-end justify-between gap-2">
                <span className="text-lg font-medium uppercase tracking-[0.01em] text-charcoal sm:text-xl">
                  {item.label}
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
