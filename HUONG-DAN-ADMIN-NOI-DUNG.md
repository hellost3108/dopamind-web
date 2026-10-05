# Admin chỉnh sửa nội dung website DOPAMIND

## Cài đặt (làm 1 lần)
1. Giải nén file zip này vào **thư mục gốc dự án dopamind** (ghi đè các file trùng tên).
2. Mở Supabase → SQL Editor và chạy lần lượt:
   - `supabase/migrations/20261002090000_site_cms.sql`
   - `supabase/migrations/20261005090000_content_studio.sql`
   (Cần đã chạy file `20261001090000_admin_panel.sql` và đã cấp quyền admin cho email của bạn.)
3. Chạy `npm run build` để kiểm tra, rồi deploy như bình thường.
4. Vào `dopamind.vn/admin` → **DOPAMIND Content Studio**.

## Chỉnh được gì
| Khối | Trang |
| --- | --- |
| Thanh thông báo (bật/tắt, đường dẫn khi bấm) | mọi trang |
| Chân trang: câu giới thiệu, bản quyền, link mạng xã hội | mọi trang |
| Banner đầu trang chủ: tiêu đề, mô tả, 2 nút | `/` |
| Dòng sản phẩm: tiêu đề, mô tả, liên kết, ảnh và thứ tự các dòng | `/` |
| Dải thông tin thương hiệu | `/` |
| Khối DOPA × MIND: thông điệp và hai ô nội dung | `/` |
| Khoa học làn da: tiêu đề, công dụng, ảnh và liên kết | `/` |
| Nghi thức 15 phút: lời dẫn, trạng thái hoàn tất, nhãn nút và lời nhắc | `/#nghi-thuc-15-phut` |
| Câu chuyện cảm hứng: tiêu đề, ảnh, mô tả và liên kết từng thẻ | `/` |
| Đăng ký nhận tin: tiêu đề, mô tả, nhãn nút và lời cảm ơn | `/` |
| Trang Nhật ký: đầu trang + danh sách ghi chép | `/nhat-ky` |
| Trang Bài viết: đầu trang, bài nổi bật, danh sách bài, cuối trang | `/bai-viet` |
| Toàn bộ trang Câu chuyện: banner, ý nghĩa, trụ cột, khởi nguồn, tuyên ngôn, CTA | `/cau-chuyen-dopamind` |
| Banner trang sản phẩm: chữ, ảnh, trạng thái hiển thị | `/san-pham` |

## Các module quản trị riêng

- **Bài viết:** tạo bài, lưu nháp, xuất bản/lưu trữ, bài nổi bật, ảnh đại diện, chủ đề, thời gian đọc và SEO. Bài đã xuất bản tự xuất hiện ở `/bai-viet` và có trang chi tiết `/bai-viet/[slug]`.
- **Sản phẩm:** thông tin, trạng thái bán, biến thể, giá, tồn kho, ảnh, danh mục, cảm xúc, nhu cầu da và SEO.
- **Danh mục:** tên, tên ngắn, mô tả, ảnh, thứ tự hiển thị, bật/tắt và SEO.
- **Đơn hàng:** được giữ riêng trong nhóm **Vận hành**, không còn là trọng tâm trang tổng quan.

Mỗi section có: bật/tắt hiển thị (ở nơi hỗ trợ), lưu → website cập nhật ngay, hoàn tác, lịch sử 20 phiên bản, khôi phục nội dung gốc,
cảnh báo khi rời trang mà chưa lưu, tải ảnh lên (JPG/PNG/WebP ≤ 5MB), thêm / xóa / nhân bản / đổi thứ tự mục.
Chưa chỉnh gì thì website hiển thị nội dung gốc như cũ.

## Thêm khối mới sau này
1. Thêm 1 định nghĩa vào `src/lib/cms/sections.ts` (nhãn, các trường, nội dung gốc).
2. Trong component trang web: `const c = await getSection("khoa.moi")` rồi dùng `str(c, "truong")`.
Form admin tự sinh theo định nghĩa.
