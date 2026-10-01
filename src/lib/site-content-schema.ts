// Danh sách các ô nội dung sửa được trong /admin/noi-dung.
// Muốn thêm một ô mới: thêm 1 dòng vào `fields` bên dưới, rồi dùng
// c["khóa.của.ô"] trong component (xem Hero.tsx làm mẫu).

export type FieldType = "text" | "textarea" | "link" | "image";

export type ContentField = {
  key: string;
  label: string;
  type: FieldType;
  /** Giá trị đang dùng trên web hiện tại — dùng khi chưa có gì trong database. */
  default: string;
  hint?: string;
  /** true = được để trống (ví dụ để ẩn một link). */
  optional?: boolean;
};

export type ContentSection = {
  id: string;
  title: string;
  description: string;
  fields: ContentField[];
};

export const SECTIONS: ContentSection[] = [
  {
    id: "announcement",
    title: "Thanh thông báo trên cùng",
    description: "Dòng chữ nằm trên đầu mọi trang.",
    fields: [
      {
        key: "announcement.text",
        label: "Nội dung thông báo",
        type: "text",
        default: "Nghi thức 15 phút mỗi ngày — từ quá tải đến cân bằng",
      },
    ],
  },
  {
    id: "hero",
    title: "Trang chủ: khu vực đầu trang (Hero)",
    description: "Khối lớn đầu tiên khách thấy khi vào trang chủ.",
    fields: [
      { key: "hero.eyebrow", label: "Dòng nhỏ phía trên", type: "text", default: "DOPAMIND MASK STORY / MIND–SKIN CARE" },
      { key: "hero.line1", label: "Tiêu đề, dòng 1", type: "text", default: "Mask" },
      { key: "hero.line2", label: "Tiêu đề, dòng 2 (chữ màu tím)", type: "text", default: "Skin Mind" },
      {
        key: "hero.subtitle",
        label: "Đoạn mô tả",
        type: "textarea",
        default:
          "Dành 15 phút để làn da được chăm sóc và bạn có một khoảng thời gian thật sự dành cho chính mình.",
      },
      { key: "hero.cta1Label", label: "Nút 1: chữ", type: "text", default: "KHÁM PHÁ SẢN PHẨM" },
      { key: "hero.cta1Href", label: "Nút 1: đường dẫn", type: "link", default: "/san-pham", hint: "Ví dụ /san-pham hoặc https://..." },
      { key: "hero.cta2Label", label: "Nút 2: chữ", type: "text", default: "CÂU CHUYỆN CỦA CHÚNG TÔI →" },
      { key: "hero.cta2Href", label: "Nút 2: đường dẫn", type: "link", default: "/cau-chuyen-dopamind" },
      {
        key: "hero.imageDesktop",
        label: "Ảnh nền cho máy tính (ảnh ngang)",
        type: "image",
        default: "/images/homepage/hero/H01.png",
      },
      {
        key: "hero.imageMobile",
        label: "Ảnh nền cho điện thoại và máy tính bảng",
        type: "image",
        default: "/images/homepage/hero/H02.png",
      },
    ],
  },
  {
    id: "footer",
    title: "Chân trang (Footer)",
    description: "Phần cuối mọi trang: giới thiệu ngắn, bản quyền và link mạng xã hội.",
    fields: [
      {
        key: "footer.tagline",
        label: "Câu giới thiệu dưới logo",
        type: "textarea",
        default: "Mind–Skin Care. Nghi thức 15 phút mỗi ngày, từ quá tải đến cân bằng.",
      },
      {
        key: "footer.copyright",
        label: "Dòng bản quyền (năm tự thêm phía trước)",
        type: "text",
        default: "Dopamind Mask Story. Tất cả các quyền được bảo lưu.",
      },
      { key: "footer.instagram", label: "Link Instagram", type: "link", default: "#", optional: true, hint: "Để trống để ẩn link này." },
      { key: "footer.tiktok", label: "Link TikTok", type: "link", default: "#", optional: true, hint: "Để trống để ẩn link này." },
      { key: "footer.spotify", label: "Link Spotify", type: "link", default: "#", optional: true, hint: "Để trống để ẩn link này." },
    ],
  },
];

export const DEFAULTS: Record<string, string> = Object.fromEntries(
  SECTIONS.flatMap((s) => s.fields.map((f) => [f.key, f.default])),
);

/** Ảnh tải lên từ trang admin nằm trong thư mục này của bucket. */
export const SITE_IMAGE_FOLDER = "site";
