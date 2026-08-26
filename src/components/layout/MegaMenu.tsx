"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { MEGA_MENU } from "@/lib/mega-menu";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  function cancelClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function closeMenu() {
    cancelClose();
    setOpen(false);
  }

  function scheduleClose() {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setOpen(false);
    }, 150);
  }

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    []
  );

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onScroll() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="-my-4 flex self-stretch items-center py-4"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          cancelClose();
          setOpen(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") scheduleClose();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          cancelClose();
          setOpen((prev) => !prev);
        }}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        className="flex items-center gap-1 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal transition-colors hover:text-purple xl:text-xs"
      >
        {MEGA_MENU.labelVi}
        <ChevronDownIcon
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute inset-x-0 top-full z-40 border-t border-charcoal/10 bg-cloud-milk shadow-[0_24px_48px_-24px_rgba(37,37,43,0.25)]"
        >
          <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_260px] gap-x-16 px-[clamp(20px,4vw,64px)] py-12 2xl:grid-cols-[minmax(0,1fr)_300px] 2xl:gap-x-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
                {MEGA_MENU.eyebrowVi}
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-x-12 border-t border-charcoal/10 2xl:gap-x-16">
                {MEGA_MENU.categories.map((category) => (
                  <li key={category.slug} className="border-b border-charcoal/10">
                    <Link
                      href={category.href}
                      onClick={closeMenu}
                      className="group/cat flex items-baseline justify-between gap-4 py-6"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="text-[11px] tabular-nums text-charcoal/35">
                          {category.index}
                        </span>
                        <span className="text-lg font-medium uppercase leading-snug text-charcoal transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cat:text-purple">
                          {category.labelVi}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="text-charcoal/30 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cat:translate-x-1.5 group-hover/cat:text-purple"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <nav
              aria-label={MEGA_MENU.exploreSection.titleVi}
              className="border-l border-charcoal/10 pl-12 2xl:pl-16"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
                {MEGA_MENU.exploreSection.titleVi}
              </p>
              <ul className="mt-5 space-y-4">
                {MEGA_MENU.exploreSection.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="text-sm text-charcoal transition-colors duration-300 hover:text-purple"
                    >
                      {item.labelVi}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
