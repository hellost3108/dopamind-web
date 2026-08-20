"use client";

import { useRef } from "react";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";

const DOPA_CONCEPTS = ["Niềm vui", "Năng lượng", "Động lực", "Những niềm vui nhỏ"];
const MIND_CONCEPTS = ["Bình tâm", "Nhận biết", "Kết nối", "Thả lỏng"];

/**
 * Signature effect: TYPOGRAPHIC MERGE. DOPA and MIND drift in from opposite
 * edges as the section pins and scrolls, overlap in a soft Lavender/Peach
 * bloom, then resolve sharply into the DOPAMIND wordmark. See CLAUDE.md >
 * "DOPA + MIND" and the `.dm-*` choreography in globals.css.
 */
export function DopaMindStory() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScrub(sectionRef);

  return (
    <section ref={sectionRef} className="scroll-story dm-story relative bg-cloud-milk">
      <div className="scroll-story__pin dm-story__pin sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-[clamp(20px,4vw,64px)]">
        <div
          aria-hidden
          className="dm-pole dm-pole--dopa pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-5"
        >
          <span className="dm-pole-word font-sans text-[clamp(2.75rem,9vw,6.5rem)] font-medium leading-none tracking-[-0.01em] text-charcoal">
            DOPA
          </span>
          <div className="dm-concepts flex flex-col items-center gap-1.5">
            {DOPA_CONCEPTS.map((concept) => (
              <span
                key={concept}
                className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50 sm:text-xs"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        <div
          aria-hidden
          className="dm-pole dm-pole--mind pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-5"
        >
          <span className="dm-pole-word font-sans text-[clamp(2.75rem,9vw,6.5rem)] font-medium leading-none tracking-[-0.01em] text-charcoal">
            MIND
          </span>
          <div className="dm-concepts flex flex-col items-center gap-1.5">
            {MIND_CONCEPTS.map((concept) => (
              <span
                key={concept}
                className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50 sm:text-xs"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        <div
          aria-hidden
          className="dm-bloom pointer-events-none absolute inset-0 m-auto h-[42vh] w-[42vh] max-h-[420px] max-w-[420px] rounded-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-lavender), var(--color-peach) 55%, transparent 75%)",
            mixBlendMode: "plus-lighter",
            filter: "blur(28px)",
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          <h2 className="dm-wordmark font-sans text-[clamp(3rem,10vw,8rem)] font-medium leading-none tracking-[-0.02em] text-charcoal">
            DOPAMIND
          </h2>
          <div className="dm-statement mt-6 max-w-[38rem] sm:mt-8">
            <p className="text-[clamp(1.05rem,2vw,1.375rem)] leading-snug text-charcoal/70">
              Chăm sóc da không chỉ là thay đổi cách làn da trông như thế nào.
            </p>
            <p className="mt-2 text-[clamp(1.05rem,2vw,1.375rem)] leading-snug text-purple">
              Mà còn là cách bạn cảm nhận khoảnh khắc đó.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
