import type { Field, GroupKey, SectionContent, SectionDef } from "@/lib/cms/types";

/**
 * Danh sách MỌI khối nội dung chỉnh sửa được từ /admin/noi-dung.
 * Thêm khối mới = thêm 1 định nghĩa ở đây + gọi getSection("khóa") trong component.
 * Trang admin tự sinh form từ `fields`. `defaults` là nội dung gốc đang chạy trên
 * website, nên khi chưa lưu gì thì website trông y như cũ.
 */

export const CMS_GROUPS: { key: GroupKey; label: string; description: string }[] = [
  {
    key: "global",
    label: "Thông tin chung",
    description: "Thanh thông báo trên cùng và chân trang (footer) — hiện ở mọi trang.",
  },
  {
    key: "home",
    label: "Trang chủ",
    description: "Các khối nội dung của trang chủ dopamind.vn.",
  },
  {
    key: "journal",
    label: "Nhật ký & Bài viết",
    description: "Trang /nhat-ky và trang /bai-viet.",
  },
];

const heroFields: Field[] = [
  { key: "eyebrow", type: "text", label: "Dòng nhỏ phía trên", max: 80 },
  { key: "line1", type: "text", label: "Tiêu đề — dòng 1", max: 40, required: true },
  { key: "line2", type: "text", label: "Tiêu đề — dòng 2 (chữ nghiêng màu tím)", max: 40 },
  { key: "body", type: "textarea", label: "Mô tả ngắn", max: 300 },
  { key: "primaryLabel", type: "text", label: "Nút chính — chữ", max: 40 },
  { key: "primaryHref", type: "url", label: "Nút chính — đường dẫn", help: "Ví dụ: /san-pham" },
  { key: "secondaryLabel", type: "text", label: "Liên kết phụ — chữ", max: 50 },
  { key: "secondaryHref", type: "url", label: "Liên kết phụ — đường dẫn", help: "Ví dụ: /cau-chuyen-dopamind" },
];

