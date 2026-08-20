import { MOODS } from "@/lib/moods";
import { SKIN_NEEDS } from "@/lib/skin-needs";

export const MEGA_MENU = {
  labelVi: "SẢN PHẨM",
  moodSection: {
    titleVi: "CHỌN THEO CẢM XÚC",
    items: MOODS,
  },
  skinNeedSection: {
    titleVi: "CHỌN THEO NHU CẦU DA",
    items: SKIN_NEEDS,
  },
  highlightSection: {
    titleVi: "NỔI BẬT",
    items: [
      { labelVi: "Bán chạy", href: "/san-pham?sort=ban-chay" },
      { labelVi: "Sản phẩm mới", href: "/san-pham?sort=moi" },
      { labelVi: "Bộ sản phẩm", href: "/san-pham/bo-san-pham" },
      { labelVi: "Tất cả mặt nạ", href: "/san-pham" },
    ],
  },
  /**
   * Architecture for one campaign image slot. No campaign asset exists yet,
   * so the component renders a brand-toned placeholder when `image` is
   * unset — swap in a real asset + href here when available.
   */
  campaign: {
    titleVi: "Nghi Thức 15 Phút",
    subtitleVi: "Từ quá tải đến cân bằng",
    href: "/nghi-thuc-15-phut",
    image: undefined as string | undefined,
  },
};
