"use client";

import { useRef, type CSSProperties, type SVGProps } from "react";
import { cn } from "@/lib/utils";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";

type RitualStep = {
  number: string;
  labelVi: string;
  descriptionVi: string;
  /** Media-panel gradient accent — see CLAUDE.md > COLORS. */
  accent: string;
  /** Center of this step's crossfade window over --p (0→1). */
  center: number;
  /** Half-width of the crossfade window — wider later = slower transition. */
  halfWidth: number;
  /** Drift/blur amplitude multiplier — smaller later = quieter motion. */
  intensity: number;
};

const RITUAL_STEPS: RitualStep[] = [
  {
    number: "01",
    labelVi: "ĐẮP MẶT NẠ",
    descriptionVi: "Dành vài phút để làn da được chăm sóc trọn vẹn.",
    accent: "var(--color-peach)",
    center: 0,
    halfWidth: 0.15,
    intensity: 1,
  },
  {
    number: "02",
    labelVi: "ĐẶT ĐIỆN THOẠI XUỐNG",
    descriptionVi: "Tạm rời xa màn hình, để tâm trí được yên.",
    accent: "rgba(37, 37, 43, 0.1)",
    center: 0.25,
    halfWidth: 0.17,
    intensity: 0.85,
  },
  {
    number: "03",
    labelVi: "BẬT PLAYLIST",
    descriptionVi: "Chọn một giai điệu khiến bạn thấy dễ chịu.",
    accent: "var(--color-butter)",
    center: 0.5,
    halfWidth: 0.19,
    intensity: 0.7,
  },
  {
    number: "04",
    labelVi: "THỞ CHẬM",
    descriptionVi: "Hít vào. Thở ra. Chậm lại cùng nhịp thở.",
    accent: "var(--color-mint)",
    center: 0.75,
    halfWidth: 0.22,
    intensity: 0.55,
  },
  {
    number: "05",
    labelVi: "RESET",
    descriptionVi: "Trở lại là chính mình, nhẹ nhàng và đầy năng lượng.",
    accent: "var(--color-lavender)",
    center: 1,
    halfWidth: 0.3,
    intensity: 0.35,
  },
];

type IconProps = SVGProps<SVGSVGElement>;

function iconBase(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

function MaskIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <ellipse cx="12" cy="12" rx="7" ry="9" />
      <path d="M8.5 10c.5-1 1.5-1 2 0M13.5 10c.5-1 1.5-1 2 0" />
      <path d="M9 15c1.2 1.2 4.8 1.2 6 0" />
    </svg>
  );
}

function PhoneDownIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
      <path d="M4 4l16 16" />
    </svg>
  );
}

function PlaylistIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M9 18V6l10-2v12" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="16" r="2.2" />
    </svg>
  );
}

function BreatheIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6.5" opacity={0.6} />
      <circle cx="12" cy="12" r="10" opacity={0.3} />
    </svg>
  );
}

function ResetIcon(props: IconProps) {
  return (
    <svg {...iconBase(props)}>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v5h-5" />
    </svg>
  );
}

const STEP_ICONS = [MaskIcon, PhoneDownIcon, PlaylistIcon, BreatheIcon, ResetIcon];

function stepVars(step: RitualStep): CSSProperties {
  return {
    "--rc": String(step.center),
    "--rw": String(step.halfWidth),
    "--ri": String(step.intensity),
  } as CSSProperties;
}

/**
 * Signature effect: SCROLL CHOREOGRAPHY. Five ritual steps live as stacked,
 * absolutely-positioned layers inside one pinned composition — never five
 * separate cards. Each layer's opacity/drift/blur is a "tent" function of
 * the shared --p (see `.ritual-step` in globals.css), so scrolling
 * literally scrubs through the ritual. Later steps use a wider crossfade
 * window and smaller drift amplitude, so the sequence gradually slows and
 * quiets toward RESET — see CLAUDE.md > Phase 5 RITUAL.
 *
 * Below `md`, and for `prefers-reduced-motion`, the sticky composition is
 * swapped for a plain sequential list — a two-column, scroll-scrubbed
 * layout doesn't fit a narrow viewport, and reduced motion should still get
 * all five steps' content, not just whichever one --p resolves to.
 */
