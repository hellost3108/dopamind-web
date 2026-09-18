import Image from "next/image";
import Link from "next/link";
import { MEGA_MENU_CATEGORIES, type MegaMenuCategory } from "@/lib/mega-menu";

/**
 * Temporary visual fallback per category until dedicated category
 * photography exists (see CLAUDE.md > PRODUCT FAMILY IMAGES — reuse
 * existing production assets, never fabricate new ones). Only
 * "mts-dual-layer-sheet" has a real matching product photo (P01); the other
 * five reuse the closest existing lifestyle/editorial asset. Report these as
 * missing dedicated assets.
 */
const CATEGORY_IMAGE_SRC: Record<MegaMenuCategory["slug"], string> = {
  "mts-dual-layer-sheet": "/images/homepage/products/P01.png",
  "bo-ha": "/images/homepage/science/SS01.png",
  "mat-na-phoi-dua": "/images/homepage/campaign/CB01.png",
  "mat-na-thach": "/images/homepage/ritual/R03.png",
  "mat-na-giam-mun-phuc-hoi": "/images/homepage/featured/FR01.png",
  "mat-na-dat-set": "/images/homepage/moments/M04.png",
};

const CATEGORY_IMAGE_POSITION: Record<MegaMenuCategory["slug"], string> = {
  "mts-dual-layer-sheet": "50% 30%",
  "bo-ha": "30% 40%",
  "mat-na-phoi-dua": "68% 30%",
  "mat-na-thach": "40% 20%",
  "mat-na-giam-mun-phuc-hoi": "55% 22%",
  "mat-na-dat-set": "45% 15%",
};

/**
 * Homepage commerce entry point built on MEGA_MENU_CATEGORIES — the single
 * source of truth for DOPAMIND's six product lines (see CLAUDE.md >
 * PRODUCT FAMILIES). No price, count, or benefit claim is shown since none
 * of that is verified for these categories yet.
 */
export function ProductFamilies() {
  return (
    <section className="relative bg-cloud-milk py-[clamp(64px,7vw,112px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-col gap-10 xl:grid xl:grid-cols-[36fr_64fr] xl:items-center xl:gap-14 2xl:gap-20">
          <div className="max-w-[28rem]">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
              DÒNG SẢN PHẨM
            </span>
            <h2 className="mt-4 font-serif text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal">
              18 sản phẩm.
              <br />
              6 dòng chăm sóc.
            </h2>
            <p className="mt-5 text-[clamp(0.95rem,1.2vw,1.0625rem)] leading-relaxed text-charcoal/60">
              Từ mặt nạ chuyên sâu đến các bước chăm sóc hằng ngày, khám phá DOPAMIND theo dòng
              sản phẩm phù hợp với khoảng thời gian của bạn.
            </p>
            <Link
              href="/san-pham"
              className="mt-7 inline-flex min-h-11 items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple"
            >
              KHÁM PHÁ TẤT CẢ SẢN PHẨM →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 xl:gap-x-6 xl:gap-y-10">
            {MEGA_MENU_CATEGORIES.map((category) => (
              <Link key={category.slug} href={category.href} className="group flex flex-col gap-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px]">
                  <Image
                    src={CATEGORY_IMAGE_SRC[category.slug]}
                    alt={category.labelVi}
                    fill
                    sizes="(min-width: 1181px) 20vw, (min-width: 431px) 30vw, 46vw"
                    style={{ objectPosition: CATEGORY_IMAGE_POSITION[category.slug] }}
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />
                </div>
                <span className="flex items-center justify-between gap-2 text-[13px] font-medium leading-snug text-charcoal sm:text-sm">
                  {category.labelVi}
                  <span
                    aria-hidden
                    className="shrink-0 text-charcoal/40 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-charcoal"
                  >
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
