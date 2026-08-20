import { getMood } from "@/lib/moods";
import type { Mood, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLOR_TOKEN_VAR: Record<Mood["colorToken"], string> = {
  mint: "var(--color-mint)",
  lavender: "var(--color-lavender)",
  butter: "var(--color-butter)",
  peach: "var(--color-peach)",
};

/**
 * Stands in for real product photography, which doesn't exist yet. Renders
 * a mood-toned gradient atmosphere instead of a broken/fake image so layout,
 * hover, and aspect-ratio behavior can still be validated. Swap for
 * next/image once real photography is available (see Phase 1 report).
 */
export function ProductImage({
  mood,
  className,
}: {
  mood: Product["mood"];
  className?: string;
}) {
  const moodInfo = getMood(mood);
  const accent = COLOR_TOKEN_VAR[moodInfo.colorToken];
  return (
    <div
      className={cn("relative flex items-end justify-center overflow-hidden", className)}
      style={{ backgroundImage: `linear-gradient(160deg, ${accent}, var(--color-cloud-milk) 75%)` }}
      role="img"
      aria-label={`Ảnh minh hoạ tâm trạng ${moodInfo.labelVi}`}
    >
      <span className="mb-4 text-[11px] uppercase tracking-[0.2em] text-charcoal/40">
        {moodInfo.labelVi}
      </span>
    </div>
  );
}
