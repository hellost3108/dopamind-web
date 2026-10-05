import Image from "next/image";
import Link from "next/link";
import { PageHeader, Notice } from "@/components/admin/PageHeader";
import { btnPrimary, card, chip } from "@/components/admin/ui";
import { getAdminArticles } from "@/lib/articles";

const STATUS: Record<string, string> = { draft: "Bản nháp", published: "Đã xuất bản", archived: "Lưu trữ" };
const STYLE: Record<string, string> = { draft: "bg-amber-100 text-amber-900", published: "bg-emerald-100 text-emerald-900", archived: "bg-black/10 text-black/60" };

export default async function AdminArticlesPage() {
  const { rows, tableMissing } = await getAdminArticles();
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Kho nội dung" title="Bài viết" description="Tạo bài, lưu nháp, chọn bài nổi bật và xuất bản lên website." actions={<Link href="/admin/bai-viet/moi" className={btnPrimary}>+ Viết bài mới</Link>} />
      {tableMissing && <Notice tone="warning">Chưa có bảng bài viết. Khi chạy local, mở Supabase SQL Editor và chạy file <code>supabase/migrations/20261005090000_content_studio.sql</code>.</Notice>}
      <div className={`${card} mt-6 !p-0`}>
        {rows.length === 0 ? <p className="p-8 text-center text-sm text-black/50">Chưa có bài viết. Bấm “Viết bài mới” để bắt đầu.</p> : (
          <ul className="divide-y divide-black/10">
            {rows.map((article) => (
              <li key={article.id}>
                <Link href={`/admin/bai-viet/${article.id}`} className="flex items-center gap-4 p-4 transition hover:bg-black/[.03] sm:p-5">
                  <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-lavender/20">{article.image_url && <Image src={article.image_url} alt="" fill sizes="112px" className="object-cover" unoptimized />}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{article.title}</span>
                    <span className="mt-1 block truncate text-xs text-black/45">/{article.slug} · {article.category}</span>
                    <span className="mt-2 flex flex-wrap gap-2"><span className={`${chip} ${STYLE[article.status]}`}>{STATUS[article.status]}</span>{article.featured && <span className={`${chip} bg-[#f52334]/10 text-[#f52334]`}>Nổi bật</span>}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

