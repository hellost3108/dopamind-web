"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/account/LogoutButton";

const ITEMS = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/noi-dung", label: "Nội dung website", exact: false },
  { href: "/admin/san-pham", label: "Sản phẩm", exact: false },
  { href: "/admin/don-hang", label: "Đơn hàng", exact: false },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-charcoal/10 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-5 pt-5 lg:block lg:px-6 lg:pt-8">
        <div>
          <p className="font-serif text-xl tracking-wide text-charcoal">DOPAMIND</p>
          <p className="text-[10px] font-medium uppercase tracking-[.28em] text-purple">Quản trị</p>
        </div>
        <Link href="/" className="text-xs text-charcoal/55 underline-offset-4 hover:underline lg:mt-4 lg:inline-block">
          ← Xem trang web
        </Link>
      </div>

      <nav aria-label="Menu quản trị" className="flex gap-1 overflow-x-auto px-3 py-3 lg:mt-6 lg:flex-1 lg:flex-col lg:px-4">
        {ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm transition-colors ${
                active ? "bg-lavender/60 font-medium text-charcoal" : "text-charcoal/65 hover:bg-charcoal/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-charcoal/10 p-5 lg:block">
        <p className="mb-3 truncate text-xs text-charcoal/55">{email}</p>
        <LogoutButton className="text-[11px] font-medium tracking-[.14em] text-charcoal/70 underline-offset-4 hover:underline" />
      </div>
    </aside>
  );
}
