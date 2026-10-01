"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Ẩn thanh thông báo / header / footer của trang bán hàng khi đang ở khu vực
 * quản trị (/admin) — trang admin có khung riêng.
 */
export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
