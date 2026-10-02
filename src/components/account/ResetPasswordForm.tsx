"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthSessionMissingError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { authErrorToVi } from "@/lib/supabase/errors";

const label = "block text-[10px] uppercase tracking-[.16em] text-charcoal/45";
const input =
  "mt-2 min-h-11 w-full border border-charcoal/15 bg-transparent px-4 text-sm text-charcoal outline-none focus:border-charcoal placeholder:text-charcoal/30";
const primaryButton =
  "flex min-h-11 w-full items-center justify-center bg-charcoal px-5 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90 disabled:opacity-50";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Xác nhận mật khẩu không khớp.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (updateError) {
      if (updateError instanceof AuthSessionMissingError) {
        setError(
          "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.",
        );
      } else {
        setError(authErrorToVi(updateError));
      }
      return;
    }

    setSuccess(true);
    router.push("/tai-khoan");
  }

  if (success) {
    return (
      <p className="border-l-2 border-purple pl-3 text-sm leading-relaxed text-charcoal/75">
        Mật khẩu đã được cập nhật. Đang chuyển đến tài khoản của bạn...
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={label} htmlFor="reset-password">
          Mật khẩu mới
        </label>
        <input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
        />
      </div>
      <div>
        <label className={label} htmlFor="reset-confirm-password">
          Xác nhận mật khẩu mới
        </label>
        <input
          id="reset-confirm-password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={input}
        />
      </div>
      {error && (
        <div className="border-l-2 border-peach pl-3 text-sm leading-relaxed text-charcoal">
          <p>{error}</p>
          <Link href="/tai-khoan/quen-mat-khau" className="mt-1 inline-block underline">
            Yêu cầu liên kết mới
          </Link>
        </div>
      )}
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
      </button>
    </form>
  );
}
