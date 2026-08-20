"use client";

import type { ReactNode } from "react";
import { UIProvider } from "@/context/ui-context";

export function Providers({ children }: { children: ReactNode }) {
  return <UIProvider>{children}</UIProvider>;
}
