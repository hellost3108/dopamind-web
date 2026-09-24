"use client";

import type { ReactNode } from "react";
import { UIProvider } from "@/context/ui-context";
import { AuthProvider } from "@/context/auth-context";
import { GuestDataSync } from "@/components/account/GuestDataSync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        {children}
        <GuestDataSync />
      </UIProvider>
    </AuthProvider>
  );
}
