import sanitizeHtml from "sanitize-html";
import { decodeHTML } from "entities";
import { EDITOR_FONTS, FONT_SIZES, RICH_TEXT_FONTS } from "./fonts";

export type RichTextMode = "inline" | "block";
const FORMAT = "dopamind-richtext-v1";
export const MAX_RICH_TEXT_BYTES = 200_000;
export function countCharacters(text: string): number {
  return Array.from(new Intl.Segmenter("vi", { granularity: "grapheme" }).segment(text)).length;
}
const INLINE_TAGS = ["strong", "em", "span"];
const BLOCK_TAGS = ["p", "br", "ul", "ol", "li", "u", "a", "h2", "h3", "blockquote"];
const BLOCK_BOUNDARY = /<\/(?:p|div|li|h[1-6]|blockquote)>|<br\s*\/?>/gi;
const FONT_PATTERN = new RegExp(`^(?:["']?(?:${RICH_TEXT_FONTS.map((font) => font.family).join("|")})["']?|${EDITOR_FONTS.map(font => font.fallback.replaceAll('"', '["\']?').replace(/,\s*/g, ',\\s*')).join("|")})$`);
const SIZE_PATTERN = new RegExp(`^(?:${FONT_SIZES.join("|")})px$`);
const RGB_CHANNEL = "(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)";
const COLOR_PATTERN = new RegExp(`^(?:#[0-9a-f]{3}(?:[0-9a-f]{3})?|rgb\\(\\s*${RGB_CHANNEL}\\s*,\\s*${RGB_CHANNEL}\\s*,\\s*${RGB_CHANNEL}\\s*\\))$`, "i");

export function escapeText(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function storedHtml(value: string): string | null {
  // Có nhãn phiên bản riêng: chữ cũ có <...> không bị hiểu nhầm thành HTML.
  if (!value.startsWith('{"format":')) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed && typeof parsed === "object" && "format" in parsed && parsed.format === FORMAT && "html" in parsed && typeof parsed.html === "string") return parsed.html;
  } catch { /* Nội dung cũ không phải JSON vẫn là chữ thường. */ }
  return null;
}

export function isFormattedText(value: string): boolean {
  return storedHtml(value) !== null;
}

export function sanitizeRichHtml(html: string, mode: RichTextMode): string {
  const source = mode === "inline" ? html.replace(BLOCK_BOUNDARY, " ").replace(/[\r\n]+/g, " ") : html;
  return sanitizeHtml(source, {
    allowedTags: [...INLINE_TAGS, ...(mode === "block" ? BLOCK_TAGS : [])],
    allowedAttributes: { span: ["style"], p: mode === "block" ? ["style"] : [], a: mode === "block" ? ["href", "title"] : [] },
    allowedStyles: {
      span: { "font-family": [FONT_PATTERN], "font-size": [SIZE_PATTERN], "font-weight": [/^(?:400|500|800)$/], color: [COLOR_PATTERN] },
      p: { "text-align": [/^(?:left|center|right)$/] },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      b: "strong",
      i: "em",
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const safe = !/[\s\u0000-\u001f]/.test(href) && (/^(?:https?:\/\/|mailto:|tel:)/i.test(href) || /^\/(?!\/)/.test(href) || href.startsWith("#"));
        return { tagName, attribs: { ...attribs, href: safe ? href : "" } };
      },
    },
  }).trim();
}

export function htmlText(html: string, mode: RichTextMode): string {
  if (mode === "inline") return decodeHTML(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })).trim();
  let text = "";
  sanitizeHtml(html, {
    allowedTags: [], allowedAttributes: {},
    onOpenTag: (tag) => {
      if (tag === "br") text += "\n";
      else if (["p", "li", "h2", "h3", "blockquote"].includes(tag) && text && !text.endsWith("\n")) text += "\n";
    },
    textFilter: (value) => { text += decodeHTML(value); return value; },
    onCloseTag: (tag) => {
      if (["p", "h2", "h3"].includes(tag) || (["li", "blockquote"].includes(tag) && !text.endsWith("\n"))) text += "\n";
    },
  });
  return text.trim();
}

export function serializeRichText(html: string, mode: RichTextMode): string {
  const clean = sanitizeRichHtml(html, mode);
  if (!htmlText(clean, mode)) return "";
  return JSON.stringify({ format: FORMAT, html: clean });
}

