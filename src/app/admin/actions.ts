"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/admin/auth";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/admin/labels";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/supabase-storage";

export type FormState = { error?: string; ok?: string } | undefined;
export type ActionResult = { ok: boolean; error?: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PRODUCT_STATUSES = ["draft", "active", "archived"];

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function text(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function dbError(error: { code?: string; message?: string }): string {
  console.error("Admin DB error:", error);
  if (error.code === "23505") {
    const msg = (error.message ?? "").toLowerCase();
    if (msg.includes("slug")) return "Đường dẫn (slug) này đã có sản phẩm khác dùng. Hãy đổi tên hoặc sửa đường dẫn.";
    if (msg.includes("sku")) return "Mã SKU bị trùng với một biến thể khác.";
    return "Dữ liệu bị trùng với bản ghi đã có.";
  }
  if (error.code === "42501") {
    return "Không đủ quyền. Hãy kiểm tra tài khoản đã được cấp quyền admin trong Supabase chưa.";
  }
  if (error.code === "P0001" && error.message) return error.message;
  return "Có lỗi khi lưu dữ liệu. Vui lòng thử lại.";
}

function refreshSite() {
  // Làm mới cả trang bán hàng (đang cache 60 giây) lẫn trang admin.
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Sản phẩm
// ---------------------------------------------------------------------------

type VariantInput = {
  id?: string;
  name_vi?: string;
  sku?: string;
  price?: string | number;
  compare_at_price?: string | number | null;
  stock_quantity?: string | number;
  active?: boolean;
};

type CleanVariant = {
  id?: string;
  name_vi: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  active: boolean;
};

function parseVariants(raw: string): { variants?: CleanVariant[]; error?: string } {
  let input: unknown;
  try {
    input = JSON.parse(raw || "[]");
  } catch {
    return { error: "Dữ liệu biến thể không hợp lệ. Hãy tải lại trang." };
  }
  if (!Array.isArray(input)) return { error: "Dữ liệu biến thể không hợp lệ." };
  if (input.length > 30) return { error: "Tối đa 30 biến thể cho mỗi sản phẩm." };

  const variants: CleanVariant[] = [];
  for (let i = 0; i < input.length; i++) {
    const v = input[i] as VariantInput;
    const n = i + 1;
    const name = String(v.name_vi ?? "").trim();
    if (!name) return { error: `Biến thể ${n}: vui lòng nhập tên (ví dụ: Hộp 5 miếng).` };

    const price = Number(v.price);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(price)) {
      return { error: `Biến thể ${n}: giá bán phải là số nguyên từ 0 trở lên.` };
    }

    const compareRaw = v.compare_at_price;
    let compare: number | null = null;
    if (compareRaw !== null && compareRaw !== undefined && String(compareRaw).trim() !== "") {
      compare = Number(compareRaw);
      if (!Number.isFinite(compare) || compare < 0 || !Number.isInteger(compare)) {
        return { error: `Biến thể ${n}: giá gạch ngang phải là số nguyên từ 0 trở lên.` };
      }
      if (compare === 0) compare = null;
      else if (compare < price) {
        return { error: `Biến thể ${n}: giá gạch ngang phải lớn hơn hoặc bằng giá bán.` };
      }
    }

    const stock = Number(v.stock_quantity);
    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
      return { error: `Biến thể ${n}: tồn kho phải là số nguyên từ 0 trở lên.` };
    }

    const sku = String(v.sku ?? "").trim();
    variants.push({
      id: typeof v.id === "string" && UUID_RE.test(v.id) ? v.id : undefined,
      name_vi: name.slice(0, 120),
      sku: sku ? sku.slice(0, 60) : null,
      price,
      compare_at_price: compare,
      stock_quantity: stock,
      active: v.active !== false,
    });
  }

  const skus = variants.map((v) => v.sku?.toLowerCase()).filter(Boolean);
  if (new Set(skus).size !== skus.length) return { error: "Hai biến thể đang dùng cùng một mã SKU." };

  return { variants };
}

function uuidList(formData: FormData, key: string): string[] {
  return formData.getAll(key).filter((v): v is string => typeof v === "string" && UUID_RE.test(v));
}

export async function saveProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const supabase = await createClient();

  const idRaw = text(formData, "id");
  const id = UUID_RE.test(idRaw) ? idRaw : "";

  const name = text(formData, "name_vi");
  if (name.length < 2) return { error: "Vui lòng nhập tên sản phẩm." };

  const slug = slugify(text(formData, "slug") || name);
  if (!slug) return { error: "Đường dẫn (slug) không hợp lệ. Hãy dùng chữ cái và số." };

  const status = text(formData, "status");
  if (!PRODUCT_STATUSES.includes(status)) return { error: "Trạng thái sản phẩm không hợp lệ." };

  const parsed = parseVariants(text(formData, "variants"));
  if (parsed.error || !parsed.variants) return { error: parsed.error };
  const variants = parsed.variants;

  if (status === "active" && !variants.some((v) => v.active)) {
    return {
      error: "Sản phẩm đang bán cần ít nhất 1 biến thể đang bật. Hãy thêm biến thể hoặc chuyển sang Nháp.",
    };
  }

  const fields = {
    name_vi: name.slice(0, 200),
    slug,
    status,
    short_description_vi: text(formData, "short_description_vi").slice(0, 400) || null,
    description_vi: text(formData, "description_vi").slice(0, 8000) || null,
    featured: formData.get("featured") === "on",
    is_new: formData.get("is_new") === "on",
    seo_title: text(formData, "seo_title").slice(0, 120) || null,
    seo_description: text(formData, "seo_description").slice(0, 300) || null,
  };

  let productId = id;
  if (id) {
    const { error } = await supabase.from("products").update(fields).eq("id", id);
    if (error) return { error: dbError(error) };
  } else {
    const { data, error } = await supabase.from("products").insert(fields).select("id").single();
    if (error || !data) return { error: dbError(error ?? {}) };
    productId = data.id;
  }

  if (status === "active") {
    await supabase
      .from("products")
      .update({ published_at: new Date().toISOString() })
      .eq("id", productId)
      .is("published_at", null);
  }

  // --- Biến thể: xóa cái đã bỏ, cập nhật cái cũ, thêm cái mới ---
  const { data: existing, error: existingError } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId);
  if (existingError) return { error: dbError(existingError) };

  const existingIds = new Set((existing ?? []).map((v) => v.id));
  const keepIds = new Set(variants.map((v) => v.id).filter((x): x is string => !!x && existingIds.has(x)));
  const removeIds = [...existingIds].filter((x) => !keepIds.has(x));

  if (removeIds.length) {
    const { error } = await supabase.from("product_variants").delete().in("id", removeIds);
    if (error) return { error: dbError(error) };
  }

  const toInsert: {
    product_id: string;
    name_vi: string;
    sku: string | null;
    price: number;
    compare_at_price: number | null;
    stock_quantity: number;
    stock_status: string;
    active: boolean;
    sort_order: number;
  }[] = [];

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const payload = {
      name_vi: v.name_vi,
      sku: v.sku,
      price: v.price,
      compare_at_price: v.compare_at_price,
      stock_quantity: v.stock_quantity,
      stock_status: v.stock_quantity > 0 ? "in_stock" : "out_of_stock",
      active: v.active,
      sort_order: i,
    };
    if (v.id && existingIds.has(v.id)) {
      const { error } = await supabase
        .from("product_variants")
        .update(payload)
        .eq("id", v.id)
        .eq("product_id", productId);
      if (error) return { error: dbError(error) };
    } else {
      toInsert.push({ product_id: productId, ...payload });
    }
  }
  if (toInsert.length) {
    const { error } = await supabase.from("product_variants").insert(toInsert);
    if (error) return { error: dbError(error) };
  }

  // --- Danh mục / cảm xúc / nhu cầu da ---
  const categoryIds = uuidList(formData, "category_ids");
  const moodIds = uuidList(formData, "mood_ids");
  const skinNeedIds = uuidList(formData, "skin_need_ids");

  {
    const { error } = await supabase.from("product_categories").delete().eq("product_id", productId);
    if (error) return { error: dbError(error) };
    if (categoryIds.length) {
      const { error: e2 } = await supabase
        .from("product_categories")
        .insert(categoryIds.map((category_id, i) => ({ product_id: productId, category_id, sort_order: i })));
      if (e2) return { error: dbError(e2) };
    }
  }
  {
    const { error } = await supabase.from("product_moods").delete().eq("product_id", productId);
    if (error) return { error: dbError(error) };
    if (moodIds.length) {
      const { error: e2 } = await supabase
        .from("product_moods")
        .insert(moodIds.map((mood_id, i) => ({ product_id: productId, mood_id, sort_order: i })));
      if (e2) return { error: dbError(e2) };
    }
  }
  {
    const { error } = await supabase.from("product_skin_needs").delete().eq("product_id", productId);
    if (error) return { error: dbError(error) };
    if (skinNeedIds.length) {
      const { error: e2 } = await supabase
        .from("product_skin_needs")
        .insert(skinNeedIds.map((skin_need_id, i) => ({ product_id: productId, skin_need_id, sort_order: i })));
      if (e2) return { error: dbError(e2) };
    }
  }

  refreshSite();
  if (!id) redirect(`/admin/san-pham/${productId}?moi=1`);
  return { ok: "Đã lưu thay đổi. Trang bán hàng đã được cập nhật." };
}

