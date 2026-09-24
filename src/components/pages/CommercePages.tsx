"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { getProductBySlug, searchProducts } from "@/lib/products";
import { CatalogCard } from "@/components/pages/Catalog";
import { ProductImage } from "@/components/product/ProductImage";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";

export function SearchPageClient() { const [query,setQuery]=useState(""); const results=query.trim()?searchProducts(query):[]; return <section className="px-[clamp(20px,4vw,64px)] py-[clamp(48px,7vw,100px)]"><div className="mx-auto max-w-[1600px]"><label className="block text-[10px] uppercase tracking-[.16em] text-charcoal/45" htmlFor="search-page">Từ khóa</label><input id="search-page" autoFocus type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tên sản phẩm, cảm xúc..." className="mt-3 w-full border-b border-charcoal/25 bg-transparent pb-5 text-[clamp(1.5rem,4vw,3.5rem)] outline-none placeholder:text-charcoal/25 focus:border-charcoal"/><p className="mt-5 text-xs uppercase tracking-[.13em] text-charcoal/45">{query.trim() ? `${results.length} kết quả` : "Nhập từ khóa để bắt đầu"}</p>{results.length>0&&<div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">{results.map(p=><CatalogCard key={p.id} product={p}/>)}</div>}{query.trim()&&results.length===0&&<Empty title="Không tìm thấy kết quả" body="Thử tìm theo trạng thái như Bình tâm, Tái tạo, Rạng rỡ hoặc Yêu thương."/>}</div></section>; }

export function WishlistPageClient() { const {items}=useWishlist(); const products=items.map(i=>getProductBySlug(i.slug)).filter((p):p is NonNullable<typeof p>=>Boolean(p)); return products.length ? <section className="px-[clamp(20px,4vw,64px)] py-[clamp(48px,7vw,100px)]"><div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">{products.map(p=><CatalogCard key={p.id} product={p}/>)}</div></section> : <Empty title="Chưa có khoảng nghỉ nào được lưu" body="Chạm biểu tượng trái tim trên sản phẩm bạn muốn quay lại sau." action="Khám phá sản phẩm" href="/san-pham"/>; }

export function CartPageClient() { const {lines,adjustQuantity,removeItem}=useCart(); if(!lines.length) return <Empty title="Giỏ hàng đang trống" body="Khi dữ liệu bán hàng chính thức sẵn sàng, sản phẩm bạn chọn sẽ xuất hiện ở đây." action="Khám phá sản phẩm" href="/san-pham"/>; return <section className="px-[clamp(20px,4vw,64px)] py-[clamp(48px,7vw,100px)]"><ul className="mx-auto max-w-5xl border-t border-charcoal/10">{lines.map(line=><li key={line.productId} className="grid grid-cols-[88px_1fr] gap-5 border-b border-charcoal/10 py-5 md:grid-cols-[120px_1fr_auto]"><ProductImage mood={line.mood} className="aspect-[4/5]"/><div><Link className="font-medium" href={`/san-pham/${line.slug}`}>{line.nameVi}</Link><p className="mt-2 text-xs uppercase tracking-[.13em] text-charcoal/45">Thông tin bán hàng đang cập nhật</p><div className="mt-4 flex w-fit items-center border border-charcoal/15"><button className="flex h-11 w-11 items-center justify-center" onClick={()=>adjustQuantity(line.productId,-1)} aria-label="Giảm số lượng"><MinusIcon className="h-3.5 w-3.5"/></button><span className="w-7 text-center text-sm">{line.quantity}</span><button className="flex h-11 w-11 items-center justify-center" onClick={()=>adjustQuantity(line.productId,1)} aria-label="Tăng số lượng"><PlusIcon className="h-3.5 w-3.5"/></button></div></div><button className="col-start-2 flex min-h-11 items-center gap-2 self-start text-xs uppercase tracking-[.12em] text-charcoal/50 md:col-start-auto" onClick={()=>removeItem(line.productId)}><TrashIcon className="h-4 w-4"/>Xóa</button></li>)}</ul><div className="mx-auto mt-8 max-w-5xl bg-lavender/40 p-6 text-sm leading-relaxed text-charcoal/65">Thanh toán được tạm khóa cho đến khi giá và dữ liệu sản phẩm được xác minh chính thức.</div></section>; }

function Empty({
  title,
  body,
  action,
  href,
}: {
  title: string;
  body: string;
  action?: string;
  href?: string;
}) {
  return (
    <section className="flex min-h-[52vh] items-center justify-center px-5 py-20 text-center">
      <div className="max-w-xl">
        <p className="text-balance text-[clamp(1.75rem,4vw,3rem)] font-medium uppercase leading-[1.25] tracking-[-.02em] text-charcoal">
          {title}
        </p>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-charcoal/60">
          {body}
        </p>
        {action && href && (
          <Link
            href={href}
            className="mx-auto mt-10 flex min-h-11 w-fit items-center bg-charcoal px-6 text-xs uppercase tracking-[.13em] text-cloud-milk"
          >
            {action}
          </Link>
        )}
      </div>
    </section>
  );
}