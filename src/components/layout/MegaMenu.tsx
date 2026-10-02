"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MEGA_MENU } from "@/lib/mega-menu";
import type { MegaMenuCatalog, MegaMenuCatalogProduct } from "@/lib/real-products";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import "./mega-menu.css";

type CatalogGroup = {
  index: string;
  slug: string;
  nameVi: string;
  descriptionVi?: string;
  products: MegaMenuCatalogProduct[];
};

/** Chỉ giữ những danh mục đã có sản phẩm thật, theo đúng thứ tự sort_order
 *  từ Supabase — không tự bịa danh mục hay sản phẩm. */
function buildGroups(catalog: MegaMenuCatalog | null): CatalogGroup[] {
  if (!catalog) return [];
  const categories = [...catalog.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  return categories
    .map((category, i) => ({
      index: String(i + 1).padStart(2, "0"),
      slug: category.slug,
      nameVi: category.nameVi,
      descriptionVi: category.descriptionVi,
      products: catalog.products.filter((p) => p.categorySlug === category.slug),
    }))
    .filter((group) => group.products.length > 0);
}

export function MegaMenu({ catalog }: { catalog: MegaMenuCatalog | null }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A mouse `click` fires right after the `pointerenter` that already opened
  // the menu via hover — without this guard, the click's own toggle would
  // immediately flip it back closed. Consumed by the first click after a
  // hover-open; every click after that toggles normally.
  const openedByHoverRef = useRef(false);
  const menuId = useId();

  const groups = useMemo(() => buildGroups(catalog), [catalog]);
  const hasCatalog = groups.length > 0;

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
    function onScroll(event: Event) {
      // The catalog panel scrolls internally (overflow-y-auto) once it's
      // taller than the viewport — only page-level scroll should close it.
      const target = event.target;
      if (rootRef.current && target instanceof Node && rootRef.current.contains(target)) {
        return;
      }
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
          openedByHoverRef.current = true;
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
          if (openedByHoverRef.current) {
            openedByHoverRef.current = false;
            return;
          }
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
          aria-label={MEGA_MENU.eyebrowVi}
          className="mega-menu-panel absolute inset-x-0 top-full z-40 max-h-[calc(100vh-6rem)] overflow-y-auto border-t border-charcoal/10 bg-cloud-milk shadow-[0_24px_48px_-24px_rgba(37,37,43,0.25)]"
        >
          <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)] py-8 2xl:py-9">
            {hasCatalog ? (
              <CatalogPanel groups={groups} onNavigate={closeMenu} />
            ) : (
              <FallbackPanel onNavigate={closeMenu} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PanelTopBar({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-charcoal/10 pb-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
        {MEGA_MENU.eyebrowVi}
      </p>
      <Link
        href="/san-pham"
        onClick={onNavigate}
        className="group/all flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal transition-colors duration-300 hover:text-purple"
      >
        Xem tất cả sản phẩm
        <span
          aria-hidden
          className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/all:translate-x-1"
        >
          →
        </span>
      </Link>
    </div>
  );
}

function PanelFooterLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-charcoal/10 pt-6">
      {MEGA_MENU.exploreSection.items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="text-[11px] font-medium uppercase tracking-[0.12em] text-charcoal/55 transition-colors duration-300 hover:text-purple"
        >
          {item.labelVi}
        </Link>
      ))}
    </div>
  );
}

/** Bố cục master/detail: cột trái chọn danh mục, cột phải chỉ xem trước
 *  sản phẩm của đúng danh mục đang active — không hiển thị cả 6 danh mục
 *  cùng lúc để giữ menu điềm tĩnh, dễ quét. */
function CatalogPanel({
  groups,
  onNavigate,
}: {
  groups: CatalogGroup[];
  onNavigate: () => void;
}) {
  const [activeSlug, setActiveSlug] = useState(groups[0]?.slug ?? "");
  const activeGroup = groups.find((group) => group.slug === activeSlug) ?? groups[0];

  return (
    <div className="flex flex-col">
      <PanelTopBar onNavigate={onNavigate} />

      <div className="mt-7 grid grid-cols-[minmax(220px,30%)_1fr] gap-x-[clamp(48px,4vw,72px)]">
        <CategoryList
          groups={groups}
          activeSlug={activeGroup?.slug}
          onActivate={setActiveSlug}
          onNavigate={onNavigate}
        />
        {activeGroup && <ProductPreview group={activeGroup} onNavigate={onNavigate} />}
      </div>

      <PanelFooterLinks onNavigate={onNavigate} />
    </div>
  );
}

