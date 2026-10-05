import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import { getProductImageUrl } from "@/lib/supabase-storage";
import { LOW_STOCK_THRESHOLD } from "@/lib/admin/labels";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type AdminVariant = {
  id: string;
  name_vi: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  active: boolean;
};

export type AdminMedia = {
  id: string;
  storage_path: string;
  alt_vi: string | null;
  is_primary: boolean;
  url: string;
};

export type RefOption = { id: string; label: string };

export type AdminCategory = Tables<"categories">;

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order").order("created_at");
  if (error) console.error("Không đọc được danh mục:", error);
  return data ?? [];
}

export async function getAdminCategory(id: string): Promise<AdminCategory | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  if (error) console.error("Không đọc được danh mục:", error);
  return data ?? null;
}

export type AdminProductRow = {
  id: string;
  slug: string;
  name_vi: string;
  status: string;
  featured: boolean;
  is_new: boolean;
  imageUrl: string | null;
  priceMin: number | null;
  priceMax: number | null;
  stockTotal: number;
  variantCount: number;
};

function sortVariants<T extends { sort_order: number; created_at: string }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at),
  );
}

/** Danh sách sản phẩm cho trang quản lý (gồm cả nháp / lưu trữ). */
export async function getAdminProducts(): Promise<AdminProductRow[]> {
  const supabase = await createClient();
  const [productRes, variantRes, mediaRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("product_variants").select("*"),
    supabase.from("product_media").select("*"),
  ]);

  const products = productRes.data ?? [];
  const variants = variantRes.data ?? [];
  const media = mediaRes.data ?? [];

  return products.map((p) => {
    const vs = variants.filter((v) => v.product_id === p.id);
    const prices = vs.map((v) => Number(v.price));
    const m = media
      .filter((x) => x.product_id === p.id)
      .sort(
        (a, b) =>
          Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
      )[0];
    return {
      id: p.id,
      slug: p.slug,
      name_vi: p.name_vi,
      status: p.status,
      featured: p.featured,
      is_new: p.is_new,
      imageUrl: m ? getProductImageUrl(m.storage_path) : null,
      priceMin: prices.length ? Math.min(...prices) : null,
      priceMax: prices.length ? Math.max(...prices) : null,
      stockTotal: vs.reduce((sum, v) => sum + v.stock_quantity, 0),
      variantCount: vs.length,
    };
  });
}

export type AdminProduct = {
  product: Tables<"products">;
  variants: AdminVariant[];
  media: AdminMedia[];
  categoryIds: string[];
  moodIds: string[];
  skinNeedIds: string[];
};

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = await createClient();

  const { data: product } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (!product) return null;

  const [variantRes, mediaRes, catRes, moodRes, needRes] = await Promise.all([
    supabase.from("product_variants").select("*").eq("product_id", id),
    supabase.from("product_media").select("*").eq("product_id", id),
    supabase.from("product_categories").select("category_id").eq("product_id", id),
    supabase.from("product_moods").select("mood_id").eq("product_id", id),
    supabase.from("product_skin_needs").select("skin_need_id").eq("product_id", id),
  ]);

  return {
    product,
    variants: sortVariants(variantRes.data ?? []).map((v) => ({
      id: v.id,
      name_vi: v.name_vi,
      sku: v.sku,
      price: Number(v.price),
      compare_at_price: v.compare_at_price == null ? null : Number(v.compare_at_price),
      stock_quantity: v.stock_quantity,
      active: v.active,
    })),
    media: [...(mediaRes.data ?? [])]
      .sort(
        (a, b) =>
          Number(b.is_primary) - Number(a.is_primary) ||
          a.sort_order - b.sort_order ||
          a.created_at.localeCompare(b.created_at),
      )
      .map((m) => ({
        id: m.id,
        storage_path: m.storage_path,
        alt_vi: m.alt_vi,
        is_primary: m.is_primary,
        url: getProductImageUrl(m.storage_path),
      })),
    categoryIds: (catRes.data ?? []).map((r) => r.category_id),
    moodIds: (moodRes.data ?? []).map((r) => r.mood_id),
    skinNeedIds: (needRes.data ?? []).map((r) => r.skin_need_id),
  };
}

