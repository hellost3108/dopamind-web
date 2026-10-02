import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { getReferenceOptions } from "@/lib/admin/data";

export default async function NewProductPage() {
  const { categories, moods, skinNeeds } = await getReferenceOptions();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/san-pham" className="text-xs text-charcoal/55 underline-offset-4 hover:underline">
        ← Danh sách sản phẩm
      </Link>
      <h1 className="mt-3 font-serif text-3xl text-charcoal sm:text-4xl">Thêm sản phẩm</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Điền thông tin và bấm “Tạo sản phẩm”. Sau khi tạo, bạn sẽ thêm ảnh ở bước tiếp theo.
      </p>
      <div className="mt-8">
        <ProductForm
          values={{
            name_vi: "",
            slug: "",
            status: "draft",
            short_description_vi: "",
            description_vi: "",
            featured: false,
            is_new: false,
            seo_title: "",
            seo_description: "",
          }}
          variants={[]}
          categories={categories}
          moods={moods}
          skinNeeds={skinNeeds}
          categoryIds={[]}
          moodIds={[]}
          skinNeedIds={[]}
        />
      </div>
    </div>
  );
}
