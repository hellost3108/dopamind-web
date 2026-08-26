"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * Signature effect: MASKED LIFESTYLE IMAGE REVEAL. No suitable DOPAMIND
 * lifestyle photograph exists in /public yet, so the media panel is an
 * elegant editorial placeholder (soft brand-color gradient + grain) rather
 * than reusing a homepage product photo. Swap the placeholder <div> below
 * for a real <Image src="/images/story/dopamind-ritual-lifestyle.webp" />
 * once that asset is shot — keep the same clip-path reveal + inner scale.
 * See CLAUDE.md > "SECTION 4 — KHÔNG CHỈ LÀ MỘT CHIẾC MẶT NẠ".
 */
export function MaskRitualStory() {
  const [mediaRef, mediaVisible] = useReveal<HTMLDivElement>();
  const [textRef, textVisible] = useReveal<HTMLDivElement>();

  return (
    <section className="relative bg-cloud-milk py-[clamp(88px,12vh,168px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-24">
          <div
            ref={mediaRef}
            className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[4/5]"
            style={{
              clipPath: mediaVisible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
              transition: "clip-path 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(150deg, var(--color-lavender) 0%, var(--color-cloud-milk) 46%, var(--color-peach) 100%)",
                transform: mediaVisible ? "scale(1)" : "scale(1.08)",
                transition: "transform 1400ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
              style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "180px 180px" }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
              }}
            />
            <span className="sr-only">
              Khoảnh khắc nghi thức 15 phút của Dopamind Mask Story — hình ảnh minh hoạ sẽ được
              cập nhật khi có ảnh chụp thực tế.
            </span>
          </div>

          <div ref={textRef} className="max-w-xl">
            <h2 className="flex flex-col gap-2 text-[clamp(2rem,5vw,4rem)] font-medium uppercase leading-[1.05] tracking-[-0.015em] text-charcoal">
              <span
                className={cn(
                  "block transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  textVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}
              >
                Chiếc mặt nạ
                <br />
                là sản phẩm.
              </span>
              <span
                className={cn(
                  "block text-purple transition-[opacity,transform] duration-700 delay-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  textVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}
              >
                15 phút
                <br />
                mới là nghi thức.
              </span>
            </h2>

            <p
              className={cn(
                "mt-8 text-[clamp(1rem,1.4vw,1.1875rem)] leading-relaxed text-charcoal/65 transition-[opacity,transform] duration-700 delay-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                textVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              DOPAMIND đặt sản phẩm vào một khoảng thời gian có chủ đích — đủ để bạn tạm rời
              khỏi nhịp độ bên ngoài và dành một phần nhỏ của ngày cho chính mình.
            </p>

            <p className="mt-10 max-w-[42ch] text-xs leading-relaxed text-charcoal/40">
              DOPAMIND không hứa hẹn những điều chưa được kiểm chứng. Mỗi thông tin về sản
              phẩm, thành phần và hiệu quả chỉ được công bố khi có dữ liệu chính thức.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