/** Danh mục / cảm xúc / nhu cầu da để tick chọn trong form sản phẩm. */
export async function getReferenceOptions(): Promise<{
  categories: RefOption[];
  moods: RefOption[];
  skinNeeds: RefOption[];
}> {
  const supabase = await createClient();
  const [c, m, s] = await Promise.all([
    supabase.from("categories").select("id, name_vi, sort_order").order("sort_order"),
    supabase.from("moods").select("id, label_vi, label_en, sort_order").order("sort_order"),
    supabase.from("skin_needs").select("id, label_vi, sort_order").order("sort_order"),
  ]);
  return {
    categories: (c.data ?? []).map((x) => ({ id: x.id, label: x.name_vi })),
    moods: (m.data ?? []).map((x) => ({ id: x.id, label: `${x.label_vi} (${x.label_en})` })),
    skinNeeds: (s.data ?? []).map((x) => ({ id: x.id, label: x.label_vi })),
  };
}

// ---------------------------------------------------------------------------
// Đơn hàng
// ---------------------------------------------------------------------------

export type AdminOrderRow = Pick<
  Tables<"orders">,
  | "id"
  | "order_number"
  | "recipient_name"
  | "phone"
  | "status"
  | "payment_status"
  | "total_amount"
  | "created_at"
>;

export async function getAdminOrders(opts: {
  status?: string;
  q?: string;
}): Promise<AdminOrderRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, order_number, recipient_name, phone, status, payment_status, total_amount, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (opts.status) query = query.eq("status", opts.status);

  // Bỏ ký tự đặc biệt của bộ lọc PostgREST để tìm kiếm không bị lỗi/chèn điều kiện.
  const q = (opts.q ?? "").replace(/[^\p{L}\p{N}\s.@-]/gu, " ").trim().slice(0, 60);
  if (q) {
    query = query.or(
      `order_number.ilike.%${q}%,phone.ilike.%${q}%,recipient_name.ilike.%${q}%,customer_email.ilike.%${q}%`,
    );
  }

  const { data } = await query;
  return data ?? [];
}

export type AdminOrderDetail = Tables<"orders"> & {
  items: Tables<"order_items">[];
  payments: Tables<"payments">[];
};

export async function getAdminOrder(orderNumber: string): Promise<AdminOrderDetail | null> {
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (!order) return null;

  const [itemRes, payRes] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", order.id).order("created_at"),
    supabase.from("payments").select("*").eq("order_id", order.id).order("created_at"),
  ]);
  return { ...order, items: itemRes.data ?? [], payments: payRes.data ?? [] };
}

// ---------------------------------------------------------------------------
// Tổng quan
// ---------------------------------------------------------------------------

export type DashboardData = {
  pendingOrders: number;
  activeProducts: number;
  draftProducts: number;
  revenue30d: number;
  orders30d: number;
  lowStock: { id: string; productId: string; productName: string; variantName: string; stock: number }[];
  recentOrders: AdminOrderRow[];
};

export async function getDashboard(): Promise<DashboardData> {
  const supabase = await createClient();
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

  const [pending, active, draft, recent30, lowRes, recent] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("products").select("id", { count: "exact", head: true }).neq("status", "active"),
    supabase
      .from("orders")
      .select("total_amount, status")
      .gte("created_at", since)
      .limit(2000),
    supabase
      .from("product_variants")
      .select("id, product_id, name_vi, stock_quantity")
      .eq("active", true)
      .lte("stock_quantity", LOW_STOCK_THRESHOLD)
      .order("stock_quantity")
      .limit(10),
    supabase
      .from("orders")
      .select("id, order_number, recipient_name, phone, status, payment_status, total_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const counted = (recent30.data ?? []).filter(
    (o) => o.status !== "cancelled" && o.status !== "refunded",
  );

  const lowVariants = lowRes.data ?? [];
  const productIds = [...new Set(lowVariants.map((v) => v.product_id))];
  const { data: lowProducts } = productIds.length
    ? await supabase.from("products").select("id, name_vi, status").in("id", productIds)
    : { data: [] as { id: string; name_vi: string; status: string }[] };

  return {
    pendingOrders: pending.count ?? 0,
    activeProducts: active.count ?? 0,
    draftProducts: draft.count ?? 0,
    revenue30d: counted.reduce((sum, o) => sum + Number(o.total_amount), 0),
    orders30d: counted.length,
    lowStock: lowVariants
      .map((v) => {
        const p = (lowProducts ?? []).find((x) => x.id === v.product_id);
        return p && p.status === "active"
          ? {
              id: v.id,
              productId: v.product_id,
              productName: p.name_vi,
              variantName: v.name_vi,
              stock: v.stock_quantity,
            }
          : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null),
    recentOrders: recent.data ?? [],
  };
}
