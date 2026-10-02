"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Drives a pinned scroll-storytelling section. While the tall element at
 * `ref` scrolls past the viewport, writes normalized progress (0→1) into
 * the `--p` custom property on that same element every frame (rAF-throttled
 * scroll/resize). All choreography lives in CSS as calc()/clamp() off --p —
 * see the `.scroll-story` rules in globals.css.
 *
 * No-ops under prefers-reduced-motion; CSS supplies the static resolved
 * composition in that case, so no listener is attached at all.
 */
export function useScrollScrub(ref: RefObject<HTMLElement | null>) {
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      frame.current = null;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable <= 0 ? 1 : -rect.top / scrollable;
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };

    const onScroll = () => {
      if (frame.current == null) {
        frame.current = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [ref]);
}
