import type { CSSProperties } from "react";
import { StoryReveal } from "@/components/story/StoryReveal";
import { LeafSpray, Orb, Ripples, SerumDrop } from "@/components/story/StoryArt";

/** Per-panel reveal offsets (DOPA 16px, MIND 22px, MASK STORY 18px), staggered. */
const rise = (y: number, delayMs: number) =>
  ({ "--bs-y": `${y}px`, "--bs-delay": `${delayMs}ms` }) as CSSProperties;

const PANEL_PAD = "p-[clamp(20px,2.4vw,36px)]";
const STATEMENT =
  "text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/70 sm:text-xs";
const BODY = "mt-3 text-sm leading-relaxed text-charcoal/70 sm:text-[0.9375rem]";

/**
 * Brand meaning — ~30% copy / ~70% DOPA · MIND · MASK STORY panels from
 * Desktop; copy stacks above the panels on tablet (DOPA + MIND stay two
 * columns, MASK STORY full width). Minimal 12px radius, no shadows. One
 * staggered viewport reveal, no scrub, no sticky.
 */
export function BrandMeaning() {
  return (
    <section
      aria-labelledby="bs-meaning-title"
      className="bg-cloud-milk pb-[clamp(48px,5vw,80px)] pt-[clamp(72px,8vw,120px)]"
    >
      <div className="bs-wrap grid gap-10 md:gap-12 xl:grid-cols-[minmax(0,30fr)_minmax(0,70fr)] xl:items-start xl:gap-[clamp(40px,4.5vw,80px)]">
        {/* Copy */}
        <div className="bs-cq max-w-[38rem] xl:max-w-none">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/60 sm:text-xs">
            Ý NGHĨA TÊN THƯƠNG HIỆU
          </p>
          <h2
            id="bs-meaning-title"
            className="mt-5 font-serif text-[clamp(1.9rem,11cqi,3.25rem)] font-normal leading-[1.08] tracking-[-0.02em] text-charcoal"
          >
            <span className="block">DOPAMIND</span>
            <span className="block">được tạo nên</span>
            <span className="block">từ những giá trị</span>
            <span className="bs-accent block italic">đẹp và thật.</span>
          </h2>
          <p className="mt-7 text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-charcoal/70">
            DOPAMIND bắt đầu từ một ý niệm đơn giản: việc chăm sóc da có thể trở thành một khoảng
            dừng dễ chịu trong ngày.
          </p>
          <p className="mt-4 text-[clamp(0.95rem,1.25vw,1.0625rem)] leading-relaxed text-charcoal/70">
            DOPA, MIND và MASK STORY kết nối cảm xúc, thói quen và trải nghiệm chăm sóc da thành
            một câu chuyện thống nhất.
          </p>
        </div>

        {/* Panels */}
        <StoryReveal className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {/* DOPA */}
          <article
            className={`bs-rise bs-tone-peach relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[12px] md:min-h-[clamp(22rem,34vw,32rem)] ${PANEL_PAD}`}
            style={rise(16, 0)}
          >
            <Orb tint="peach" className="-right-[10%] -top-[8%] w-[62%] opacity-95" />
            <Orb tint="lavender" className="right-[30%] top-[38%] w-[20%]" />
            <Orb tint="butter" className="right-[12%] top-[50%] w-[9%]" />
            <h3 className="relative font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-normal leading-none tracking-[-0.03em] text-charcoal">
              DOPA
            </h3>
            <div className="relative max-w-[24rem]">
              <p className={STATEMENT}>NIỀM VUI TỪ NHỮNG ĐIỀU NHỎ.</p>
              <p className={BODY}>
                Những khoảnh khắc tích cực đôi khi bắt đầu từ một điều rất nhỏ — vài phút dành
                riêng cho chính mình.
              </p>
            </div>
          </article>

          {/* MIND */}
          <article
            className={`bs-rise bs-tone-mint relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[12px] md:min-h-[clamp(22rem,34vw,32rem)] ${PANEL_PAD}`}
            style={rise(22, 120)}
          >
            <LeafSpray uid="bm-mind" className="-right-[6%] top-[2%] h-[62%] w-auto opacity-95" />
            <h3 className="relative font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-normal leading-none tracking-[-0.03em] text-charcoal">
              MIND
            </h3>
            <div className="relative max-w-[24rem]">
              <p className={STATEMENT}>MỘT TÂM TRÍ AN YÊN HƠN.</p>
              <p className={BODY}>
                Khi bạn dành thời gian cho bản thân, skincare có thể trở thành một nghi thức giúp
                nhịp sống chậm lại.
              </p>
            </div>
          </article>

          {/* MASK STORY */}
          <article
            className={`bs-rise bs-tone-pearl relative flex min-h-[18rem] flex-col justify-between gap-8 overflow-hidden rounded-[12px] md:col-span-2 md:min-h-[clamp(15rem,20vw,19rem)] ${PANEL_PAD}`}
            style={rise(18, 240)}
          >
            {/* Water-like composition: ripples, one serum drop, two pearls */}
            <Ripples
              ring="rgb(150 136 255 / 0.22)"
              className="-right-[8%] top-1/2 w-[clamp(15rem,34vw,30rem)] -translate-y-1/2"
            />
            <SerumDrop
              uid="bm-mask"
              className="right-[clamp(2rem,10vw,9rem)] top-1/2 h-[clamp(7rem,15vw,12rem)] w-auto -translate-y-[58%]"
            />
            <Orb tint="lavender" className="right-[clamp(9rem,25vw,22rem)] top-[62%] w-[clamp(1.75rem,3vw,2.75rem)]" />
            <Orb tint="peach" className="right-[3%] top-[22%] w-[clamp(1.25rem,2vw,1.75rem)]" />
            <h3 className="relative font-serif text-[clamp(2.25rem,6vw,5.5rem)] font-normal leading-none tracking-[-0.03em] text-charcoal">
              MASK STORY
            </h3>
            <p className="relative max-w-[24rem] text-sm leading-relaxed text-charcoal/70 sm:text-[0.9375rem]">
              Mỗi sản phẩm là một chương trong hành trình chăm sóc bản thân.
            </p>
          </article>
        </StoryReveal>
      </div>
    </section>
  );
}
