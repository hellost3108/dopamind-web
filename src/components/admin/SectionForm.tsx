"use client";

import { useActionState, useRef, useState } from "react";
import { saveSectionAction, type SaveState } from "@/app/admin/noi-dung/actions";
import { btnGhost, btnPrimary, card, inputCls, labelCls } from "@/components/admin/ui";
import type { ContentField, ContentSection } from "@/lib/site-content-schema";
import { SITE_IMAGE_FOLDER } from "@/lib/site-content-schema";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_IMAGE_BUCKET, getProductImageUrl } from "@/lib/supabase-storage";

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 5 * 1024 * 1024;

function ImageField({ field, initial }: { field: ContentField; initial: string }) {
  const [value, setValue] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    const ext = EXT[file.type];
    if (!ext) return setError("Chỉ nhận ảnh JPG, PNG hoặc WebP.");
    if (file.size > MAX_BYTES) return setError("Ảnh nặng hơn 5MB. Hãy nén nhỏ lại rồi tải lên.");

    setUploading(true);
    const path = `${SITE_IMAGE_FOLDER}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const { error: upErr } = await createClient()
      .storage.from(PRODUCT_IMAGE_BUCKET)
      .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (upErr) {
      console.error("Upload ảnh lỗi:", upErr);
      return setError("Không tải được ảnh. Hãy kiểm tra bạn đã chạy SQL phân quyền admin chưa.");
    }
    setValue(getProductImageUrl(path));
  }

  return (
    <div>
      <input type="hidden" name={field.key} value={value} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={value} alt="" className="mb-3 h-40 w-full rounded-xl border border-charcoal/10 bg-charcoal/5 object-cover sm:w-72" />
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className={btnGhost + " !h-9 !px-4"}>
          {uploading ? "Đang tải lên..." : "Đổi ảnh"}
        </button>
        {value !== field.default && (
          <button type="button" onClick={() => setValue(field.default)} className={btnGhost + " !h-9 !px-4"}>
            Dùng lại ảnh gốc
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-2 text-[11px] text-charcoal/45">Đổi ảnh xong nhớ bấm “Lưu” ở cuối khu vực này.</p>
    </div>
  );
}

export function SectionForm({ section, values }: { section: ContentSection; values: Record<string, string> }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveSectionAction, undefined);

  return (
    <form action={action} className={card}>
      <input type="hidden" name="sectionId" value={section.id} />
      <h2 className="font-serif text-xl text-charcoal">{section.title}</h2>
      <p className="mt-1 text-xs text-charcoal/55">{section.description}</p>

      <div className="mt-6 grid gap-5">
        {section.fields.map((f) => (
          <div key={f.key}>
            <label className={labelCls} htmlFor={f.key}>{f.label}</label>
            {f.type === "image" ? (
              <ImageField field={f} initial={values[f.key]} />
            ) : f.type === "textarea" ? (
              <textarea id={f.key} name={f.key} rows={3} defaultValue={values[f.key]} className={inputCls} />
            ) : (
              <input id={f.key} name={f.key} type="text" defaultValue={values[f.key]} className={inputCls} />
            )}
            {f.hint && f.type !== "image" && <p className="mt-1 text-[11px] text-charcoal/45">{f.hint}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Đang lưu..." : "Lưu khu vực này"}
        </button>
        {state?.ok && <span className="text-sm text-emerald-700">{state.ok}</span>}
        {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
