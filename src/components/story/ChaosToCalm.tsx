"use client";

import { useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";

type ChaosWord = { text: string; size: "sm" | "md" | "lg" };

/** Exact STATE 01 word list — see CLAUDE.md > "SECTION 2 — QUÁ TẢI → RESET". */
const CHAOS_WORDS: ChaosWord[] = [
  { text: "DEADLINE", size: "lg" },
  { text: "THÔNG BÁO", size: "sm" },
  { text: "HỌP", size: "md" },
  { text: "EMAIL", size: "lg" },
  { text: "KẸT XE", size: "sm" },
  { text: "MẠNG XÃ HỘI", size: "md" },
  { text: "SUY NGHĨ QUÁ NHIỀU", size: "sm" },
  { text: "THIẾU NGỦ", size: "md" },
];

const SIZE_CLASS: Record<ChaosWord["size"], string> = {
  sm: "text-[clamp(0.85rem,1.7vw,1.1rem)]",
  md: "text-[clamp(1.1rem,2.4vw,1.6rem)]",
  lg: "text-[clamp(1.4rem,3.6vw,2.25rem)]",
};

type StageVars = CSSProperties & { "--rc": string; "--rw": string; "--ri": string };

function stage(center: number, halfWidth: number, intensity: number): StageVars {
  return { "--rc": String(center), "--rw": String(halfWidth), "--ri": String(intensity) };
}

/**
 * Signature effect: CHAOS-TO-CALM SCROLL TRANSFORMATION. A cloud of daily
 * noise dissolves word-by-word while four stages — QUÁ TẢI, DỪNG LẠI, THỞ,
 * RESET — crossfade in place, and the section's own background/text color
 * literally lightens from Charcoal to Cloud Milk across the same scroll, per
 * CLAUDE.md > "SECTION 2 — QUÁ TẢI → RESET". See the `.ctc-*` choreography
 * (and the shared `.ritual-step` tent utility) in globals.css.
 *
 * Below `md`, and for `prefers-reduced-motion`, the pinned composition is
 * swapped for a plain sequential section — a scroll-scrubbed, absolutely
 * stacked layout doesn't fit a narrow viewport, and reduced motion should
 * still surface all four stages' content, not just whichever one --p
 * resolves to. Same two-track pattern as Ritual.tsx.
 */
export function ChaosToCalm() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScrub(sectionRef);

  return (
    <>
      {/* Mobile + reduced-motion fallback: sequential, all four stages always present */}
      <section className="relative hidden bg-cloud-milk max-md:block motion-reduce:block">
        <div className="mx-auto max-w-[640px] px-[clamp(20px,4vw,64px)] py-[clamp(72px,10vh,128px)]">
          <div className="flex flex-col gap-14 sm:gap-16">
            <div className="border-t border-charcoal/15 pt-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                QUÁ TẢI
              </h2>
              <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-charcoal/55">
                Deadline. Thông báo. Họp. Email. Kẹt xe. Mạng xã hội. Suy nghĩ quá nhiều.
                Thiếu ngủ.
              </p>
            </div>

            <div className="border-t border-charcoal/15 pt-6">
              <h2 className="text-[clamp(1.75rem,7vw,2.5rem)] font-medium uppercase leading-[1.15] tracking-[-0.01em] text-charcoal">
                Dừng lại một chút.
              </h2>
            </div>

            <div className="border-t border-charcoal/15 pt-6">
              <h2 className="text-[clamp(1.75rem,7vw,2.5rem)] font-medium uppercase leading-[1.15] tracking-[-0.01em] text-charcoal">
                Thở chậm.
              </h2>
            </div>

            <div className="border-t border-charcoal/15 pt-6">
              <h2 className="text-[clamp(2.5rem,14vw,4.5rem)] font-medium leading-none tracking-[-0.02em] text-purple">
                RESET
              </h2>
              <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-charcoal/60">
                Một khoảng nghỉ nhỏ cũng có thể thay đổi cách bạn bước tiếp vào phần còn lại
                của ngày.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tablet-landscape + Desktop: pinned chaos-to-calm choreography */}
      <section
        ref={sectionRef}
        className="scroll-story ctc-story relative hidden h-[340svh] motion-reduce:hidden md:block"
      >
        <div className="scroll-story__pin ctc-story__pin sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-[clamp(20px,4vw,64px)]">
          <div
            aria-hidden
            className="pointer-events-none flex max-w-[min(880px,84vw)] flex-wrap items-center justify-center gap-x-[clamp(14px,3vw,32px)] gap-y-[clamp(10px,2vw,22px)]"
          >
            {CHAOS_WORDS.map((word, i) => {
              const style: CSSProperties = {
                "--i": String(i),
                "--base-o": i % 3 === 0 ? "0.9" : "0.6",
                "--drift-x": `${(i % 2 === 0 ? 1 : -1) * (4 + (i % 3))}px`,
                "--drift-y": `${(i % 3 === 0 ? -1 : 1) * (5 + (i % 2) * 3)}px`,
                "--drift-duration": `${7 + (i % 4)}s`,
                "--drift-delay": `${-(i * 0.6)}s`,
              } as CSSProperties;

              return (
                <span
                  key={word.text}
                  className={cn(
                    "ctc-word font-medium leading-none tracking-[0.01em] text-cloud-milk",
                    SIZE_CLASS[word.size]
                  )}
                  style={style}
                >
                  <span className="ctc-word-inner">{word.text}</span>
                </span>
              );
            })}
          </div>

          <div className="ritual-step absolute inset-0 flex flex-col items-center justify-center text-center" style={stage(0.06, 0.11, 1)}>
            <span className="text-[11px] font-medium uppercase tracking-[0.28em]">QUÁ TẢI</span>
          </div>

          <div className="ritual-step absolute inset-0 flex flex-col items-center justify-center text-center" style={stage(0.38, 0.14, 0.85)}>
            <h2 className="max-w-[16ch] text-[clamp(2rem,5.5vw,4rem)] font-medium uppercase leading-[1.1] tracking-[-0.01em]">
              Dừng lại một chút.
            </h2>
          </div>

          <div className="ritual-step absolute inset-0 flex flex-col items-center justify-center text-center" style={stage(0.66, 0.14, 0.6)}>
            <div
              aria-hidden
              className="pointer-events-none absolute h-[38vh] w-[38vh] max-h-[380px] max-w-[380px] rounded-full opacity-50 blur-3xl"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--color-lavender), var(--color-mint) 60%, transparent 78%)",
              }}
            />
            <h2 className="relative max-w-[16ch] text-[clamp(2rem,5.5vw,4rem)] font-medium uppercase leading-[1.1] tracking-[-0.01em]">
              Thở chậm.
            </h2>
          </div>

          <div className="ritual-step absolute inset-0 flex flex-col items-center justify-center text-center" style={stage(1, 0.34, 0.4)}>
            <h2 className="text-[clamp(3.5rem,13vw,8rem)] font-medium leading-none tracking-[-0.02em] text-purple">
              RESET
            </h2>
            <p className="mt-6 max-w-[34rem] text-[clamp(0.95rem,1.3vw,1.0625rem)] leading-relaxed opacity-70">
              Một khoảng nghỉ nhỏ cũng có thể thay đổi cách bạn bước tiếp vào phần còn lại của
              ngày.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
