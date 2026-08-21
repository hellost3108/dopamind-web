import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductImage } from "@/components/product/ProductImage";
import { WishlistButton } from "@/components/product/WishlistButton";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { getMood } from "@/lib/moods";
import { SKIN_NEEDS } from "@/lib/skin-needs";

export function generateStaticParams() { return getAllProducts().map(({slug}) => ({slug})); }
export async function generateMetadata({params}: PageProps<"/san-pham/[slug]">): Promise<Metadata> { const {slug}=await params; const p=getProductBySlug(slug); return {title:p ? `${p.nameVi} | DOPAMIND` : "Sản phẩm | DOPAMIND"}; }

export default async function ProductPage({params}: PageProps<"/san-pham/[slug]">) {
  const {slug}=await params; const product=getProductBySlug(slug); if(!product) notFound();
  const mood=getMood(product.mood); const needs=product.skinNeeds.map(s=>SKIN_NEEDS.find(n=>n.slug===s)?.labelVi).filter(Boolean);
  return <div className="px-[clamp(20px,4vw,64px)] py-[clamp(32px,6vw,96px)]"><div className="mx-auto max-w-[1600px]"><nav className="mb-8 text-[10px] uppercase tracking-[.16em] text-charcoal/45"><Link href="/san-pham">Sản phẩm</Link> / {product.nameVi}</nav><div className="grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-[clamp(48px,7vw,120px)]"><div className="relative aspect-[4/5] max-h-[820px] overflow-hidden"><ProductImage mood={product.mood} className="h-full" /></div><div className="lg:sticky lg:top-28 lg:self-start"><p className="text-[11px] uppercase tracking-[.18em] text-charcoal/50">{mood.labelVi} / {mood.labelEn}</p><h1 className="mt-4 text-[clamp(2.8rem,6vw,6.5rem)] font-medium uppercase leading-[.9] tracking-[-.06em]">{product.nameVi}</h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-charcoal/65">{product.benefitVi}</p><div className="mt-8 flex flex-wrap gap-2">{needs.map(n=><span key={n} className="border border-charcoal/15 px-3 py-2 text-[10px] uppercase tracking-[.12em]">{n}</span>)}</div><div className="mt-10 border-y border-charcoal/10 py-7"><p className="text-xs font-medium uppercase tracking-[.15em]">Thông tin sản phẩm đang được xác minh</p><p className="mt-3 max-w-lg text-sm leading-relaxed text-charcoal/55">Giá, thành phần, hướng dẫn sử dụng và các tuyên bố về hiệu quả chưa có nguồn dữ liệu chính thức nên chưa được hiển thị. Bạn vẫn có thể lưu sản phẩm để xem lại.</p></div><div className="mt-7 flex items-center gap-3"><WishlistButton product={product} className="static shrink-0 border border-charcoal/15 bg-transparent"/><Link href="/san-pham" className="flex min-h-11 flex-1 items-center justify-center bg-charcoal px-5 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk">Khám phá sản phẩm khác</Link></div></div></div></div></div>;
}
