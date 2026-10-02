import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Trạm trung chuyển cho mọi link Supabase gửi qua email (đặt lại mật khẩu,
 * xác nhận đăng ký...). Các link đó trỏ về đây kèm ?code=..., route này đổi
 * code thành 1 phiên đăng nhập thật (exchangeCodeForSession — bắt buộc chạy
 * ở server vì cần set cookie), rồi mới chuyển tiếp sang trang đích thật sự
 * (?next=...). Không có bước này, trang đích sẽ luôn thấy "chưa đăng nhập"
 * dù code trên URL còn hợp lệ.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Code thiếu hoặc đã hết hạn/đã dùng — quay lại trang đặt lại mật khẩu,
  // nơi đã có sẵn thông báo "liên kết không hợp lệ" + link yêu cầu lại.
  return NextResponse.redirect(`${origin}/tai-khoan/dat-lai-mat-khau?error=link_invalid`);
}