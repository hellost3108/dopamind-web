# Bước 2 — Thử thanh công cụ ở Nội dung thông báo

## Phạm vi

Chỉ bật trình soạn thảo mới cho `/admin/noi-dung/global.announcement`, ô **Nội dung thông báo**. Chưa áp dụng sang nhóm trang khác. Chưa đẩy mã lên GitHub hoặc triển khai lên dopamind.vn. Chưa ghi dữ liệu vào Supabase.

Dùng TipTap vì phù hợp React/Next.js, cho phép giữ kiểu dáng ô hiện tại và dùng một component cho cả bản một dòng lẫn nhiều dòng. Tài liệu: https://tiptap.dev/docs/editor/getting-started/install/nextjs.

Component chung có hai chế độ. Ô thông báo dùng chế độ một dòng: font, cỡ, đậm, nghiêng, màu và xóa định dạng. Có 20 font hỗ trợ tiếng Việt, gồm các font website hiện dùng; chỉ yêu cầu tải family khi dùng, có `subset=vietnamese`. Bộ đếm đếm ký tự chữ tiếng Việt, không đếm mã định dạng.

Nội dung cũ được giữ dưới dạng chữ thường; không chạy chuyển đổi dữ liệu hàng loạt. Định dạng mới có nhãn phiên bản riêng trong cùng giá trị chuỗi của ô. Lọc thẻ, thuộc tính, màu, cỡ và font được phép khi lưu và trước khi hiển thị. Luồng phân quyền, lưu phiên bản, Hoàn tác và Khôi phục nội dung gốc của CMS vẫn dùng các action hiện có.

## Cách kiểm tra đơn giản

Mở **http://localhost:3001** trên máy này khi bản thử đang chạy. Đây là trang thử riêng, không cần tài khoản admin và không kết nối database. Các nút trên trang chỉ thay đổi bản thử trong bộ nhớ; tải lại trang thử sẽ về nội dung ban đầu.

1. Bấm vào ô **Nội dung thông báo**: thanh công cụ xuất hiện ngay phía trên.
2. Bôi đen vài chữ, thử đổi font, cỡ, đậm, nghiêng và màu. Chỉ phần bôi đen phải thay đổi.
3. Bấm ô đường dẫn bên dưới: thanh công cụ phải ẩn. Ô đường dẫn vẫn là ô nhập thường.
4. Bấm **Lưu thay đổi**: vùng xem trước bên dưới hiển thị định dạng đã lưu trong bản thử.
5. Sửa tiếp vài chữ rồi bấm **Hoàn tác**: phải quay lại nội dung và định dạng vừa lưu.
6. Bấm **Khôi phục nội dung gốc**: cả ô và vùng xem trước quay về thông báo gốc của bản thử.
7. Thử Enter, Shift+Enter và dán nhiều dòng: ô vẫn chỉ có một dòng nội dung. Chữ dài có thể cuộn ngang giống ô một dòng thông thường.
8. Thử nhập hơn 140 ký tự: không được vượt giới hạn. Đổi định dạng không làm tăng bộ đếm.
9. Thử trên cửa sổ hẹp/điện thoại: thanh công cụ phải nằm trên ô và không tràn ngang.

Sau khi bản thay đổi được triển khai vào môi trường có cấu hình Supabase, cần kiểm tra lại tại trang admin thật: lưu, tải lại trang, lịch sử phiên bản, Hoàn tác, Khôi phục và thanh thông báo trên website. Các thao tác này có thể cập nhật nội dung thật; bản thử tại localhost không làm việc đó.

## Kiểm tra đã chạy

