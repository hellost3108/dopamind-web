"use client";

import { useState } from "react";
import { useUI } from "@/context/ui-context";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { searchProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

const POPULAR_SUGGESTIONS = ["Bán chạy", "Bình tâm", "Tái tạo", "Rạng rỡ", "Yêu thương"];

export function SearchOverlay() {
  const { isSearchOpen, close } = useUI();
  // Mounted only while open, so its local `query` state always starts fresh
  // on the next open — no effect needed to reset it.
  if (!isSearchOpen) return null;
  return <SearchOverlayPanel close={close} />;
}

function SearchOverlayPanel({ close }: { close: () => void }) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const results = trimmed ? searchProducts(trimmed) : [];

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm DOPAMIND"
    >
      <button
        type="button"
        aria-label="Đóng tìm kiếm"
        onClick={close}
        className="absolute inset-0 bg-charcoal/40"
      />

      <div className="absolute inset-x-0 top-0 max-h-[92vh] overflow-y-auto bg-cloud-milk">
        <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)] py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal">
              TÌM KIẾM DOPAMIND
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Đóng tìm kiếm"
              className="flex h-11 w-11 items-center justify-center text-charcoal"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 border-b border-charcoal/20 pb-3 transition-colors focus-within:border-charcoal">
            <SearchIcon className="shrink-0 text-charcoal/40" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Bạn đang tìm sản phẩm nào?"
              className="w-full min-w-0 bg-transparent text-lg text-charcoal outline-none placeholder:text-charcoal/40"
            />
          </div>

          {!trimmed && (
            <div className="mt-6 flex flex-wrap gap-2">
              {POPULAR_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="flex min-h-11 items-center border border-charcoal/15 px-4 text-xs font-medium uppercase tracking-[0.1em] text-charcoal transition-colors hover:border-charcoal"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {trimmed && results.length === 0 && (
            <p className="mt-10 text-sm text-charcoal/60">
              Không tìm thấy sản phẩm phù hợp.
            </p>
          )}

          {results.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
