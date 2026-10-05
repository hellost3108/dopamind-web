import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { btnPrimary, card, chip } from "@/components/admin/ui";
import { getAdminCategories } from "@/lib/admin/data";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return <div className="mx-auto max-w-5xl"><PageHeader eyebrow="Cửa hàng" title="Danh mục sản phẩm" description="Quản lý tên dòng sản phẩm, mô tả, ảnh và thứ tự hiển thị trên trang Sản phẩm." actions={<Link href="/admin/danh-muc/moi" className={btnPrimary}>+ Thêm danh mục</Link>} /><div className={`${card} !p-0`}>{categories.length === 0 ? <p className="p-8 text-center text-sm text-black/50">Chưa có danh mục.</p> : <ul className="divide-y divide-black/10">{categories.map((category) => <li key={category.id}><Link href={`/admin/danh-muc/${category.id}`} className="flex items-center gap-4 p-5 transition hover:bg-black/[.03]"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-lavender/20 font-serif text-lg">{category.sort_order + 1}</span><span className="min-w-0 flex-1"><span className="block truncate font-semibold">{category.name_vi}</span><span className="mt-1 block truncate text-xs text-black/45">/{category.slug}</span></span><span className={`${chip} ${category.active ? "bg-emerald-100 text-emerald-900" : "bg-black/10 text-black/55"}`}>{category.active ? "Đang hiện" : "Đang ẩn"}</span></Link></li>)}</ul>}</div></div>;
}

