import Image from "next/image";
import Link from "next/link";
import { getAdminProducts } from "@/lib/admin/data";
import { PRODUCT_STATUS_LABEL, PRODUCT_STATUS_STYLE } from "@/lib/admin/labels";
import { formatVnd } from "@/lib/format";
import { btnPrimary, card, chip } from "@/components/admin/ui";

function priceText(min: number | null, max: number | null): string {
  if (min === null || max === null) return "Chưa có biến thể";
  return min === max ? formatVnd(min) : `${formatVnd(min)} – ${formatVnd(max)}`;
}

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">Sản phẩm</h1>
          <p className="mt-2 text-sm text-charcoal/60">{products.length} sản phẩm (gồm cả bản nháp và lưu trữ).</p>
        </div>
        <Link href="/admin/san-pham/moi" className={btnPrimary}>
          + Thêm sản phẩm
        </Link>
      </div>

      <div className={`${card} mt-8 !p-0`}>
        {products.length === 0 ? (
          <p className="p-8 text-center text-sm text-charcoal/55">Chưa có sản phẩm nào. Bấm “Thêm sản phẩm” để bắt đầu.</p>
        ) : (
          <ul className="divide-y divide-charcoal/10">
            {products.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/san-pham/${p.id}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-lavender/20 sm:p-5">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-lavender/30">
                    {p.imageUrl && (
                      <Image src={p.imageUrl} alt="" fill sizes="64px" className="object-cover" unoptimized />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-charcoal">{p.name_vi}</p>
                    <p className="mt-0.5 truncate text-xs text-charcoal/50">/{p.slug}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className={`${chip} ${PRODUCT_STATUS_STYLE[p.status] ?? ""}`}>
                        {PRODUCT_STATUS_LABEL[p.status] ?? p.status}
                      </span>
                      {p.featured && <span className={`${chip} bg-purple/15 text-purple`}>Nổi bật</span>}
                      {p.is_new && <span className={`${chip} bg-peach/50 text-charcoal`}>Mới</span>}
                    </div>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-sm text-charcoal">{priceText(p.priceMin, p.priceMax)}</p>
                    <p className={`mt-1 text-xs ${p.stockTotal === 0 ? "text-red-600" : "text-charcoal/55"}`}>
                      {p.variantCount === 0 ? "—" : p.stockTotal === 0 ? "Hết hàng" : `Tồn kho: ${p.stockTotal}`}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
