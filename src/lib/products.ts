import type { Product, MoodSlug } from "@/lib/types";
import { getMood } from "@/lib/moods";
import { BADGE_LABEL_VI } from "@/lib/badges";

/**
 * SAMPLE / PLACEHOLDER CATALOG
 * ----------------------------
 * There is no real product feed yet. Every entry below exists only so the
 * Phase 1 components (ProductCard, mega menu, search, cart...) have
 * something real to render and can be visually validated. Prices, benefit
 * copy, and discounts here are structural placeholders, not verified
 * commerce facts — see CLAUDE.md > COMMERCE. Replace this module with a
 * real data source before launch.
 */
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "mat-na-binh-tam",
    nameVi: "Mặt Nạ Bình Tâm",
    benefitVi: "Làm dịu và cấp ẩm cho làn da mệt mỏi",
    mood: "binh-tam",
    skinNeeds: ["lam-diu", "cap-am"],
    price: 390000,
    badge: "best-seller",
    isPlaceholder: true,
  },
  {
    id: "p2",
    slug: "mat-na-tai-tao",
    nameVi: "Mặt Nạ Tái Tạo",
    benefitVi: "Hỗ trợ hàng rào bảo vệ da sau một ngày dài",
    mood: "tai-tao",
    skinNeeds: ["hang-rao-bao-ve-da", "cap-am"],
    price: 450000,
    compareAtPrice: 520000,
    isPlaceholder: true,
  },
  {
    id: "p3",
    slug: "mat-na-rang-ro",
    nameVi: "Mặt Nạ Rạng Rỡ",
    benefitVi: "Làm sáng và cấp ẩm cho làn da tươi mới",
    mood: "rang-ro",
    skinNeeds: ["lam-sang", "cap-am"],
    price: 420000,
    badge: "new",
    isPlaceholder: true,
  },
  {
    id: "p4",
    slug: "mat-na-yeu-thuong",
    nameVi: "Mặt Nạ Yêu Thương",
    benefitVi: "Làm dịu nhẹ nhàng, dành 15 phút cho chính mình",
    mood: "yeu-thuong",
    skinNeeds: ["lam-diu"],
    price: 410000,
    isPlaceholder: true,
  },
  {
    id: "p5",
    slug: "mat-na-binh-tam-ban-dem",
    nameVi: "Mặt Nạ Bình Tâm Ban Đêm",
    benefitVi: "Cấp ẩm sâu, hỗ trợ phục hồi trong lúc ngủ",
    mood: "binh-tam",
    skinNeeds: ["lam-diu", "cap-am"],
    price: 390000,
    compareAtPrice: 430000,
    isPlaceholder: true,
  },
  {
    id: "p6",
    slug: "mat-na-tai-tao-chuyen-sau",
    nameVi: "Mặt Nạ Tái Tạo Chuyên Sâu",
    benefitVi: "Hỗ trợ hàng rào bảo vệ da, phục hồi chuyên sâu",
    mood: "tai-tao",
    skinNeeds: ["hang-rao-bao-ve-da"],
    price: 480000,
    badge: "best-seller",
    isPlaceholder: true,
  },
  {
    id: "p7",
    slug: "mat-na-rang-ro-suc-song",
    nameVi: "Mặt Nạ Rạng Rỡ Sức Sống",
    benefitVi: "Làm sáng da, mang lại vẻ tươi tắn tức thì",
    mood: "rang-ro",
    skinNeeds: ["lam-sang"],
    price: 420000,
    isPlaceholder: true,
  },
  {
    id: "p8",
    slug: "mat-na-yeu-thuong-diu-nhe",
    nameVi: "Mặt Nạ Yêu Thương Dịu Nhẹ",
    benefitVi: "Cấp ẩm và làm dịu, dịu dàng như một cái ôm",
    mood: "yeu-thuong",
    skinNeeds: ["lam-diu", "cap-am"],
    price: 400000,
    badge: "new",
    isPlaceholder: true,
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getBestSellers(): Product[] {
  return PRODUCTS.filter((product) => product.badge === "best-seller");
}

export function getNewProducts(): Product[] {
  return PRODUCTS.filter((product) => product.badge === "new");
}

export function getProductsByMood(mood: MoodSlug): Product[] {
  return PRODUCTS.filter((product) => product.mood === mood);
}

function normalizeVi(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim();
}

export function searchProducts(query: string): Product[] {
  const q = normalizeVi(query);
  if (!q) return [];

  return PRODUCTS.filter((product) => {
    const moodLabel = getMood(product.mood).labelVi;
    const badgeLabel = product.badge ? BADGE_LABEL_VI[product.badge] : "";
    const haystack = normalizeVi(
      `${product.nameVi} ${product.benefitVi} ${moodLabel} ${badgeLabel}`
    );
    return haystack.includes(q);
  });
}
