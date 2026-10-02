"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { resetSectionAction, saveSectionAction } from "@/app/admin/noi-dung/actions";
import { ImageInput } from "@/components/admin/cms/ImageInput";
import { resolveContent } from "@/lib/cms/fields";
import type { Field, ListField, ListItem, SectionContent, SectionDef, ValueField } from "@/lib/cms/types";
import { btnGhost, btnPrimary, btnSmall, card, inputCls, labelCls } from "@/components/admin/ui";

type VersionOption = { id: number; savedLabel: string; content: unknown };
type Message = { tone: "ok" | "error"; text: string } | null;

const blankItem = (field: ListField): ListItem => {
  const item: ListItem = {};
  for (const sub of field.fields) item[sub.key] = sub.type === "number" ? 0 : "";
  return item;
};

function ValueInput({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: ValueField;
  value: string | number | undefined;
  onChange: (next: string | number) => void;
}) {
  if (field.type === "image") {
    return <ImageInput id={id} value={typeof value === "string" ? value : ""} onChange={onChange} />;
  }

  if (field.type === "number") {
    return (
      <input
        id={id}
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        value={typeof value === "number" && value !== 0 ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        className={inputCls}
      />
    );
  }

  const text = typeof value === "string" ? value : "";

  if (field.type === "textarea") {
    return (
      <>
        <textarea
          id={id}
          rows={4}
          value={text}
          maxLength={field.max}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputCls}
        />
        {field.max && <p className="mt-1 text-right text-[11px] text-charcoal/40">{text.length}/{field.max}</p>}
      </>
    );
  }

  return (
    <>
      <input
        id={id}
        type={field.type === "date" ? "date" : "text"}
        value={text}
        maxLength={field.type === "date" ? undefined : field.max}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={inputCls}
      />
      {field.max && field.type === "text" && (
        <p className="mt-1 text-right text-[11px] text-charcoal/40">{text.length}/{field.max}</p>
      )}
    </>
  );
}

function FieldShell({ id, field, children }: { id: string; field: Field; children: React.ReactNode }) {
  const required = field.type !== "list" && field.required;
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {field.label}
        {required && " *"}
      </label>
      {children}
      {field.help && <p className="mt-1 text-[11px] leading-snug text-charcoal/45">{field.help}</p>}
    </div>
  );
}

