import Link from "next/link";
import { getSection } from "@/lib/cms/server";
import { str } from "@/lib/cms/fields";

/** Nội dung chỉnh được ở /admin/noi-dung/global.announcement. Để trống = ẩn thanh. */
export async function AnnouncementBar() {
  const content = await getSection("global.announcement");
  const text = str(content, "text");
  if (!text) return null;
  const href = str(content, "href");

  const line = (
    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cloud-milk">{text}</p>
  );

  return (
    <div className="bg-charcoal px-[clamp(16px,4vw,64px)] py-2.5 text-center">
      {href ? (
        <Link href={href} className="block transition-opacity hover:opacity-80">
          {line}
        </Link>
      ) : (
        line
      )}
    </div>
  );
}
