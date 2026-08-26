"use client";

import { useState } from "react";
import Link from "next/link";
import { useUI } from "@/context/ui-context";
import { PRIMARY_NAV, SHOP_NAV_LABEL } from "@/lib/navigation";
import { MEGA_MENU } from "@/lib/mega-menu";
import { MenuIcon, CloseIcon, ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function MobileNavTrigger() {
  const { openMobileNav } = useUI();
  return (
    <button
      type="button"
      onClick={openMobileNav}
      aria-label="Mở menu điều hướng"
      className="flex h-11 w-11 items-center justify-center text-charcoal xl:hidden"
    >
      <MenuIcon />
    </button>
  );
}

function MobileShopSections({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
          {MEGA_MENU.eyebrowVi}
        </p>
        <ul className="mt-2 flex flex-col">
          {MEGA_MENU.categories.map((category) => (
            <li key={category.slug} className="border-b border-charcoal/10">
              <Link
                href={category.href}
                onClick={onNavigate}
                className="flex min-h-11 items-center gap-3 py-2.5 text-sm text-charcoal"
              >
                <span className="text-[11px] tabular-nums text-charcoal/35">
                  {category.index}
                </span>
                {category.labelVi}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
          {MEGA_MENU.exploreSection.titleVi}
        </p>
        <ul className="mt-2 flex flex-col">
          {MEGA_MENU.exploreSection.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex min-h-11 items-center text-sm text-charcoal"
              >
                {item.labelVi}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function MobileNav() {
  const { isMobileNavOpen, close } = useUI();
  const [shopOpen, setShopOpen] = useState(false);

  if (!isMobileNavOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 xl:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu điều hướng"
    >
      <button
        type="button"
        aria-label="Đóng menu"
        onClick={close}
        className="absolute inset-0 bg-charcoal/40"
      />

      <div className="absolute inset-y-0 right-0 flex w-[min(88vw,400px)] flex-col bg-cloud-milk">
        <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
          <span className="text-sm font-semibold uppercase tracking-[0.1em] text-charcoal">
            DOPAMIND MASK STORY
          </span>
          <button
            type="button"
            autoFocus
            onClick={close}
            aria-label="Đóng menu"
            className="flex h-11 w-11 items-center justify-center text-charcoal"
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Điều hướng chính" className="flex-1 overflow-y-auto px-5 py-2">
          <ul className="flex flex-col">
            {PRIMARY_NAV.map((item) =>
              item.labelVi === SHOP_NAV_LABEL ? (
                <li key={item.href} className="border-b border-charcoal/10 py-1">
                  <button
                    type="button"
                    onClick={() => setShopOpen((prev) => !prev)}
                    aria-expanded={shopOpen}
                    className="flex min-h-11 w-full items-center justify-between py-2.5 text-left text-sm font-medium uppercase tracking-[0.12em] text-charcoal"
                  >
                    {item.labelVi}
                    <ChevronDownIcon
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        shopOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {shopOpen && (
                    <div className="pb-4 pl-1">
                      <MobileShopSections onNavigate={close} />
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.href} className="border-b border-charcoal/10">
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex min-h-11 items-center py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-charcoal"
                  >
                    {item.labelVi}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="flex border-t border-charcoal/10">
          <Link
            href="/tai-khoan"
            onClick={close}
            className="flex min-h-11 flex-1 items-center justify-center border-r border-charcoal/10 py-4 text-xs font-medium uppercase tracking-[0.1em] text-charcoal"
          >
            Tài khoản
          </Link>
          <Link
            href="/yeu-thich"
            onClick={close}
            className="flex min-h-11 flex-1 items-center justify-center py-4 text-xs font-medium uppercase tracking-[0.1em] text-charcoal"
          >
            Yêu thích
          </Link>
        </div>
      </div>
    </div>
  );
}
