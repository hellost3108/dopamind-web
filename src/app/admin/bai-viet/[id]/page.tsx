import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getAdminArticle } from "@/lib/articles";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getAdminArticle(id);
  if (!article) notFound();
  return <div className="mx-auto max-w-5xl"><Link href="/admin/bai-viet" className="text-xs text-black/50 hover:underline">← Danh sách bài viết</Link><div className="mt-3"><PageHeader eyebrow="Bài viết" title={article.title} description="Chỉnh sửa nội dung, ảnh, trạng thái xuất bản và thông tin SEO." actions={article.status === "published" ? <Link href={`/bai-viet/${article.slug}`} target="_blank" className="text-sm font-semibold text-[#f52334] hover:underline">Xem bài ↗</Link> : undefined} /></div><ArticleForm values={article} /></div>;
}

