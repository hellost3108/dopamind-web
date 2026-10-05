import type {
  Field,
  ListField,
  ListItem,
  SectionContent,
  SectionDef,
  SectionValue,
  ValueField,
} from "@/lib/cms/types";

/*
 * Chuẩn hoá + kiểm tra nội dung của các khối CMS.
 *  - resolveContent(): dùng khi ĐỌC (website + form admin). Không bao giờ ném lỗi:
 *    thiếu/sai kiểu -> dùng nội dung gốc.
 *  - validateContent(): dùng khi LƯU (server action). Kiểm tra chặt, trả lỗi tiếng Việt.
 */

const DEFAULT_MAX = {
  text: 200,
  textarea: 2000,
  richtext: 12000,
  url: 500,
  image: 500,
  date: 10,
  number: 10,
  boolean: 5,
  select: 100,
} as const;
const MAX_LIST_ITEMS = 100;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Cho phép: đường dẫn nội bộ (/...), #, http(s), mailto, tel. Chặn javascript:, //host, khoảng trắng. */
export function isSafeHref(value: string): boolean {
  if (/[\s\u0000-\u001f]/.test(value)) return false;
  if (value === "#" || value.startsWith("#")) return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  return /^(https?:\/\/|mailto:|tel:)/i.test(value);
}

