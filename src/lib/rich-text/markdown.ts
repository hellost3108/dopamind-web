import { escapeText, sanitizeRichHtml } from "./content";

function inline(value: string): string {
  return value.split(/(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g).map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) return `<strong>${escapeText(part.slice(2,-2))}</strong>`;
    if (part.startsWith("_") && part.endsWith("_")) return `<em>${escapeText(part.slice(1,-1))}</em>`;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) return `<a href="${escapeText(link[2])}">${escapeText(link[1])}</a>`;
    return escapeText(part);
  }).join("");
}

/** Chỉ chuyển để mở bài cũ trong editor, không tự ghi lại giá trị gốc. */
export function markdownEditorHtml(value: string): string {
  const out: string[] = [];
  let bullets: string[] = [];
  const flush = () => { if (bullets.length) { out.push(`<ul>${bullets.map((line)=>`<li><p>${inline(line)}</p></li>`).join("")}</ul>`); bullets = []; } };
  for (const raw of value.replaceAll("\r\n","\n").split("\n")) {
    const line = raw.trim();
    if (line.startsWith("- ")) { bullets.push(line.slice(2)); continue; }
    flush();
    if (!line) continue;
    if (line.startsWith("### ")) out.push(`<h3>${inline(line.slice(4))}</h3>`);
    else if (line.startsWith("## ")) out.push(`<h2>${inline(line.slice(3))}</h2>`);
    else if (line.startsWith("> ")) out.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`);
    else out.push(`<p>${inline(line)}</p>`);
  }
  flush();
  return sanitizeRichHtml(out.join(""),"block") || "<p></p>";
}
