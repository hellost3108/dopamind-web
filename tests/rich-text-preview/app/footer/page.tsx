"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FormattedText } from "@/components/content/FormattedText";
import { btnGhost, btnPrimary, card, inputCls, labelCls } from "@/components/admin/ui";
import { getSectionDef } from "@/lib/cms/sections";
import { list, itemStr, resolveContent, str, validateContent } from "@/lib/cms/fields";
import { isFormattedText, readRichText } from "@/lib/rich-text/content";
import type { SectionContent } from "@/lib/cms/types";

const def = getSectionDef("global.footer")!;
const original = resolveContent(def, undefined);

/** Bản thử footer riêng; lưu/hoàn tác/khôi phục chỉ trong bộ nhớ. */
export default function FooterPreview() {
  const [values, setValues] = useState<SectionContent>(original);
  const [saved, setSaved] = useState<SectionContent>(original);
  const [message, setMessage] = useState("");
  const setField = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const updateSocial = (index: number, key: string, value: string) => setValues((current) => ({ ...current, social: list(current, "social").map((item, i) => i === index ? { ...item, [key]: value } : item) }));
  const Tagline = isFormattedText(str(saved, "tagline")) ? "div" : "p";

  return <main className="mx-auto max-w-4xl px-5 py-10">
    <h1 className="font-serif text-3xl">Thử thanh công cụ — Chân trang</h1>
    <p className="mt-3 text-sm text-black/60">Bản thử trên máy. Các nút chỉ thay đổi bản thử, không cập nhật dopamind.vn. Tải lại trang sẽ về nội dung gốc.</p>
    <section className={`${card} mt-48 space-y-5`}>
      <div>
        <label id="footer-tagline-label" htmlFor="footer-tagline" className={labelCls}>Câu giới thiệu dưới logo</label>
        <RichTextEditor id="footer-tagline" mode="block" maxLength={200} value={str(values, "tagline")} onChange={(value) => setField("tagline", value)} />
      </div>
      <div>
        <label id="footer-copyright-label" htmlFor="footer-copyright" className={labelCls}>Dòng bản quyền</label>
        <RichTextEditor id="footer-copyright" mode="inline" maxLength={120} value={str(values, "copyright")} onChange={(value) => setField("copyright", value)} />
      </div>
      <div className="space-y-4">
        <h2 className={labelCls}>Liên kết mạng xã hội</h2>
        {list(values, "social").map((item, index) => <div key={index} className="rounded-2xl border border-charcoal/10 bg-cloud-milk/60 p-4">
          <p data-testid={`social-title-${index}`} className="mb-4 text-sm">Liên kết {index + 1} · {readRichText(itemStr(item, "label"), "inline").text}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label id={`footer-social-${index}-label`} htmlFor={`footer-social-${index}`} className={labelCls}>Tên (Instagram, TikTok...)</label>
              <RichTextEditor id={`footer-social-${index}`} mode="inline" maxLength={30} value={itemStr(item, "label")} onChange={(value) => updateSocial(index, "label", value)} />
            </div>
            <div>
              <label htmlFor={`footer-link-${index}`} className={labelCls}>Đường dẫn</label>
              <input id={`footer-link-${index}`} className={inputCls} value={itemStr(item, "href")} onChange={(event) => updateSocial(index, "href", event.target.value)} />
            </div>
          </div>
        </div>)}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={btnPrimary} onClick={() => {
          const result = validateContent(def, values);
          if (!result.ok) { setMessage(result.error); return; }
          const content = resolveContent(def, result.value);
          setValues(content); setSaved(content); setMessage("Đã lưu bản thử footer.");
        }}>Lưu thay đổi</button>
        <button type="button" className={btnGhost} onClick={() => { setValues(saved); setMessage(""); }}>Hoàn tác</button>
        <button type="button" className={btnGhost} onClick={() => { setValues(original); setSaved(original); setMessage("Đã khôi phục bản thử footer."); }}>Khôi phục nội dung gốc</button>
      </div>
      <p role="status" className="text-sm">{message}</p>
    </section>
    <h2 className="mb-3 mt-8 font-semibold">Nội dung footer đã lưu</h2>
    <section data-testid="footer-preview" className="border-t border-charcoal/10 bg-cloud-milk p-5">
      <div className="max-w-[22rem]">
        <strong>DOPAMIND</strong>
        <Tagline data-testid="footer-tagline-preview" className="mt-3 text-sm leading-relaxed text-charcoal/60"><FormattedText value={str(saved, "tagline")} mode="block" /></Tagline>
      </div>
      <ul className="mt-6 space-y-2">{list(saved, "social").map((item, index) => <li key={index}><a data-testid={`footer-social-preview-${index}`} href={itemStr(item, "href")} className="text-sm text-charcoal/70"><FormattedText value={itemStr(item, "label")} /></a></li>)}</ul>
      <p data-testid="footer-copyright-preview" className="mt-6 border-t border-charcoal/10 pt-6 text-xs text-charcoal/45">© {new Date().getFullYear()} <FormattedText value={str(saved, "copyright")} /></p>
    </section>
  </main>;
}
