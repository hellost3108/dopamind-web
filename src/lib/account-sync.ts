"use client";

/**
 * Đồng bộ Yêu thích + Giỏ hàng với tài khoản trên Supabase.
 * - Đăng nhập: tải dữ liệu của đúng tài khoản đó về.
 * - Đăng xuất / đổi tài khoản: xóa dữ liệu trên máy (về 0), không hiện đồ của tài khoản cũ.
 * - Khi đang đăng nhập: mọi thay đổi được lưu lên Supabase.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { wishlistStore, type WishlistItem } from "@/context/wishlist-context";
import { cartStore, type CartLine } from "@/context/cart-context";
import type { MoodSlug } from "@/lib/types";

const OWNER_KEY = "dopamind:owner";

/** Dòng dữ liệu của bảng user_wishlist_items */
interface WishlistRow {
  product_id: string;
  slug: string;
  name_vi: string;
  price: number | string;
  image_url: string | null;
  image_alt: string | null;
}

/** Dòng dữ liệu của bảng user_cart_items */
interface CartRow {
  variant_id: string;
  product_id: string;
  slug: string;
  name_vi: string;
  mood: string;
  price: number | string;
  quantity: number;
}

/**
 * Hai bảng user_wishlist_items và user_cart_items chưa có trong file kiểu
 * Supabase được tạo sẵn, nên dùng client không ràng buộc kiểu cho hai bảng này.
 */
function getDb(): SupabaseClient {
  return createClient() as unknown as SupabaseClient;
}

let currentUserId: string | null = null;
let ready = false;
let started = false;
let prevWishlist: WishlistItem[] = [];
let prevCart: CartLine[] = [];
let queue: Promise<unknown> = Promise.resolve();

function getOwner(): string | null {
  try {
    return localStorage.getItem(OWNER_KEY);
  } catch {
    return null;
  }
}
function setOwner(id: string | null) {
  try {
    if (id) localStorage.setItem(OWNER_KEY, id);
    else localStorage.removeItem(OWNER_KEY);
  } catch {}
}

function enqueue(fn: () => Promise<void>) {
  queue = queue.then(fn).catch((e) => console.error("Đồng bộ tài khoản lỗi:", e));
}

/** Xóa Yêu thích + Giỏ hàng trên máy này (không xóa trên Supabase). */
export function clearLocalAccountData() {
  currentUserId = null;
  ready = false;
  prevWishlist = [];
  prevCart = [];
  wishlistStore.set([]);
  cartStore.set([]);
  setOwner(null);
}

async function pushWishlist() {
  const uid = currentUserId;
  if (!uid || !ready) return;
  const db = getDb();
  const next = wishlistStore.get();
  const prevIds = new Set(prevWishlist.map((i) => i.productId));
  const nextIds = new Set(next.map((i) => i.productId));
  const added = next.filter((i) => !prevIds.has(i.productId));
  const removed = prevWishlist.filter((i) => !nextIds.has(i.productId)).map((i) => i.productId);
  prevWishlist = next;

  if (added.length) {
    const { error } = await db.from("user_wishlist_items").upsert(
      added.map((i) => ({
        user_id: uid,
        product_id: i.productId,
        slug: i.slug,
        name_vi: i.nameVi,
        price: i.price,
        image_url: i.imageUrl ?? null,
        image_alt: i.imageAlt ?? null,
      })),
      { onConflict: "user_id,product_id" },
    );
    if (error) console.error(error);
  }
  if (removed.length) {
    const { error } = await db
      .from("user_wishlist_items")
      .delete()
      .eq("user_id", uid)
      .in("product_id", removed);
    if (error) console.error(error);
  }
}

async function pushCart() {
  const uid = currentUserId;
  if (!uid || !ready) return;
  const db = getDb();
  const next = cartStore.get();
  const prevMap = new Map(prevCart.map((l) => [l.variantId, l]));
  const nextIds = new Set(next.map((l) => l.variantId));
  const changed = next.filter((l) => prevMap.get(l.variantId)?.quantity !== l.quantity);
  const removed = prevCart.filter((l) => !nextIds.has(l.variantId)).map((l) => l.variantId);
  prevCart = next;

  if (changed.length) {
    const { error } = await db.from("user_cart_items").upsert(
      changed.map((l) => ({
        user_id: uid,
        variant_id: l.variantId,
        product_id: l.productId,
        slug: l.slug,
        name_vi: l.nameVi,
        mood: l.mood,
        price: l.price,
        quantity: l.quantity,
      })),
      { onConflict: "user_id,variant_id" },
    );
    if (error) console.error(error);
  }
  if (removed.length) {
    const { error } = await db
      .from("user_cart_items")
      .delete()
      .eq("user_id", uid)
      .in("variant_id", removed);
    if (error) console.error(error);
  }
}

