// Kiểu dữ liệu dùng chung cho hệ thống quản lý nội dung (CMS) của DOPAMIND.
// File này chỉ chứa kiểu + dữ liệu thuần, an toàn để import cả ở client lẫn server.

export type ValueFieldType = "text" | "textarea" | "url" | "image" | "date" | "number";

type BaseField = {
  /** Khóa lưu trong JSON, ví dụ "title". */
  key: string;
  /** Nhãn tiếng Việt hiển thị trong form admin. */
  label: string;
  /** Gợi ý nhỏ dưới ô nhập. */
  help?: string;
  placeholder?: string;
};

export type ValueField = BaseField & {
  type: ValueFieldType;
  /** Số ký tự tối đa (text/textarea/url). Mặc định theo loại. */
  max?: number;
  required?: boolean;
};

export type ListField = BaseField & {
  type: "list";
  /** Tên 1 phần tử, ví dụ "Bài viết" -> "Bài viết 1". */
  itemLabel: string;
  /** Trường dùng làm tiêu đề cho từng phần tử trong form. */
  itemTitleKey?: string;
  fields: ValueField[];
  min?: number;
  max?: number;
};

export type Field = ValueField | ListField;

export type ListItem = Record<string, string | number>;
export type SectionValue = string | number | ListItem[];
export type SectionContent = Record<string, SectionValue>;

export type GroupKey = "global" | "home" | "journal";

export type SectionDef = {
  /** Khóa duy nhất, dạng "home.hero". Cũng là khóa lưu trong bảng site_sections. */
  key: string;
  group: GroupKey;
  label: string;
  description: string;
  /** Đường dẫn trang công khai để bấm "Xem trang". */
  path: string;
  fields: Field[];
  /** Nội dung gốc — dùng khi chưa có dữ liệu trong database. */
  defaults: SectionContent;
};
