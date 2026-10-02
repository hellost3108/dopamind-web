import type { Metadata } from "next";
import Image from "next/image";
import { RealCatalog } from "@/components/pages/RealCatalog";
import { getRealCatalog } from "@/lib/real-products";
import "./products.css";

export const metadata: Metadata = {
  title: "Sản phẩm | DOPAMIND",
  description:
    "Khám phá mặt nạ DOPAMIND theo cảm xúc và nhu cầu của làn da.",
};

// Làm mới dữ liệu từ Supabase mỗi 60 giây.
export const revalidate = 60;

export default async function ProductsPage() {
  const { categories, moods, skinNeeds, products } = await getRealCatalog();

  return (
    <>
      <section className="products-hero px-[clamp(20px,4vw,64px)] pt-[clamp(24px,4vw,64px)]">
        <div className="products-hero__frame relative mx-auto max-w-[1600px] overflow-hidden rounded-2xl bg-lavender/15">
          {/* Chữ: trên màn hình lớn nằm đè lên ảnh, trên điện thoại nằm phía trên ảnh */}
          <div className="relative z-10 px-6 pb-6 pt-8 text-center md:absolute md:inset-x-0 md:top-0 md:px-8 md:pb-0 md:pt-[4%]">
            <p className="products-hero__eyebrow text-[10px] font-medium uppercase tracking-[.18em] text-charcoal/50">
              Mind–Skin Care / Sản phẩm
            </p>
            <h1 className="products-hero__headline mt-4 font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] text-charcoal">
              Chọn một
              <br className="md:hidden" />{" "}
              <span className="text-purple">khoảng nghỉ.</span>
            </h1>
            <p className="products-hero__support mx-auto mt-4 max-w-md text-base leading-relaxed text-charcoal/60">
              {`${products.length} sản phẩm DOPAMIND — chăm sóc làn da theo từng dòng sản phẩm.`}
            </p>
          </div>

          {/* Lớp sáng chiều sâu — Lavender / Mint, rất mờ */}
          <div aria-hidden className="products-hero__glow" />

          {/* Ảnh nền */}
          <div className="products-hero__media relative aspect-[16/9]">
            <div className="products-hero__zoom absolute inset-0">
              <Image
                src="/images/san-pham-hero.jpg"
                alt="Các dòng sản phẩm DOPAMIND Mask Story"
                fill
                priority
                sizes="(min-width: 1600px) 1600px, 100vw"
                className="products-hero__image object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <RealCatalog categories={categories} moods={moods} skinNeeds={skinNeeds} products={products} />
    </>
  );
}
