"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FormattedText } from "@/components/content/FormattedText";
import { btnGhost, btnPrimary, card, inputCls, labelCls } from "@/components/admin/ui";
import { getSectionDef } from "@/lib/cms/sections";
import { resolveContent, validateContent } from "@/lib/cms/fields";

const def = getSectionDef("global.announcement")!;
const original = String(def.defaults.text);

/** Trang thử riêng, không thuộc src/app và không truy cập database thật. */
export default function PreviewPage() {
  const [saved, setSaved] = useState(original);
  const [value, setValue] = useState(original);
  const [message, setMessage] = useState("");
  return <main className="mx-auto max-w-4xl px-5 py-10">
    <h1 className="font-serif text-3xl">Thử thanh công cụ — Nội dung thông báo</h1>
    <p className="mt-3 text-sm text-black/60">Bản thử trên máy. Các nút chỉ thay đổi nội dung bản thử, không cập nhật dopamind.vn.</p>
    <section className={`${card} mt-32`}>
      <label id="announcement-label" className={labelCls} htmlFor="announcement">Nội dung thông báo</label>
      <RichTextEditor id="announcement" value={value} onChange={setValue} mode="inline" maxLength={140} />
      <label className={`${labelCls} mt-5`} htmlFor="ordinary">Đường dẫn khi bấm (ô thường để đối chiếu)</label>
      <input id="ordinary" className={inputCls} defaultValue="/san-pham" />
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className={btnPrimary} onClick={() => {
          const result = validateContent(def, { text: value, href: "" });
          if (!result.ok) { setMessage(result.error); return; }
          const next = String(resolveContent(def, result.value).text);
          setSaved(next); setValue(next); setMessage("Đã lưu bản thử.");
        }}>Lưu thay đổi</button>
        <button type="button" className={btnGhost} onClick={() => { setValue(saved); setMessage(""); }}>Hoàn tác</button>
        <button type="button" className={btnGhost} onClick={() => { setValue(original); setSaved(original); setMessage("Đã khôi phục bản thử."); }}>Khôi phục nội dung gốc</button>
      </div>
      <p role="status" className="mt-3 text-sm">{message}</p>
    </section>
    <h2 className="mb-3 mt-8 text-sm font-semibold">Nội dung đã lưu hiển thị ngoài website</h2>
    <div data-testid="public-preview" className="bg-charcoal px-4 py-2.5 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cloud-milk"><FormattedText value={saved} /></p>
    </div>
  </main>;
}
