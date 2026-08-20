"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Overlay = "none" | "mobile-nav" | "search" | "cart";

type UIContextValue = {
  overlay: Overlay;
  isMobileNavOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  openMobileNav: () => void;
  openSearch: () => void;
  openCart: () => void;
  close: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>("none");

  const close = useCallback(() => setOverlay("none"), []);

  useEffect(() => {
    if (overlay === "none") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [overlay, close]);

  const value = useMemo<UIContextValue>(
    () => ({
      overlay,
      isMobileNavOpen: overlay === "mobile-nav",
      isSearchOpen: overlay === "search",
      isCartOpen: overlay === "cart",
      openMobileNav: () => setOverlay("mobile-nav"),
      openSearch: () => setOverlay("search"),
      openCart: () => setOverlay("cart"),
      close,
    }),
    [overlay, close]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}