async function handleLogin(userId: string) {
  if (currentUserId === userId) return;
  currentUserId = userId;
  ready = false;

  const db = getDb();
  const [w, c] = await Promise.all([
    db
      .from("user_wishlist_items")
      .select("product_id, slug, name_vi, price, image_url, image_alt")
      .eq("user_id", userId)
      .order("created_at"),
    db
      .from("user_cart_items")
      .select("variant_id, product_id, slug, name_vi, mood, price, quantity")
      .eq("user_id", userId)
      .order("created_at"),
  ]);

  if (currentUserId !== userId) return; // người dùng đã đổi trong lúc tải

  const owner = getOwner();

  if (w.error || c.error) {
    console.error(w.error ?? c.error);
    // Không tải được: nếu dữ liệu trên máy là của tài khoản khác thì bỏ đi cho an toàn.
    if (owner && owner !== userId) {
      wishlistStore.set([]);
      cartStore.set([]);
    }
    setOwner(userId);
    return;
  }

  const wishlistRows = (w.data ?? []) as unknown as WishlistRow[];
  const cartRows = (c.data ?? []) as unknown as CartRow[];

  const serverWishlist: WishlistItem[] = wishlistRows.map((r) => ({
    productId: r.product_id,
    slug: r.slug,
    nameVi: r.name_vi,
    price: Number(r.price),
    imageUrl: r.image_url ?? undefined,
    imageAlt: r.image_alt ?? undefined,
  }));
  const serverCart: CartLine[] = cartRows.map((r) => ({
    productId: r.product_id,
    variantId: r.variant_id,
    slug: r.slug,
    nameVi: r.name_vi,
    mood: r.mood as MoodSlug,
    price: Number(r.price),
    quantity: r.quantity,
  }));

  // Dữ liệu trên máy:
  //  - của tài khoản khác  -> bỏ hẳn
  //  - của chính tài khoản này (bộ nhớ đệm) -> lấy theo Supabase
  //  - của khách chưa đăng nhập (chưa có chủ) -> gộp vào tài khoản
  const guestWishlist = owner === null ? wishlistStore.get() : [];
  const guestCart = owner === null ? cartStore.get() : [];

  const mergedWishlist = [...serverWishlist];
  for (const g of guestWishlist) {
    if (!mergedWishlist.some((i) => i.productId === g.productId)) mergedWishlist.push(g);
  }
  const mergedCart = serverCart.map((l) => ({ ...l }));
  for (const g of guestCart) {
    const found = mergedCart.find((l) => l.variantId === g.variantId);
    if (!found) mergedCart.push(g);
    else found.quantity = Math.max(found.quantity, g.quantity);
  }

  prevWishlist = serverWishlist;
  prevCart = serverCart;
  wishlistStore.set(mergedWishlist);
  cartStore.set(mergedCart);
  setOwner(userId);
  ready = true;

  // Đẩy phần khách đã thêm trước khi đăng nhập lên tài khoản
  enqueue(pushWishlist);
  enqueue(pushCart);
}

async function applySession(userId: string | null) {
  if (!userId) {
    if (currentUserId !== null || getOwner()) clearLocalAccountData();
    return;
  }
  await handleLogin(userId);
}

/** Gọi mỗi khi đổi trang: kiểm tra ai đang đăng nhập. */
export async function syncSession() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  await applySession(data.session?.user.id ?? null);
}

/** Gọi 1 lần khi mở web. */
export function startAccountSync() {
  if (started) return;
  started = true;

  wishlistStore.subscribe(() => enqueue(pushWishlist));
  cartStore.subscribe(() => enqueue(pushCart));

  const supabase = createClient();
  supabase.auth.onAuthStateChange((_event, session) => {
    // setTimeout để tránh gọi Supabase ngay trong hàm lắng nghe
    setTimeout(() => void applySession(session?.user.id ?? null), 0);
  });
}
