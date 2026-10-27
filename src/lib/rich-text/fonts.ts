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
  { family: "Libre Caslon Display", kind: "serif" },
] as const;

export const FONT_SIZES = [10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72] as const;

export const EDITOR_FONTS = [
  { id: "libre-caslon-400", label: "Libre Caslon Display", family: "Libre Caslon Display", weight: 400, fallback: '"Libre Caslon Display", Georgia, "Times New Roman", serif' },
  { id: "montserrat-800", label: "Montserrat ExtraBold", family: "Montserrat", weight: 800, fallback: '"Montserrat", Arial, sans-serif' },
  { id: "be-vietnam-400", label: "Be Vietnam Pro Regular", family: "Be Vietnam Pro", weight: 400, fallback: '"Be Vietnam Pro", Arial, sans-serif' },
  { id: "be-vietnam-500", label: "Be Vietnam Pro Medium", family: "Be Vietnam Pro", weight: 500, fallback: '"Be Vietnam Pro", Arial, sans-serif' },
] as const;

// Giữ whitelist cũ để nội dung đã lưu tiếp tục hiển thị đúng.
export function fontStylesheet(family: string, weight?: number): string | null {
  if (!RICH_TEXT_FONTS.some(font => font.family === family)) return null;
  const weights = weight ? String(weight) : family === "Libre Caslon Display" ? "400" : "400;700";
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replaceAll("%20", "+")}:wght@${weights}&display=swap&subset=latin,vietnamese`;
}

export function loadRichTextFonts(families: string[]) {
  for (const request of families) {
    const [family, weight] = request.split("::");
    const href = fontStylesheet(family, weight ? Number(weight) : undefined);
    if (!href || document.querySelector(`link[href="${href}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = href; link.dataset.richTextFont = request;
    document.head.appendChild(link);
  }
}
