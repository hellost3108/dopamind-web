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
          <div className="mx-auto grid max-w-[1600px] grid-cols-3 gap-8 px-[clamp(20px,4vw,64px)] py-10">
            <nav aria-label={MEGA_MENU.moodSection.titleVi}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
                {MEGA_MENU.moodSection.titleVi}
              </p>
              <ul className="mt-4 space-y-3.5">
                {MEGA_MENU.moodSection.items.map((mood) => (
                  <li key={mood.slug}>
                    <Link
                      href={`/san-pham?mood=${mood.slug}`}
                      onClick={closeMenu}
                      className="group/item flex items-baseline gap-2"
                    >
                      <span className="text-sm text-charcoal transition-colors group-hover/item:text-purple">
                        {mood.labelVi}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.1em] text-charcoal/35">
                        {mood.labelEn}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={MEGA_MENU.skinNeedSection.titleVi}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
                {MEGA_MENU.skinNeedSection.titleVi}
              </p>
              <ul className="mt-4 space-y-3.5">
                {MEGA_MENU.skinNeedSection.items.map((need) => (
                  <li key={need.slug}>
                    <Link
                      href={`/san-pham?nhu-cau=${need.slug}`}
                      onClick={closeMenu}
                      className="text-sm text-charcoal transition-colors hover:text-purple"
                    >
                      {need.labelVi}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-8">
              <nav aria-label={MEGA_MENU.highlightSection.titleVi}>
                <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
                  {MEGA_MENU.highlightSection.titleVi}
                </p>
                <ul className="mt-4 space-y-3.5">
                  {MEGA_MENU.highlightSection.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="text-sm text-charcoal transition-colors hover:text-purple"
                      >
                        {item.labelVi}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <Link
                href={MEGA_MENU.campaign.href}
                onClick={closeMenu}
                className="flex h-28 flex-1 items-end p-4"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--color-lavender), var(--color-mint))",
                }}
              >
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    {MEGA_MENU.campaign.titleVi}
                  </p>
                  <p className="text-xs text-charcoal/60">{MEGA_MENU.campaign.subtitleVi}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
