# Bước 3 — Nhóm 2: Trang chủ

## Phạm vi đã làm

Đã áp dụng component `RichTextEditor` chung cho **43 loại ô chữ của 8 khối Trang chủ**. Đây là số loại trường; những trường trong danh sách được áp dụng cho mọi mục hiện có và mục thêm sau này.

| Khối trong admin | Bộ công cụ rút gọn, một dòng | Bộ công cụ đầy đủ, nhiều dòng |
| --- | --- | --- |
| `home.hero` — Banner đầu trang | Dòng nhỏ; tiêu đề dòng 1, dòng 2; chữ nút chính; chữ liên kết phụ | Mô tả ngắn |
| `home.productFamilies` — Dòng sản phẩm | Dòng nhỏ; chữ liên kết; tên mỗi dòng sản phẩm | Tiêu đề; mô tả |
| `home.brandStrip` — Dải thương hiệu | Tiêu đề và mô tả mỗi thông điệp | — |
| `home.scienceEmotion` — DOPA × MIND | Chữ liên kết; tiêu đề mỗi ô DOPA/MIND | Tiêu đề; mô tả; các ý nhỏ mỗi ô |
| `home.skinScience` — Khoa học làn da | Dòng nhỏ; nhãn công dụng; chữ trên nút | Tiêu đề; các công dụng |
| `home.ritual` — Nghi thức 15 phút | Dòng nhỏ; dòng nhỏ khi hoàn tất; nhãn bắt đầu/tạm dừng/tiếp tục/đặt lại; nội dung mỗi lời nhắc | Tiêu đề; mô tả; thông điệp bên phải; lời nhắn khi hoàn tất |
| `home.journal` — Câu chuyện cảm hứng | Tiêu đề; chữ liên kết xem tất cả; chủ đề và tiêu đề mỗi câu chuyện | Mô tả mỗi câu chuyện |
| `home.newsletter` — Đăng ký nhận tin | Tiêu đề; chữ trên nút | Mô tả; lời cảm ơn sau khi gửi |

**Giữ ô thường:** tất cả đường dẫn, đường dẫn ảnh, mô tả ảnh, số thứ tự dải thương hiệu, gợi ý trong ô email. Chưa áp dụng nhóm Câu chuyện DOPAMIND, banner Sản phẩm, Nhật ký/Bài viết hay các module quản trị riêng.

## Các điểm xử lý riêng

- Các ý DOPA/MIND vẫn được tách bằng dấu `|`. Việc tách diễn ra trong phần chữ, giữ định dạng đang kéo dài qua dấu phân cách và không tách dấu `|` nằm trong một địa chỉ link.
- Tiêu đề đang nhiều dòng vẫn cho xuống dòng. HTML hiển thị trong `h1/h2/h3/p/span` được chuyển sang phần tử phrasing hợp lệ, giữ xuống dòng, căn lề và dấu/số của danh sách; không tạo `p` hoặc `div` lồng sai trong heading/đoạn văn.
- Tên/tiêu đề được dùng làm mô tả ảnh dự phòng sẽ lấy phần chữ thuần, tránh lộ mã định dạng trong thuộc tính ảnh.
- Thẻ câu chuyện vẫn giữ khung, ảnh, khoảng cách và vùng bấm. Cấu trúc vùng bấm được tách khỏi phần mô tả để link người dùng chèn trong mô tả có thể bấm riêng, không tạo thẻ `a` lồng nhau.
- Các trạng thái của bộ đếm và lời cảm ơn sau đăng ký đều dùng bộ hiển thị chung. Logic đếm giờ và xử lý đăng ký không được viết lại; phần đăng ký hiện vẫn chỉ đổi trạng thái giao diện như code gốc, không gửi email ra ngoài.
- Nội dung chữ thường cũ và các giá trị mặc định không bị chuyển đổi hàng loạt hoặc ghi đè. Chỉ các ô có cờ định dạng đã duyệt mới dùng trình soạn thảo.

## Cách kiểm tra đơn giản

Mở **http://localhost:3001/home**. Chọn khối tại **Khối Trang chủ** ở đầu trang.

1. Bấm một ô chữ và bôi đen vài chữ. Thử đổi font, cỡ, đậm/nghiêng hoặc màu; ô nhiều dòng có thêm gạch chân, căn lề, danh sách và link.
2. Bấm **Lưu thay đổi**, kéo xuống vùng xem trước. Vùng này dùng chính component hiển thị của website, không phải bản vẽ lại.
3. Có thể bấm **Mở khối ở tab riêng** để xem khối với toàn bộ chiều rộng tab. Khung nhúng trong trang thử có chiều cao cố định nên đôi khi có khoảng trống bên dưới; đây không phải thay đổi bố cục website.
4. Sửa tiếp vài chữ, bấm **Hoàn tác**: nội dung và định dạng quay lại bản vừa lưu. Bấm **Khôi phục nội dung gốc** để xem lại mặc định của khối thử.
5. Chọn lần lượt các khối còn lại. Với DOPA/MIND, thử định dạng cả đoạn có dấu `|` rồi kiểm tra các ý vẫn tách đúng.
6. Với khối Câu chuyện cảm hứng, thử chèn link vào mô tả. Link trong mô tả phải bấm được độc lập với link của cả thẻ.
7. Với Nghi thức 15 phút, lưu rồi thử Bắt đầu → Tạm dừng → Tiếp tục → Đặt lại trong vùng xem trước.
8. Với Đăng ký nhận tin, thử định dạng lời cảm ơn, lưu, rồi nhập email mẫu trong vùng xem trước và bấm nút đăng ký. Lời cảm ơn phải giữ định dạng.
9. Kiểm tra ô đường dẫn, mô tả ảnh, số thứ tự và gợi ý email: không có thanh công cụ.

