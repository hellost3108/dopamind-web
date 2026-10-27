"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { Extension, Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import { countCharacters, readRichText, sanitizeRichHtml, serializeRichText, type RichTextMode } from "@/lib/rich-text/content";
import { FONT_SIZES, loadRichTextFonts, EDITOR_FONTS } from "@/lib/rich-text/fonts";
import { inputCls } from "@/components/admin/ui";
import styles from "./RichTextEditor.module.css";
import { markdownEditorHtml } from "@/lib/rich-text/markdown";

const FontWeight = Extension.create({
  name: "fontWeight",
  addGlobalAttributes() { return [{types:["textStyle"],attributes:{fontWeight:{default:null,parseHTML:element=>element.style.fontWeight||null,renderHTML:attrs=>attrs.fontWeight?{style:`font-weight:${attrs.fontWeight}`}:{}}}}]; },
});

const OneLine = Extension.create({
  name: "oneLine",
  addKeyboardShortcuts() {
    return { Enter: () => true, "Shift-Enter": () => true };
  },
});
const SingleDocument = Node.create({ name: "doc", topNode: true, content: "paragraph" });
const VisibleCharacterCount = CharacterCount.extend({
  onBeforeCreate(event) {
    this.parent?.(event);
    // Một dấu xuống dòng giữa các đoạn, không đếm thêm cấu trúc list/li/p.
    this.storage.characters = (options) => {
      const node = options?.node ?? this.editor.state.doc;
      return countCharacters(node.textBetween(0, node.content.size, "\n", "\n").trim());
    };
  },
});

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  mode?: RichTextMode;
  maxLength?: number;
  placeholder?: string;
  label?: string;
  rows?: number;
  legacyMarkdown?: boolean;
};

