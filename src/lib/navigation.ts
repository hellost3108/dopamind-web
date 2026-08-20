export type NavLink = {
  labelVi: string;
  href: string;
};

/**
 * Header primary navigation. "SẢN PHẨM" additionally drives the SHOP mega
 * menu (see mega-menu.ts) — its href is the fallback / mobile-tap target.
 */
export const PRIMARY_NAV: NavLink[] = [
  { labelVi: "SẢN PHẨM", href: "/san-pham" },
  { labelVi: "BÁN CHẠY", href: "/san-pham?sort=ban-chay" },
  { labelVi: "TÌM MẶT NẠ PHÙ HỢP", href: "/tim-mat-na-phu-hop" },
  { labelVi: "CÂU CHUYỆN DOPAMIND", href: "/cau-chuyen-dopamind" },
  { labelVi: "NGHI THỨC 15 PHÚT", href: "/nghi-thuc-15-phut" },
  { labelVi: "NHẬT KÝ", href: "/nhat-ky" },
];

export const SHOP_NAV_LABEL = "SẢN PHẨM";
