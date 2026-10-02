import type { Review } from "@/lib/types";

/**
 * REAL REVIEW DATA — none collected yet.
 * ---------------------------------------
 * Per CLAUDE.md > REVIEWS, rating, review text, and verified-purchase
 * status must never be fabricated. No customer reviews have been collected
 * for DOPAMIND yet, so this stays empty on purpose — the Reviews section
 * renders an honest empty state instead of placeholder testimonials.
 * Replace with a real review feed/data source before launch.
 */
export const REVIEWS: Review[] = [];

export function getAllReviews(): Review[] {
  return REVIEWS;
}
