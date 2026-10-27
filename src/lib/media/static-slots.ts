import type { MediaSlot } from "./types";
export const STATIC_IMAGE_SLOTS: MediaSlot[] = [
  {key:"home.hero.mobile",label:"Hero — điện thoại / tablet",page:"Trang chủ",href:"/",url:"/images/homepage/hero/H02.png",alt:"Khoảnh khắc thư giãn trong nghi thức chăm sóc da Dopamind Mask Story",advice:"Ảnh dọc 4:5, ít nhất 960 × 1200 px. Giữ chủ thể trong vùng lấy nét."},
  {key:"home.hero.desktop",label:"Hero — máy tính",page:"Trang chủ",href:"/",url:"/images/homepage/hero/H01.png",alt:"Khoảnh khắc thư giãn trong nghi thức chăm sóc da Dopamind Mask Story",advice:"Ảnh ngang 4:3, ít nhất 1920 × 1440 px."},
  {key:"static:header.logo",label:"Logo header",page:"Thông tin chung",href:"/",url:"/images/brand/dopamind-mask-story-logo-cropped.png",alt:"Dopamind Mask Story",advice:"Logo nền trong suốt PNG/WebP; giữ đúng tỉ lệ gốc, chiều rộng ít nhất 600 px."},
  {key:"static:footer.logo",label:"Logo footer",page:"Thông tin chung",href:"/",url:"/images/brand/dopamind-mask-story-logo-cropped.png",alt:"Dopamind Mask Story",advice:"Logo nền trong suốt PNG/WebP; giữ đúng tỉ lệ gốc, chiều rộng ít nhất 600 px."},
  ...[ ["binh-tam","Bình Tâm","P01"],["tai-tao","Tái Tạo","P02"],["rang-ro","Rạng Rỡ","P03"],["yeu-thuong","Yêu Thương","P04"] ].map(([key,label,file])=>({key:`static:product-mood:${key}`,label:`Ảnh nhóm ${label} — giỏ hàng/tìm kiếm`,page:"Ảnh sản phẩm dùng chung",href:"/san-pham",url:`/images/homepage/products/${file}.png`,alt:`Trải nghiệm mặt nạ DOPAMIND — ${label}`,advice:"Ảnh dọc 4:5, ít nhất 1600 × 2000 px."})),
];