/** Một component cho cả hai bộ công cụ, dùng ở những ô CMS đã được duyệt. */
export function RichTextEditor({ id, value, onChange, mode = "block", maxLength, placeholder, label, rows = 4, legacyMarkdown = false }: Props) {
  const inline = mode === "inline";
  const root = useRef<HTMLDivElement>(null);
  const lastValue = useRef(value);
  const [active, setActive] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const initial = readRichText(value, mode);
  const documentHtml = (raw: string) => {
    const content = readRichText(raw, mode);
    if (inline) return `<p>${content.html}</p>`;
    if (content.formatted) return content.html;
    return legacyMarkdown ? markdownEditorHtml(raw) : `<p>${content.html.replaceAll("\n", "<br>")}</p>`;
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false, blockquote: false, code: false, codeBlock: false,
        horizontalRule: false, strike: false, trailingNode: false,
        ...(legacyMarkdown ? { heading: { levels: [2,3] as (2|3)[] }, blockquote: {} } : {}),
        ...(inline ? { document: false, hardBreak: false, bulletList: false, orderedList: false, listItem: false, listKeymap: false, underline: false, link: false } : { link: { openOnClick: false, autolink: false, defaultProtocol: "https" } }),
      }),
      TextStyle, FontSize, FontFamily, FontWeight, Color,
      ...(inline ? [OneLine, SingleDocument] : [TextAlign.configure({ types: ["paragraph"], alignments: ["left", "center", "right"] })]),
      VisibleCharacterCount.configure({ limit: maxLength, autoTrim: false, textCounter: countCharacters }),
    ],
    content: documentHtml(value),
    editorProps: {
      attributes: { id, role: "textbox", "aria-multiline": String(!inline), ...(label ? {"aria-label":label} : {"aria-labelledby":`${id}-label`}), "aria-describedby": `${id}-count`, "data-placeholder": placeholder ?? "", ...(!inline ? {style:`min-height:${rows * 20 + 26}px`} : {}), class: `${inputCls} ${styles.content} ${inline ? styles.single : styles.multiline}` },
      transformPastedHTML: (html) => sanitizeRichHtml(html, mode),
      transformPastedText: (text) => inline ? text.replace(/[\r\n]+/g, " ") : text,
      // Chặn cả xuống dòng do bàn phím điện thoại/IME gửi trực tiếp.
      handleDOMEvents: {
        beforeinput: (_view, event) => {
          if (inline && event instanceof InputEvent && ["insertParagraph", "insertLineBreak"].includes(event.inputType)) {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
    },
    onUpdate: ({ editor: current }) => {
      const next = serializeRichText(current.getHTML(), mode);
      lastValue.current = next;
      loadRichTextFonts(readRichText(next, mode).fonts);
      onChange(next);
    },
  }, [mode, maxLength, id, legacyMarkdown, rows]);

  const selection = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      selected: current ? !current.state.selection.empty : false,
      bold: current?.isActive("bold") ?? false,
      italic: current?.isActive("italic") ?? false,
      underline: current?.isActive("underline") ?? false,
      font: EDITOR_FONTS.find(font => font.fallback === current?.getAttributes("textStyle").fontFamily && String(font.weight) === String(current?.getAttributes("textStyle").fontWeight))?.id ?? "",
      size: String(current?.getAttributes("textStyle").fontSize ?? ""),
      color: String(current?.getAttributes("textStyle").color ?? "#191716"),
      count: current ? current.storage.characterCount.characters() : countCharacters(initial.text),
    }),
  });

  useEffect(() => {
    if (!editor || value === lastValue.current) return;
    const next = readRichText(value, mode);
    editor.commands.setContent(inline ? `<p>${next.html}</p>` : next.formatted ? next.html : legacyMarkdown ? markdownEditorHtml(value) : `<p>${next.html.replaceAll("\n", "<br>")}</p>`, { emitUpdate: false });
    lastValue.current = value;
  }, [editor, value, mode, inline, legacyMarkdown]);

  useEffect(() => { loadRichTextFonts(readRichText(value, mode).fonts); }, [value, mode]);

  useEffect(() => {
    if (!active) return;
    const measure = () => {
      const element = root.current;
      if (element) element.style.setProperty("--rich-toolbar-space", `${Math.max(48, element.getBoundingClientRect().top - 12)}px`);
    };
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  const canFormat = !!selection?.selected;
  const toolClass = "rounded-lg border border-black/10 bg-white px-2.5 py-2 text-xs text-black/70 hover:border-[#f52334] disabled:opacity-40";

  return (
    <div
      ref={root}
      className={styles.root}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setActive(false);
          setLinkOpen(false);
        }
      }}
    >
      {active && editor && (
        <div className={styles.toolbar} role="toolbar" aria-label="Định dạng văn bản" onMouseDown={(event) => { if (event.target instanceof Element && event.target.closest("button")) event.preventDefault(); }}>
          <select aria-label="Font chữ" className={toolClass} disabled={!canFormat} value={selection?.font ?? ""} onFocus={() => loadRichTextFonts(EDITOR_FONTS.map(f => f.family + "::" + f.weight))} onChange={(event) => {
            const font = EDITOR_FONTS.find(f => f.id === event.target.value);
            if (font) { loadRichTextFonts([font.family + "::" + font.weight]); editor.chain().focus().setMark("textStyle", {fontFamily:font.fallback,fontWeight:String(font.weight)}).run(); }
            else editor.chain().focus().setMark("textStyle", {fontFamily:null,fontWeight:null}).removeEmptyTextStyle().run();
          }}>
            <option value="">Font hiện tại</option>
            {EDITOR_FONTS.map(font => <option key={font.id} value={font.id} style={{fontFamily:font.fallback,fontWeight:font.weight}}>{font.label}</option>)}
          </select>
          <select aria-label="Cỡ chữ" className={toolClass} disabled={!canFormat} value={selection?.size ?? ""} onChange={(event) => { if (event.target.value) editor.chain().focus().setFontSize(event.target.value).run(); else editor.chain().focus().unsetFontSize().run(); }}>
            <option value="">Cỡ hiện tại</option>
            {FONT_SIZES.map((size) => <option key={size} value={`${size}px`}>{size}</option>)}
          </select>
          <button type="button" aria-label="In đậm" aria-pressed={selection?.bold ?? false} className={toolClass} disabled={!canFormat} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
          <button type="button" aria-label="In nghiêng" aria-pressed={selection?.italic ?? false} className={toolClass} disabled={!canFormat} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
          {!inline && <button type="button" aria-label="Gạch chân" aria-pressed={selection?.underline ?? false} className={toolClass} disabled={!canFormat} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>}
          <label className={`${toolClass} flex items-center gap-1.5`}>
            Màu chữ
            <input type="color" aria-label="Màu chữ" className="h-5 w-6 cursor-pointer" disabled={!canFormat} value={/^#[0-9a-f]{6}$/i.test(selection?.color ?? "") ? selection!.color : "#191716"} onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} />
          </label>
          {!inline && <>
            {(["left", "center", "right"] as const).map((align, index) => <button key={align} type="button" className={toolClass} disabled={!canFormat} aria-label={`Căn ${["trái", "giữa", "phải"][index]}`} onClick={() => editor.chain().focus().setTextAlign(align).run()}>{["Trái", "Giữa", "Phải"][index]}</button>)}
            <button type="button" className={toolClass} disabled={!canFormat} onClick={() => editor.chain().focus().toggleBulletList().run()}>• Danh sách</button>
            <button type="button" className={toolClass} disabled={!canFormat} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. Danh sách</button>
            <button type="button" className={toolClass} disabled={!canFormat} onClick={() => { setLink(String(editor.getAttributes("link").href ?? "")); setLinkError(""); setLinkOpen(!linkOpen); }}>Chèn link</button>
          </>}
          <button type="button" className={toolClass} disabled={!canFormat} onClick={() => { if (inline) editor.chain().focus().unsetAllMarks().run(); else editor.chain().focus().unsetAllMarks().clearNodes().unsetTextAlign().run(); }}>Xóa định dạng</button>
          <span className="text-[11px] text-black/45">Bôi đen chữ để định dạng</span>
          {linkOpen && !inline && <div className="flex w-full flex-wrap items-center gap-2">
            <input aria-label="Đường dẫn liên kết" className={`${inputCls} min-w-0 flex-1 !py-2`} value={link} onChange={(event) => setLink(event.target.value)} placeholder="https:// hoặc /duong-dan" />
            <button type="button" className={toolClass} onClick={() => {
              const href = link.trim();
              if (href && (!/^(?:https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href) || /[\s\u0000-\u001f]/.test(href))) { setLinkError("Đường dẫn chưa hợp lệ."); return; }
              if (href) editor.chain().focus().setLink({ href }).run(); else editor.chain().focus().unsetLink().run();
              setLinkOpen(false);
            }}>Áp dụng</button>
            {linkError && <span role="alert" className="text-xs text-red-600">{linkError}</span>}
          </div>}
        </div>
      )}
      <EditorContent editor={editor} />
      {!editor && <div className={`${inputCls} ${styles.content} ${inline ? styles.single : styles.multiline}`}>{initial.text}</div>}
      <p id={`${id}-count`} className="mt-1 text-right text-[11px] text-charcoal/40">{selection?.count ?? countCharacters(initial.text)}{maxLength ? `/${maxLength}` : " ký tự"}</p>
    </div>
  );
}

/** Cầu nối FormData cho form sẵn có, vẫn dùng một engine RichTextEditor. */
export function RichTextField({ name, defaultValue = "", id = name, mode = "inline", label, maxLength, rows, placeholder }: {
  name: string; defaultValue?: string; id?: string; mode?: RichTextMode; label: string; maxLength: number; rows?: number; placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  return <><input type="hidden" name={name} value={value} /><RichTextEditor id={id} label={label} mode={mode} value={value} onChange={setValue} maxLength={maxLength} rows={rows} placeholder={placeholder} /></>;
}
