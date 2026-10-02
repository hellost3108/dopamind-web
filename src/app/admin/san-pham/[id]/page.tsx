import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { MediaManager } from "@/components/admin/MediaManager";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminProduct, getReferenceOptions } from "@/lib/admin/data";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const [data, refs] = await Promise.all([getAdminProduct(id), getReferenceOptions()]);
  if (!data) notFound();

  const { product } = data;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/san-pham" className="text-xs text-charcoal/55 underline-offset-4 hover:underline">
        ← Danh sách sản phẩm
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">{product.name_vi}</h1>
        {product.status === "active" && (
          <Link href={`/san-pham/${product.slug}`} target="_blank" className="text-sm text-[#f52334] underline-offset-4 hover:underline">
            Xem trên trang web ↗
          </Link>
        )}
      </div>

      {sp.moi === "1" && (
        <p role="status" className="mt-5 rounded-xl bg-mint/60 px-4 py-3 text-sm text-charcoal">
          Đã tạo sản phẩm. Hãy thêm ảnh ở phần “Ảnh sản phẩm” bên dưới, rồi đổi trạng thái sang “Đang bán” khi sẵn sàng.
        </p>
      )}

      <div className="mt-8 space-y-5">
        <ProductForm
          values={{
            id: product.id,
            name_vi: product.name_vi,
            slug: product.slug,
            status: product.status,
            short_description_vi: product.short_description_vi ?? "",
            description_vi: product.description_vi ?? "",
            featured: product.featured,
            is_new: product.is_new,
            seo_title: product.seo_title ?? "",
            seo_description: product.seo_description ?? "",
          }}
          variants={data.variants}
          categories={refs.categories}
          moods={refs.moods}
          skinNeeds={refs.skinNeeds}
          categoryIds={data.categoryIds}
          moodIds={data.moodIds}
          skinNeedIds={data.skinNeedIds}
        />
        <MediaManager productId={product.id} productName={product.name_vi} media={data.media} />
        <div className="pt-2">
          <DeleteProductButton productId={product.id} productName={product.name_vi} />
        </div>
      </div>
    </div>
  );
}
