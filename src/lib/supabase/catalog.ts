import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Server-side catalog data access layer for the Phase 1 Supabase schema.
 * Uses the normal (RLS-scoped) server client only — no service-role/admin
 * client. Every query is explicitly narrowed to what the caller needs.
 *
 * Only status = 'active' products / active reference rows are ever
 * returned — RLS already enforces this server-side, the explicit filters
 * here just keep the query intent obvious and avoid relying on RLS alone.
 *
 * Every function fails safe: on a Supabase error it logs a short diagnostic
 * (never the error's raw database detail, never credentials) and returns an
 * empty result instead of throwing, so a callable page can always render an
 * honest empty state instead of crashing.
 */

// ---------------------------------------------------------------------------
// Reference data (categories / moods / skin needs)
// ---------------------------------------------------------------------------

export type CatalogCategory = Pick<
  Database["public"]["Tables"]["categories"]["Row"],
  "id" | "slug" | "name_vi" | "short_name_vi" | "description_vi" | "image_path" | "sort_order"
>;

export type CatalogMood = Pick<
  Database["public"]["Tables"]["moods"]["Row"],
  "id" | "slug" | "label_vi" | "label_en" | "color_token" | "sort_order"
>;

export type CatalogSkinNeed = Pick<
  Database["public"]["Tables"]["skin_needs"]["Row"],
  "id" | "slug" | "label_vi" | "sort_order"
>;

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name_vi, short_name_vi, description_vi, image_path, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[catalog] getCatalogCategories failed:", error.message);
    return [];
  }
  return data;
}

export async function getCatalogMoods(): Promise<CatalogMood[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("moods")
    .select("id, slug, label_vi, label_en, color_token, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[catalog] getCatalogMoods failed:", error.message);
    return [];
  }
  return data;
}

export async function getCatalogSkinNeeds(): Promise<CatalogSkinNeed[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skin_needs")
    .select("id, slug, label_vi, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[catalog] getCatalogSkinNeeds failed:", error.message);
    return [];
  }
  return data;
}

// ---------------------------------------------------------------------------
// Products — normalized app-facing shape
//
// This is intentionally NOT the placeholder `Product` type from
// src/lib/types.ts: that type models sample data (single mood, flat
// skinNeeds array, no variants). Real catalog products have many-to-many
// moods/categories/skin-needs and a variant list, so they get their own
// shape here instead of being forced into the placeholder one.
// ---------------------------------------------------------------------------

export type CatalogProductVariant = {
  id: string;
  sku: string | null;
  nameVi: string;
  price: number;
  compareAtPrice: number | null;
  stockStatus: string;
};

export type CatalogProductRef = { id: string; slug: string; nameVi: string };
export type CatalogProductMoodRef = {
  id: string;
  slug: string;
  labelVi: string;
  labelEn: string;
  colorToken: string;
};
export type CatalogProductSkinNeedRef = { id: string; slug: string; labelVi: string };

export type CatalogProduct = {
  id: string;
  slug: string;
  nameVi: string;
  shortDescriptionVi: string | null;
  featured: boolean;
  isNew: boolean;
  publishedAt: string | null;
  /**
   * `storagePath` is raw metadata from product_media — there is no Supabase
   * Storage bucket wired up yet (Phase 1 explicitly defers that). Callers
   * must not assume this resolves to a public URL yet.
   */
  primaryImage: { storagePath: string; altVi: string | null } | null;
  variants: CatalogProductVariant[];
  categories: CatalogProductRef[];
  moods: CatalogProductMoodRef[];
  skinNeeds: CatalogProductSkinNeedRef[];
};

const PRODUCT_SELECT = `
  id, slug, name_vi, short_description_vi, featured, is_new, published_at,
  product_variants ( id, sku, name_vi, price, compare_at_price, stock_status, active, sort_order ),
  product_media ( id, storage_path, alt_vi, sort_order, is_primary ),
  product_categories ( sort_order, categories ( id, slug, name_vi ) ),
  product_moods ( sort_order, moods ( id, slug, label_vi, label_en, color_token ) ),
  product_skin_needs ( sort_order, skin_needs ( id, slug, label_vi ) )
` as const;

