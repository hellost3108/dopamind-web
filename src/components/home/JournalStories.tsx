import Image from "next/image";
import Link from "next/link";
import { getSection } from "@/lib/cms/server";
import { itemStr, list, str } from "@/lib/cms/fields";

/** Nội dung chỉnh được ở /admin/noi-dung/home.journal. */
export async function JournalStories() {
  const content = await getSection("home.journal");
  const cards = list(content, "cards");

  return (
    <section className="relative bg-cloud-milk py-[clamp(64px,7vw,112px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal">{str(content, "title")}</h2>
          <Link href={str(content, "ctaHref") || "/nhat-ky"} className="flex min-h-11 items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple">
            {str(content, "ctaLabel")}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-8">
          {cards.map((card, index) => (
            <Link key={`${itemStr(card, "title")}-${index}`} href={itemStr(card, "href") || "/nhat-ky"} className="group flex flex-col gap-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-charcoal/[.04]">
                <Image
                  src={itemStr(card, "image")}
                  alt={itemStr(card, "alt") || itemStr(card, "title")}
                  fill
                  sizes="(min-width: 1181px) 30vw, (min-width: 431px) 46vw, 88vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/45">{itemStr(card, "category")}</span>
                <h3 className="font-serif text-[clamp(1.25rem,1.8vw,1.625rem)] font-medium leading-[1.2] text-charcoal">{itemStr(card, "title")}</h3>
                <p className="text-sm leading-relaxed text-charcoal/60">{itemStr(card, "intro")}</p>
                <span className="mt-1 inline-flex w-fit items-center text-xs font-medium tracking-[0.12em] text-charcoal underline underline-offset-4 transition-colors group-hover:text-purple">ĐỌC THÊM →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
