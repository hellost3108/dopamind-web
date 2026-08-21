import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { SearchPageClient } from "@/components/pages/CommercePages";
export const metadata: Metadata = { title: "Tìm kiếm | DOPAMIND" };
export default function SearchPage(){return <><PageIntro eyebrow="Tìm kiếm" title={<>Bạn đang<br/><span className="text-purple">cần gì?</span></>} body="Tìm theo tên sản phẩm, trạng thái cảm xúc hoặc nhu cầu của làn da."/><SearchPageClient/></>}
