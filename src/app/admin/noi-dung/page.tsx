import Link from "next/link";
import { getStoredSections } from "@/lib/admin/cms-data";
import { formatDateTime } from "@/lib/admin/format";
import { CMS_GROUPS, SECTION_DEFS } from "@/lib/cms/sections";
import { card, chip } from "@/components/admin/ui";

export default async function AdminContentPage() {
  const { rows, tableMissing } = await getStoredSections();

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">Nội dung website</h1>
      <p className="mt-2 max-w-2xl text-sm text-charcoal/60">
        Chọn một khối để chỉnh chữ, đường dẫn và ảnh. Bấm “Lưu thay đổi” là website cập nhật ngay.
        Khối chưa chỉnh sẽ dùng nội dung gốc.
      </p>

      {tableMissing && (
        <p role="alert" className="mt-6 rounded-xl bg-butter/60 px-4 py-3 text-sm text-charcoal">
          Chưa tạo bảng nội dung trong Supabase nên chưa lưu được chỉnh sửa. Mở Supabase → SQL Editor và chạy file{" "}
          <code className="rounded bg-white/70 px-1.5 py-0.5 text-[12px]">supabase/migrations/20261002090000_site_cms.sql</code>{" "}
          một lần, rồi tải lại trang này.
        </p>
      )}

      <div className="mt-8 space-y-10">
        {CMS_GROUPS.map((group) => {
          const defs = SECTION_DEFS.filter((d) => d.group === group.key);
          if (defs.length === 0) return null;
          return (
            <section key={group.key}>
              <h2 className="font-serif text-xl text-charcoal">{group.label}</h2>
              <p className="mt-1 text-xs text-charcoal/50">{group.description}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {defs.map((def) => {
                  const stored = rows[def.key];
                  return (
                    <li key={def.key}>
                      <Link
                        href={`/admin/noi-dung/${def.key}`}
                        className={`${card} block h-full transition-colors hover:bg-lavender/20`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-[15px] font-medium text-charcoal">{def.label}</h3>
                          <span className={`${chip} shrink-0 ${stored ? "bg-mint text-charcoal" : "bg-charcoal/10 text-charcoal/65"}`}>
                            {stored ? "Đã chỉnh" : "Nội dung gốc"}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-charcoal/55">{def.description}</p>
                        {stored && (
                          <p className="mt-3 text-[11px] text-charcoal/45">Cập nhật {formatDateTime(stored.updatedAt)}</p>
                        )}
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