export async function deleteProductAction(productId: string): Promise<ActionResult> {
  await assertAdmin();
  if (!UUID_RE.test(productId)) return { ok: false, error: "Sản phẩm không hợp lệ." };
  const supabase = await createClient();

  const { data: media } = await supabase.from("product_media").select("storage_path").eq("product_id", productId);

  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) return { ok: false, error: dbError(error) };

  const paths = (media ?? []).map((m) => m.storage_path);
  if (paths.length) await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(paths);

  refreshSite();
  redirect("/admin/san-pham");
}

// ---------------------------------------------------------------------------
// Ảnh sản phẩm (file được tải thẳng từ trình duyệt lên Storage, ở đây chỉ ghi vào DB)
// ---------------------------------------------------------------------------

export async function addProductMediaAction(
  productId: string,
  storagePath: string,
  alt: string,
): Promise<ActionResult> {
  await assertAdmin();
  if (!UUID_RE.test(productId) || !storagePath.startsWith(`${productId}/`) || storagePath.includes("..")) {
    return { ok: false, error: "Đường dẫn ảnh không hợp lệ." };
  }
  const supabase = await createClient();

  const { count } = await supabase
    .from("product_media")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  const { error } = await supabase.from("product_media").insert({
    product_id: productId,
    storage_path: storagePath,
    alt_vi: alt.trim().slice(0, 200) || null,
    media_type: "product",
    sort_order: count ?? 0,
    is_primary: (count ?? 0) === 0,
  });
  if (error) return { ok: false, error: dbError(error) };

  refreshSite();
  return { ok: true };
}

