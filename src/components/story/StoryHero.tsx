"use client";

import { useRef } from "react";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";

/**
 * Signature effect: DOPA + MIND KINETIC MERGE. Unlike the homepage's
 * DopaMindStory (a mid-scroll pause with floating concept words), this is
 * the page's immersive opening — DOPA and MIND sit large and architectural
 * at the edges from the first frame, converge into a Lavender/Peach bloom,
 * and resolve into the real page heading + copy. See CLAUDE.md >
 * "SECTION 1 — DOPA + MIND HERO" and the `.sh-*` choreography in globals.css.
 */
export function StoryHero() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScrub(sectionRef);

  return (
    <section ref={sectionRef} className="scroll-story sh-story relative bg-cloud-milk">
      <div className="scroll-story__pin sh-story__pin sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-[clamp(20px,4vw,64px)]">
        {/* Ambient atmosphere — extremely subtle, static */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 18% 20%, var(--color-lavender), transparent 68%), radial-gradient(55% 45% at 84% 78%, var(--color-peach), transparent 68%)",
            opacity: 0.28,
          }}
        />

        <p className="relative text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/45 sm:text-[11px]">
          DOPAMIND / MIND–SKIN CARE
        </p>

        <div className="relative mt-8 flex w-full flex-1 items-center justify-center sm:mt-10">
          <div
            aria-hidden
            className="sh-pole sh-pole--dopa pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="sh-pole-word font-sans text-[clamp(3.25rem,13vw,10rem)] font-medium leading-none tracking-[-0.02em] text-charcoal">
              DOPA
            </span>
          </div>

          <div
            aria-hidden
            className="sh-pole sh-pole--mind pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="sh-pole-word font-sans text-[clamp(3.25rem,13vw,10rem)] font-medium leading-none tracking-[-0.02em] text-charcoal">
              MIND
            </span>
          </div>

          <div
            aria-hidden
            className="sh-bloom pointer-events-none absolute inset-0 m-auto h-[46vh] w-[46vh] max-h-[460px] max-w-[460px] rounded-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-lavender), var(--color-peach) 55%, transparent 75%)",
              mixBlendMode: "plus-lighter",
              filter: "blur(30px)",
            }}
          />

          <div aria-hidden className="sh-wordmark pointer-events-none relative">
            <span className="font-sans text-[clamp(3.5rem,12vw,9rem)] font-medium leading-none tracking-[-0.02em] text-charcoal">
              DOPAMIND
            </span>
          </div>
        </div>

        <div className="relative flex flex-col items-center pb-[clamp(8px,2vh,24px)] text-center">
          <h1 className="sh-statement max-w-[16ch] text-[clamp(1.5rem,3.6vw,3rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal">
            LÀN DA VÀ TÂM TRÍ
            <br />
            KHÔNG SỐNG TRONG HAI THẾ GIỚI TÁCH BIỆT.
          </h1>
          <p className="sh-para mt-6 max-w-[34rem] text-[clamp(0.95rem,1.3vw,1.0625rem)] leading-relaxed text-charcoal/65 sm:mt-7">
            DOPAMIND được xây dựng từ một ý niệm đơn giản: chăm sóc da cũng có thể là thời
            gian để bạn chậm lại và trở về với chính mình.
          </p>
        </div>
      </div>
    </section>
  );
}
