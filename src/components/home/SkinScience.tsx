"use client";

import Image from "next/image";
import { SKIN_NEEDS } from "@/lib/skin-needs";
import { useReveal } from "@/hooks/use-reveal";

/**
 * Compact wide editorial science banner (~38% text / 62% image on desktop)
 * — replaces the previous tall 50/50 section. Only ever renders verified
 * catalog data (see CLAUDE.md > DATA INTEGRITY); no fabricated formula,
 * material, usage-step, or ingredient copy is added just to fill space.
 * One image reveal only, via a single clip-path wipe.
 */
export function SkinScience() {
  const [ref, isVisible] = useReveal<HTMLDivElement>();
  const usesVi = SKIN_NEEDS.map((need) => need.labelVi).join(" · ");

  return (
    <section className="relative bg-cloud-milk py-[clamp(64px,7vw,112px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[38fr_62fr] xl:items-center xl:gap-14 2xl:gap-20">
          <div className="order-2 max-w-[26rem] xl:order-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
              KHOA HỌC LÀN DA
            </span>
            <h2 className="mt-4 font-serif text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal">
              Tinh hoa khoa học
              <br />
              trong từng lớp mặt nạ
            </h2>

            <div className="mt-6 flex flex-col gap-1.5 border-t border-charcoal/10 pt-6">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/50">
                CÔNG DỤNG CHÍNH
              </span>
              <span className="text-sm leading-relaxed text-charcoal/70">{usesVi}</span>
            </div>

            <span className="mt-7 inline-flex min-h-11 items-center border border-charcoal/25 px-5 text-xs font-medium tracking-[0.14em] text-charcoal/70">
              KHÁM PHÁ CÔNG NGHỆ
            </span>
          </div>

          <div
            ref={ref}
            className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-[10px] sm:aspect-[16/10] xl:order-2 xl:aspect-[4/3]"
            style={{
              clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
              transition: "clip-path 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <Image
              src="/images/homepage/science/SS01.png"
              alt="Cận cảnh chất liệu mặt nạ và tinh chất Dopamind Mask Story"
              fill
              sizes="(min-width: 1181px) 62vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 40%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
