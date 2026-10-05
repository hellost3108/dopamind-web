import Link from "next/link";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default function NewCategoryPage() {
  return <div className="mx-auto max-w-4xl"><Link href="/admin/danh-muc" className="text-xs text-black/50 hover:underline">← Danh sách danh mục</Link><div className="mt-3"><PageHeader eyebrow="Cửa hàng" title="Thêm danh mục" description="Tạo một dòng sản phẩm mới để dùng trong bộ lọc và gán cho sản phẩm." /></div><CategoryForm values={{ active: true, sort_order: 0 }} /></div>;
}

