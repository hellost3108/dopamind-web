import { MOODS } from "@/lib/moods";
import type { NavLink } from "@/lib/navigation";

export type FooterLinkGroup = {
  titleVi: string;
  links: NavLink[];
};

/**
 * Footer nav data. Mood links reuse MOODS (src/lib/moods.ts) instead of
 * hard-coding labels/slugs a second time, so a mood rename can't drift out
 * of sync between the mega menu, Collections, and the footer.
 */
export const FOOTER_GROUPS: FooterLinkGroup[] = [
  {
    titleVi: "SẢN PHẨM",
    links: [
      { labelVi: "Tất cả mặt nạ", href: "/san-pham" },
      { labelVi: "Bán chạy", href: "/san-pham?sort=ban-chay" },
      { labelVi: "Sản phẩm mới", href: "/san-pham?sort=moi" },
      ...MOODS.map((mood) => ({
        labelVi: mood.labelVi,
        href: `/san-pham?mood=${mood.slug}`,
      })),
    ],
  },
  {
    titleVi: "VỀ DOPAMIND MASK STORY",
    links: [
      { labelVi: "Câu chuyện Dopamind Mask Story", href: "/cau-chuyen-dopamind" },
      { labelVi: "Mind × Skin", href: "/mind-skin" },
      { labelVi: "Nghi thức 15 phút", href: "/#nghi-thuc-15-phut" },
      { labelVi: "Nhật ký", href: "/nhat-ky" },
    ],
  },
  {
    titleVi: "HỖ TRỢ",
    links: [
      { labelVi: "Câu hỏi thường gặp", href: "/ho-tro/cau-hoi-thuong-gap" },
      { labelVi: "Chính sách giao hàng", href: "/ho-tro/chinh-sach-giao-hang" },
      { labelVi: "Đổi trả", href: "/ho-tro/doi-tra" },
      { labelVi: "Liên hệ", href: "/ho-tro/lien-he" },
      { labelVi: "Theo dõi đơn hàng", href: "/ho-tro/theo-doi-don-hang" },
    ],
  },
  {
    titleVi: "TÀI KHOẢN",
    links: [
      { labelVi: "Tài khoản của tôi", href: "/tai-khoan" },
      { labelVi: "Đơn hàng", href: "/tai-khoan/don-hang" },
      { labelVi: "Yêu thích", href: "/yeu-thich" },
    ],
  },
];

/**
 * Real DOPAMIND social profile URLs don't exist yet — hrefs stay "#"
 * rather than guessing at a handle that might not even belong to the
 * brand. Fill these in with verified profile URLs before launch.
 */
export const SOCIAL_LINKS: NavLink[] = [
  { labelVi: "Instagram", href: "#" },
  { labelVi: "TikTok", href: "#" },
  { labelVi: "Spotify", href: "#" },
];

export const LEGAL_LINKS: NavLink[] = [
  { labelVi: "CHÍNH SÁCH BẢO MẬT", href: "/chinh-sach-bao-mat" },
  { labelVi: "ĐIỀU KHOẢN SỬ DỤNG", href: "/dieu-khoan-su-dung" },
];