export async function setPrimaryMediaAction(mediaId: string): Promise<ActionResult> {
  await assertAdmin();
  if (!UUID_RE.test(mediaId)) return { ok: false, error: "Ảnh không hợp lệ." };
  const supabase = await createClient();

  const { data: media } = await supabase.from("product_media").select("product_id").eq("id", mediaId).maybeSingle();
  if (!media) return { ok: false, error: "Không tìm thấy ảnh." };

  const clear = await supabase.from("product_media").update({ is_primary: false }).eq("product_id", media.product_id);
  if (clear.error) return { ok: false, error: dbError(clear.error) };
  const set = await supabase.from("product_media").update({ is_primary: true }).eq("id", mediaId);
  if (set.error) return { ok: false, error: dbError(set.error) };

  refreshSite();
  return { ok: true };
}

export async function updateMediaAltAction(mediaId: string, alt: string): Promise<ActionResult> {
  await assertAdmin();
  if (!UUID_RE.test(mediaId)) return { ok: false, error: "Ảnh không hợp lệ." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_media")
    .update({ alt_vi: alt.trim().slice(0, 200) || null })
    .eq("id", mediaId);
  if (error) return { ok: false, error: dbError(error) };
  refreshSite();
  return { ok: true };
}

export async function deleteMediaAction(mediaId: string): Promise<ActionResult> {
  await assertAdmin();
  if (!UUID_RE.test(mediaId)) return { ok: false, error: "Ảnh không hợp lệ." };
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("product_media")
    .select("product_id, storage_path, is_primary")
    .eq("id", mediaId)
    .maybeSingle();
  if (!media) return { ok: false, error: "Không tìm thấy ảnh." };

  const { error } = await supabase.from("product_media").delete().eq("id", mediaId);
  if (error) return { ok: false, error: dbError(error) };
  await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([media.storage_path]);

  // Xóa ảnh chính thì chọn ảnh còn lại đầu tiên làm ảnh chính.
  if (media.is_primary) {
    const { data: rest } = await supabase
      .from("product_media")
      .select("id")
      .eq("product_id", media.product_id)
      .order("sort_order")
      .limit(1);
    if (rest?.[0]) await supabase.from("product_media").update({ is_primary: true }).eq("id", rest[0].id);
  }

  refreshSite();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Đơn hàng
// ---------------------------------------------------------------------------

export async function updateOrderAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();

  const orderId = text(formData, "order_id");
  const status = text(formData, "status");
  const paymentStatus = text(formData, "payment_status");
  const reason = text(formData, "reason");

  if (!UUID_RE.test(orderId)) return { error: "Đơn hàng không hợp lệ." };
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) return { error: "Trạng thái đơn không hợp lệ." };
  if (!(PAYMENT_STATUSES as readonly string[]).includes(paymentStatus)) {
    return { error: "Trạng thái thanh toán không hợp lệ." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_update_order", {
    p_order_id: orderId,
    p_status: status,
    p_payment_status: paymentStatus,
    p_reason: reason || undefined,
  });
  if (error) return { error: dbError(error) };

  refreshSite();
  return { ok: "Đã cập nhật đơn hàng." };
}