export function SectionEditor({
  def,
  initial,
  versions,
}: {
  def: SectionDef;
  initial: SectionContent;
  versions: VersionOption[];
}) {
  const [saved, setSaved] = useState<SectionContent>(initial);
  const [values, setValues] = useState<SectionContent>(initial);
  const [message, setMessage] = useState<Message>(null);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(saved), [values, saved]);

  // Cảnh báo khi đóng tab/chuyển trang lúc còn thay đổi chưa lưu.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const setField = (key: string, next: string | number) => {
    setMessage(null);
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const getItems = (key: string): ListItem[] => {
    const v = values[key];
    return Array.isArray(v) ? v : [];
  };

  const setItems = (key: string, next: ListItem[]) => {
    setMessage(null);
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const updateItem = (key: string, index: number, subKey: string, next: string | number) =>
    setItems(
      key,
      getItems(key).map((item, i) => (i === index ? { ...item, [subKey]: next } : item)),
    );

  const moveItem = (key: string, index: number, delta: -1 | 1) => {
    const items = [...getItems(key)];
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    setItems(key, items);
  };

  const duplicateItem = (field: ListField, index: number) => {
    const items = getItems(field.key);
    if (field.max && items.length >= field.max) return;
    const copy = [...items];
    copy.splice(index + 1, 0, { ...items[index] });
    setItems(field.key, copy);
  };

  const removeItem = (field: ListField, index: number) => {
    const items = getItems(field.key);
    if (field.min && items.length <= field.min) return;
    if (!confirm(`Xóa ${field.itemLabel.toLowerCase()} ${index + 1}?`)) return;
    setItems(field.key, items.filter((_, i) => i !== index));
  };

  const addItem = (field: ListField) => {
    const items = getItems(field.key);
    if (field.max && items.length >= field.max) return;
    setItems(field.key, [...items, blankItem(field)]);
  };

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveSectionAction(def.key, values);
      if (result.ok) {
        setValues(result.content);
        setSaved(result.content);
        setMessage({ tone: "ok", text: result.message });
      } else {
        setMessage({ tone: "error", text: result.error });
      }
    });
  };

  const discard = () => {
    setValues(saved);
    setMessage(null);
  };

  const resetToDefault = () => {
    if (!confirm("Khôi phục nội dung gốc của khối này?\n\nNhững gì bạn đã chỉnh sẽ bị bỏ (vẫn còn trong lịch sử phiên bản).")) return;
    setMessage(null);
    startTransition(async () => {
      const result = await resetSectionAction(def.key);
      if (result.ok) {
        const base = resolveContent(def, undefined);
        setValues(base);
        setSaved(base);
        setMessage({ tone: "ok", text: result.message });
      } else {
        setMessage({ tone: "error", text: result.error });
      }
    });
  };

  const loadVersion = (v: VersionOption) => {
    setValues(resolveContent(def, v.content));
    setMessage({ tone: "ok", text: `Đã nạp phiên bản lúc ${v.savedLabel}. Bấm “Lưu thay đổi” để áp dụng lên website.` });
  };

  return (
    <div className="space-y-5">
      <section className={card}>
        <div className="grid gap-5">
          {def.fields.map((field) => {
            if (field.type !== "list") {
              const id = `f-${field.key}`;
              return (
                <FieldShell key={field.key} id={id} field={field}>
                  <ValueInput id={id} field={field} value={values[field.key] as string | number | undefined} onChange={(v) => setField(field.key, v)} />
                </FieldShell>
              );
            }

            const items = getItems(field.key);
            return (
              <div key={field.key}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={labelCls}>
                    {field.label} <span className="font-normal text-charcoal/45">({items.length})</span>
                  </p>
                  <button
                    type="button"
                    className={btnSmall}
                    onClick={() => addItem(field)}
                    disabled={!!field.max && items.length >= field.max}
                  >
                    + Thêm {field.itemLabel.toLowerCase()}
                  </button>
                </div>
                {field.help && <p className="mt-1 text-[11px] text-charcoal/45">{field.help}</p>}

                {items.length === 0 && (
                  <p className="mt-3 rounded-xl border border-dashed border-charcoal/20 p-4 text-center text-sm text-charcoal/50">
                    Chưa có mục nào. Bấm “Thêm {field.itemLabel.toLowerCase()}”.
                  </p>
                )}

                <ol className="mt-3 space-y-3">
                  {items.map((item, index) => {
                    const titleRaw = field.itemTitleKey ? item[field.itemTitleKey] : "";
                    const title = typeof titleRaw === "string" && titleRaw.trim() ? titleRaw : "";
                    return (
                      <li key={index} className="rounded-2xl border border-charcoal/10 bg-cloud-milk/60 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="min-w-0 truncate text-sm font-medium text-charcoal">
                            {field.itemLabel} {index + 1}
                            {title && <span className="font-normal text-charcoal/55"> · {title}</span>}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            <button type="button" className={btnSmall} disabled={index === 0} onClick={() => moveItem(field.key, index, -1)} aria-label="Chuyển lên">
                              ↑
                            </button>
                            <button type="button" className={btnSmall} disabled={index === items.length - 1} onClick={() => moveItem(field.key, index, 1)} aria-label="Chuyển xuống">
                              ↓
                            </button>
                            <button type="button" className={btnSmall} disabled={!!field.max && items.length >= field.max} onClick={() => duplicateItem(field, index)}>
                              Nhân bản
                            </button>
                            <button type="button" className={`${btnSmall} !border-red-200 !text-red-600 hover:!bg-red-50`} onClick={() => removeItem(field, index)}>
                              Xóa
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          {field.fields.map((sub) => {
                            const id = `f-${field.key}-${index}-${sub.key}`;
                            const wide = sub.type === "textarea" || sub.type === "image";
                            return (
                              <div key={sub.key} className={wide ? "sm:col-span-2" : ""}>
                                <FieldShell id={id} field={sub}>
                                  <ValueInput id={id} field={sub} value={item[sub.key]} onChange={(v) => updateItem(field.key, index, sub.key, v)} />
                                </FieldShell>
                              </div>
                            );
                          })}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      {versions.length > 0 && (
        <details className={card}>
          <summary className="cursor-pointer text-sm font-medium text-charcoal">
            Lịch sử phiên bản ({versions.length})
          </summary>
          <ul className="mt-4 divide-y divide-charcoal/10">
            {versions.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-sm text-charcoal/70">Lưu lúc {v.savedLabel}</span>
                <button type="button" className={btnSmall} onClick={() => loadVersion(v)}>
                  Dùng bản này
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="sticky bottom-3 z-10 rounded-2xl border border-charcoal/10 bg-white/95 p-4 shadow-lg backdrop-blur">
        {message && (
          <p
            role={message.tone === "error" ? "alert" : "status"}
            className={`mb-3 rounded-xl px-4 py-2.5 text-sm ${message.tone === "error" ? "bg-peach/40 text-charcoal" : "bg-mint/60 text-charcoal"}`}
          >
            {message.text}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btnPrimary} disabled={pending || !dirty} onClick={save}>
            {pending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button type="button" className={btnGhost} disabled={pending || !dirty} onClick={discard}>
            Hoàn tác
          </button>
          <button
            type="button"
            onClick={resetToDefault}
            disabled={pending}
            className="ml-auto text-sm text-charcoal/55 underline-offset-4 hover:underline disabled:opacity-50"
          >
            Khôi phục nội dung gốc
          </button>
        </div>
        {dirty && !pending && <p className="mt-2 text-[11px] text-charcoal/50">Bạn có thay đổi chưa lưu.</p>}
      </div>
    </div>
  );
}
