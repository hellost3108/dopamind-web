"use client";

import { useToast } from "@/context/toast-context";

export function ToastViewport() {
  const { toasts } = useToast();
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toast-slide-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{ animation: "toast-slide-in 0.25s ease-out" }}
            className="pointer-events-auto max-w-[320px] border border-charcoal/10 bg-charcoal px-4 py-3 text-xs font-medium leading-relaxed tracking-[0.02em] text-cloud-milk shadow-lg"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}