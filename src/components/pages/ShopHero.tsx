import Image from "next/image";
import { FormattedText } from "@/components/content/FormattedText";
import { replaceRichText } from "@/lib/rich-text/content";
import { bool, str } from "@/lib/cms/fields";
import type { SectionContent } from "@/lib/cms/types";

export function ShopHero({content:hero,count}:{content:SectionContent;count:number}) { return <>
      {bool(hero, "enabled") && <section className="products-hero px-[clamp(20px,4vw,64px)] pt-[clamp(24px,4vw,64px)]">
        <div className="products-hero__frame relative mx-auto max-w-[1600px] overflow-hidden rounded-2xl bg-lavender/15">
          {/* Chữ: trên màn hình lớn nằm đè lên ảnh, trên điện thoại nằm phía trên ảnh */}
          <div className="relative z-10 px-6 pb-6 pt-8 text-center md:absolute md:inset-x-0 md:top-0 md:px-8 md:pb-0 md:pt-[4%]">
            <p className="products-hero__eyebrow text-[10px] font-medium uppercase tracking-[.18em] text-charcoal/50">
              <FormattedText value={str(hero, "eyebrow")} />
            </p>
            <h1 className="products-hero__headline mt-4 font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] text-charcoal">
              <FormattedText value={str(hero, "title")} mode="block" phrasing />
              <br className="md:hidden" />{" "}
              <span className="text-purple"><FormattedText value={str(hero, "titleEm")} /></span>
            </h1>
            <p className="products-hero__support mx-auto mt-4 max-w-md text-base leading-relaxed text-charcoal/60">
              <FormattedText value={replaceRichText(str(hero, "body"), "{count}", String(count))} mode="block" phrasing />
            </p>
          </div>

          {/* Lớp sáng chiều sâu — Lavender / Mint, rất mờ */}
          <div aria-hidden className="products-hero__glow" />

          {/* Ảnh nền */}
          <div className="products-hero__media relative aspect-[16/9]">
            <div className="products-hero__zoom absolute inset-0">
              <Image
                src={str(hero, "image")}
                alt={str(hero, "imageAlt")}
                fill
                priority
                sizes="(min-width: 1600px) 1600px, 100vw"
                className="products-hero__image object-cover"
              />
            </div>
          </div>
        </div>
      </section>}

</>; }
