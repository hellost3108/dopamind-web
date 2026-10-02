const STRIP_ITEMS = [
  {
    number: "01",
    labelVi: "MIND–SKIN CARE",
    descriptionVi: "Chăm sóc làn da và khoảng thời gian của bạn.",
  },
  {
    number: "02",
    labelVi: "15 PHÚT",
    descriptionVi: "Một nghi thức nhỏ trong ngày.",
  },
  {
    number: "03",
    labelVi: "18 sản phẩm & 6 dòng chăm sóc",
    descriptionVi: "Khám phá theo nhu cầu của bạn.",
  },
  {
    number: "04",
    labelVi: "DOPAMIND MASK STORY",
    descriptionVi: "Từ quá tải đến cân bằng.",
  },
];

/**
 * Thin, compact 4-up information rail — brand-safe messaging only, no
 * cards/shadows. See CLAUDE.md > COMPACT BRAND STRIP.
 */
export function HomeBrandStrip() {
  return (
    <section className="relative border-y border-charcoal/10 bg-cloud-milk">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)] py-[clamp(28px,3.2vw,44px)]">
        <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-0">
          {STRIP_ITEMS.map((item) => (
            <div key={item.number} className="flex items-start gap-3">
              <span className="mt-0.5 text-[11px] font-medium tabular-nums text-charcoal/35">
                {item.number}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal">
                  {item.labelVi}
                </span>
                <span className="text-[13px] leading-snug text-charcoal/55">
                  {item.descriptionVi}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
