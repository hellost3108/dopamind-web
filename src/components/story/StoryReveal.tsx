"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

/**
 * Thin viewport-entry wrapper for the rebuilt Story sections. Sets
 * `data-in="true"` once (IntersectionObserver via useReveal, immediate under
 * prefers-reduced-motion); the `.bs-rise` / `.bs-mask` descendants in
 * story.css do the actual transform/opacity/clip-path work. Server-rendered
 * children pass straight through, so each section stays a Server Component.
 */
export function StoryReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [ref, isVisible] = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} data-in={isVisible ? "true" : "false"} className={className}>
      {children}
    </div>
  );
}
