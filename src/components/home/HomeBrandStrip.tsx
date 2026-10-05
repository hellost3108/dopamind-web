import { getSection } from "@/lib/cms/server";
import { itemStr, list } from "@/lib/cms/fields";

/** Nội dung chỉnh được ở /admin/noi-dung/home.brandStrip. */
export async function HomeBrandStrip() {
  const content = await getSection("home.brandStrip");
  const items = list(content, "items");

  return (
    <section className="relative border-y border-charcoal/10 bg-cloud-milk">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)] py-[clamp(28px,3.2vw,44px)]">
        <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-0">
          {items.map((item, index) => (
            <div key={`${itemStr(item, "number")}-${index}`} className="flex items-start gap-3">
              <span className="mt-0.5 text-[11px] font-medium tabular-nums text-charcoal/35">{itemStr(item, "number")}</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal">{itemStr(item, "label")}</span>
                <span className="text-[13px] leading-snug text-charcoal/55">{itemStr(item, "description")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
