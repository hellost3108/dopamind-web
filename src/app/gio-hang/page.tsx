import type { Metadata } from "next";
import { CartPageClient } from "@/components/pages/CartSelectable";

export const metadata: Metadata = { title: "Giỏ hàng | DOPAMIND" };

export default function CartPage() {
  return <CartPageClient />;
}
