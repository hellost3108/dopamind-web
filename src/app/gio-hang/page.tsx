import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { CartPageClient } from "@/components/pages/CommercePages";
export const metadata: Metadata = { title: "Giỏ hàng | DOPAMIND" };
export default function CartPage(){return <><PageIntro eyebrow="Giỏ hàng" title={<>Khoảng nghỉ<br/><span className="text-purple">của bạn.</span></>} body="Xem lại những lựa chọn trước khi tiếp tục. Thanh toán chỉ mở khi dữ liệu bán hàng đã được xác minh."/><CartPageClient/></>}
