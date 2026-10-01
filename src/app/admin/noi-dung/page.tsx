import { SectionForm } from "@/components/admin/SectionForm";
import { SECTIONS } from "@/lib/site-content-schema";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function SiteContentPage() {
  const values = await getSiteContent();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl text-charcoal">Nội dung trang web</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Sửa chữ, ảnh và link ngay tại đây. Bấm Lưu là trang web cập nhật, không cần sửa code.
      </p>
      <div className="mt-8 grid gap-6">
        {SECTIONS.map((section) => (
          <SectionForm key={section.id} section={section} values={values} />
        ))}
      </div>
    </div>
  );
}
