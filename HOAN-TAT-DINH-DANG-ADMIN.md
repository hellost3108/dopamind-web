# Thanh công cụ định dạng DOPAMIND — bàn giao trên máy

Đã áp dụng trong mã nguồn cho 115 loại ô chữ của 22 khối CMS và 12 loại ô của bài viết, sản phẩm, biến thể, danh mục. Một loại ô trong danh sách có thể xuất hiện nhiều lần khi thêm mục. Các ô kỹ thuật như URL, email, slug, SEO, mô tả ảnh thay thế, giá, tồn kho, SKU, ngày tháng và ghi chú nội bộ giữ nguyên.

## Cách kiểm tra, không cần biết code

Máy đang chạy bản thử tại http://localhost:3001. Bản thử chỉ lưu tạm để xem; tải lại trang sẽ quay về nội dung gốc, không ghi vào database thật.

1. Mở http://localhost:3001/all. Chọn khối câu chuyện, banner sản phẩm, nhật ký hoặc bài viết trong danh sách. Trang chủ cũng có trong danh sách này.
2. Bấm một ô chữ. Thanh công cụ hiện ngay phía trên. Bôi đen vài chữ, thử đậm/nghiêng, font, cỡ chữ và màu. Bấm ra ngoài để ẩn thanh.
3. Ở ô nhiều dòng, thử gạch chân, căn lề, danh sách và chèn link. Ô một dòng chỉ có bộ rút gọn và không cho xuống dòng.
4. Bấm **Lưu thay đổi**. Xem khối website thật nằm ở phần xem trước bên dưới. Bộ đếm chỉ đếm chữ hiển thị.
5. Sửa tiếp rồi bấm **Hoàn tác**: chữ và định dạng về lần lưu gần nhất. Bấm **Khôi phục nội dung gốc**: khối quay về chữ ban đầu.
6. Mở http://localhost:3001/entities. Chọn article (bài viết), product (sản phẩm), category (danh mục) để thử ba form thật. Nút lưu ở bản thử này bị chặn gửi tới database và chỉ kiểm tra trên máy.
7. Thông báo thử riêng: http://localhost:3001. Footer: http://localhost:3001/footer. Trang chủ riêng: http://localhost:3001/home. Sản phẩm/danh mục/bài chi tiết mẫu: http://localhost:3001/entities/public.

## Cách lưu và bảo vệ nội dung

- Dùng **TipTap** vì phù hợp React/Next.js, có thể dùng cùng một engine cho ô một dòng lẫn nhiều dòng, và định dạng theo vùng chữ được chọn. MarkdownEditor cũ chỉ còn là cầu nối tới component chung, không có engine thứ hai.
- Chữ cũ của CMS vẫn là chữ thường. Định dạng mới có nhãn phiên bản riêng; chữ cũ chứa dấu < hoặc > không bị hiểu nhầm thành HTML.
- Tên sản phẩm/danh mục/biến thể và bài viết tiếp tục có chữ thuần trong cột hiện có để không ảnh hưởng slug, tìm kiếm, lọc và SQL tạo đơn. Định dạng nằm riêng trong cột rich_text.
- Nếu công cụ khác sửa chữ thuần, website không lấy lại định dạng của câu cũ. Khi mở form, phần định dạng khớp nội dung sẽ được nạp lại.
- Bài Markdown cũ được mở để sửa mà không tự ghi lại. Nếu chỉ đổi tiêu đề, nội dung Markdown cũ vẫn nguyên. Khi sửa phần thân, định dạng mới giữ heading, danh sách và trích dẫn đã hỗ trợ.
- Lọc thẻ, màu, font, cỡ chữ và URL ở cả khi lưu lẫn hiển thị. Script, sự kiện HTML và CSS ngoài danh sách được loại bỏ.
- Có 20 font hỗ trợ tiếng Việt, gồm font website đang dùng, cả serif và sans-serif. Chỉ yêu cầu tải font được dùng trong nội dung; URL tải có subset=vietnamese.
- Không chạy chuyển đổi hàng loạt dữ liệu hiện có. Tệp migration chỉ thêm bốn cột JSON với mặc định rỗng.

## Trạng thái Supabase thật và bước triển khai

Đã tạo cấu hình .env.local riêng trên máy từ cấu hình kết nối công khai của website. Tệp này được Git bỏ qua, không ghi giá trị vào báo cáo hay kho mã.

Đã đăng nhập đúng dự án Supabase đang phục vụ dopamind.vn và chạy hai tệp:

- supabase/migrations/20261027090000_rich_text_fields.sql: thêm bốn cột JSON rich_text, không chuyển đổi hoặc ghi đè nội dung cũ.
- supabase/migrations/20261027091000_article_public_read.sql: sửa lỗi đọc bài công khai đang gọi hàm chỉ dành cho admin. Khách chỉ đọc status = published; quyền admin quản lý bài nháp vẫn ở policy riêng. Không cấp hàm admin cho khách.

Đã xác nhận cả bốn cột tồn tại bằng SQL Editor. Qua API ẩn danh, bài đã xuất bản đọc được; bài nháp và bài lưu trữ trả về rỗng. Kiểm tra các trang công khai bằng bản production cục bộ dùng dữ liệu thật đều trả HTTP 200, gồm trang chủ, câu chuyện, nhật ký, danh sách sản phẩm, chi tiết sản phẩm, danh sách bài và chi tiết bài; không có lỗi JavaScript trình duyệt.

**Chưa triển khai mã nguồn mới lên dopamind.vn.** Chưa kiểm tra thao tác ghi từ tài khoản admin trên bản production mới. Sau khi triển khai, cần thử lưu một bản nháp bài viết/sản phẩm/danh mục bằng admin, tải lại để kiểm tra định dạng và xem trang công khai.

