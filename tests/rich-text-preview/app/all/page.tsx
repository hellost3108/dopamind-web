"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { btnGhost, btnPrimary, card, inputCls, labelCls } from "@/components/admin/ui";
import { resolveContent, list } from "@/lib/cms/fields";
import { SECTION_DEFS } from "@/lib/cms/sections";
import { readRichText } from "@/lib/rich-text/content";
import type { SectionContent, ValueField } from "@/lib/cms/types";
import { previewHomeSection } from "./actions";

const defs = SECTION_DEFS.filter((def) => def.group !== "global");

function PreviewInput({ id, field, value, onChange }: { id: string; field: ValueField; value: unknown; onChange: (value: string) => void }) {
  const text = typeof value === "string" ? value : "";
  return <div>
    <label id={`${id}-label`} htmlFor={id} className={labelCls}>{field.label}</label>
    {field.format ? <RichTextEditor id={id} mode={field.format} maxLength={field.max} value={text} onChange={onChange} /> : <input id={id} className={inputCls} value={text} onChange={(event) => onChange(event.target.value)} />}
    {field.help && <p className="mt-1 text-xs text-black/45">{field.help}</p>}
  </div>;
}

export default function HomePreview() {
  const [key, setKey] = useState(defs[0].key);
  const [values, setValues] = useState<SectionContent>(resolveContent(defs[0], undefined));
  const [saved, setSaved] = useState(values);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saveId, setSaveId] = useState(0);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const def = defs.find((item) => item.key === key)!;
  const save = (content: SectionContent) => startTransition(async () => {
    const result = await previewHomeSection(key, content);
    if (!result.ok) { setMessage(result.error); return; }
    setSaved(result.content); setValues(result.content);
    setPreviewUrl(`/all/view?section=${encodeURIComponent(key)}&content=${encodeURIComponent(JSON.stringify(result.content))}&version=${saveId + 1}`);
    setSaveId(saveId + 1); setMessage("Đã lưu bản thử, không ghi database.");
  });

  return <main className="mx-auto max-w-6xl px-5 py-10">
    <Image src="/images/brand/dopamind-mask-story-logo-cropped.png" alt="DOPAMIND" width={140} height={36} unoptimized className="mb-5" />
    <h1 className="font-serif text-3xl">Thử thanh công cụ — Toàn bộ nội dung</h1>
    <p className="mt-3 text-sm text-black/60">Chọn một khối nội dung. Lưu để xem bằng component thật của website. Bản thử không ghi database; đổi khối hoặc tải lại trang sẽ về nội dung gốc.</p>
    <nav className="mt-4 flex gap-4 text-sm underline"><Link href="/" prefetch={false}>Bản thử thông báo</Link><Link href="/footer" prefetch={false}>Bản thử footer</Link></nav>
    <label className={`${labelCls} mt-6`} htmlFor="home-section">Khối nội dung</label>
    <select id="home-section" className={inputCls} disabled={pending} value={key} onChange={(event) => {
      const next = defs.find((item) => item.key === event.target.value)!;
      const initial = resolveContent(next, undefined);
      setKey(next.key); setValues(initial); setSaved(initial); setPreviewUrl(""); setMessage("");
    }}>{defs.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select>
    <section className={`${card} mt-32 space-y-6`}>
      {def.fields.map((field) => field.type !== "list" ? <PreviewInput key={`${key}.${field.key}`} id={`home-${field.key}`} field={field} value={values[field.key]} onChange={(value) => setValues((current) => ({ ...current, [field.key]: value }))} /> : <div key={`${key}.${field.key}`}>
        <h2 className={labelCls}>{field.label}</h2>
        {list(values, field.key).map((item, index) => <details key={index} open={index === 0} className="mt-4 rounded-2xl border border-black/10 p-4">
          <summary className="cursor-pointer text-sm">{field.itemLabel} {index + 1} · {readRichText(String(item[field.itemTitleKey ?? ""] ?? ""), "inline").text}</summary>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">{field.fields.map((sub) => <PreviewInput key={sub.key} id={`home-${field.key}-${index}-${sub.key}`} field={sub} value={item[sub.key]} onChange={(value) => setValues((current) => ({ ...current, [field.key]: list(current, field.key).map((row, i) => i === index ? { ...row, [sub.key]: value } : row) }))} />)}</div>
        </details>)}
      </div>)}
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={pending} className={btnPrimary} onClick={() => save(values)}>Lưu thay đổi</button>
        <button type="button" disabled={pending} className={btnGhost} onClick={() => { setValues(saved); setMessage(""); }}>Hoàn tác</button>
        <button type="button" disabled={pending} className={btnGhost} onClick={() => save(resolveContent(def, undefined))}>Khôi phục nội dung gốc</button>
      </div>
      <p role="status" className="text-sm">{pending ? "Đang dựng bản thử…" : message}</p>
    </section>
    <h2 className="mb-4 mt-10 text-xl font-semibold">Nội dung đã lưu — hiển thị bằng component website</h2>
    {previewUrl && <Link href={previewUrl} target="_blank" prefetch={false} className="mb-4 inline-block text-sm underline">Mở khối ở tab riêng</Link>}
    <div key={key} data-testid="home-preview" className="border border-charcoal/10">{previewUrl ? <iframe key={previewUrl} id="home-preview-frame" title="Khối Trang chủ đã lưu" src={previewUrl} className="h-[1100px] w-full border-0" /> : <p className="p-5 text-sm text-black/50">Bấm Lưu thay đổi để xem khối này.</p>}</div>
  </main>;
}
