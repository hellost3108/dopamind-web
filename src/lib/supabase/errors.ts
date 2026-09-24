import { AuthApiError } from "@supabase/supabase-js";

/** Generic fallback — never surface a raw Supabase/Postgres error to the customer. */
export const GENERIC_ERROR_VI = "Không thể hoàn tất yêu cầu lúc này. Vui lòng thử lại.";

/**
 * Translates a handful of known, safe-to-disclose Supabase Auth error codes
 * into natural Vietnamese. Anything unrecognized falls back to the generic
 * message so internal error detail never reaches the customer.
 */
export function authErrorToVi(error: unknown): string {
  if (error instanceof AuthApiError) {
    switch (error.code) {
      case "user_already_exists":
      case "email_exists":
        return "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.";
      case "email_address_invalid":
        return "Địa chỉ email này không hợp lệ. Vui lòng dùng email khác.";
      case "invalid_credentials":
        return "Email hoặc mật khẩu không đúng.";
      case "email_not_confirmed":
        return "Vui lòng xác nhận email trước khi đăng nhập.";
      case "weak_password":
        return "Mật khẩu chưa đủ mạnh. Vui lòng chọn mật khẩu khác.";
      case "over_email_send_rate_limit":
      case "over_request_rate_limit":
        return "Bạn vừa thử quá nhiều lần. Vui lòng đợi một chút rồi thử lại.";
      case "same_password":
        return "Mật khẩu mới phải khác mật khẩu hiện tại.";
      default:
        return GENERIC_ERROR_VI;
    }
  }
  return GENERIC_ERROR_VI;
}
