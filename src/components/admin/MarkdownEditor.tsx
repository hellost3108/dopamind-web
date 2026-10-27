"use client";

import { RichTextEditor } from "@/components/admin/RichTextEditor";

/** API cũ, engine soạn thảo dùng chung với toàn admin. */
export function MarkdownEditor({value,onChange}:{value:string;onChange:(value:string)=>void}) {
  return <RichTextEditor id="article-content" label="Nội dung chi tiết" mode="block" rows={18} maxLength={50000} value={value} onChange={onChange} legacyMarkdown />;
}
