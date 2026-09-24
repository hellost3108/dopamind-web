"use client";

import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { WishlistButton } from "@/components/product/WishlistButton";
import { getMood } from "@/lib/moods";
import type { Product } from "@/lib/types";

export function CatalogCard({ product }: { product: Product }) {
  const mood = getMood(product.mood);
  return <article className="group relative"><div className="relative aspect-[4/5] overflow-hidden"><Link href={`/san-pham/${product.slug}`} className="block h-full transition-transform duration-500 group-hover:scale-[1.025]"><ProductImage mood={product.mood} className="h-full" /></Link><WishlistButton product={product} className="absolute right-3 top-3" /></div><div className="mt-4"><p className="text-[10px] uppercase tracking-[.17em] text-charcoal/45">{mood.labelVi}</p><Link href={`/san-pham/${product.slug}`}><h2 className="mt-2 text-base font-medium">{product.nameVi}</h2></Link><p className="mt-1 line-clamp-2 text-sm leading-relaxed text-charcoal/60">{product.benefitVi}</p><p className="mt-4 text-[11px] font-medium uppercase tracking-[.13em] text-purple">Thông tin bán hàng đang cập nhật</p></div></article>;
}
