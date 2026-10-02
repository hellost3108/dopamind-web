"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/account/LogoutButton";

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

const GROUPS = [
  {
    title: "Website",
    items: [
      {
        href: "/admin/noi-dung",
        label: "Nội dung website",
        exact: false,
        icon: icon(<><path d="M4 5h16M4 10h10M4 15h16M4 20h10" /></>),
      },
    ],
  },
  {
    title: "Cửa hàng",
    items: [
      { href: "/admin", label: "Tổng quan", exact: true, icon: icon(<><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>) },
      { href: "/admin/san-pham", label: "Sản phẩm", exact: false, icon: icon(<><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /></>) },
      { href: "/admin/don-hang", label: "Đơn hàng", exact: false, icon: icon(<><path d="M6 3h12l2 5H4l2-5z" /><path d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8" /><path d="M9 12h6" /></>) },
    ],
  },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const items = GROUPS.flatMap((g) => g.items);

  return (
    <aside className="bg-charcoal text-cloud-milk lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:pb-2 lg:pt-8">
        <div>
          <p className="font-serif text-xl tracking-wide">DOPAMIND</p>
          <p className="mt-0.5 text-xs text-lavender/80">Trang quản trị</p>
        </div>
        <Link href="/" className="rounded-lg border border-cloud-milk/20 px-3 py-1.5 text-xs text-cloud-milk/80 transition-colors hover:bg-cloud-milk/10 lg:mt-5 lg:inline-block">
          Xem website
        </Link>
      </div>

      {/* Điện thoại / máy tính bảng: một hàng cuộn ngang */}
      <nav aria-label="Menu quản trị" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:hidden">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm transition-colors ${active ? "bg-lavender text-charcoal" : "text-cloud-milk/75 hover:bg-cloud-milk/10"}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Máy tính: cột dọc, chia nhóm */}
      <nav aria-label="Menu quản trị" className="hidden flex-1 overflow-y-auto px-4 py-6 lg:block">
        {GROUPS.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-2 px-3 text-xs text-cloud-milk/45">{group.title}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-lavender font-medium text-charcoal" : "text-cloud-milk/75 hover:bg-cloud-milk/10 hover:text-cloud-milk"}`}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="hidden border-t border-cloud-milk/10 p-5 lg:block">
        <p className="truncate text-xs text-cloud-milk/55">Đang đăng nhập</p>
        <p className="mb-3 truncate text-sm text-cloud-milk/90">{email}</p>
        <LogoutButton className="text-xs font-medium text-lavender underline-offset-4 hover:underline" />
      </div>
    </aside>
  );
}