export function Ritual() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollScrub(sectionRef);

  return (
    <>
      <section className="relative bg-cloud-milk pt-[clamp(80px,11vh,160px)]">
        <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
          <div className="max-w-[40rem]">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
              NGHI THỨC
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal">
              NGHI THỨC 15 PHÚT
            </h2>
            <p className="mt-4 text-[clamp(0.95rem,1.3vw,1.0625rem)] text-charcoal/60">
              Bạn không nhất thiết cần cả một ngày nghỉ.
              <br />
              Đôi khi, chỉ cần 15 phút thực sự thuộc về mình.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile + reduced-motion fallback: sequential scroll, all 5 steps always present */}
      <section className="relative hidden bg-cloud-milk max-md:block motion-reduce:block">
        <div className="mx-auto max-w-[640px] px-[clamp(20px,4vw,64px)] py-[clamp(56px,9vh,104px)]">
          <ol className="flex flex-col gap-14 sm:gap-16">
            {RITUAL_STEPS.map((step, index) => {
              const Icon = STEP_ICONS[index];
              return (
                <li key={step.number} className="relative pl-1">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -left-2 -top-9 select-none text-[clamp(4.5rem,24vw,6.5rem)] font-medium leading-none text-charcoal opacity-[0.06]"
                  >
                    {step.number}
                  </span>
                  <div className="relative flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-purple" />
                      <span className="text-xs font-medium tracking-[0.18em] text-purple">
                        {step.number} / 05
                      </span>
                      <span aria-hidden className="h-px flex-1 bg-charcoal/15" />
                    </div>
                    <h3 className="text-[clamp(1.5rem,6vw,2.125rem)] font-medium uppercase leading-[1.1] tracking-[-0.01em] text-charcoal">
                      {step.labelVi}
                    </h3>
                    <p className="max-w-[32ch] text-sm text-charcoal/60">{step.descriptionVi}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Tablet-landscape + Desktop: pinned cinematic choreography */}
      <section
        ref={sectionRef}
        className="scroll-story relative hidden h-[300svh] bg-cloud-milk motion-reduce:hidden md:block xl:h-[400svh]"
      >
        <div className="scroll-story__pin sticky top-0 flex h-[100svh] items-center overflow-hidden px-[clamp(20px,4vw,64px)]">
          <div className="mx-auto flex w-full max-w-[1600px] items-center gap-10 xl:gap-16">
            {/* Media — one continuously-morphing panel, xl+ only */}
            <div className="relative hidden h-[60svh] max-h-[600px] w-[38%] shrink-0 overflow-hidden xl:block">
              {RITUAL_STEPS.map((step, index) => {
                const Icon = STEP_ICONS[index];
                return (
                  <div
                    key={step.number}
                    className="ritual-step absolute inset-0 flex items-center justify-center"
                    style={{
                      ...stepVars(step),
                      backgroundImage: `linear-gradient(165deg, ${step.accent} 0%, var(--color-cloud-milk) 82%)`,
                    }}
                  >
                    <Icon className="h-[clamp(64px,8vw,120px)] w-[clamp(64px,8vw,120px)] text-charcoal/55" />
                  </div>
                );
              })}
            </div>

            {/* Text — changing editorial content on the other side */}
            <div className="relative h-[54svh] max-h-[460px] w-full">
              {RITUAL_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="ritual-step absolute inset-0 flex flex-col justify-center"
                  style={stepVars(step)}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute top-1/2 -translate-y-1/2 select-none text-[clamp(7rem,16vw,15rem)] font-medium leading-none text-charcoal opacity-[0.06]",
                      "left-1/2 -translate-x-1/2 xl:left-0 xl:translate-x-0"
                    )}
                  >
                    {step.number}
                  </span>
                  <div className="relative flex flex-col items-center text-center xl:items-start xl:text-left">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-purple">
                      NGHI THỨC {step.number} / 05
                    </span>
                    <h3 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] font-medium uppercase leading-[1.05] tracking-[-0.01em] text-charcoal">
                      {step.labelVi}
                    </h3>
                    <p className="mt-4 max-w-[30ch] text-[clamp(0.95rem,1.2vw,1.0625rem)] text-charcoal/65">
                      {step.descriptionVi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
