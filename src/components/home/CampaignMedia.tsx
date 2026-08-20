import { cn } from "@/lib/utils";

/**
 * Placeholder for the Hero's lifestyle campaign photography/film — no real
 * asset exists yet (see CLAUDE.md > COMMERCE, and the Phase 2 report for the
 * full asset request). Renders a mood-toned gradient field so composition,
 * overlap, and the cinematic-zoom motion can still be validated honestly,
 * instead of a broken image or stock photography.
 *
 * Expected real assets, once photographed/filmed (drop in `public/campaign/`):
 *   public/campaign/hero-desktop.jpg  — ~4:5 or 3:4, 2400px+ wide, subject
 *                                        clear of the left ~45% (text overlap
 *                                        zone) and safe-framed for both
 *                                        landscape (1181–1599px) and large
 *                                        desktop (1600px+) crops
 *   public/campaign/hero-mobile.jpg   — ~4:5 crop, subject centered/right,
 *                                        safe-framed for a full-bleed band
 *   public/campaign/hero.mp4          — optional motion loop, same framing
 *                                        as hero-desktop, silent/looping,
 *                                        used in place of the CSS zoom
 */
export function CampaignMedia({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      role="img"
      aria-label="Hình ảnh chiến dịch DOPAMIND — nghi thức 15 phút mỗi ngày"
    >
      <div
        aria-hidden
        className="absolute inset-0 animate-cinematic-zoom"
        style={{
          backgroundImage:
            "linear-gradient(155deg, var(--color-lavender) 0%, var(--color-peach) 55%, var(--color-mint) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 75% 18%, rgba(248,247,243,0) 0%, rgba(248,247,243,0.32) 100%)",
        }}
      />
      <span className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.2em] text-charcoal/40 sm:bottom-6 sm:left-6">
        Ảnh minh hoạ chiến dịch
      </span>
    </div>
  );
}