## Kết quả kiểm tra

- 20 bài kiểm tra dữ liệu và an toàn: đạt; bao gồm toàn bộ 115 loại ô CMS, tương thích dữ liệu cũ, giới hạn chữ thật, lọc mã, tách dòng và lưu chữ thuần kèm metadata.
- 46 tình huống trình duyệt đã đạt qua các lượt chạy: thông báo, footer, 8 khối trang chủ, 12 khối còn lại, từng ô hiển thị của 12 khối đó, ba form thật, bài Markdown cũ và các phần hiển thị sản phẩm/danh mục/bài chi tiết.
- Kiểm tra kiểu dữ liệu và quy tắc mã nguồn: đạt.
- Bản dựng production: đạt đầy đủ (biên dịch, TypeScript, lấy dữ liệu và tạo 31 trang). Lần thử trước thiếu cấu hình đã được giải quyết bằng cấu hình kết nối công khai của website.

Các lệnh kiểm tra dành cho người bảo trì: npm run test:rich-text; npm run test:rich-text:ui; npx tsc --noEmit; npm run lint; npm run build.

## Toàn bộ file sửa trong đợt triển khai

- .gitignore
- eslint.config.mjs
- package-lock.json
- package.json
- src/app/admin/actions.ts
- src/app/admin/bai-viet/actions.ts
- src/app/admin/danh-muc/actions.ts
- src/app/bai-viet/BaiVietClient.tsx
- src/app/bai-viet/[slug]/page.tsx
- src/app/bai-viet/page.tsx
- src/app/nhat-ky/page.tsx
- src/app/san-pham/[slug]/page.tsx
- src/app/san-pham/page.tsx
- src/components/admin/ArticleForm.tsx
- src/components/admin/CategoryForm.tsx
- src/components/admin/MarkdownEditor.tsx
- src/components/admin/ProductForm.tsx
- src/components/admin/cms/SectionEditor.tsx
- src/components/article/ArticleBody.tsx
- src/components/checkout/CheckoutForm.tsx
- src/components/home/Hero.tsx
- src/components/home/HomeBrandStrip.tsx
- src/components/home/JournalStories.tsx
- src/components/home/Newsletter.tsx
- src/components/home/ProductFamilies.tsx
- src/components/home/ResetTimer.tsx
- src/components/home/ScienceEmotionIntro.tsx
- src/components/home/SkinScience.tsx
- src/components/layout/AnnouncementBar.tsx
- src/components/layout/Footer.tsx
- src/components/layout/MegaMenu.tsx
- src/components/pages/CartSelectable.tsx
- src/components/pages/CommercePages.tsx
- src/components/pages/PageIntro.tsx
- src/components/pages/RealCatalog.tsx
- src/components/product/ProductPurchase.tsx
- src/components/product/ProductTabs.tsx
- src/components/story/BrandClosing.tsx
- src/components/story/BrandMeaning.tsx
- src/components/story/BrandOrigin.tsx
- src/components/story/BrandPillars.tsx
- src/components/story/BrandStoryCTA.tsx
- src/components/story/BrandStoryHero.tsx
- src/context/cart-context.tsx
- src/context/wishlist-context.tsx
- src/lib/admin/data.ts
- src/lib/articles.ts
- src/lib/cms/fields.ts
- src/lib/cms/sections.ts
- src/lib/cms/types.ts
- src/lib/real-product-detail.ts
- src/lib/real-products.ts
- src/lib/supabase/database.types.ts
- tsconfig.json

## Toàn bộ file mới

- supabase/migrations/20261027091000_article_public_read.sql

- BUOC-2-THU-THANH-CONG-CU.md
- BUOC-3-NHOM-1-FOOTER.md
- BUOC-3-NHOM-2-TRANG-CHU.md
- playwright.config.ts
- src/components/admin/RichTextEditor.module.css
- src/components/admin/RichTextEditor.tsx
- src/components/content/FormattedText.tsx
- src/components/pages/JournalNotes.tsx
- src/components/pages/ShopHero.tsx
- src/lib/rich-text/content.ts
- src/lib/rich-text/entities.ts
- src/lib/rich-text/fonts.ts
- src/lib/rich-text/markdown.ts
- supabase/migrations/20261027090000_rich_text_fields.sql
- tests/rich-text-preview/app/all/actions.tsx
- tests/rich-text-preview/app/all/page.tsx
- tests/rich-text-preview/app/all/view/page.tsx
- tests/rich-text-preview/app/entities/page.tsx
- tests/rich-text-preview/app/entities/public/page.tsx
- tests/rich-text-preview/app/footer/page.tsx
- tests/rich-text-preview/app/home/actions.tsx
- tests/rich-text-preview/app/home/page.tsx
- tests/rich-text-preview/app/home/view/page.tsx
- tests/rich-text-preview/app/layout.tsx
- tests/rich-text-preview/app/page.tsx
- tests/rich-text-preview/app/preview.css
- tests/rich-text-preview/next.config.ts
- tests/rich-text-preview/tsconfig.json
- tests/rich-text.spec.ts
- tests/rich-text.test.ts
- HOAN-TAT-DINH-DANG-ADMIN.md

Các tệp trong tests/rich-text-preview là bản thử độc lập, không phải trang admin công khai. Tệp môi trường, dữ liệu đăng nhập, thư mục build và kết quả trình duyệt được Git bỏ qua.

Tệp tạo riêng trên máy: .env.local (cấu hình kết nối công khai, Git bỏ qua; không đưa lên kho mã).
