"use client";

import { useState, useTransition } from "react";
import { deleteProductAction } from "@/app/admin/actions";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const ok = confirm(
            `Xóa vĩnh viễn “${productName}”?\n\nẢnh, biến thể và mục yêu thích liên quan cũng bị xóa. Đơn hàng cũ vẫn được giữ lại. Nếu chỉ muốn ẩn khỏi trang bán hàng, hãy đổi trạng thái sang “Lưu trữ”.`,
          );
          if (!ok) return;
          setError(null);
          startTransition(async () => {
            const result = await deleteProductAction(productId);
            if (result && !result.ok) setError(result.error ?? "Không xóa được sản phẩm.");
          });
        }}
        className="text-sm text-red-600 underline-offset-4 hover:underline disabled:opacity-50"
      >
        {pending ? "Đang xóa..." : "Xóa sản phẩm này"}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
