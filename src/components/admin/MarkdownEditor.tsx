"use client";

import { useRef } from "react";
import { inputCls } from "@/components/admin/ui";

type Tool = { label: string; before: string; after?: string; placeholder: string };

const TOOLS: Tool[] = [
  { label: "Tiêu đề", before: "## ", placeholder: "Tiêu đề phần" },
  { label: "Đậm", before: "**", after: "**", placeholder: "nội dung in đậm" },
  { label: "Nghiêng", before: "_", after: "_", placeholder: "nội dung in nghiêng" },
  { label: "Trích dẫn", before: "> ", placeholder: "câu trích dẫn" },
  { label: "Danh sách", before: "- ", placeholder: "một ý trong danh sách" },
  { label: "Liên kết", before: "[", after: "](https://)", placeholder: "tên liên kết" },
];

export function MarkdownEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function insert(tool: Tool) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || tool.placeholder;
    const next = `${value.slice(0, start)}${tool.before}${selected}${tool.after ?? ""}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + tool.before.length + selected.length + (tool.after?.length ?? 0);
      el.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/15 bg-white focus-within:border-[#f52334] focus-within:ring-2 focus-within:ring-[#f52334]/10">
      <div className="flex flex-wrap gap-1 border-b border-black/10 bg-black/[.025] p-2">
        {TOOLS.map((tool) => (
          <button key={tool.label} type="button" onClick={() => insert(tool)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-black/60 hover:bg-white hover:text-[#f52334]">
            {tool.label}
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        rows={18}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Viết nội dung bài... Dùng thanh công cụ để tạo tiêu đề, chữ đậm, trích dẫn và danh sách."
        className={`${inputCls} !rounded-none !border-0 !ring-0`}
      />
      <p className="border-t border-black/10 px-4 py-2 text-[11px] text-black/40">Nội dung được lưu dưới dạng văn bản định dạng an toàn; không chạy mã HTML.</p>
    </div>
  );
}

