"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_IMAGE_BUCKET, getProductImageUrl } from "@/lib/supabase-storage";
import { btnSmall, inputCls } from "@/components/admin/ui";

const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/**
 * Ô chọn ảnh: tải ảnh lên Supabase Storage (thư mục cms/) hoặc dán đường dẫn có sẵn
 * (ví dụ /images/homepage/hero/H01.png). Giá trị trả về là URL/đường dẫn của ảnh.
 */
export function ImageInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    const ext = EXT[file.type];
    if (!ext) {
      setError("Chỉ nhận ảnh JPG, PNG hoặc WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Ảnh nặng hơn 5MB. Hãy nén ảnh nhỏ lại rồi tải lên.");
      return;
    }

    setUploading(true);
    const path = `cms/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const { error: uploadError } = await createClient()
      .storage.from(PRODUCT_IMAGE_BUCKET)
      .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";

    if (uploadError) {
      console.error("Upload ảnh lỗi:", uploadError);
      setError("Không tải được ảnh. Hãy kiểm tra bạn đã chạy file SQL phân quyền admin chưa.");
      return;
    }
    onChange(getProductImageUrl(path));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Dán đường dẫn ảnh hoặc bấm “Tải ảnh lên”"
          className={`${inputCls} min-w-0 flex-1`}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        <button type="button" className={btnSmall} disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? "Đang tải..." : "Tải ảnh lên"}
        </button>
        {value && (
          <button type="button" className={btnSmall} onClick={() => onChange("")}>
            Bỏ ảnh
          </button>
        )}
      </div>
      {value && (
        <div className="mt-3 h-28 w-44 overflow-hidden rounded-xl border border-charcoal/10 bg-lavender/20">
          {/* eslint-disable-next-line @next/next/no-img-element -- ảnh xem trước có thể ở bất kỳ host nào */}
          <img src={value} alt="Ảnh xem trước" className="h-full w-full object-cover" />
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
