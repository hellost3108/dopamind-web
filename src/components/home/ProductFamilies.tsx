import Image from "next/image";
import Link from "next/link";
import { getSection } from "@/lib/cms/server";
import { itemStr, list, str } from "@/lib/cms/fields";

/** Nội dung chỉnh được ở /admin/noi-dung/home.productFamilies. */
export async function ProductFamilies() {
  const content = await getSection("home.productFamilies");
  const categories = list(content, "categories");

  return (
    <section className="relative bg-cloud-milk py-[clamp(64px,7vw,112px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-col gap-10 xl:grid xl:grid-cols-[36fr_64fr] xl:items-center xl:gap-14 2xl:gap-20">
          <div className="max-w-[28rem]">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
              {str(content, "eyebrow")}
            </span>
            <h2 className="mt-4 whitespace-pre-line font-serif text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal">
              {str(content, "title")}
            </h2>
            <p className="mt-5 text-[clamp(0.95rem,1.2vw,1.0625rem)] leading-relaxed text-charcoal/60">
              {str(content, "body")}
            </p>
            <Link
              href={str(content, "ctaHref") || "/san-pham"}
              className="mt-7 inline-flex min-h-11 items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple"
            >
              {str(content, "ctaLabel")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 xl:gap-x-6 xl:gap-y-10">
            {categories.map((category, index) => (
              <Link key={`${itemStr(category, "label")}-${index}`} href={itemStr(category, "href") || "/san-pham"} className="group flex flex-col gap-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-charcoal/[.04]">
                  <Image
                    src={itemStr(category, "image")}
                    alt={itemStr(category, "alt") || itemStr(category, "label")}
                    fill
                    sizes="(min-width: 1181px) 20vw, (min-width: 431px) 30vw, 46vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />
                </div>
                <span className="flex items-center justify-between gap-2 text-[13px] font-medium leading-snug text-charcoal sm:text-sm">
                  {itemStr(category, "label")}
                  <span aria-hidden className="shrink-0 text-charcoal/40 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-charcoal">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
