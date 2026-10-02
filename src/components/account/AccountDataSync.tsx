"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startAccountSync, syncSession } from "@/lib/account-sync";

/** Không hiển thị gì, chỉ đồng bộ Yêu thích và Giỏ hàng theo tài khoản. */
export function AccountDataSync() {
  const pathname = usePathname();

  useEffect(() => {
    startAccountSync();
  }, []);

  useEffect(() => {
    void syncSession();
  }, [pathname]);

  return null;
}
