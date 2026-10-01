# Admin chỉnh sửa nội dung website DOPAMIND

## Cài đặt (làm 1 lần)
1. Giải nén file zip này vào **thư mục gốc dự án dopamind** (ghi đè các file trùng tên).
2. Mở Supabase → SQL Editor → chạy file `supabase/migrations/20261002090000_site_cms.sql`.
   (Cần đã chạy file `20261001090000_admin_panel.sql` và đã cấp quyền admin cho email của bạn.)
3. Chạy `npm run build` để kiểm tra, rồi deploy như bình thường.
4. Vào `dopamind.vn/admin` → mục **Nội dung website**.

## Chỉnh được gì
| Khối | Trang |
| --- | --- |
| Thanh thông báo (bật/tắt, đường dẫn khi bấm) | mọi trang |
| Chân trang: câu giới thiệu, bản quyền, link mạng xã hội | mọi trang |
| Banner đầu trang chủ: tiêu đề, mô tả, 2 nút | `/` |
| Trang Nhật ký: đầu trang + danh sách ghi chép | `/nhat-ky` |
| Trang Bài viết: đầu trang, bài nổi bật, danh sách bài, cuối trang | `/bai-viet` |

Mỗi khối có: lưu → website cập nhật ngay, hoàn tác, lịch sử 20 phiên bản, khôi phục nội dung gốc,
cảnh báo khi rời trang mà chưa lưu, tải ảnh lên (JPG/PNG/WebP ≤ 5MB), thêm / xóa / nhân bản / đổi thứ tự mục.
Chưa chỉnh gì thì website hiển thị nội dung gốc như cũ.

## Thêm khối mới sau này
1. Thêm 1 định nghĩa vào `src/lib/cms/sections.ts` (nhãn, các trường, nội dung gốc).
2. Trong component trang web: `const c = await getSection("khoa.moi")` rồi dùng `str(c, "truong")`.
Form admin tự sinh theo định nghĩa.
