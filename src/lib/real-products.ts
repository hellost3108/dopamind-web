import { supabase } from "@/lib/supabase";

export type RealCategory = {
  slug: string;
  nameVi: string;
  shortNameVi?: string;
  descriptionVi?: string;
  sortOrder: number;
};

export type RealProduct = {
  id: string;
  slug: string;
  nameVi: string;
  shortDescriptionVi?: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  imageAlt?: string;
  categorySlug?: string;
  categoryNameVi?: string;
  isNew: boolean;
};

const STORAGE_BUCKET = "product-imagess";
const STORAGE_BASE = `https://wgycugskzrxelzkprkph.supabase.co/storage/v1/object/public/${STORAGE_BUCKET}/`;

type CategoryRow = {
  slug: string;
  name_vi: string;
  short_name_vi: string | null;
  description_vi: string | null;
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
        price: number | string;
        compare_at_price: number | string | null;
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
};

function first<T>(value: T | T[] | null | undefined): T | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

export async function getRealCatalog(): Promise<{
  categories: RealCategory[];
  products: RealProduct[];
}> {
  const [categoryRes, productRes] = await Promise.all([
    supabase
      .from("categories")
      .select("slug, name_vi, short_name_vi, description_vi, sort_order")
      .eq("active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select(
        `
        id, slug, name_vi, short_description_vi, is_new,
        product_variants ( price, compare_at_price, active, sort_order ),
        product_media ( storage_path, alt_vi, is_primary, sort_order ),
        product_categories ( sort_order, categories ( slug, name_vi, short_name_vi, description_vi, sort_order ) )
      `
      )
      .eq("status", "active"),
  ]);

  if (categoryRes.error) console.error("Lỗi lấy danh mục:", categoryRes.error);
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

    const product: RealProduct = {
      id: p.id,
      slug: p.slug,
      nameVi: p.name_vi,
      shortDescriptionVi: p.short_description_vi ?? undefined,
      price: variant ? Number(variant.price) : 0,
      compareAtPrice:
        variant?.compare_at_price != null
          ? Number(variant.compare_at_price)
          : undefined,
      imageUrl: media?.storage_path ? STORAGE_BASE + media.storage_path : undefined,
      imageAlt: media?.alt_vi ?? undefined,
      categorySlug: category?.slug,
      categoryNameVi: category?.name_vi,
      isNew: p.is_new,
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

  return { categories, products: items.map((i) => i.product) };
}

/** Giữ lại để các file cũ vẫn import được. */
export async function getRealProducts(): Promise<RealProduct[]> {
  return (await getRealCatalog()).products;
}