- 10 kiểm tra dữ liệu/hiển thị đã vượt qua: chữ cũ, định dạng, ký tự tiếng Việt, 140/141 ký tự, lọc mã độc/CSS/URL, dán nhiều dòng, danh sách font, chỉ bật đúng ô thử nghiệm và hiển thị từ máy chủ.
- 3 kiểm tra trình duyệt Edge đã vượt qua: vùng chọn, font/cỡ/màu, lưu trong bản thử, Hoàn tác, Khôi phục, giữ viền/bo góc/kích thước mặc định, chặn Enter, dán nội dung và bố trí màn hình 390 px.
- TypeScript, lint toàn dự án và kiểm tra khoảng trắng trong thay đổi đều thành công ở lượt kiểm tra cuối.
- Bản dựng production đã biên dịch và vượt kiểm tra TypeScript, sau đó dừng khi thu thập dữ liệu trang vì bản sao dự án thiếu `NEXT_PUBLIC_SUPABASE_URL`. Chưa có cấu hình Supabase nên chưa kiểm tra ghi/đọc database thật hoặc khẳng định build production hoàn tất.
- Ngày 27/10/2026 đã kiểm tra trực tiếp trang Environment Variables của dự án Vercel đang đăng nhập: có đủ `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`, cả hai áp dụng **All Environments**. Website trên Vercel có khai báo cấu hình; bản sao trên máy chưa có `.env.local`. Các nút mở giá trị chưa trả về dữ liệu trong phiên trình duyệt điều khiển nên chưa lấy được giá trị, chưa tạo `.env.local` và chưa chạy lại build. Không sửa cấu hình Vercel hoặc dữ liệu website trong lần kiểm tra này.

## File đã sửa

1. `package.json` — thư viện và lệnh kiểm tra/bản thử.
2. `package-lock.json` — khóa phiên bản thư viện.
3. `src/lib/cms/types.ts` — cờ bật định dạng theo từng ô.
4. `src/lib/cms/sections.ts` — chỉ bật cờ ở ô thông báo.
5. `src/lib/cms/fields.ts` — kiểm tra chữ thật và lọc định dạng lúc lưu/đọc.
6. `src/components/admin/cms/SectionEditor.tsx` — dùng component chung khi ô được bật định dạng.
7. `src/components/layout/AnnouncementBar.tsx` — hiển thị định dạng đã lọc cho thông báo.
8. `.gitignore` — bỏ qua kết quả chạy thử và file tự sinh.
9. `eslint.config.mjs` — không kiểm tra các file tự sinh của trang thử.
10. `tsconfig.json` — loại các kiểu tự sinh của trang thử khỏi dự án chính.

## File đã thêm

1. `src/components/admin/RichTextEditor.tsx` — component chung, hai chế độ công cụ.
2. `src/components/admin/RichTextEditor.module.css` — CSS riêng cho thanh công cụ và vùng soạn thảo.
3. `src/components/content/FormattedText.tsx` — bộ hiển thị định dạng đã lọc, dùng chung.
4. `src/lib/rich-text/content.ts` — đọc/lưu/lọc định dạng và đếm ký tự.
5. `src/lib/rich-text/fonts.ts` — 20 font được phép và tải font theo nhu cầu.
6. `tests/rich-text.test.ts` — kiểm tra dữ liệu và an toàn.
7. `tests/rich-text.spec.ts` — kiểm tra thao tác trên trình duyệt.
8. `playwright.config.ts` — cấu hình kiểm tra Edge.
9. `tests/rich-text-preview/app/page.tsx` — trang thử độc lập, không ghi database.
10. `tests/rich-text-preview/app/layout.tsx` — khung trang thử.
11. `tests/rich-text-preview/app/preview.css` — dùng CSS dự án cho bản thử.
12. `tests/rich-text-preview/next.config.ts` — cấu hình tách biệt trang thử.
13. `tests/rich-text-preview/tsconfig.json` — cấu hình TypeScript trang thử.
14. `BUOC-2-THU-THANH-CONG-CU.md` — hướng dẫn này.

## Lệnh dành cho người triển khai

Tại thư mục gốc dự án:

```sh
npm install
npm run test:rich-text
npm run lint
npm run preview:rich-text
```

Mở cửa sổ lệnh khác để chạy `npm run test:rich-text:ui`. Lệnh kiểm tra giao diện dùng Edge đã cài trên Windows; có thể đổi channel trong `playwright.config.ts` nếu môi trường dùng trình duyệt khác.

Để dựng website chính cần cấu hình Supabase như `.env.example`, rồi chạy `npm run build`. Không thay đổi cơ sở dữ liệu hoặc chạy migration cho bước thử nghiệm này.

**Dừng sau Bước 2 để người dùng kiểm tra; chưa triển khai Bước 3.**
