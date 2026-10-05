import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { getAdminCategory } from "@/lib/admin/data";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getAdminCategory(id);
  if (!category) notFound();
  return <div className="mx-auto max-w-4xl"><Link href="/admin/danh-muc" className="text-xs text-black/50 hover:underline">← Danh sách danh mục</Link><div className="mt-3"><PageHeader eyebrow="Danh mục" title={category.name_vi} description="Chỉnh sửa cách danh mục này xuất hiện trên trang sản phẩm." /></div><CategoryForm values={category} /></div>;
}

