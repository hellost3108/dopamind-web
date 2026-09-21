export type NavLink = {
  labelVi: string;
  href: string;
};

/**
 * Header primary navigation. "SẢN PHẨM" additionally drives the SHOP mega
 * menu (see mega-menu.ts) — its href is the fallback / mobile-tap target.
 */
export const PRIMARY_NAV: NavLink[] = [
 
  { labelVi: "CÂU CHUYỆN THƯƠNG HIỆU", href: "/cau-chuyen-dopamind" },
   { labelVi: "SẢN PHẨM", href: "/san-pham" },
  { labelVi: "BÀI VIẾT", href: "/bai-viet" },
];

export const SHOP_NAV_LABEL = "SẢN PHẨM";
