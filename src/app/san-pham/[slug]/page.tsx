import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductTabs } from "@/components/product/ProductTabs";
import { getRealProductBySlug } from "@/lib/real-product-detail";

// Làm mới dữ liệu từ Supabase mỗi 60 giây.
export const revalidate = 60;

function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
}

function HighlightIcon({ index }: { index: number }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (index % 4) {
    case 0:
      return (
        <svg {...common}>
          <path d="M12 3.5s6 6.2 6 10.2a6 6 0 0 1-12 0c0-4 6-10.2 6-10.2z" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5.5c0 4.4-3 7.8-7 9.5-4-1.7-7-5.1-7-9.5V6l7-3z" />
          <path d="M9 12.5c1.5 0 2.5-1 3-2.5 1 1.5 1.5 2.5 1.5 3.5" />
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5.5c0 4.4-3 7.8-7 9.5-4-1.7-7-5.1-7-9.5V6l7-3z" />
          <path d="M12 9v6M9 12h6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z" />
          <path d="M5 19c2-4 5-7 9-9" />
        </svg>
      );
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getRealProductBySlug(slug);
  return {
    title: product
      ? `${product.fullTitle ?? product.nameVi} | DOPAMIND`
      : "Sản phẩm | DOPAMIND",
    description: product?.intro ?? product?.shortDescriptionVi,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/san-pham/[slug]">) {
  const { slug } = await params;
  const product = await getRealProductBySlug(slug);
  if (!product) notFound();

  const chipLabel = product.categoryShortNameVi ?? product.categoryNameVi;
  const crumbLabel = product.categoryLabel ?? product.categoryNameVi;
  const intro = product.intro ?? product.shortDescriptionVi;
  const hasDiscount =
    product.price !== undefined &&
    product.compareAtPrice !== undefined &&
    product.compareAtPrice > product.price;
  const banner = product.banner;

  return (
    <div className="px-[clamp(20px,4vw,64px)] py-[clamp(24px,4vw,64px)]">
      <div className="mx-auto max-w-[1600px]">
        <nav aria-label="Đường dẫn" className="mb-6 text-sm text-charcoal/55">
          <Link href="/">Trang chủ</Link>
          <span aria-hidden="true" className="mx-2">›</span>
          {crumbLabel && (
            <>
              <Link href="/san-pham">{crumbLabel}</Link>
              <span aria-hidden="true" className="mx-2">›</span>
            </>
          )}
          <span className="text-charcoal">{product.nameVi}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:gap-[clamp(40px,6vw,96px)]">
          <ProductGallery images={product.images} name={product.nameVi} />

          <div className="lg:self-start">
            {chipLabel && (
              <span className="inline-block rounded-full bg-lavender/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[.16em] text-purple">
                {chipLabel}
              </span>
            )}

            <h1 className="mt-5 font-serif text-[clamp(2.2rem,4vw,3.75rem)] leading-[1.05] text-charcoal">
              {product.fullTitle ?? product.nameVi}
            </h1>

            {product.tagline && (
              <p className="mt-4 font-serif text-xl text-charcoal/80">
                {product.tagline}
              </p>
            )}

            {intro && (
              <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal/60">
                {intro}
              </p>
            )}

            {product.price !== undefined && (
              <p className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-3xl text-charcoal">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && product.compareAtPrice !== undefined && (
                  <span className="text-base text-charcoal/40 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </p>
            )}

            <ProductPurchase />
          </div>
        </div>

        {product.highlights.length > 0 && (
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 border-t border-charcoal/10 pt-10 md:grid-cols-4">
            {product.highlights.map((text, i) => (
              <li key={text} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lavender/30 text-charcoal/70">
                  <HighlightIcon index={i} />
                </span>
                <span className="max-w-[16ch] text-sm leading-snug text-charcoal/70">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12">
          <ProductTabs
            description={product.description}
            benefits={product.benefits}
          />
        </div>

        {banner?.title && (
          <section className="mt-14 grid overflow-hidden rounded-2xl bg-lavender/15 md:grid-cols-2">
            <div
              aria-hidden="true"
              className="min-h-[220px] bg-gradient-to-br from-lavender via-cloud-milk to-mint"
            />
            <div className="flex flex-col justify-center p-[clamp(24px,4vw,56px)]">
              {banner.eyebrow && (
                <p className="text-[10px] font-medium uppercase tracking-[.18em] text-charcoal/50">
                  {banner.eyebrow}
                </p>
              )}
              <h2 className="mt-4 font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-charcoal">
                {banner.title}
              </h2>
              {banner.body && (
                <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/60">
                  {banner.body}
                </p>
              )}
              {banner.linkLabel && banner.linkHref && (
                <Link
                  href={banner.linkHref}
                  className="mt-6 inline-flex w-fit items-center gap-2 border-b border-charcoal pb-1 text-sm text-charcoal"
                >
                  {banner.linkLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}