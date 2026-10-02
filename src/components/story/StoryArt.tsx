import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Abstract skincare-material art for the Story page, built from CSS and inline
 * SVG only. Purely decorative (aria-hidden) and deliberately non-literal — these
 * are pearls, water and foliage as *mood*, never depictions of real
 * ingredients or product technology.
 */

type Tint = "lavender" | "peach" | "mint" | "butter" | "purple";

export function Orb({
  className,
  tint = "lavender",
}: {
  className?: string;
  tint?: Tint;
}) {
  return (
    <span
      aria-hidden
      className={cn("bs-orb pointer-events-none absolute block", className)}
      style={{ "--orb": `var(--color-${tint})` } as CSSProperties}
    />
  );
}

/** Concentric hairline rings that fade outward — a still "breath". */
export function Ripples({
  className,
  ring,
}: {
  className?: string;
  ring?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("bs-ripples pointer-events-none absolute block", className)}
      style={ring ? ({ "--ring": ring } as CSSProperties) : undefined}
    />
  );
}

/** A muted, translucent spray of leaves on a curved stem. `uid` keeps gradient ids unique. */
export function LeafSpray({ className, uid }: { className?: string; uid: string }) {
  const leaf = "M0 0 C 18 -24 58 -26 84 0 C 58 26 18 24 0 0 Z";
  const leaves = [
    { x: 100, y: 212, r: -78, s: 1.05 },
    { x: 103, y: 174, r: -124, s: 0.95 },
    { x: 108, y: 138, r: -58, s: 0.9 },
    { x: 112, y: 102, r: -106, s: 0.78 },
    { x: 118, y: 68, r: -72, s: 0.62 },
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 220"
      fill="none"
      className={cn("pointer-events-none absolute", className)}
    >
      <defs>
        <linearGradient id={`${uid}-leaf`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      <path
        d="M100 220 C 96 170 104 110 122 44"
        stroke="#fff"
        strokeOpacity="0.7"
        strokeWidth="1.2"
      />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
          <path
            d={leaf}
            fill={`url(#${uid}-leaf)`}
            stroke="#fff"
            strokeOpacity="0.75"
            strokeWidth="1"
          />
          <path d="M4 0 L 78 0" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  );
}

/** One glassy serum-like droplet with a soft highlight and rim light. */
export function SerumDrop({ className, uid }: { className?: string; uid: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 124"
      fill="none"
      className={cn("pointer-events-none absolute", className)}
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.92" />
          <stop offset="0.55" stopColor="#D8D2FF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#9688FF" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id={`${uid}-shine`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M50 4 C 50 4 90 56 90 80 A 40 40 0 0 1 10 80 C 10 56 50 4 50 4 Z"
        fill={`url(#${uid}-body)`}
        stroke="#fff"
        strokeOpacity="0.8"
        strokeWidth="1.2"
      />
      <ellipse
        cx="34"
        cy="84"
        rx="7"
        ry="17"
        transform="rotate(14 34 84)"
        fill={`url(#${uid}-shine)`}
      />
      <path
        d="M28 102 A 30 30 0 0 0 68 110"
        stroke="#fff"
        strokeOpacity="0.7"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Two overlapping translucent planes — a sheet-like veil with a highlight arc. */
export function SheetVeil({ className, uid }: { className?: string; uid: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 240"
      fill="none"
      className={cn("pointer-events-none absolute", className)}
    >
      <defs>
        <linearGradient id={`${uid}-a`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.82" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`${uid}-b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9688FF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M14 176 C 30 64 156 14 228 66 C 212 148 118 226 14 176 Z"
        fill={`url(#${uid}-a)`}
        stroke="#fff"
        strokeOpacity="0.8"
        strokeWidth="1"
      />
      <path
        d="M46 204 C 58 112 162 62 232 122 C 208 194 128 238 46 204 Z"
        fill={`url(#${uid}-b)`}
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="1"
      />
      <path
        d="M30 168 C 56 92 130 52 200 78"
        stroke="#fff"
        strokeOpacity="0.9"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
