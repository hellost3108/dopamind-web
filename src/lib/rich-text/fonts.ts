/** Chỉ tải family được dùng trong nội dung, không tải cả danh sách của menu. */
export const RICH_TEXT_FONTS = [
  { family: "Geist", kind: "sans-serif" },
  { family: "Geist Mono", kind: "monospace" },
  { family: "Fraunces", kind: "serif" },
  { family: "Be Vietnam Pro", kind: "sans-serif" },
  { family: "Noto Serif Display", kind: "serif" },
  { family: "Noto Sans", kind: "sans-serif" },
  { family: "Noto Serif", kind: "serif" },
  { family: "Roboto", kind: "sans-serif" },
  { family: "Open Sans", kind: "sans-serif" },
  { family: "Montserrat", kind: "sans-serif" },
  { family: "Nunito", kind: "sans-serif" },
  { family: "Nunito Sans", kind: "sans-serif" },
  { family: "Source Sans 3", kind: "sans-serif" },
  { family: "Source Serif 4", kind: "serif" },
  { family: "Merriweather", kind: "serif" },
  { family: "Lora", kind: "serif" },
  { family: "Playfair Display", kind: "serif" },
  { family: "Literata", kind: "serif" },
  { family: "Crimson Pro", kind: "serif" },
  { family: "Barlow", kind: "sans-serif" },
] as const;

export const FONT_SIZES = [10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72] as const;

export function fontStylesheet(family: string): string | null {
  if (!RICH_TEXT_FONTS.some((font) => font.family === family)) return null;
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replaceAll("%20", "+")}:wght@400;700&display=swap&subset=vietnamese`;
}

export function loadRichTextFonts(families: string[]) {
  for (const family of families) {
    const href = fontStylesheet(family);
    if (!href || document.querySelector(`link[data-rich-text-font="${family}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.richTextFont = family;
    document.head.appendChild(link);
  }
}
