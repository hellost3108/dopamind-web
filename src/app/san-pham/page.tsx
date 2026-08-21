import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { Catalog } from "@/components/pages/Catalog";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Sản phẩm | DOPAMIND", description: "Khám phá mặt nạ DOPAMIND theo cảm xúc và nhu cầu của làn da." };

export default function ProductsPage() {
  return <><PageIntro eyebrow="Mind–Skin Care / Sản phẩm" title={<>Chọn một<br/><span className="text-purple">khoảng nghỉ.</span></>} body="Bắt đầu từ cảm xúc hiện tại, hoặc điều làn da đang cần. Thông tin bán hàng chỉ hiển thị khi đã được DOPAMIND xác minh." /><Catalog products={getAllProducts()} /></>;
}
