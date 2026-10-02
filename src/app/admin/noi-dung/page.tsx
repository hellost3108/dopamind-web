import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { getStoredSections } from "@/lib/admin/cms-data";
import { formatDateTime } from "@/lib/admin/format";
import { CMS_GROUPS, SECTION_DEFS } from "@/lib/cms/sections";

export default async function AdminContentPage() {
  const { rows, tableMissing } = await getStoredSections();
  const edited = Object.keys(rows).length;

  return (
    <div>
      <PageHeader
        title="Nội dung website"
        description="Chọn một khối để sửa chữ, đường dẫn và ảnh. Bấm “Lưu thay đổi” là website cập nhật ngay."
        actions={
          <Link href="/" target="_blank" className="inline-flex h-10 items-center rounded-xl border border-charcoal/15 bg-white px-4 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/[.04]">
            Xem website
          </Link>
        }
      />

      {tableMissing && (
        <p role="alert" className="mb-8 rounded-xl border border-butter bg-butter/40 px-4 py-3 text-sm text-charcoal">
          Chưa tạo bảng nội dung trong Supabase nên chưa lưu được chỉnh sửa. Mở Supabase → SQL Editor và chạy file{" "}
          <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs">supabase/migrations/20261002090000_site_cms.sql</code>, rồi tải lại trang.
        </p>
      )}

      <p className="mb-8 text-sm text-charcoal/55">
        {SECTION_DEFS.length} khối nội dung · {edited} khối đã chỉnh · {SECTION_DEFS.length - edited} khối đang dùng nội dung gốc
      </p>

      <div className="space-y-10">
        {CMS_GROUPS.map((group) => {
          const defs = SECTION_DEFS.filter((d) => d.group === group.key);
          if (defs.length === 0) return null;
          return (
            <section key={group.key} aria-labelledby={`g-${group.key}`}>
              <h2 id={`g-${group.key}`} className="font-serif text-xl text-charcoal">{group.label}</h2>
              <p className="mt-1 text-sm text-charcoal/55">{group.description}</p>
              <ul className="mt-4 divide-y divide-charcoal/[.07] overflow-hidden rounded-2xl border border-charcoal/[.08] bg-white shadow-[0_1px_2px_rgba(37,37,43,.04)]">
                {defs.map((def) => {
                  const stored = rows[def.key];
                  return (
                    <li key={def.key}>
                      <Link href={`/admin/noi-dung/${def.key}`} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-black/[.04] focus-visible:bg-black/[.04] focus-visible:outline-none">
                        <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${stored ? "bg-[#f52334]" : "bg-charcoal/20"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-medium text-charcoal">{def.label}</p>
                          <p className="mt-0.5 line-clamp-1 text-[13px] text-charcoal/55">{def.description}</p>
                        </div>
                        <div className="hidden shrink-0 text-right sm:block">
                          <p className="text-xs font-medium text-charcoal/70">{stored ? "Đã chỉnh" : "Nội dung gốc"}</p>
                          {stored && <p className="mt-0.5 text-[11px] text-charcoal/45">{formatDateTime(stored.updatedAt)}</p>}
                        </div>
                        <span aria-hidden="true" className="shrink-0 text-charcoal/30 transition-transform group-hover:translate-x-0.5 group-hover:text-[#f52334]">›</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
