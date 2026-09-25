import { supabase } from "@/lib/supabase";
import { getProductImageUrl } from "@/lib/supabase-storage";

export type RealCategory = {
  slug: string;
  nameVi: string;
  shortNameVi?: string;
  descriptionVi?: string;
  sortOrder: number;
};

export type RealMood = {
  slug: string;
  labelVi: string;
  labelEn: string;
  colorToken: string;
  sortOrder: number;
};

export type RealSkinNeed = {
  slug: string;
  labelVi: string;
  sortOrder: number;
};

export type RealProduct = {
  id: string;
  slug: string;
  nameVi: string;
  shortDescriptionVi?: string;
  variantId?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity?: number;
  stockStatus?: string;
  imageUrl?: string;
  imageAlt?: string;
  categorySlug?: string;
  categoryNameVi?: string;
  isNew: boolean;
  moodSlugs: string[];
  skinNeedSlugs: string[];
};

type CategoryRow = {
  slug: string;
  name_vi: string;
  short_name_vi: string | null;
  description_vi: string | null;
  sort_order: number;
};

type MoodRow = {
  slug: string;
  label_vi: string;
  label_en: string;
  color_token: string;
  sort_order: number;
};

type SkinNeedRow = {
  slug: string;
  label_vi: string;
  sort_order: number;
};

type ProductRow = {
  id: string;
  slug: string;
  name_vi: string;
  short_description_vi: string | null;
  is_new: boolean;
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
    | {
        sort_order: number;
        categories: CategoryRow | CategoryRow[] | null;
      }[]
    | null;
  product_moods:
    | { moods: { slug: string } | { slug: string }[] | null }[]
    | null;
  product_skin_needs:
    | { skin_needs: { slug: string } | { slug: string }[] | null }[]
    | null;
};

function first<T>(value: T | T[] | null | undefined): T | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

export async function getRealCatalog(): Promise<{
  categories: RealCategory[];
  moods: RealMood[];
  skinNeeds: RealSkinNeed[];
  products: RealProduct[];
}> {
  const [categoryRes, moodRes, skinNeedRes, productRes] = await Promise.all([
    supabase
      .from("categories")
      .select("slug, name_vi, short_name_vi, description_vi, sort_order")
      .eq("active", true)
      .order("sort_order"),
    supabase
      .from("moods")
      .select("slug, label_vi, label_en, color_token, sort_order")
      .eq("active", true)
      .order("sort_order"),
    supabase
      .from("skin_needs")
      .select("slug, label_vi, sort_order")
      .eq("active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select(
        `
        id, slug, name_vi, short_description_vi, is_new,
        product_variants ( id, price, compare_at_price, stock_quantity, stock_status, active, sort_order ),
        product_media ( storage_path, alt_vi, is_primary, sort_order ),
        product_categories ( sort_order, categories ( slug, name_vi, short_name_vi, description_vi, sort_order ) ),
        product_moods ( moods ( slug ) ),
        product_skin_needs ( skin_needs ( slug ) )
      `
      )
      .eq("status", "active"),
  ]);

  if (categoryRes.error) console.error("Lỗi lấy danh mục:", categoryRes.error);
  if (moodRes.error) console.error("Lỗi lấy cảm xúc:", moodRes.error);
  if (skinNeedRes.error) console.error("Lỗi lấy nhu cầu da:", skinNeedRes.error);
  if (productRes.error) console.error("Lỗi lấy sản phẩm:", productRes.error);

  const categories: RealCategory[] = (
    (categoryRes.data ?? []) as unknown as CategoryRow[]
  ).map((c) => ({
    slug: c.slug,
    nameVi: c.name_vi,
    shortNameVi: c.short_name_vi ?? undefined,
    descriptionVi: c.description_vi ?? undefined,
    sortOrder: c.sort_order,
  }));

  const moods: RealMood[] = ((moodRes.data ?? []) as unknown as MoodRow[]).map((m) => ({
    slug: m.slug,
    labelVi: m.label_vi,
    labelEn: m.label_en,
    colorToken: m.color_token,
    sortOrder: m.sort_order,
  }));

  const skinNeeds: RealSkinNeed[] = (
    (skinNeedRes.data ?? []) as unknown as SkinNeedRow[]
  ).map((s) => ({
    slug: s.slug,
    labelVi: s.label_vi,
    sortOrder: s.sort_order,
  }));

  const rows = (productRes.data ?? []) as unknown as ProductRow[];

  const items = rows.map((p) => {
    const variants = [...(p.product_variants ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );
    const variant = variants.find((v) => v.active) ?? variants[0];

    const media = [...(p.product_media ?? [])].sort(
      (a, b) =>
        (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
        a.sort_order - b.sort_order
    )[0];

    const link = [...(p.product_categories ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    )[0];
    const category = first(link?.categories);

    const moodSlugs = (p.product_moods ?? [])
      .map((m) => first(m.moods)?.slug)
      .filter((slug): slug is string => Boolean(slug));

    const skinNeedSlugs = (p.product_skin_needs ?? [])
      .map((s) => first(s.skin_needs)?.slug)
      .filter((slug): slug is string => Boolean(slug));

    const product: RealProduct = {
      id: p.id,
      slug: p.slug,
      nameVi: p.name_vi,
      shortDescriptionVi: p.short_description_vi ?? undefined,
      variantId: variant?.id,
      price: variant ? Number(variant.price) : 0,
      compareAtPrice:
        variant?.compare_at_price != null
          ? Number(variant.compare_at_price)
          : undefined,
      stockQuantity: variant?.stock_quantity,
      stockStatus: variant?.stock_status,
      imageUrl: media?.storage_path ? getProductImageUrl(media.storage_path) : undefined,
      imageAlt: media?.alt_vi ?? undefined,
      categorySlug: category?.slug,
      categoryNameVi: category?.name_vi,
      isNew: p.is_new,
      moodSlugs,
      skinNeedSlugs,
    };

    return {
      product,
      categoryOrder: category?.sort_order ?? 999,
      inCategoryOrder: link?.sort_order ?? 999,
    };
  });

  items.sort(
    (a, b) =>
      a.categoryOrder - b.categoryOrder || a.inCategoryOrder - b.inCategoryOrder
  );

  return { categories, moods, skinNeeds, products: items.map((i) => i.product) };
}

/** Giữ lại để các file cũ vẫn import được. */
export async function getRealProducts(): Promise<RealProduct[]> {
  return (await getRealCatalog()).products;
}