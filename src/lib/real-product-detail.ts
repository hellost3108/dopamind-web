import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { getProductImageUrl } from "@/lib/supabase-storage";

export type RealProductImage = {
  url: string;
  alt: string;
};

export type ProductBanner = {
  eyebrow?: string;
  title?: string;
  body?: string;
  linkLabel?: string;
  linkHref?: string;
};

export type RealProductDetail = {
  id: string;
  slug: string;
  nameVi: string;
  shortDescriptionVi?: string;
  variantId?: string;
  price?: number;
  compareAtPrice?: number;
  stockQuantity?: number;
  stockStatus?: string;
  moodSlug?: string;
  categoryNameVi?: string;
  categoryShortNameVi?: string;
  images: RealProductImage[];
  // Chữ chi tiết, lưu trong cột products.detail của Supabase
  fullTitle?: string;
  categoryLabel?: string;
  tagline?: string;
  intro?: string;
  highlights: string[];
  description?: string;
  benefits: string[];
  banner?: ProductBanner;
};

type CategoryRow = { slug: string; name_vi: string; short_name_vi: string | null };

type DetailRow = {
  id: string;
  slug: string;
  name_vi: string;
  short_description_vi: string | null;
  description_vi: string | null;
  detail: unknown;
  product_variants:
    | {
        id: string;
        price: number | string;
        compare_at_price: number | string | null;
        stock_quantity: number;
        stock_status: string;
        active: boolean;
        sort_order: number;
      }[]
    | null;
  product_media:
    | {
        storage_path: string;
        alt_vi: string | null;
        is_primary: boolean;
        sort_order: number;
      }[]
    | null;
  product_categories:
    | { sort_order: number; categories: CategoryRow | CategoryRow[] | null }[]
    | null;
  product_moods: { moods: { slug: string } | { slug: string }[] | null }[] | null;
};

function first<T>(value: T | T[] | null | undefined): T | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((x): x is string => typeof x === "string" && x.trim() !== "")
    : [];
}

/** `cache` giúp generateMetadata và trang dùng chung một lần gọi Supabase. */
export const getRealProductBySlug = cache(
  async (slug: string): Promise<RealProductDetail | null> => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id, slug, name_vi, short_description_vi, description_vi, detail,
        product_variants ( id, price, compare_at_price, stock_quantity, stock_status, active, sort_order ),
        product_media ( storage_path, alt_vi, is_primary, sort_order ),
        product_categories ( sort_order, categories ( slug, name_vi, short_name_vi ) ),
        product_moods ( moods ( slug ) )
      `
      )
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();

    if (error) console.error("Lỗi lấy chi tiết sản phẩm:", error);
    if (!data) return null;

    const p = data as unknown as DetailRow;

    const variants = [...(p.product_variants ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );
    const variant = variants.find((v) => v.active) ?? variants[0];

    const images: RealProductImage[] = [...(p.product_media ?? [])]
      .sort(
        (a, b) =>
          (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
          a.sort_order - b.sort_order
      )
      .map((m) => ({
        url: getProductImageUrl(m.storage_path),
        alt: m.alt_vi ?? p.name_vi,
      }));

    const link = [...(p.product_categories ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    )[0];
    const category = first(link?.categories);

    const moodSlug = first(p.product_moods?.[0]?.moods)?.slug;

    const detail = asRecord(p.detail);
    const bannerRaw = asRecord(detail.banner);
    const banner: ProductBanner | undefined = detail.banner
      ? {
          eyebrow: asString(bannerRaw.eyebrow),
          title: asString(bannerRaw.title),
          body: asString(bannerRaw.body),
          linkLabel: asString(bannerRaw.link_label),
          linkHref: asString(bannerRaw.link_href),
        }
      : undefined;

    return {
      id: p.id,
      slug: p.slug,
      nameVi: p.name_vi,
      shortDescriptionVi: p.short_description_vi ?? undefined,
      variantId: variant?.id,
      price: variant ? Number(variant.price) : undefined,
      compareAtPrice:
        variant?.compare_at_price != null
          ? Number(variant.compare_at_price)
          : undefined,
      stockQuantity: variant?.stock_quantity,
      stockStatus: variant?.stock_status,
      moodSlug,
      categoryNameVi: category?.name_vi,
      categoryShortNameVi: category?.short_name_vi ?? undefined,
      images,
      fullTitle: asString(detail.full_title),
      categoryLabel: asString(detail.category_label),
      tagline: asString(detail.tagline),
      intro: asString(detail.intro),
      highlights: asStringArray(detail.highlights),
      description: asString(detail.description) ?? p.description_vi ?? undefined,
      benefits: asStringArray(detail.benefits),
      banner,
    };
  }
);