**Bản thử không ghi database và không cập nhật dopamind.vn.** Nội dung thử chỉ được giữ trong phiên trang, đồng thời gửi tới máy chủ cục bộ để kiểm tra và dựng vùng xem trước. Đổi khối hoặc tải lại trang thử sẽ về mặc định. Bản thử dùng trực tiếp ảnh sẵn có của dự án, không thay hoặc tải ảnh lên hệ thống thật.

Sau khi triển khai vào môi trường có kết nối Supabase, cần kiểm tra thêm lưu → tải lại admin → lịch sử phiên bản → hiển thị trên website thật. Lần làm nhóm này chưa ghi dữ liệu thật hoặc chạy migration.

## Kết quả kiểm tra

- **16 kiểm tra dữ liệu/hiển thị đạt**, gồm 43 trường Trang chủ, dữ liệu mặc định, tương thích chữ cũ, lọc mã độc, tách ý DOPA/MIND và HTML phrasing hợp lệ.
- **17 tình huống trình duyệt đạt**, gồm 6 tình huống hồi quy thông báo/footer; từng khối trong 8 khối Trang chủ; thao tác bộ đếm; màn hình điện thoại; tiêu đề nhiều dòng và danh sách.
- TypeScript, lint toàn dự án và kiểm tra khoảng trắng trong thay đổi đều thành công.
- Bản dựng production đầy đủ và kết nối database thật chưa được xác nhận: máy chưa có `.env.local`; việc đọc giá trị cấu hình Vercel còn chờ xác minh email.
- Chưa push GitHub hoặc triển khai lên website thật. Dừng ở nhóm Trang chủ để người dùng kiểm tra trước khi sang nhóm tiếp theo.

## File sửa trong nhóm này

1. `src/lib/cms/sections.ts` — bật định dạng cho 43 loại ô chữ được duyệt.
2. `src/components/content/FormattedText.tsx` — hỗ trợ nội dung nhiều dòng trong các khung chữ sẵn có.
3. `src/lib/rich-text/content.ts` — tách ý giữ định dạng và tạo HTML phrasing an toàn.
4. `src/components/home/Hero.tsx` — các dòng banner, mô tả và nhãn liên kết.
5. `src/components/home/ProductFamilies.tsx` — nội dung khối dòng sản phẩm và mô tả ảnh dự phòng.
6. `src/components/home/HomeBrandStrip.tsx` — tiêu đề/mô tả thông điệp, giữ số thứ tự.
7. `src/components/home/ScienceEmotionIntro.tsx` — nội dung DOPA/MIND và các ý tách bằng dấu `|`.
8. `src/components/home/SkinScience.tsx` — tiêu đề, nhãn công dụng, công dụng và nhãn nút.
9. `src/components/home/ResetTimer.tsx` — chữ ở các trạng thái bộ đếm và lời nhắc.
10. `src/components/home/JournalStories.tsx` — nội dung thẻ và link riêng trong mô tả.
11. `src/components/home/Newsletter.tsx` — nội dung, nhãn nút và lời cảm ơn; giữ ô email.
12. `tests/rich-text.test.ts` — kiểm tra dữ liệu và phạm vi nhóm Trang chủ.
13. `tests/rich-text.spec.ts` — kiểm tra hiển thị/tương tác bằng component thật.
14. `.gitignore` — bỏ qua liên kết thư mục ảnh phục vụ bản thử cục bộ.

## File thêm

1. `tests/rich-text-preview/app/home/page.tsx` — form thử chọn 8 khối.
2. `tests/rich-text-preview/app/home/actions.tsx` — kiểm tra dữ liệu thử trên máy chủ cục bộ, không lưu DB.
3. `tests/rich-text-preview/app/home/view/page.tsx` — dựng khối bằng component thật của website từ dữ liệu thử đã kiểm tra.
4. `BUOC-3-NHOM-2-TRANG-CHU.md` — hướng dẫn này.

Ngoài ra, `tests/rich-text-preview/public` là liên kết cục bộ đến thư mục `public` có sẵn để bản thử dùng được ảnh. Liên kết này được bỏ qua trong Git; không có ảnh nguồn nào bị sửa. Không thêm thư viện mới hoặc đổi cấu trúc database.
