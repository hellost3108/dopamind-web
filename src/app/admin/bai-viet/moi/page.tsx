import Link from "next/link";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewArticlePage() {
  return <div className="mx-auto max-w-5xl"><Link href="/admin/bai-viet" className="text-xs text-black/50 hover:underline">← Danh sách bài viết</Link><div className="mt-3"><PageHeader eyebrow="Kho nội dung" title="Viết bài mới" description="Soạn nội dung, thêm ảnh đại diện rồi lưu nháp hoặc xuất bản." /></div><ArticleForm values={{ status: "draft", reading_time: 5, sort_order: 0, featured: false }} /></div>;
}