export const SECTION_DEFS: SectionDef[] = [
  // ---------------------------------------------------------------- Thông tin chung
  {
    key: "global.announcement",
    group: "global",
    label: "Thanh thông báo",
    description: "Dòng chữ trên cùng của website. Để trống ô nội dung để ẩn thanh này.",
    path: "/",
    fields: [
      { key: "text", type: "text", label: "Nội dung thông báo", max: 140, help: "Để trống để ẩn thanh thông báo." },
      { key: "href", type: "url", label: "Đường dẫn khi bấm (không bắt buộc)", help: "Để trống nếu không cần bấm được." },
    ],
    defaults: {
      text: "Nghi thức 15 phút mỗi ngày — từ quá tải đến cân bằng",
      href: "",
    },
  },
  {
    key: "global.footer",
    group: "global",
    label: "Chân trang (footer)",
    description: "Câu giới thiệu, dòng bản quyền và các liên kết mạng xã hội ở cuối trang.",
    path: "/",
    fields: [
      { key: "tagline", type: "textarea", label: "Câu giới thiệu dưới logo", max: 200 },
      {
        key: "copyright",
        type: "text",
        label: "Dòng bản quyền",
        max: 120,
        help: "Năm hiện tại được tự thêm phía trước (© 2026 ...).",
      },
      {
        key: "social",
        type: "list",
        label: "Liên kết mạng xã hội",
        itemLabel: "Liên kết",
        itemTitleKey: "label",
        max: 8,
        fields: [
          { key: "label", type: "text", label: "Tên (Instagram, TikTok...)", max: 30, required: true },
          { key: "href", type: "url", label: "Đường dẫn", help: "Dán link trang của bạn, ví dụ https://instagram.com/...", required: true },
        ],
      },
    ],
    defaults: {
      tagline: "Mind–Skin Care. Nghi thức 15 phút mỗi ngày, từ quá tải đến cân bằng.",
      copyright: "Dopamind Mask Story. Tất cả các quyền được bảo lưu.",
      social: [
        { label: "Instagram", href: "#" },
        { label: "TikTok", href: "#" },
        { label: "Spotify", href: "#" },
      ],
    },
  },

  // ---------------------------------------------------------------- Trang chủ
  {
    key: "home.hero",
    group: "home",
    label: "Banner đầu trang chủ (Hero)",
    description: "Tiêu đề lớn, mô tả và hai nút ở đầu trang chủ. Ảnh nền của banner chưa chỉnh được ở đây.",
    path: "/",
    fields: heroFields,
    defaults: {
      eyebrow: "DOPAMIND MASK STORY / MIND–SKIN CARE",
      line1: "Mask",
      line2: "Skin Mind",
      body: "Dành 15 phút để làn da được chăm sóc và bạn có một khoảng thời gian thật sự dành cho chính mình.",
      primaryLabel: "KHÁM PHÁ SẢN PHẨM",
      primaryHref: "/san-pham",
      secondaryLabel: "CÂU CHUYỆN CỦA CHÚNG TÔI",
      secondaryHref: "/cau-chuyen-dopamind",
    },
  },

  // ---------------------------------------------------------------- Nhật ký & Bài viết
  {
    key: "journal.notes",
    group: "journal",
    label: "Trang Nhật ký",
    description: "Phần đầu trang và danh sách các ghi chép ở /nhat-ky.",
    path: "/nhat-ky",
    fields: [
      { key: "eyebrow", type: "text", label: "Dòng nhỏ phía trên", max: 60 },
      { key: "line1", type: "text", label: "Tiêu đề — dòng 1", max: 60, required: true },
      { key: "line2", type: "text", label: "Tiêu đề — dòng 2 (màu tím)", max: 60 },
      { key: "body", type: "textarea", label: "Mô tả", max: 300 },
      {
        key: "notes",
        type: "list",
        label: "Các ghi chép",
        itemLabel: "Ghi chép",
        itemTitleKey: "title",
        max: 30,
        fields: [
          { key: "tag", type: "text", label: "Nhãn", max: 30 },
          { key: "title", type: "text", label: "Tiêu đề", max: 120, required: true },
          { key: "body", type: "textarea", label: "Nội dung ngắn", max: 400 },
        ],
      },
    ],
    defaults: {
      eyebrow: "DOPAMIND Editorial",
      line1: "Nhật ký của",
      line2: "những nhịp chậm.",
      body: "Ghi chép về việc nghỉ ngơi, lắng nghe cơ thể và biến chăm sóc da thành một nghi thức có chủ ý.",
      notes: [
        {
          tag: "Nghi thức",
          title: "Một khoảng dừng giữa ngày dài",
          body: "Không phải lúc nào bạn cũng cần làm thêm. Đôi khi, điều cần thiết chỉ là cho cơ thể và tâm trí một nhịp thở.",
        },
        {
          tag: "Mind–Skin",
          title: "Chăm da như một cách quay về",
          body: "DOPAMIND nhìn khoảnh khắc chăm sóc da như một tín hiệu nhỏ: đã đến lúc đặt mọi thứ xuống và chú ý đến chính mình.",
        },
        {
          tag: "15:00",
          title: "Mười lăm phút không cần hoàn hảo",
          body: "Một nghi thức đủ ngắn để hiện diện trong ngày thường, đủ dài để bạn cảm nhận sự chuyển nhịp.",
        },
      ],
    },
  },
  {
    key: "blog.hero",
    group: "journal",
    label: "Trang Bài viết — đầu trang",
    description: "Tiêu đề, mô tả và nút ở đầu trang /bai-viet.",
    path: "/bai-viet",
    fields: [
      { key: "title", type: "text", label: "Tiêu đề", max: 80, required: true },
      { key: "titleEm", type: "text", label: "Tiêu đề — phần nghiêng (xuống dòng)", max: 80 },
      { key: "body", type: "textarea", label: "Mô tả", max: 300 },
      { key: "ctaLabel", type: "text", label: "Chữ trên nút", max: 40 },
      { key: "tags", type: "text", label: "Dòng chủ đề nhỏ", max: 120 },
    ],
    defaults: {
      title: "Những điều tốt đẹp bắt đầu",
      titleEm: "từ sự dịu dàng.",
      body: "Khám phá những câu chuyện, kiến thức và cảm hứng về làn da, tâm trí và một nhịp sống cân bằng hơn.",
      ctaLabel: "Khám phá bài viết",
      tags: "Kiến thức / Cảm hứng / Rituals / Vì một làn da hạnh phúc",
    },
  },
  {
    key: "blog.featured",
    group: "journal",
    label: "Trang Bài viết — bài nổi bật",
    description: "Khối bài viết nổi bật nằm dưới phần đầu trang /bai-viet.",
    path: "/bai-viet",
    fields: [
      { key: "eyebrow", type: "text", label: "Dòng nhỏ", max: 40 },
      { key: "title", type: "text", label: "Tiêu đề", max: 120, required: true },
      { key: "body", type: "textarea", label: "Mô tả", max: 400 },
      { key: "ctaLabel", type: "text", label: "Chữ trên nút", max: 40 },
      { key: "href", type: "url", label: "Đường dẫn bài viết", help: "Dùng # nếu chưa có trang chi tiết." },
      { key: "dateLabel", type: "text", label: "Ngày hiển thị", max: 40, help: "Ví dụ: 12 Tháng 5, 2024" },
      { key: "minutes", type: "number", label: "Số phút đọc" },
      { key: "image", type: "image", label: "Ảnh (không bắt buộc)", help: "Để trống để dùng nền màu mặc định. Tỉ lệ khuyến nghị 16:9." },
    ],
    defaults: {
      eyebrow: "Nổi bật",
      title: "Làn da cũng cần được nghỉ ngơi",
      body: "Khi bạn cho phép mình chậm lại, làn da cũng có cơ hội được phục hồi. Khám phá mối liên kết diệu kỳ giữa nghỉ ngơi, cảm xúc và sức khỏe làn da.",
      ctaLabel: "Đọc bài viết",
      href: "#",
      dateLabel: "12 Tháng 5, 2024",
      minutes: 6,
      image: "",
    },
  },
  {
    key: "blog.posts",
    group: "journal",
    label: "Trang Bài viết — danh sách bài",
    description: "Các bài viết hiện trong lưới /bai-viet. Bộ lọc chủ đề tự lấy từ cột “Chủ đề” của các bài.",
    path: "/bai-viet",
    fields: [
      {
        key: "posts",
        type: "list",
        label: "Bài viết",
        itemLabel: "Bài viết",
        itemTitleKey: "title",
        max: 60,
        fields: [
          { key: "cat", type: "text", label: "Chủ đề", max: 40, required: true, help: "Ví dụ: Skin Science, Mind Reset" },
          { key: "title", type: "text", label: "Tiêu đề", max: 140, required: true },
          { key: "desc", type: "textarea", label: "Mô tả ngắn", max: 300 },
          { key: "date", type: "date", label: "Ngày đăng", required: true },
          { key: "min", type: "number", label: "Số phút đọc" },
          { key: "href", type: "url", label: "Đường dẫn bài viết", help: "Dùng # nếu chưa có trang chi tiết." },
          { key: "image", type: "image", label: "Ảnh (không bắt buộc)", help: "Để trống để dùng nền màu mặc định. Tỉ lệ khuyến nghị 4:3." },
        ],
      },
    ],
    defaults: {
      posts: [
        { cat: "Skin Science", title: "Hàng rào bảo vệ da thực sự là gì?", desc: "Hiểu đúng về hàng rào bảo vệ da để chăm sóc da khỏe mạnh và bền vững hơn mỗi ngày.", date: "2024-05-10", min: 5, href: "#", image: "" },
        { cat: "Mask Technology", title: "Điều gì tạo nên một chiếc mask khác biệt?", desc: "Không chỉ là miếng mask, mà là sự kết hợp giữa khoa học, chất liệu và trải nghiệm cảm xúc.", date: "2024-05-08", min: 6, href: "#", image: "" },
        { cat: "Mind Reset", title: "Khi tâm trí dịu lại, làn da cũng rạng rỡ hơn", desc: "Một làn da đẹp bắt đầu từ một tâm trí bình yên. Cùng khám phá nghệ thuật sống chậm.", date: "2024-05-05", min: 4, href: "#", image: "" },
        { cat: "Skin Science", title: "Những hoạt chất vàng trong chăm sóc da hiện đại", desc: "Từ Niacinamide đến Peptide, khám phá các thành phần đang tạo nên làn da khỏe đẹp hơn.", date: "2024-04-28", min: 5, href: "#", image: "" },
        { cat: "Mind Reset", title: "5 nghi thức nhỏ giúp bạn sống chậm mỗi ngày", desc: "Những thay đổi nhỏ trong thói quen có thể tạo nên phiên bản dịu dàng và hạnh phúc hơn.", date: "2024-04-24", min: 4, href: "#", image: "" },
        { cat: "Mask Technology", title: "Tương lai của mặt nạ: Cá nhân hóa trải nghiệm", desc: "Công nghệ đang mở ra một kỷ nguyên mới cho trải nghiệm chăm sóc da tại nhà.", date: "2024-04-20", min: 5, href: "#", image: "" },
      ],
    },
  },
  {
    key: "blog.closing",
    group: "journal",
    label: "Trang Bài viết — cuối trang",
    description: "Câu trích dẫn, khối kêu gọi khám phá sản phẩm và khối đăng ký nhận bài ở cuối /bai-viet.",
    path: "/bai-viet",
    fields: [
      { key: "quote", type: "textarea", label: "Câu trích dẫn", max: 200 },
      { key: "quoteAuthor", type: "text", label: "Người/nhãn hiệu trích dẫn", max: 40 },
      { key: "ctaEyebrow", type: "text", label: "Khối kêu gọi — dòng nhỏ", max: 80 },
      { key: "ctaTitle", type: "text", label: "Khối kêu gọi — tiêu đề", max: 120 },
      { key: "ctaBody", type: "textarea", label: "Khối kêu gọi — mô tả", max: 300 },
      { key: "ctaLabel", type: "text", label: "Khối kêu gọi — chữ trên nút", max: 40 },
      { key: "ctaHref", type: "url", label: "Khối kêu gọi — đường dẫn", help: "Ví dụ: /san-pham" },
      { key: "newsTitle", type: "text", label: "Đăng ký nhận bài — tiêu đề", max: 100 },
      { key: "newsBody", type: "textarea", label: "Đăng ký nhận bài — mô tả", max: 300 },
    ],
    defaults: {
      quote: "“Một làn da đẹp là kết quả của một tâm trí bình yên.”",
      quoteAuthor: "DOPAMIND",
      ctaEyebrow: "Từ những câu chuyện đến trải nghiệm thật",
      ctaTitle: "Biến tri thức thành nghi thức chăm da.",
      ctaBody: "Khám phá bộ sưu tập mặt nạ DOPAMIND, nơi khoa học và cảm xúc gặp nhau, cho một làn da rạng rỡ và một bạn phiên bản thư thái hơn mỗi ngày.",
      ctaLabel: "Khám phá sản phẩm",
      ctaHref: "/san-pham",
      newsTitle: "Nhận cảm hứng mỗi tuần.",
      newsBody: "Đăng ký để nhận những bài viết mới nhất, bí quyết chăm da và những câu chuyện truyền cảm hứng từ DOPAMIND.",
    },
  },
];

export function getSectionDef(key: string): SectionDef | undefined {
  return SECTION_DEFS.find((d) => d.key === key);
}

export function isSectionKey(key: string): boolean {
  return SECTION_DEFS.some((d) => d.key === key);
}

export function defaultsOf(key: string): SectionContent {
  return getSectionDef(key)?.defaults ?? {};
}
