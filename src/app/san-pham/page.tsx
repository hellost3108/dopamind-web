import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { RealCatalog } from "@/components/pages/RealCatalog";
import { getRealCatalog } from "@/lib/real-products";

export const metadata: Metadata = {
  title: "Sản phẩm | DOPAMIND",
  description:
    "Khám phá mặt nạ DOPAMIND theo cảm xúc và nhu cầu của làn da.",
};

// Làm mới dữ liệu từ Supabase mỗi 60 giây.
export const revalidate = 60;

export default async function ProductsPage() {
  const { categories, products } = await getRealCatalog();

  return (
    <>
      <PageIntro
        eyebrow="Mind–Skin Care / Sản phẩm"
        title={
          <>
            Chọn một
            <br />
            <span className="text-purple">khoảng nghỉ.</span>
          </>
        }
        body={`${products.length} sản phẩm DOPAMIND — chăm sóc làn da theo từng dòng sản phẩm.`}
      />
      <RealCatalog categories={categories} products={products} />
    </>
  );
}