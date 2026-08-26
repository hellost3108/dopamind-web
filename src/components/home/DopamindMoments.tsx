"use client";

import Image from "next/image";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type Moment = {
  labelVi: string;
  timeVi: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition: string;
  /** Explicit grid placement — mobile/tablet shape, then the xl override. */
  area: string;
};

/**
 * Four small daily moments — purely atmospheric editorial content tied to a
 * time of day rather than a specific mood/product. See CLAUDE.md > DOPAMIND
 * MOMENTS.
 */
const MOMENTS: Moment[] = [
  {
    labelVi: "BUỔI SÁNG",
    timeVi: "07:36",
    imageSrc: "/images/homepage/moments/M01.png",
    imageAlt: "Buổi sáng thư giãn cùng mặt nạ Dopamind Mask Story bên bàn trang điểm",
    objectPosition: "65% 20%",
    area: "[grid-area:1/1/3/2] xl:[grid-area:1/1/3/6]",
  },
  {
    labelVi: "SAU GIỜ LÀM",
    timeVi: "19:26",
    imageSrc: "/images/homepage/moments/M02.png",
    imageAlt: "Thư giãn sau giờ làm trong ánh hoàng hôn ấm áp",
    objectPosition: "55% 15%",
    area: "[grid-area:1/2/2/3] xl:[grid-area:1/6/2/10]",
  },
  {
    labelVi: "CHỦ NHẬT",
    timeVi: "10:42",
    imageSrc: "/images/homepage/moments/M03.png",
    imageAlt: "Buổi sáng Chủ nhật chậm rãi cùng sách và mặt nạ Dopamind Mask Story",
    objectPosition: "40% 15%",
    area: "[grid-area:2/2/3/3] xl:[grid-area:2/6/3/10]",
  },
  {
    labelVi: "ĐÊM MUỘN",
    timeVi: "23:14",
    imageSrc: "/images/homepage/moments/M04.png",
    imageAlt: "Khoảnh khắc tĩnh lặng cuối ngày dưới ánh đèn dịu nhẹ",
    objectPosition: "45% 15%",
    area: "[grid-area:3/1/4/3] xl:[grid-area:1/10/3/13]",
  },
];

export function DopamindMoments() {
  const [ref, isVisible] = useReveal<HTMLDivElement>();

  return (
    <section className="relative bg-cloud-milk py-[clamp(72px,10vh,144px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="max-w-[38rem]">
          <h2 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal">
            DOPAMIND MASK STORY MOMENTS
          </h2>
          <p className="mt-4 text-[clamp(0.95rem,1.3vw,1.0625rem)] text-charcoal/60">
            Những khoảnh khắc nhỏ khiến một ngày trở nên dễ chịu hơn.
          </p>
        </div>

        <div
          ref={ref}
          className={cn(
            "mt-10 grid grid-cols-2 gap-3 [grid-auto-rows:clamp(150px,34vw,240px)] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-4 md:gap-5 xl:grid-cols-12 xl:gap-6 xl:[grid-template-rows:repeat(2,clamp(220px,20vw,380px))]",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {MOMENTS.map((moment) => (
            <div
              key={moment.labelVi}
              className={cn("group relative flex overflow-hidden", moment.area)}
            >
              <Image
                src={moment.imageSrc}
                alt={moment.imageAlt}
                fill
                sizes="(min-width: 1181px) 40vw, 50vw"
                className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                style={{ objectPosition: moment.objectPosition }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, rgba(248,247,243,0.85) 0%, rgba(248,247,243,0.35) 55%, rgba(248,247,243,0) 100%)",
                }}
              />
              <div className="relative mt-auto flex flex-col gap-1 p-5 sm:p-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/45">
                  {moment.labelVi}
                </span>
                <span className="text-lg font-medium tabular-nums text-charcoal sm:text-xl">
                  {moment.timeVi}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
