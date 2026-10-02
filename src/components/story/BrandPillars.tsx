import type { CSSProperties, ReactNode } from "react";
import { StoryReveal } from "@/components/story/StoryReveal";
import { LeafSpray, Orb, Ripples, SheetVeil } from "@/components/story/StoryArt";

const rise = (delayMs: number) =>
  ({ "--bs-y": "10px", "--bs-delay": `${delayMs}ms` }) as CSSProperties;

type Pillar = {
  index: string;
  title: string;
  labelVi: string;
  body: string;
  tone: "cream" | "mint" | "lavender";
  wide?: boolean;
  art: ReactNode;
};

const PILLARS: Pillar[] = [
  {
    index: "01",
    title: "SKIN SCIENCE",
    labelVi: "KHOA HỌC LÀN DA",
    body: "Mọi thông tin về công thức, thành phần và công dụng chỉ được công bố khi có dữ liệu chính thức.",
    tone: "cream",
    // Pearl cluster — translucent serum-like spheres of different sizes
    art: (
      <>
        <Orb tint="peach" className="left-[6%] top-[8%] w-[62%]" />
        <Orb tint="lavender" className="left-[56%] top-[50%] w-[34%]" />
        <Orb tint="butter" className="left-[34%] top-[68%] w-[18%]" />
        <Orb tint="peach" className="left-[82%] top-[24%] w-[9%]" />
      </>
    ),
  },
  {
    index: "02",
    title: "MIND RESET",
    labelVi: "15 PHÚT DÀNH CHO BẠN",
    body: "Một khoảng dừng nhỏ để bạn tạm rời khỏi nhịp độ bên ngoài và trở lại với chính mình.",
    tone: "mint",
    // Still breath (rings) with a muted leaf spray
    art: (
      <>
        <Ripples className="inset-0 h-full w-full" />
        <LeafSpray uid="bp-mind" className="left-[22%] top-[10%] h-[80%] w-auto" />
      </>
    ),
  },
  {
    index: "03",
    title: "MASK EXPERIENCE",
    labelVi: "TRẢI NGHIỆM MẶT NẠ",
    body: "Chất liệu, cấu trúc và trải nghiệm sản phẩm được kể bằng thông tin thực khi dữ liệu chính thức sẵn sàng.",
    tone: "lavender",
    wide: true,
    // Layered translucent sheet-like veil with one pearl
    art: (
      <>
        <SheetVeil uid="bp-mask" className="inset-0 h-full w-full" />
        <Orb tint="purple" className="left-[58%] top-[6%] w-[16%] opacity-80" />
      </>
    ),
  },
];

/**
 * Three brand pillars — ~30% copy / ~70% tall editorial panels from Desktop.
 * Tablet keeps two panels side by side and lets the third run wide (2 + 1)
 * instead of squeezing three; mobile is one panel per row. Panel copy is
 * brand philosophy only — no claims of outcomes, technology or data.
 */
export function BrandPillars() {
  return (
    <section
      aria-labelledby="bs-pillars-title"
      className="bg-cloud-milk pb-[clamp(72px,8vw,120px)] pt-[clamp(48px,5vw,80px)]"
    >
      <div className="bs-wrap">
        <div className="grid gap-10 border-t border-charcoal/10 pt-[clamp(48px,5vw,80px)] md:gap-12 xl:grid-cols-[minmax(0,30fr)_minmax(0,70fr)] xl:items-start xl:gap-[clamp(40px,4.5vw,80px)]">
          {/* Copy */}
          <div className="bs-cq max-w-[38rem] xl:max-w-none">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/60 sm:text-xs">
              BA TRỤ CỘT TẠO NÊN DOPAMIND
            </p>
            <h2
              id="bs-pillars-title"
              className="mt-5 font-serif text-[clamp(1.9rem,11.5cqi,3.25rem)] font-normal leading-[1.08] tracking-[-0.02em] text-charcoal"
            >
              <span className="block">Khoa học,</span>
              <span className="block">cảm xúc</span>
              <span className="bs-accent block italic">và trải nghiệm.</span>
            </h2>
            <p className="mt-7 text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-charcoal/70">
              DOPAMIND tiếp cận việc chăm sóc da từ ba góc nhìn: nghiêm túc với làn da, tinh tế
              với cảm xúc và có chủ đích trong từng trải nghiệm.
            </p>
          </div>

          {/* Panels */}
          <StoryReveal className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PILLARS.map((p, i) => (
              <article
                key={p.title}
                className={`bs-rise bs-pillar bs-tone-${p.tone} relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[12px] p-[clamp(20px,2vw,32px)] xl:min-h-[clamp(30rem,34vw,38rem)] ${
                  p.wide
                    ? "bs-pillar--wide md:max-xl:col-span-2 md:max-xl:min-h-[18rem]"
                    : "md:min-h-[26rem]"
                }`}
                style={rise(i * 90)}
              >
                <div aria-hidden className="bs-pillar-art">
                  {p.art}
                </div>

                <p className="relative text-[11px] font-medium tracking-[0.2em] text-charcoal/60">
                  {p.index} <span className="text-charcoal/40">/ 03</span>
                </p>

                <div className="relative max-w-[22rem]">
                  <h3 className="text-balance font-serif text-[clamp(1.5rem,2.1vw,2.125rem)] font-normal leading-[1.05] tracking-[-0.01em] text-charcoal">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[11px] font-medium tracking-[0.16em] text-charcoal/70">
                    {p.labelVi}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{p.body}</p>
                </div>
              </article>
            ))}
          </StoryReveal>
        </div>
      </div>
    </section>
  );
}