type ProductQueryRow = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  "id" | "slug" | "name_vi" | "short_description_vi" | "featured" | "is_new" | "published_at"
> & {
  product_variants: Array<
    Pick<
      Database["public"]["Tables"]["product_variants"]["Row"],
      "id" | "sku" | "name_vi" | "price" | "compare_at_price" | "stock_status" | "active" | "sort_order"
    >
  >;
  product_media: Array<
    Pick<Database["public"]["Tables"]["product_media"]["Row"], "id" | "storage_path" | "alt_vi" | "sort_order" | "is_primary">
  >;
  product_categories: Array<{
    sort_order: number;
    categories: Pick<Database["public"]["Tables"]["categories"]["Row"], "id" | "slug" | "name_vi"> | null;
  }>;
  product_moods: Array<{
    sort_order: number;
    moods: Pick<Database["public"]["Tables"]["moods"]["Row"], "id" | "slug" | "label_vi" | "label_en" | "color_token"> | null;
  }>;
  product_skin_needs: Array<{
    sort_order: number;
    skin_needs: Pick<Database["public"]["Tables"]["skin_needs"]["Row"], "id" | "slug" | "label_vi"> | null;
  }>;
};

function bySortOrder<T extends { sort_order: number }>(a: T, b: T) {
  return a.sort_order - b.sort_order;
}

function toCatalogProduct(row: ProductQueryRow): CatalogProduct {
  const media = [...row.product_media].sort(bySortOrder);
  const primary = media.find((m) => m.is_primary) ?? media[0] ?? null;

  return {
    id: row.id,
    slug: row.slug,
    nameVi: row.name_vi,
    shortDescriptionVi: row.short_description_vi,
    featured: row.featured,
    isNew: row.is_new,
    publishedAt: row.published_at,
    primaryImage: primary ? { storagePath: primary.storage_path, altVi: primary.alt_vi } : null,
    variants: row.product_variants
      .filter((v) => v.active)
      .sort(bySortOrder)
      .map((v) => ({
        id: v.id,
        sku: v.sku,
        nameVi: v.name_vi,
        price: v.price,
        compareAtPrice: v.compare_at_price,
        stockStatus: v.stock_status,
      })),
    categories: row.product_categories
      .filter((c) => c.categories !== null)
      .sort(bySortOrder)
      .map((c) => ({ id: c.categories!.id, slug: c.categories!.slug, nameVi: c.categories!.name_vi })),
    moods: row.product_moods
      .filter((m) => m.moods !== null)
      .sort(bySortOrder)
      .map((m) => ({
        id: m.moods!.id,
        slug: m.moods!.slug,
        labelVi: m.moods!.label_vi,
        labelEn: m.moods!.label_en,
        colorToken: m.moods!.color_token,
      })),
    skinNeeds: row.product_skin_needs
      .filter((s) => s.skin_needs !== null)
      .sort(bySortOrder)
      .map((s) => ({ id: s.skin_needs!.id, slug: s.skin_needs!.slug, labelVi: s.skin_needs!.label_vi })),
  };
}

/** Published catalog products, newest-published first. Empty array when the table has no active rows. */
export async function getPublishedProducts(): Promise<CatalogProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("published_at", { ascending: false, nullsFirst: false })
    .returns<ProductQueryRow[]>();

  if (error) {
    console.error("[catalog] getPublishedProducts failed:", error.message);
    return [];
  }
  return data.map(toCatalogProduct);
}

/** A single published product by slug, or null if not found / not active / on error. */
export async function getPublishedProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("slug", slug)
    .maybeSingle()
    .returns<ProductQueryRow>();

  if (error) {
    console.error("[catalog] getPublishedProductBySlug failed:", error.message);
    return null;
  }
  return data ? toCatalogProduct(data) : null;
}

/**
 * Published products belonging to a given category slug. Uses an inner join
 * through product_categories -> categories so the category filter applies
 * at the database level.
 */
export async function getProductsByCategory(categorySlug: string): Promise<CatalogProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, slug, name_vi, short_description_vi, featured, is_new, published_at,
      product_variants ( id, sku, name_vi, price, compare_at_price, stock_status, active, sort_order ),
      product_media ( id, storage_path, alt_vi, sort_order, is_primary ),
      product_categories!inner ( sort_order, categories!inner ( id, slug, name_vi ) ),
      product_moods ( sort_order, moods ( id, slug, label_vi, label_en, color_token ) ),
      product_skin_needs ( sort_order, skin_needs ( id, slug, label_vi ) )
      `,
    )
    .eq("status", "active")
    .eq("product_categories.categories.slug", categorySlug)
    .order("published_at", { ascending: false, nullsFirst: false })
    .returns<ProductQueryRow[]>();

  if (error) {
    console.error("[catalog] getProductsByCategory failed:", error.message);
    return [];
  }
  return data.map(toCatalogProduct);
}
