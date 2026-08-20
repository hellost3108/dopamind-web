export type MoodSlug = "binh-tam" | "tai-tao" | "rang-ro" | "yeu-thuong";

export type Mood = {
  slug: MoodSlug;
  /** Primary label — must stay Vietnamese per CLAUDE.md > LANGUAGE. */
  labelVi: string;
  /** Optional secondary English mood word, shown smaller/muted. */
  labelEn: string;
  /** Brand color token backing this mood's visual atmosphere. */
  colorToken: "mint" | "lavender" | "butter" | "peach";
};

export type SkinNeedSlug =
  | "cap-am"
  | "lam-diu"
  | "lam-sang"
  | "hang-rao-bao-ve-da";

export type SkinNeed = {
  slug: SkinNeedSlug;
  labelVi: string;
};

export type ProductBadge = "best-seller" | "new";

export type Product = {
  id: string;
  slug: string;
  nameVi: string;
  /** Short, factual benefit line — no invented clinical/marketing claims. */
  benefitVi: string;
  mood: MoodSlug;
  skinNeeds: SkinNeedSlug[];
  /** Price in VND. */
  price: number;
  /** Compare-at price in VND; only valid when greater than `price`. */
  compareAtPrice?: number;
  badge?: ProductBadge;
  /**
   * True for every seed entry right now — there is no real product feed yet.
   * Flags to any consumer (and to the Phase 1 report) that this record is
   * sample data standing in for the real catalog, per CLAUDE.md > COMMERCE
   * ("do not invent prices, discounts, ingredients, reviews, or claims").
   */
  isPlaceholder: boolean;
};

export type CartLine = {
  productId: string;
  slug: string;
  nameVi: string;
  mood: MoodSlug;
  price: number;
  quantity: number;
};

export type WishlistItem = {
  productId: string;
  slug: string;
  nameVi: string;
  mood: MoodSlug;
  price: number;
};
