# Bước 3 — Nhóm 1: Thông tin chung / chân trang

## Đã áp dụng

Tại `/admin/noi-dung/global.footer`:

| Ô | Thanh công cụ | Giới hạn |
| --- | --- | --- |
| Câu giới thiệu dưới logo | Đầy đủ, nhiều dòng: font, cỡ, đậm, nghiêng, gạch chân, màu, căn lề, danh sách, link, xóa định dạng | 200 ký tự chữ thật |
| Dòng bản quyền | Rút gọn, một dòng | 120 ký tự chữ thật |
| Tên (Instagram, TikTok...) của mỗi liên kết | Rút gọn, một dòng | 30 ký tự chữ thật |
| Đường dẫn mạng xã hội | Giữ ô nhập thường | Giữ kiểm tra đường dẫn hiện có |

Tất cả vẫn dùng `RichTextEditor` của Bước 2. Thanh công cụ hiện phía trên khi bấm vào ô, ẩn khi bấm ra ngoài; các nút định dạng chữ yêu cầu bôi đen nội dung. Trên màn hình nhỏ, thanh công cụ có thể cuộn bên trong để không bị khuất phía trên.

Các nhóm menu footer cố định, đường dẫn, màu nền, kiểu chữ mặc định, khoảng cách và bố cục footer không được thiết kế lại. Khi nội dung chưa có định dạng, giữ cách xuất chữ cũ; khi người dùng chủ động thêm đoạn, danh sách hoặc đổi cỡ chữ, vùng chữ sẽ hiển thị theo định dạng đó. Nội dung cũ không bị tự cắt khi mở trình soạn thảo.

Luồng lưu, Hoàn tác, lịch sử phiên bản và Khôi phục nội dung gốc trong admin vẫn dùng server action có sẵn. Định dạng của câu giới thiệu, bản quyền và tên mạng xã hội được lọc lúc lưu/đọc và trước khi hiển thị. Tên mỗi mục trong danh sách admin dùng phần chữ thuần để không hiện mã định dạng.

## Cách kiểm tra trên máy

Mở **http://localhost:3001/footer**. Đây là trang thử riêng, không phải admin thật và không ghi database. Các nút chỉ lưu trong bộ nhớ của trang thử; tải lại trang thử sẽ quay về mặc định. Phần xem trước thể hiện nội dung footer, không mô phỏng toàn bộ menu và logo của website.

1. Bấm ô **Câu giới thiệu dưới logo**, bôi đen vài chữ và thử gạch chân, font/cỡ/màu.
2. Thử căn giữa, tạo danh sách và chèn một link bắt đầu bằng `https://` hoặc `/`.
3. Bấm **Lưu thay đổi**, kiểm tra nội dung ở vùng xem trước bên dưới. Danh sách phải có dấu đầu dòng hoặc số, căn lề và link phải được giữ.
4. Thử ô **Dòng bản quyền** và **Tên mạng xã hội**: chỉ có bộ công cụ rút gọn, không có danh sách/link/gạch chân, không xuống dòng.
5. Bấm vào ô **Đường dẫn**: thanh công cụ phải ẩn, ô này vẫn nhập link bình thường.
6. Sau khi lưu, sửa tiếp nội dung rồi bấm **Hoàn tác**: nội dung và định dạng quay lại bản vừa lưu.
7. Bấm **Khôi phục nội dung gốc**: cả form và vùng xem trước trở lại nội dung gốc của bản thử.
8. Thử cửa sổ hẹp/điện thoại: thanh công cụ không tràn ngang; nếu cần có thể cuộn bên trong thanh công cụ.

## Kiểm tra kỹ thuật và giới hạn

- 12 kiểm tra dữ liệu/hiển thị đã vượt qua, gồm tương thích chữ cũ, lọc mã độc, giới hạn ký tự và lưu/đọc cả các mục mạng xã hội.
- 6 kiểm tra trình duyệt Edge đã vượt qua: 3 kiểm tra hồi quy ô thông báo và 3 kiểm tra nhóm footer. Đã kiểm tra gạch chân, căn lề, link, danh sách, bộ đếm, Lưu/Hoàn tác/Khôi phục trong bản thử và màn hình điện thoại 390 px.
- Kiểm tra TypeScript và lint toàn dự án thành công; không có lỗi khoảng trắng trong thay đổi.
- Bản dựng production đầy đủ và việc lưu/đọc database thật chưa được xác nhận vì máy chưa có `.env.local`. Các biến đã có trên Vercel nhưng việc mở giá trị đang chờ người dùng xác minh email.
- Chưa push GitHub, chưa triển khai lên dopamind.vn, chưa ghi hoặc thay thế dữ liệu thật. Chưa áp dụng nhóm Trang chủ, Câu chuyện, Sản phẩm hay Bài viết.

## File sửa trong nhóm này

1. `src/lib/cms/sections.ts` — bật định dạng cho ba loại ô footer đã duyệt.
2. `src/components/layout/Footer.tsx` — hiển thị định dạng ở câu giới thiệu, bản quyền, tên mạng xã hội trên cả mobile và desktop.
3. `src/components/content/FormattedText.tsx` — kiểu danh sách/link/đoạn chỉ trong vùng nội dung nhiều dòng.
4. `src/components/admin/cms/SectionEditor.tsx` — tiêu đề mỗi mục lấy chữ thuần, giữ các thao tác danh sách sẵn có.
5. `src/components/admin/RichTextEditor.tsx` — đếm thống nhất chữ nhiều dòng, không tự cắt dữ liệu cũ, xóa định dạng đoạn và giới hạn thanh công cụ theo chỗ trống.
6. `src/components/admin/RichTextEditor.module.css` — giữ chiều cao mặc định tương đương textarea 4 dòng, cho thanh công cụ cuộn trên màn hình nhỏ.
7. `src/lib/rich-text/content.ts` — lấy chữ thuần của đoạn/danh sách mà không đếm trùng cấu trúc.
8. `tests/rich-text.test.ts` — kiểm tra phạm vi áp dụng và dữ liệu footer.
9. `tests/rich-text.spec.ts` — kiểm tra tương tác nhóm footer và hồi quy thông báo.

## File thêm

1. `tests/rich-text-preview/app/footer/page.tsx` — trang thử riêng nhóm footer.
2. `BUOC-3-NHOM-1-FOOTER.md` — hướng dẫn này.

Không thêm thư viện hoặc thay đổi cấu trúc database ở nhóm này.

**Dừng tại nhóm footer để người dùng kiểm tra trước khi sang nhóm tiếp theo.**
