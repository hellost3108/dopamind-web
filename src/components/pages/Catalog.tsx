"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { WishlistButton } from "@/components/product/WishlistButton";
import { MOODS, getMood } from "@/lib/moods";
import { SKIN_NEEDS } from "@/lib/skin-needs";
import type { Product, MoodSlug, SkinNeedSlug } from "@/lib/types";

export function Catalog({ products }: { products: Product[] }) {
  const [mood, setMood] = useState<MoodSlug | "all">("all");
  const [need, setNeed] = useState<SkinNeedSlug | "all">("all");
  const visible = useMemo(() => products.filter((p) => (mood === "all" || p.mood === mood) && (need === "all" || p.skinNeeds.includes(need))), [products, mood, need]);
  const chip = "min-h-11 border px-4 text-[11px] font-medium uppercase tracking-[.12em] transition-colors";
  return (
    <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-6 border-b border-charcoal/10 pb-8 lg:grid-cols-2">
          <Filter label="Cảm xúc" value={mood} onChange={(v) => setMood(v as MoodSlug | "all")} options={MOODS.map((m) => ({value:m.slug,label:m.labelVi}))} chip={chip} />
          <Filter label="Nhu cầu da" value={need} onChange={(v) => setNeed(v as SkinNeedSlug | "all")} options={SKIN_NEEDS.map((n) => ({value:n.slug,label:n.labelVi}))} chip={chip} />
        </div>
        <div className="mt-7 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[.14em] text-charcoal/50"><span>{visible.length} lựa chọn</span><span className="text-right">Dữ liệu sản phẩm đang chờ xác minh</span></div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-7 xl:grid-cols-4">
          {visible.map((product) => <CatalogCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}

function Filter({label,value,onChange,options,chip}:{label:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[];chip:string}) {
  return <div><p className="mb-3 text-[10px] uppercase tracking-[.16em] text-charcoal/45">{label}</p><div className="flex flex-wrap gap-2"><button type="button" className={`${chip} ${value === "all" ? "border-charcoal bg-charcoal text-cloud-milk" : "border-charcoal/15"}`} onClick={()=>onChange("all")}>Tất cả</button>{options.map(o=><button type="button" key={o.value} className={`${chip} ${value === o.value ? "border-charcoal bg-charcoal text-cloud-milk" : "border-charcoal/15"}`} onClick={()=>onChange(o.value)}>{o.label}</button>)}</div></div>
}

export function CatalogCard({ product }: { product: Product }) {
  const mood = getMood(product.mood);
  return <article className="group relative"><div className="relative aspect-[4/5] overflow-hidden"><Link href={`/san-pham/${product.slug}`} className="block h-full transition-transform duration-500 group-hover:scale-[1.025]"><ProductImage mood={product.mood} className="h-full" /></Link><WishlistButton product={product} className="absolute right-3 top-3" /></div><div className="mt-4"><p className="text-[10px] uppercase tracking-[.17em] text-charcoal/45">{mood.labelVi}</p><Link href={`/san-pham/${product.slug}`}><h2 className="mt-2 text-base font-medium">{product.nameVi}</h2></Link><p className="mt-1 line-clamp-2 text-sm leading-relaxed text-charcoal/60">{product.benefitVi}</p><p className="mt-4 text-[11px] font-medium uppercase tracking-[.13em] text-purple">Thông tin bán hàng đang cập nhật</p></div></article>;
}
