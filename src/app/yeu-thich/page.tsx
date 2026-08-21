import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { WishlistPageClient } from "@/components/pages/CommercePages";
export const metadata: Metadata = { title: "Yêu thích | DOPAMIND" };
export default function WishlistPage(){return <><PageIntro eyebrow="Danh sách của bạn" title={<>Để dành một<br/><span className="text-purple">khoảng nghỉ.</span></>} body="Những lựa chọn bạn muốn giữ lại cho ngày cần một nhịp chậm hơn."/><WishlistPageClient/></>}
