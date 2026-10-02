import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/admin/cms/SectionEditor";
import { getSectionVersions, getStoredSections } from "@/lib/admin/cms-data";
import { resolveContent } from "@/lib/cms/fields";
import { getSectionDef } from "@/lib/cms/sections";

export default async function EditSectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key: rawKey } = await params;
  const def = getSectionDef(decodeURIComponent(rawKey));
  if (!def) notFound();

  const [{ rows, tableMissing }, versions] = await Promise.all([getStoredSections(), getSectionVersions(def.key)]);
  const initial = resolveContent(def, rows[def.key]?.content);

  return (
    <div>
      <Link href="/admin/noi-dung" className="text-xs text-charcoal/55 underline-offset-4 hover:underline">
        ← Nội dung website
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">{def.label}</h1>
        <Link href={def.path} target="_blank" className="text-sm text-purple underline-offset-4 hover:underline">
          Xem trên trang web ↗
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-charcoal/60">{def.description}</p>

      {tableMissing && (
        <p role="alert" className="mt-5 rounded-xl bg-butter/60 px-4 py-3 text-sm text-charcoal">
          Chưa tạo bảng nội dung trong Supabase nên chưa lưu được. Hãy chạy file{" "}
          <code className="rounded bg-white/70 px-1.5 py-0.5 text-[12px]">supabase/migrations/20261002090000_site_cms.sql</code>{" "}
          trong SQL Editor.
        </p>
      )}

      <div className="mt-6">
        <SectionEditor def={def} initial={initial} versions={versions} />
      </div>
    </div>
  );
}
