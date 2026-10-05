import Link from "next/link";
import { PageHeader, Notice } from "@/components/admin/PageHeader";
import { card, chip } from "@/components/admin/ui";
import { getStoredSections } from "@/lib/admin/cms-data";
import { getAdminCategories, getAdminProducts } from "@/lib/admin/data";
import { getAdminArticles } from "@/lib/articles";
import { CMS_GROUPS, SECTION_DEFS } from "@/lib/cms/sections";

export default async function AdminDashboardPage() {
  const [sections, products, categories, articles] = await Promise.all([
    getStoredSections(),
    getAdminProducts(),
    getAdminCategories(),
    getAdminArticles(),
  ]);
  const edited = Object.keys(sections.rows).length;
  const published = articles.rows.filter((article) => article.status === "published").length;

  const modules = [
    { label: "Khối nội dung", value: `${edited}/${SECTION_DEFS.length}`, detail: "đã tùy chỉnh", href: "/admin/noi-dung", color: "bg-lavender" },
    { label: "Sản phẩm", value: products.length, detail: `${products.filter((product) => product.status === "active").length} đang bán`, href: "/admin/san-pham", color: "bg-mint" },
    { label: "Danh mục", value: categories.length, detail: `${categories.filter((category) => category.active).length} đang hiển thị`, href: "/admin/danh-muc", color: "bg-butter" },
    { label: "Bài viết", value: articles.rows.length, detail: `${published} đã xuất bản`, href: "/admin/bai-viet", color: "bg-peach" },
  ];

  return (
    <div>
      <PageHeader eyebrow="DOPAMIND Content Studio" title="Quản trị nội dung website" description="Điều khiển banner, từng section, bài viết, danh mục và sản phẩm từ một nơi. Đơn hàng được tách sang khu vực Vận hành." actions={<Link href="/" target="_blank" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold hover:border-[#f52334] hover:text-[#f52334]">Xem website ↗</Link>} />

      {(sections.tableMissing || articles.tableMissing) && <Notice tone="warning">Một phần Content Studio chưa có bảng dữ liệu trên Supabase. Để kiểm thử đầy đủ, chạy các migration CMS trong thư mục <code>supabase/migrations</code>. Website vẫn dùng nội dung gốc khi chưa có bảng.</Notice>}

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {modules.map((module) => <Link key={module.label} href={module.href} className={`${card} transition hover:-translate-y-0.5 hover:border-[#f52334]/40`}><span className={`block h-1.5 w-9 rounded-full ${module.color}`} /><p className="mt-4 text-sm text-black/55">{module.label}</p><p className="mt-1 font-serif text-3xl">{module.value}</p><p className="mt-1 text-xs text-black/40">{module.detail}</p></Link>)}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="font-serif text-2xl">Các trang trên website</h2><p className="mt-1 text-sm text-black/50">Chọn trang, sau đó chọn section cần thay đổi.</p></div><Link href="/admin/noi-dung" className="text-sm font-semibold text-[#f52334] hover:underline">Xem tất cả section →</Link></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CMS_GROUPS.map((group) => {
            const defs = SECTION_DEFS.filter((def) => def.group === group.key);
            const customized = defs.filter((def) => sections.rows[def.key]).length;
            return <Link key={group.key} href={`/admin/noi-dung/${defs[0]?.key ?? "global.announcement"}`} className={`${card} group`}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#f52334]">{group.label}</p><p className="mt-3 text-sm leading-6 text-black/55">{group.description}</p></div><span className="text-2xl text-black/20 transition group-hover:translate-x-1 group-hover:text-[#f52334]">→</span></div><div className="mt-5 flex items-center gap-2"><span className={`${chip} bg-black/[.05] text-black/60`}>{defs.length} section</span><span className={`${chip} bg-lavender/35 text-black/65`}>{customized} đã chỉnh</span></div></Link>;
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <Link href="/admin/bai-viet/moi" className={`${card} bg-[#191716] text-white`}><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#ff5a66]">Kho nội dung</p><h2 className="mt-3 font-serif text-2xl">Viết bài mới</h2><p className="mt-2 text-sm leading-6 text-white/55">Soạn bài, thêm ảnh, lưu nháp hoặc xuất bản lên trang Bài viết.</p><span className="mt-5 inline-block text-sm font-semibold">Bắt đầu viết →</span></Link>
        <Link href="/admin/san-pham/moi" className={card}><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#f52334]">Cửa hàng</p><h2 className="mt-3 font-serif text-2xl">Thêm sản phẩm</h2><p className="mt-2 text-sm leading-6 text-black/55">Quản lý thông tin, biến thể, giá, tồn kho, ảnh và trạng thái bán.</p></Link>
        <Link href="/admin/danh-muc" className={card}><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#f52334]">Cấu trúc catalog</p><h2 className="mt-3 font-serif text-2xl">Sắp xếp danh mục</h2><p className="mt-2 text-sm leading-6 text-black/55">Đổi tên dòng sản phẩm, mô tả, ảnh và thứ tự xuất hiện.</p></Link>
      </section>
    </div>
  );
}
