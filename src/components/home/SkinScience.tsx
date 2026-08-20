"use client";

import { SKIN_NEEDS } from "@/lib/skin-needs";
import { useReveal } from "@/hooks/use-reveal";

type ScienceField = {
  labelVi: string;
  /** Only ever set from verified catalog/product data — see CLAUDE.md >
   *  SKIN SCIENCE ("Only use verified data. Do not fabricate."). Fields
   *  left undefined (formula, mask material, usage steps, ingredients)
   *  simply don't render below until real, verified copy exists for them. */
  contentVi?: string;
};

const SCIENCE_FIELDS: ScienceField[] = [
  {
    labelVi: "CÔNG DỤNG CHÍNH",
    contentVi: SKIN_NEEDS.map((need) => need.labelVi).join(" · "),
  },
  { labelVi: "CÔNG THỨC" },
  { labelVi: "CHẤT LIỆU MẶT NẠ" },
  { labelVi: "CÁCH SỬ DỤNG" },
  { labelVi: "THÀNH PHẦN" },
];

/**
 * One elegant image reveal only (per CLAUDE.md > SKIN SCIENCE): the media
 * panel unveils via a single clip-path wipe as the section enters the
 * viewport, nothing else animates. Desktop uses a 50/50 split composition;
 * tablet/mobile stack the media above the copy.
 */
export function SkinScience() {
  const [ref, isVisible] = useReveal<HTMLDivElement>();
  const populatedFields = SCIENCE_FIELDS.filter((field) => field.contentVi);
  const pendingFields = SCIENCE_FIELDS.filter((field) => !field.contentVi);

  return (
    <section className="relative bg-cloud-milk py-[clamp(72px,10vh,144px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-20">
          <div
            ref={ref}
            className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[4/5]"
            style={{
              clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
              transition: "clip-path 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(155deg, var(--color-mint) 0%, var(--color-cloud-milk) 78%)",
              }}
            />
            <span className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.2em] text-charcoal/40 sm:bottom-6 sm:left-6">
              Ảnh minh hoạ chất liệu mặt nạ
            </span>
          </div>

          <div className="max-w-[36rem]">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
              SKIN SCIENCE
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal">
              DỊU DÀNG VỚI KHOẢNH KHẮC.
              <br />
              NGHIÊM TÚC VỚI LÀN DA.
            </h2>

            <dl className="mt-10 flex flex-col gap-6 border-t border-charcoal/10 pt-8">
              {populatedFields.map((field) => (
                <div key={field.labelVi} className="flex flex-col gap-1.5">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/50">
                    {field.labelVi}
                  </dt>
                  <dd className="text-sm leading-relaxed text-charcoal/70">
                    {field.contentVi}
                  </dd>
                </div>
              ))}
            </dl>

            {pendingFields.length > 0 && (
              <p className="mt-8 text-xs leading-relaxed text-charcoal/45">
                {pendingFields.map((f) => f.labelVi).join(", ")} sẽ được cập nhật khi có dữ
                liệu xác thực từ nhãn sản phẩm.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
