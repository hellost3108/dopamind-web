"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type Moment = {
  labelVi: string;
  timeVi: string;
  gradient: string;
  /** Explicit grid placement — mobile/tablet shape, then the xl override. */
  area: string;
};

/**
 * Four small daily moments, each tied to an existing brand color token
 * (never an invented palette) rather than a specific mood/product. Purely
 * atmospheric editorial content — see CLAUDE.md > DOPAMIND MOMENTS.
 */
const MOMENTS: Moment[] = [
  {
    labelVi: "BUỔI SÁNG",
    timeVi: "07:36",
    gradient: "linear-gradient(160deg, var(--color-mint) 0%, var(--color-cloud-milk) 85%)",
    area: "[grid-area:1/1/3/2] xl:[grid-area:1/1/3/6]",
  },
  {
    labelVi: "SAU GIỜ LÀM",
    timeVi: "19:26",
    gradient: "linear-gradient(160deg, var(--color-peach) 0%, var(--color-cloud-milk) 85%)",
    area: "[grid-area:1/2/2/3] xl:[grid-area:1/6/2/10]",
  },
  {
    labelVi: "CHỦ NHẬT",
    timeVi: "10:42",
    gradient: "linear-gradient(160deg, var(--color-butter) 0%, var(--color-cloud-milk) 85%)",
    area: "[grid-area:2/2/3/3] xl:[grid-area:2/6/3/10]",
  },
  {
    labelVi: "ĐÊM MUỘN",
    timeVi: "23:14",
    gradient: "linear-gradient(160deg, var(--color-lavender) 0%, var(--color-cloud-milk) 85%)",
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
            DOPAMIND MOMENTS
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
              <div
                aria-hidden
                className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                style={{ backgroundImage: moment.gradient }}
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