/** Ảnh: đường dẫn nội bộ (/images/...) hoặc https. */
export function isSafeImage(value: string): boolean {
  if (/[\s\u0000-\u001f]/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  return /^https:\/\//i.test(value);
}

function isRealDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function maxOf(field: ValueField): number {
  return field.max ?? DEFAULT_MAX[field.type];
}

const emptyValue = (field: ValueField): string | number | boolean =>
  field.type === "number" ? 0 : field.type === "boolean" ? false : "";

// ---------------------------------------------------------------------------
// Đọc (không ném lỗi)
// ---------------------------------------------------------------------------

function readValue(
  field: ValueField,
  raw: unknown,
  fallback: string | number | boolean,
): string | number | boolean {
  if (field.type === "boolean") return typeof raw === "boolean" ? raw : fallback;
  if (field.type === "number") {
    const n = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : fallback;
  }
  if (typeof raw !== "string") return fallback;
  const v = raw.trim().slice(0, maxOf(field));
  if (field.type === "url" && v !== "" && !isSafeHref(v)) return fallback;
  if (field.type === "image" && v !== "" && !isSafeImage(v)) return fallback;
  if (field.type === "date" && v !== "" && !isRealDate(v)) return fallback;
  if (field.type === "select" && field.options?.length && !field.options.some((option) => option.value === v)) {
    return fallback;
  }
  return v;
}

function readList(field: ListField, raw: unknown, fallback: ListItem[]): ListItem[] {
  if (!Array.isArray(raw)) return fallback;
  const items: ListItem[] = [];
  for (const entry of raw.slice(0, field.max ?? MAX_LIST_ITEMS)) {
    if (!entry || typeof entry !== "object") continue;
    const obj = entry as Record<string, unknown>;
    const item: ListItem = {};
    for (const sub of field.fields) item[sub.key] = readValue(sub, obj[sub.key], emptyValue(sub));
    items.push(item);
  }
  return items;
}

/** Ghép nội dung đã lưu lên nội dung gốc. Trường nào thiếu/sai -> lấy nội dung gốc. */
export function resolveContent(def: SectionDef, stored: unknown): SectionContent {
  const source = stored && typeof stored === "object" && !Array.isArray(stored) ? (stored as Record<string, unknown>) : {};
  const out: SectionContent = {};
  for (const field of def.fields) {
    const fallback = def.defaults[field.key];
    if (field.type === "list") {
      out[field.key] = readList(field, source[field.key], Array.isArray(fallback) ? (fallback as ListItem[]) : []);
    } else {
      const fb =
        typeof fallback === "string" || typeof fallback === "number" || typeof fallback === "boolean"
          ? fallback
          : emptyValue(field);
      out[field.key] = readValue(field, source[field.key], fb);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Lưu (kiểm tra chặt)
// ---------------------------------------------------------------------------

type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

function checkValue(field: ValueField, raw: unknown, where: string): Checked<string | number | boolean> {
  const name = `${where}“${field.label}”`;

  if (field.type === "boolean") {
    if (typeof raw !== "boolean") return { ok: false, error: `${name} có dữ liệu không hợp lệ.` };
    return { ok: true, value: raw };
  }

  if (field.type === "number") {
    if (raw === "" || raw === null || raw === undefined) {
      return field.required ? { ok: false, error: `${name} không được để trống.` } : { ok: true, value: 0 };
    }
    const n = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0 || n > 100000) {
      return { ok: false, error: `${name} phải là số nguyên từ 0 trở lên.` };
    }
    return { ok: true, value: n };
  }

  if (raw !== undefined && raw !== null && typeof raw !== "string") {
    return { ok: false, error: `${name} có dữ liệu không hợp lệ.` };
  }
  const v = (typeof raw === "string" ? raw : "").trim();
  if (field.required && v === "") return { ok: false, error: `${name} không được để trống.` };
  if (v.length > maxOf(field)) return { ok: false, error: `${name} dài tối đa ${maxOf(field)} ký tự.` };
  if (field.type === "url" && v !== "" && !isSafeHref(v)) {
    return { ok: false, error: `${name} chưa đúng. Hãy nhập đường dẫn bắt đầu bằng /, #, https://, mailto: hoặc tel:.` };
  }
  if (field.type === "image" && v !== "" && !isSafeImage(v)) {
    return { ok: false, error: `${name} chưa đúng. Hãy tải ảnh lên hoặc nhập địa chỉ bắt đầu bằng https:// hoặc /.` };
  }
  if (field.type === "date" && v !== "" && !isRealDate(v)) {
    return { ok: false, error: `${name} không phải ngày hợp lệ.` };
  }
  if (field.type === "select" && field.options?.length && !field.options.some((option) => option.value === v)) {
    return { ok: false, error: `${name} không nằm trong danh sách lựa chọn.` };
  }
  return { ok: true, value: v };
}

export function validateContent(def: SectionDef, input: unknown): Checked<SectionContent> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Dữ liệu gửi lên không hợp lệ. Hãy tải lại trang." };
  }
  const source = input as Record<string, unknown>;
  const out: SectionContent = {};

  for (const field of def.fields as Field[]) {
    if (field.type === "list") {
      const raw = source[field.key];
      if (raw !== undefined && !Array.isArray(raw)) {
        return { ok: false, error: `“${field.label}” có dữ liệu không hợp lệ.` };
      }
      const rows = (raw ?? []) as unknown[];
      const max = field.max ?? MAX_LIST_ITEMS;
      if (rows.length > max) return { ok: false, error: `“${field.label}” tối đa ${max} mục.` };
      if (field.min && rows.length < field.min) {
        return { ok: false, error: `“${field.label}” cần ít nhất ${field.min} mục.` };
      }
      const items: ListItem[] = [];
      for (let i = 0; i < rows.length; i++) {
        const entry = rows[i];
        if (!entry || typeof entry !== "object") return { ok: false, error: `${field.itemLabel} ${i + 1} không hợp lệ.` };
        const obj = entry as Record<string, unknown>;
        const item: ListItem = {};
        for (const sub of field.fields) {
          const checked = checkValue(sub, obj[sub.key], `${field.itemLabel} ${i + 1} — `);
          if (!checked.ok) return checked;
          item[sub.key] = checked.value;
        }
        items.push(item);
      }
      out[field.key] = items;
    } else {
      const checked = checkValue(field, source[field.key], "");
      if (!checked.ok) return checked;
      out[field.key] = checked.value;
    }
  }
  return { ok: true, value: out };
}

// ---------------------------------------------------------------------------
// Tiện ích đọc giá trị cho component website
// ---------------------------------------------------------------------------

export function str(content: SectionContent, key: string): string {
  const v: SectionValue | undefined = content[key];
  return typeof v === "string" ? v : "";
}

export function num(content: SectionContent, key: string): number {
  const v: SectionValue | undefined = content[key];
  return typeof v === "number" ? v : 0;
}

export function bool(content: SectionContent, key: string): boolean {
  const v: SectionValue | undefined = content[key];
  return typeof v === "boolean" ? v : false;
}

export function list(content: SectionContent, key: string): ListItem[] {
  const v: SectionValue | undefined = content[key];
  return Array.isArray(v) ? v : [];
}

export function itemStr(item: ListItem, key: string): string {
  const v = item[key];
  return typeof v === "string" ? v : "";
}

export function itemNum(item: ListItem, key: string): number {
  const v = item[key];
  return typeof v === "number" ? v : 0;
}

export function itemBool(item: ListItem, key: string): boolean {
  const v = item[key];
  return typeof v === "boolean" ? v : false;
}

/** "2024-05-10" -> "10 Tháng 5, 2024" */
export function formatViDate(value: string): string {
  if (!isRealDate(value)) return value;
  const [y, m, d] = value.split("-").map(Number);
  return `${d} Tháng ${m}, ${y}`;
}
