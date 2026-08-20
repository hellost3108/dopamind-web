"use client";

import { useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";

type ChaosWord = {
  text: string;
  kind: "env" | "skin";
  size: "sm" | "md" | "lg";
  soft?: boolean;
  hideOnMobile?: boolean;
};

/**
 * Environmental noise and skin-fatigue words, interleaved so the narrative
 * reads as one overwhelming cloud rather than two separate lists. DEADLINE
 * and EMAIL stay in English — natural in Vietnamese urban/work culture, per
 * CLAUDE.md > "MIND × SKIN".
 */
const CHAOS_WORDS: ChaosWord[] = [
  { text: "DEADLINE", kind: "env", size: "lg" },
  { text: "THÔNG BÁO", kind: "env", size: "sm", soft: true, hideOnMobile: true },
  { text: "KHÔ DA", kind: "skin", size: "md" },
  { text: "HỌP", kind: "env", size: "md" },
  { text: "XỈN MÀU", kind: "skin", size: "sm", soft: true, hideOnMobile: true },
  { text: "KẸT XE", kind: "env", size: "sm", hideOnMobile: true },
  { text: "EMAIL", kind: "env", size: "lg" },
  { text: "NHẠY CẢM", kind: "skin", size: "md", hideOnMobile: true },
  { text: "SUY NGHĨ QUÁ NHIỀU", kind: "env", size: "sm", soft: true, hideOnMobile: true },
  { text: "THIẾU ẨM", kind: "skin", size: "sm", soft: true, hideOnMobile: true },
  { text: "MẠNG XÃ HỘI", kind: "env", size: "md" },
  { text: "LÀN DA MỆT MỎI", kind: "skin", size: "lg" },
];

const SIZE_CLASS: Record<ChaosWord["size"], string> = {
  sm: "text-[clamp(0.85rem,1.6vw,1.05rem)]",
  md: "text-[clamp(1.05rem,2.3vw,1.5rem)]",
  lg: "text-[clamp(1.3rem,3.4vw,2.125rem)]",
};

/**
 * Signature effect: CHAOS-TO-CALM SCROLL TRANSFORMATION. A cloud of
 * environmental noise and skin-fatigue words drifts softly, then dissolves
 * word-by-word (staggered fade + blur, never a shake) as the section
 * scrolls, resolving into the MIND × SKIN statement. See CLAUDE.md >
 * "MIND × SKIN" and the `.ms-*` choreography in globals.css.
 */
export function MindSkinStory() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScrub(sectionRef);

  return (
    <section ref={sectionRef} className="scroll-story ms-story relative bg-cloud-milk">
      <div className="scroll-story__pin ms-story__pin sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-[clamp(20px,4vw,64px)]">
        <div
          aria-hidden
          className="ms-story__cloud pointer-events-none flex max-w-[min(920px,88vw)] flex-wrap items-center justify-center gap-x-[clamp(14px,3vw,36px)] gap-y-[clamp(10px,2.2vw,24px)]"
        >
          {CHAOS_WORDS.map((word, i) => {
            const style: CSSProperties = {
              "--i": String(i),
              "--base-o": word.soft ? "0.5" : "0.9",
              "--base-blur": word.soft ? "1px" : "0px",
              "--drift-x": `${(i % 2 === 0 ? 1 : -1) * (6 + (i % 3) * 2)}px`,
              "--drift-y": `${(i % 3 === 0 ? -1 : 1) * (8 + (i % 2) * 4)}px`,
              "--drift-duration": `${6 + (i % 4)}s`,
              "--drift-delay": `${-(i * 0.6)}s`,
            } as CSSProperties;

            return (
              <span
                key={word.text}
                className={cn(
                  "ms-story__word font-medium leading-none tracking-[0.01em]",
                  word.hideOnMobile ? "hidden md:inline-block" : "inline-block",
                  SIZE_CLASS[word.size],
                  word.kind === "skin" ? "text-purple/75" : "text-charcoal/55"
                )}
                style={style}
              >
                <span className="ms-story__word-inner">{word.text}</span>
              </span>
            );
          })}
        </div>

        <div className="ms-story__resolve absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="ms-story__eyebrow text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/55 sm:text-xs">
            MIND <span className="text-purple">×</span> SKIN
          </p>
          <h2 className="ms-story__headline mt-5 max-w-[22ch] font-sans text-[clamp(1.75rem,4.4vw,3.5rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal sm:mt-6">
            <span className="block">KHI MỌI THỨ TRỞ NÊN QUÁ ỒN,</span>
            <span className="block">HÃY CHO MÌNH MỘT KHOẢNG NGHỈ.</span>
          </h2>
          <p className="ms-story__support mt-6 max-w-[34rem] text-[clamp(0.95rem,1.4vw,1.0625rem)] leading-relaxed text-charcoal/65 sm:mt-8">
            DOPAMIND tin rằng chăm sóc da cũng có thể trở thành một nghi thức giúp bạn chậm lại.
          </p>
        </div>
      </div>
    </section>
  );
}