export function readRichText(value: string, mode: RichTextMode) {
  const rawHtml = storedHtml(value);
  const formatted = rawHtml !== null;
  const html = formatted ? sanitizeRichHtml(rawHtml, mode) : escapeText(value);
  const text = formatted ? htmlText(html, mode) : value;
  const fonts: string[] = [];
  if (formatted) sanitizeHtml(html, {allowedTags:["span"],allowedAttributes:{span:["style"]},onOpenTag:(tag,attrs)=>{
    if(tag!=="span") return;
    const requestedFamily = (attrs.style?.match(/font-family:([^;]+)/)?.[1] ?? "").split(",")[0].trim().replace(/^["']|["']$/g, "");
    const family=RICH_TEXT_FONTS.find(font=>font.family===requestedFamily)?.family;
    if(!family) return;
    const weight=attrs.style?.match(/font-weight:\s*(400|500|800)(?:;|$)/)?.[1];
    const request=family+(weight?"::"+weight:"");
    if(!fonts.includes(request)) fonts.push(request);
  }});

  return { html, text, fonts, formatted };
}

export function normalizeRichText(value: string, mode: RichTextMode): string {
  const html = storedHtml(value);
  return html === null ? value : serializeRichText(html, mode);
}

/** HTML phrasing hợp lệ bên trong h2/p/span; chỉ đổi cấu trúc đã lọc. */
export function phrasingRichHtml(html: string): string {
  return sanitizeHtml(sanitizeRichHtml(html, "block"), {
    allowedTags: [...INLINE_TAGS, "br", "u", "a"],
    allowedAttributes: { span: ["style", "role"], a: ["href", "title"] },
    allowedStyles: { span: {
      "font-family": [FONT_PATTERN], "font-size": [SIZE_PATTERN], "font-weight": [/^(?:400|500|800)$/], color: [COLOR_PATTERN],
      "text-align": [/^(?:left|center|right)$/], display: [/^(?:block|list-item)$/],
      "list-style-type": [/^(?:disc|decimal)$/], "padding-left": [/^1\.25em$/],
    } },
    allowedSchemes: ["http", "https", "mailto", "tel"], allowProtocolRelative: false,
    transformTags: {
      p: (_tag, attrs) => ({ tagName: "span", attribs: { style: `display:block;${attrs.style ?? ""}` } }),
      ul: () => ({ tagName: "span", attribs: { role: "list", style: "display:block;list-style-type:disc;padding-left:1.25em" } }),
      ol: () => ({ tagName: "span", attribs: { role: "list", style: "display:block;list-style-type:decimal;padding-left:1.25em" } }),
      li: () => ({ tagName: "span", attribs: { role: "listitem", style: "display:list-item" } }),
      h2: () => ({ tagName: "span", attribs: { style: "display:block" } }),
      h3: () => ({ tagName: "span", attribs: { style: "display:block" } }),
      blockquote: () => ({ tagName: "span", attribs: { style: "display:block" } }),
    },
  });
}

/** Tách dấu trong phần chữ, không tách JSON, thuộc tính link hoặc làm mất dấu định dạng. */
export function splitRichText(value: string, separator: string, mode: RichTextMode = "block"): string[] {
  if (!separator) return [value];
  const content = readRichText(value, mode);
  if (!content.formatted) return value.split(separator).map((part) => part.trim()).filter(Boolean);
  const parts: string[] = [];
  const stack: { tag: string; opening: string }[] = [];
  let current = "";
  const finish = () => {
    const segment = serializeRichText(current + [...stack].reverse().map((entry) => `</${entry.tag}>`).join(""), mode);
    if (segment) parts.push(segment);
    current = stack.map((entry) => entry.opening).join("");
  };
  for (const token of content.html.match(/<[^>]*>|[^<]+/g) ?? []) {
    if (token.startsWith("<")) {
      const tag = token.match(/^<(\/?)([a-z0-9]+)/i);
      if (!tag) continue;
      if (separator === "\n" && tag[2] === "br") { finish(); continue; }
      if (separator === "\n" && !tag[1] && ["p", "h2", "h3"].includes(tag[2]) && htmlText(current, mode)) finish();
      current += token;
      if (tag[1]) stack.pop();
      else if (tag[2] !== "br") stack.push({ tag: tag[2], opening: token });
    } else {
      const chunks = decodeHTML(token).split(separator);
      chunks.forEach((part, index) => {
        const trimmed = (index ? part.trimStart() : part);
        current += escapeText(index < chunks.length - 1 ? trimmed.trimEnd() : trimmed);
        if (index < chunks.length - 1) finish();
      });
    }
  }
  finish();
  return parts;
}

/** Thay biến trong chữ đã lọc, không đụng đến URL hay thuộc tính HTML. */
export function replaceRichText(value: string, token: string, replacement: string, mode: RichTextMode = "block"): string {
  const content = readRichText(value, mode);
  if (!content.formatted) return value.replaceAll(token, replacement);
  return serializeRichText((content.html.match(/<[^>]*>|[^<]+/g) ?? []).map((part) => part.startsWith("<") ? part : escapeText(decodeHTML(part).replaceAll(token, replacement))).join(""), mode);
}
