export type MegaMenuCategory = {
  /** Subtle editorial index — "01".."06". Never the visually dominant part of the item. */
  index: string;
  labelVi: string;
  slug: string;
  href: string;
};

/**
 * DOPAMIND's six primary product categories, shown in the SẢN PHẨM mega
 * menu and in mobile nav. There is no category field on `Product` yet (see
 * src/lib/products.ts / src/lib/types.ts) — the catalog page also does not
 * read the `mood` / `nhu-cau` query params it already links to, so pointing
 * these at a not-yet-consumed `danh-muc` query param doesn't regress
 * anything. Once real category data exists, wire `Catalog` to read
 * `danh-muc` and assign real products to these slugs — do not fabricate
 * that mapping here.
 */
export const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    index: "01",
    labelVi: "MTS Dual Layer Mask",
    slug: "mts-dual-layer-sheet",
    href: "/san-pham?danh-muc=mts-dual-layer-sheet",
  },
  {
    index: "02",
    labelVi: "Mặt nạ phôi dừa",
    slug: "bo-ha",
    href: "/san-pham?danh-muc=bo-ha",
  },
  {
    index: "03",
    labelVi: "Mặt nạ thạch",
    slug: "mat-na-phoi-dua",
    href: "/san-pham?danh-muc=mat-na-phoi-dua",
  },
  {
    index: "04",
    labelVi: "Bộ cấp ẩm Hydra Matrix",
    slug: "mat-na-thach",
    href: "/san-pham?danh-muc=mat-na-thach",
  },
  {
    index: "05",
    labelVi: "Mặt nạ giảm mụn phục hồi",
    slug: "mat-na-giam-mun-phuc-hoi",
    href: "/san-pham?danh-muc=mat-na-giam-mun-phuc-hoi",
  },
  {
    index: "06",
    labelVi: "Mặt nạ đất sét",
    slug: "mat-na-dat-set",
    href: "/san-pham?danh-muc=mat-na-dat-set",
  },
];

export const MEGA_MENU = {
  labelVi: "SẢN PHẨM",
  eyebrowVi: "DANH MỤC SẢN PHẨM",
  categories: MEGA_MENU_CATEGORIES,
  exploreSection: {
    titleVi: "KHÁM PHÁ",
    items: [
      { labelVi: "Tất cả sản phẩm", href: "/san-pham" },
      { labelVi: "Sản phẩm bán chạy", href: "/san-pham?sort=ban-chay" },
      { labelVi: "Sản phẩm mới", href: "/san-pham?sort=moi" },
    ],
  },
};
