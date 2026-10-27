# Cập nhật font và quản lý ảnh DOPAMIND

## Phần A — Font
Ô chọn có Font hiện tại và bốn mục: Libre Caslon Display (400), Montserrat ExtraBold (800), Be Vietnam Pro Regular (400), Be Vietnam Pro Medium (500). Tên font được xem trước bằng chính font đó. Font cũ vẫn được hỗ trợ khi hiển thị nội dung đã lưu; font chung của website/admin giữ nguyên.
Libre Caslon Display không có bộ ký tự tiếng Việt đầy đủ: các ký tự thiếu được hiển thị bằng Georgia hoặc Times New Roman. Font được tải khi dùng, theo độ đậm và subset latin/vietnamese.

Kiểm tra: mở một ô chữ, bôi đen một phần, chọn từng font và lưu. Mở trang tương ứng trên website, kiểm tra chữ có dấu và độ đậm. Chọn Font hiện tại để trở về kiểu mặc định.

## Phần B — Ảnh
Mở Admin → Thư viện ảnh. Có thể tải JPG, PNG, WebP tối đa 20 MB, tìm theo tên, xem vị trí đang sử dụng và dùng lại ảnh. Bản gốc mới được giữ trong kho riêng; bản hiển thị được chuyển WebP và tạo nhiều kích thước. File ảnh cũ không bị ghi đè hoặc xóa.
Trong từng khung ảnh: chọn/kéo thả ảnh, nhập mô tả ảnh, chỉnh điểm lấy nét riêng cho điện thoại/máy tính, bấm Lưu ảnh. Hoàn tác bỏ thay đổi chưa lưu; Khôi phục ảnh gốc đưa vị trí về ảnh gốc. Với bài viết/danh mục/dòng nội dung mới, lưu bản ghi trước khi chỉnh lấy nét.
Xóa ảnh cần xác nhận tiếng Việt. Mở Thư viện ảnh → Thùng rác để khôi phục trong 30 ngày. Sau thời hạn này không còn nút khôi phục; hệ thống chưa tự xóa vĩnh viễn file gốc. Ảnh đang được dùng không được chuyển khỏi thư viện.
Quyền được kiểm tra phía máy chủ và cơ sở dữ liệu. Khách chưa đăng nhập không được tải ảnh, sửa vị trí ảnh hay đọc thư viện/thùng rác. Định dạng file được kiểm tra bằng nội dung thật, sau đó giải mã và tạo bản WebP an toàn.

## Phạm vi kiểm tra
Kiểm tra tự động gồm font cũ/mới, lọc định dạng, xử lý ảnh thật, từ chối file giả, giới hạn kích thước, EXIF, lấy nét, thứ tự các dòng nội dung, chọn ảnh, lưu/hoàn tác/xóa/khôi phục và tìm kiếm thư viện. Bản dựng và kiểm tra lỗi được chạy trước khi cập nhật.

## Các tệp

### Phần A

- `src/lib/rich-text/fonts.ts`
- `src/lib/rich-text/content.ts`
- `src/components/admin/RichTextEditor.tsx`
- `src/components/content/FormattedText.tsx`
- `tests/rich-text.spec.ts`
- `tests/rich-text.test.ts`

### Phần B và cấu hình kiểm tra

- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `src/app/admin/actions.ts`
- `src/app/admin/danh-muc/actions.ts`
- `src/app/admin/hinh-anh/page.tsx`
- `src/app/api/admin/media/route.ts`
- `src/app/bai-viet/[slug]/page.tsx`
- `src/app/bai-viet/BaiVietClient.tsx`
- `src/app/bai-viet/page.tsx`
- `src/app/layout.tsx`
- `src/components/admin/AdminNav.tsx`
- `src/components/admin/ArticleForm.tsx`
- `src/components/admin/CategoryForm.tsx`
- `src/components/admin/cms/ImageInput.tsx`
- `src/components/admin/cms/SectionEditor.tsx`
- `src/components/admin/media/ImageEditor.tsx`
- `src/components/admin/media/MediaLibrary.tsx`
- `src/components/admin/MediaManager.tsx`
- `src/components/home/CampaignMedia.tsx`
- `src/components/home/JournalStories.tsx`
- `src/components/home/ProductFamilies.tsx`
- `src/components/home/SkinScience.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/MegaMenu.tsx`
- `src/components/media/MediaProvider.tsx`
- `src/components/media/SiteImage.module.css`
- `src/components/media/SiteImage.tsx`
- `src/components/pages/JournalNotes.tsx`
- `src/components/pages/RealCatalog.tsx`
- `src/components/pages/ShopHero.tsx`
- `src/components/product/ProductGallery.tsx`
- `src/components/product/ProductImage.tsx`
- `src/components/story/BrandClosing.tsx`
- `src/components/story/BrandStoryHero.tsx`
- `src/lib/cms/fields.ts`
- `src/lib/cms/sections.ts`
- `src/lib/media/client.ts`
- `src/lib/media/process.ts`
- `src/lib/media/public.ts`
- `src/lib/media/registry.ts`
- `src/lib/media/server.ts`
- `src/lib/media/static-slots.ts`
- `src/lib/media/types.ts`
- `src/lib/real-product-detail.ts`
- `src/lib/real-products.ts`
- `supabase/migrations/20261027110000_media_library.sql`
- `tests/media.spec.ts`
- `tests/media.test.ts`
- `tests/rich-text-preview/app/media/page.tsx`