function CategoryList({
  groups,
  activeSlug,
  onActivate,
  onNavigate,
}: {
  groups: CatalogGroup[];
  activeSlug: string | undefined;
  onActivate: (slug: string) => void;
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col divide-y divide-charcoal/10 border-t border-charcoal/10">
      {groups.map((group) => {
        const isActive = group.slug === activeSlug;
        return (
          <Link
            key={group.slug}
            href={`/san-pham?danh-muc=${group.slug}`}
            onClick={onNavigate}
            onMouseEnter={() => onActivate(group.slug)}
            onFocus={() => onActivate(group.slug)}
            aria-current={isActive ? "true" : undefined}
            className="group/cat relative flex items-center justify-between gap-3 py-4 pl-4"
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-0 left-0 w-[2px] bg-purple transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-0"
              )}
            />
            <span
              className={cn(
                "flex items-baseline gap-3 transition-transform duration-300",
                isActive && "translate-x-[2px]"
              )}
            >
              <span className="text-[11px] tabular-nums text-charcoal/35">{group.index}</span>
              <span
                className={cn(
                  "text-[15px] font-medium uppercase leading-snug transition-colors duration-300 xl:text-base",
                  isActive ? "text-purple" : "text-charcoal"
                )}
              >
                {group.nameVi}
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                "text-sm transition-all duration-300",
                isActive ? "translate-x-1 text-purple" : "text-charcoal/30"
              )}
            >
              →
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function ProductPreview({
  group,
  onNavigate,
}: {
  group: CatalogGroup;
  onNavigate: () => void;
}) {
  const products = group.products.slice(0, 4);

  const gridCols =
    products.length === 1
      ? "grid-cols-1"
      : products.length === 2
        ? "grid-cols-2"
        : products.length === 3
          ? "grid-cols-3"
          : "grid-cols-2 min-[1440px]:grid-cols-4";

  const imageSizes =
    products.length === 1
      ? "240px"
      : products.length === 2
        ? "(min-width: 1600px) 260px, 220px"
        : products.length === 3
          ? "(min-width: 1600px) 230px, 200px"
          : "(min-width: 1440px) 190px, (min-width: 1181px) 300px, 160px";

  return (
    <div key={group.slug} className="mega-menu-preview flex flex-col">
      <div className="mb-7 border-b border-charcoal/10 pb-5">
        <h3 className="text-lg font-medium uppercase leading-snug text-charcoal xl:text-xl">
          {group.nameVi}
        </h3>
        {group.descriptionVi && (
          <p className="mt-1.5 line-clamp-2 max-w-xl text-[13px] leading-relaxed text-charcoal/55">
            {group.descriptionVi}
          </p>
        )}
      </div>

      <div className={cn("grid gap-x-6 gap-y-7", gridCols, products.length === 1 && "max-w-[240px]")}>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/san-pham/${product.slug}`}
            onClick={onNavigate}
            className="mega-menu-product group/p block"
          >
            <div className="mega-menu-product__frame relative aspect-square overflow-hidden rounded-[10px] border border-charcoal/10 bg-cloud-milk p-3 xl:p-3.5">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.imageAlt ?? product.nameVi}
                  fill
                  sizes={imageSizes}
                  className="mega-menu-product__image object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-2 text-center text-[9px] uppercase leading-relaxed tracking-[0.12em] text-charcoal/35">
                  Hình ảnh sắp cập nhật
                </div>
              )}
            </div>
            <span className="mega-menu-product__name mt-3.5 block line-clamp-2 text-[14px] font-medium leading-snug text-charcoal xl:text-[15px] 2xl:text-[16px]">
              {product.nameVi}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href={`/san-pham?danh-muc=${group.slug}`}
        onClick={onNavigate}
        className="group/all mt-8 flex items-center gap-1.5 self-start text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal transition-colors duration-300 hover:text-purple"
      >
        Xem tất cả dòng này
        <span
          aria-hidden
          className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/all:translate-x-1"
        >
          →
        </span>
      </Link>
    </div>
  );
}

/** Danh mục dạng chữ — dùng khi Supabase không trả được dữ liệu, để Header
 *  không bao giờ vỡ bố cục vì thiếu catalog thật. */
function FallbackPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_260px] gap-x-16 2xl:grid-cols-[minmax(0,1fr)_300px] 2xl:gap-x-20">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/50">
          {MEGA_MENU.eyebrowVi}
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-x-12 border-t border-charcoal/10 2xl:gap-x-16">
          {MEGA_MENU.categories.map((category) => (
            <li key={category.slug} className="border-b border-charcoal/10">
              <Link
                href={category.href}
                onClick={onNavigate}
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
                onClick={onNavigate}
                className="text-sm text-charcoal transition-colors duration-300 hover:text-purple"
              >
                {item.labelVi}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
