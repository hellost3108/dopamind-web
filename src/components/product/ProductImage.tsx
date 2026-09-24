import Image from "next/image";
import { getMood } from "@/lib/moods";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * One production visual per mood (P01–P04) stands in for real per-SKU
 * photography, which doesn't exist yet — every product sharing a mood
 * reuses that mood's image rather than inventing additional SKU shots. See
 * CLAUDE.md > COMMERCE.
 */
const MOOD_IMAGE_SRC: Record<Product["mood"], string> = {
  "binh-tam": "/images/homepage/products/P01.png",
  "tai-tao": "/images/homepage/products/P02.png",
  "rang-ro": "/images/homepage/products/P03.png",
  "yeu-thuong": "/images/homepage/products/P04.png",
};

/** Source photography is portrait (~4:5), matching ProductCard's aspect-[4/5]
 *  almost exactly (near-zero crop there), but MoodFinder reuses the same
 *  image in an aspect-square preview where object-cover crops ~20% of the
 *  height. Position tuned per mood so that crop favors keeping the model's
 *  face and the full package in frame in both contexts. */
const MOOD_IMAGE_POSITION: Record<Product["mood"], string> = {
  "binh-tam": "50% 42%",
  "tai-tao": "50% 46%",
  "rang-ro": "50% 44%",
  "yeu-thuong": "50% 44%",
};

export function ProductImage({
  mood,
  className,
  objectPosition,
}: {
  mood: Product["mood"];
  className?: string;
  /** Override the default per-mood crop focus — e.g. a tighter context that
   *  needs different framing than ProductCard/MoodFinder's defaults. */
  objectPosition?: string;
}) {
  const moodInfo = getMood(mood);
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={MOOD_IMAGE_SRC[mood]}
        alt={`Trải nghiệm mặt nạ Dopamind Mask Story cho trạng thái ${moodInfo.labelVi}`}
        fill
        sizes="(min-width: 1181px) 22vw, (min-width: 768px) 30vw, (min-width: 431px) 46vw, 74vw"
        style={{ objectPosition: objectPosition ?? MOOD_IMAGE_POSITION[mood] }}
        className="object-cover"
      />
    </div>
  );
}