-- Khách chỉ đọc bài đã xuất bản, không gọi hàm is_admin() dành cho authenticated.
-- Policy "Admins manage articles" hiện có vẫn cho admin quản lý cả bài nháp.
-- Không cấp quyền execute is_admin cho anon, không thay đổi bất kỳ bài viết nào.
begin;
alter policy "Published articles are public" on public.articles
using (status = 'published');
commit;
