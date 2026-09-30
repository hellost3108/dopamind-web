"use client";

import { useTransition } from "react";
import { signOutAction } from "@/lib/supabase/auth-actions";
import { clearLocalAccountData } from "@/lib/account-sync";

export function LogoutButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        // Đưa Yêu thích và Giỏ hàng trên máy về 0 (dữ liệu vẫn còn trên tài khoản)
        clearLocalAccountData();
        startTransition(() => signOutAction());
      }}
      className={className}
    >
      {pending ? "ĐANG ĐĂNG XUẤT..." : "ĐĂNG XUẤT"}
    </button>
  );
}
