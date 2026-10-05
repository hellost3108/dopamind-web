"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

/* Cấu trúc menu & class lấy từ AdminNav của melalogy: nhóm có nhãn nhỏ, mục đang chọn nền đỏ,
   trên điện thoại là nút ☰ mở menu trượt từ trái. */

const svg = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const I = {
  dash: svg(<><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>),
  home: svg(<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>),
  note: svg(<><path d="M5 3h10l4 4v14H5z" /><path d="M9 12h6M9 16h6" /></>),
  book: svg(<><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" /><path d="M4 19V5" /></>),
  cog: svg(<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>),
  box: svg(<><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /></>),
  order: svg(<><path d="M6 3h12l2 5H4l2-5z" /><path d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8" /><path d="M9 12h6" /></>),
  tag: svg(<><path d="M20 13l-7 7-10-10V3h7z" /><circle cx="7.5" cy="7.5" r="1" /></>),
  pen: svg(<><path d="M4 20h4l11-11-4-4L4 16z" /><path d="M13 7l4 4" /></>),
};

type Item = { href: string; label: string; icon: ReactNode; exact?: boolean; match?: string };

const GROUPS: { label: string; items: Item[] }[] = [
  { label: "", items: [{ href: "/admin", label: "Content Studio", icon: I.dash, exact: true }] },
  {
    label: "Nội dung website",
    items: [
      { href: "/admin/noi-dung/home.hero", label: "Trang chủ", icon: I.home, match: "/admin/noi-dung/home." },
      { href: "/admin/noi-dung/story.hero", label: "Câu chuyện DOPAMIND", icon: I.book, match: "/admin/noi-dung/story." },
      { href: "/admin/noi-dung/shop.hero", label: "Banner trang sản phẩm", icon: I.box, match: "/admin/noi-dung/shop." },
      { href: "/admin/noi-dung/journal.notes", label: "Trang Nhật ký", icon: I.note, match: "/admin/noi-dung/journal." },
      { href: "/admin/noi-dung/blog.hero", label: "Bố cục trang Bài viết", icon: I.book, match: "/admin/noi-dung/blog." },
      { href: "/admin/noi-dung/global.announcement", label: "Header, footer & chung", icon: I.cog, match: "/admin/noi-dung/global." },
    ],
  },
  { label: "Kho nội dung", items: [{ href: "/admin/bai-viet", label: "Bài viết", icon: I.pen }] },
  {
    label: "Cửa hàng",
    items: [
      { href: "/admin/san-pham", label: "Sản phẩm", icon: I.box },
      { href: "/admin/danh-muc", label: "Danh mục", icon: I.tag },
    ],
  },
  { label: "Vận hành", items: [{ href: "/admin/don-hang", label: "Đơn hàng", icon: I.order }] },
];

export function AdminNav({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (i: Item) =>
    i.exact ? pathname === i.href : i.match ? pathname.startsWith(i.match) : pathname === i.href || pathname.startsWith(`${i.href}/`);

  const nav = (
    <nav className="space-y-5" aria-label="Điều hướng quản trị">
      {GROUPS.map((group) => (
        <div key={group.label || "root"}>
          {group.label && (
            <p className="px-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">{group.label}</p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item) ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive(item) ? "bg-[#f52334] text-white shadow-lg shadow-red-950/20" : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  if (variant === "sidebar") return nav;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-black/15 bg-white lg:hidden" aria-label="Mở menu quản trị">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-label="Đóng menu" />
          <div className="absolute inset-y-0 left-0 w-[min(20rem,85vw)] overflow-y-auto bg-[#191716] p-4 text-white shadow-2xl">
            <div className="mb-5 flex items-center justify-between px-2">
              <span className="font-serif text-xl">Dopamind Admin</span>
              <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10" aria-label="Đóng menu">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}
    </>
  );
}
