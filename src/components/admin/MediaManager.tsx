"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import {
  addProductMediaAction,
  deleteMediaAction,
  setPrimaryMediaAction,
  updateMediaAltAction,
} from "@/app/admin/actions";
import type { AdminMedia } from "@/lib/admin/data";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_IMAGE_BUCKET } from "@/lib/supabase-storage";
import { btnGhost, btnSmall, card, inputCls } from "@/components/admin/ui";

const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export function MediaManager({
  productId,
  productName,
  media,
}: {
  productId: string;
  productName: string;
  media: AdminMedia[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const ext = EXT[file.type];
      if (!ext) {
        setError(`“${file.name}”: chỉ nhận ảnh JPG, PNG hoặc WebP.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`“${file.name}” nặng hơn 5MB. Hãy nén ảnh nhỏ lại rồi tải lên.`);
        continue;
      }

      const path = `${productId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
      if (uploadError) {
        console.error("Upload ảnh lỗi:", uploadError);
        setError(`Không tải được “${file.name}”. Hãy kiểm tra bạn đã chạy file SQL phân quyền admin chưa.`);
        continue;
      }

      const result = await addProductMediaAction(productId, path, productName);
      if (!result.ok) {
        await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove([path]);
        setError(result.error ?? "Không lưu được ảnh.");
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.error ?? "Có lỗi xảy ra.");
    });
  }

  return (
    <section className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-charcoal">Ảnh sản phẩm</h2>
          <p className="mt-1 text-xs text-charcoal/50">
            JPG, PNG hoặc WebP, tối đa 5MB mỗi ảnh. Ảnh có nhãn “Ảnh chính” sẽ hiện ở thẻ sản phẩm.
          </p>
        </div>
        <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className={btnGhost + " !h-9 !px-4"}>
          {uploading ? "Đang tải lên..." : "+ Tải ảnh lên"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}

      {media.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-charcoal/20 p-8 text-center text-sm text-charcoal/50">
          Chưa có ảnh nào.
        </p>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-xl border border-charcoal/10 bg-cloud-milk/60">
              <div className="relative aspect-square bg-black/[.04]">
                <Image src={m.url} alt={m.alt_vi ?? ""} fill sizes="(min-width:1024px) 220px, 45vw" className="object-cover" unoptimized />
                {m.is_primary && (
                  <span className="absolute left-2 top-2 rounded-full bg-charcoal px-2.5 py-1 text-[10px] font-medium text-cloud-milk">
                    Ảnh chính
                  </span>
                )}
              </div>
              <div className="space-y-2 p-3">
                <input
                  defaultValue={m.alt_vi ?? ""}
                  aria-label="Mô tả ảnh"
                  placeholder="Mô tả ảnh (cho SEO)"
                  className={inputCls + " !py-2 !text-[13px]"}
                  onBlur={(e) => {
                    if (e.target.value.trim() !== (m.alt_vi ?? "")) run(() => updateMediaAltAction(m.id, e.target.value));
                  }}
                />
                <div className="flex items-center justify-between gap-2">
                  {m.is_primary ? (
                    <span className="text-[11px] text-charcoal/45">Đang là ảnh chính</span>
                  ) : (
                    <button type="button" disabled={pending} onClick={() => run(() => setPrimaryMediaAction(m.id))} className={btnSmall}>
                      Đặt làm ảnh chính
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (confirm("Xóa ảnh này khỏi sản phẩm?")) run(() => deleteMediaAction(m.id));
                    }}
                    className="text-xs text-red-600 underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
