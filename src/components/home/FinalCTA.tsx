import Link from "next/link";

/**
 * Soft Lavender → Peach atmosphere per CLAUDE.md > FINAL CTA. Static —
 * this section is the closing beat right before Newsletter/Footer, no
 * scroll-triggered motion needed on top of the ambient gradient.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-cloud-milk py-[clamp(96px,14vh,192px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(155deg, var(--color-lavender) 0%, var(--color-peach) 100%)",
          opacity: 0.55,
        }}
      />

      <div className="relative mx-auto flex max-w-[720px] flex-col items-center px-[clamp(20px,4vw,64px)] text-center">
        <h2 className="text-[clamp(2rem,4.6vw,3.75rem)] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal">
          SẴN SÀNG CHO 15 PHÚT CỦA BẠN?
        </h2>
        <p className="mt-5 max-w-[32rem] text-[clamp(0.95rem,1.3vw,1.0625rem)] text-charcoal/65">
          Khoảng thời gian dành cho bạn bắt đầu từ đây.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4 sm:mt-10">
          <Link
            href="/tim-mat-na-phu-hop"
            className="flex min-h-11 items-center bg-charcoal px-7 text-xs font-medium tracking-[0.14em] text-cloud-milk transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-purple"
          >
            TÌM MẶT NẠ PHÙ HỢP
          </Link>
          <Link
            href="/san-pham"
            className="flex min-h-11 items-center border border-charcoal px-7 text-xs font-medium tracking-[0.14em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cloud-milk"
          >
            KHÁM PHÁ TẤT CẢ MẶT NẠ
          </Link>
        </div>
      </div>
    </section>
  );
}
