import { countCharacters, isFormattedText, MAX_RICH_TEXT_BYTES, normalizeRichText, readRichText, type RichTextMode } from "./content";

type EntityField = { mode: RichTextMode; max: number; min?: number; label: string };
export const ENTITY_TEXT_FIELDS: Record<string, Record<string, EntityField>> = {
  article: {
    title: { mode: "inline", max: 200, min: 3, label: "Tiêu đề" },
    category: { mode: "inline", max: 80, label: "Chủ đề" },
    excerpt: { mode: "block", max: 600, label: "Mô tả ngắn" },
    author: { mode: "inline", max: 100, label: "Tác giả" },
    content_markdown: { mode: "block", max: 50000, label: "Nội dung chi tiết" },
  },
  product: {
    name_vi: { mode: "inline", max: 200, min: 2, label: "Tên sản phẩm" },
    short_description_vi: { mode: "inline", max: 400, label: "Mô tả ngắn" },
    description_vi: { mode: "block", max: 8000, label: "Mô tả chi tiết" },
  },
  variant: { name_vi: { mode: "inline", max: 120, min: 1, label: "Tên biến thể" } },
  category: {
    name_vi: { mode: "inline", max: 140, min: 2, label: "Tên danh mục" },
    short_name_vi: { mode: "inline", max: 80, label: "Tên ngắn trên bộ lọc" },
    description_vi: { mode: "block", max: 1200, label: "Mô tả" },
  },
};

/** Chữ thuần vẫn ở cột cũ: slug, tìm kiếm và SQL tạo đơn không đổi. */
export function prepareEntityText(kind: string, input: Record<string, unknown>) {
  const fields = ENTITY_TEXT_FIELDS[kind];
  if (!fields) return { ok: false as const, error: "Loại nội dung không hợp lệ." };
  const values: Record<string, string> = {};
  const rich_text: Record<string, string> = {};
  for (const [key, field] of Object.entries(fields)) {
    const raw = typeof input[key] === "string" ? input[key].trim() : "";
    if (raw.length > MAX_RICH_TEXT_BYTES) return { ok: false as const, error: `${field.label} có quá nhiều mã định dạng.` };
    const value = normalizeRichText(raw, field.mode);
    const plain = readRichText(value, field.mode).text.trim();
    const count = countCharacters(plain);
    if (field.min && count < field.min) return { ok: false as const, error: `Vui lòng nhập ${field.label.toLowerCase()} (ít nhất ${field.min} ký tự).` };
    if (count > field.max) return { ok: false as const, error: `${field.label} dài tối đa ${field.max} ký tự.` };
    if (field.mode === "inline" && /[\r\n]/.test(plain)) return { ok: false as const, error: `${field.label} chỉ được nhập một dòng.` };
    values[key] = plain;
    if (isFormattedText(value)) rich_text[key] = value;
  }
  return { ok: true as const, values, rich_text };
}

export function formattedField(row: object, key: string, mode: RichTextMode = "inline"): string | undefined {
  const record = row as Record<string, unknown>;
  const metadata = record.rich_text;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return;
  const raw = (metadata as Record<string, unknown>)[key];
  if (typeof raw !== "string" || raw.length > MAX_RICH_TEXT_BYTES || !isFormattedText(raw)) return;
  const value = normalizeRichText(raw, mode);
  // Một công cụ khác sửa chữ thuần thì không hiển thị lại định dạng của câu cũ.
  if (readRichText(value, mode).text.trim() !== String(record[key] ?? "").trim()) return;
  return value;
}

export function editableEntity<T extends object>(kind: string, row: T): T {
  const copy = { ...row } as Record<string, unknown>;
  for (const [key, field] of Object.entries(ENTITY_TEXT_FIELDS[kind] ?? {})) {
    const value = formattedField(row, key, field.mode);
    if (value !== undefined) copy[key] = value;
  }
  return copy as T;
}

export function richSchemaMissing(error: { code?: string; message?: string }) {
  return ["42703", "PGRST204"].includes(error.code ?? "") && /rich_text/i.test(error.message ?? "");
}
export const RICH_SCHEMA_MESSAGE = "Chưa có cột lưu định dạng. Hãy chạy migration 20261027090000_rich_text_fields.sql trước khi lưu; dữ liệu cũ chưa bị thay đổi.";
