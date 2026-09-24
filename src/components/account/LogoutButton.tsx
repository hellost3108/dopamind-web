"use client";

import { useTransition } from "react";
import { signOutAction } from "@/lib/supabase/auth-actions";

export function LogoutButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOutAction())}
      className={className}
    >
      {pending ? "ĐANG ĐĂNG XUẤT..." : "ĐĂNG XUẤT"}
    </button>
  );
}
