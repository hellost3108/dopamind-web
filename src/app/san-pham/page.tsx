


import type { Metadata } from "next";
import { ShopHero } from "@/components/pages/ShopHero";
import { RealCatalog } from "@/components/pages/RealCatalog";
import { getRealCatalog } from "@/lib/real-products";
import { getSection } from "@/lib/cms/server";

import "./products.css";

export const metadata: Metadata = {
  title: "Sản phẩm | DOPAMIND",
  description:
    "Khám phá mặt nạ DOPAMIND theo cảm xúc và nhu cầu của làn da.",
};

// Làm mới dữ liệu từ Supabase mỗi 60 giây.
export const revalidate = 60;

export default async function ProductsPage() {
  const [{ categories, moods, skinNeeds, products }, hero] = await Promise.all([
    getRealCatalog(),
    getSection("shop.hero"),
  ]);

  return (
    <>
      <ShopHero content={hero} count={products.length} />
      <RealCatalog categories={categories} moods={moods} skinNeeds={skinNeeds} products={products} />
    </>
  );
}
