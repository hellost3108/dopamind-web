"use client";

import type { ReactNode } from "react";
import { UIProvider } from "@/context/ui-context";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import { ToastViewport } from "@/components/ui/Toast";
import { GuestDataSync } from "@/components/account/GuestDataSync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <UIProvider>
          {children}
          <GuestDataSync />
          <ToastViewport />
        </UIProvider>
      </ToastProvider>
    </AuthProvider>
  );
}