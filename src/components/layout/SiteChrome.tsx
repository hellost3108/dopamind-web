"use client";

import type { ReactNode } from "react";
import { useUI } from "@/context/ui-context";

/**
 * Marks the base page (announcement bar, header, main, footer) `inert`
 * while an overlay (mobile nav, search, cart) is open, so Tab and
 * screen-reader users can't reach content hidden behind it — the overlays
 * themselves live outside this wrapper in layout.tsx.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const { overlay } = useUI();
  return (
    <div className="flex flex-1 flex-col" inert={overlay !== "none"}>
      {children}
    </div>
  );
}
