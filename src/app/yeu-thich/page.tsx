import type { Metadata } from "next";
import Link from "next/link";
import { WishlistPageClient } from "@/components/pages/CommercePages";

export const metadata: Metadata = { title: "Yêu thích | DOPAMIND" };

const ACCOUNT_NAV = [
  { href: "/tai-khoan", label: "Tài khoản" },
  { href: "/tai-khoan/don-hang", label: "Đơn hàng" },
  { href: "/tai-khoan/dia-chi", label: "Địa chỉ" },
  { href: "/yeu-thich", label: "Yêu thích", active: true },
];

export default function WishlistPage() {
  return (
    <>
      <section className="px-[clamp(20px,4vw,64px)] pb-6 pt-[clamp(36px,5vw,72px)]">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Tài khoản" className="mb-10 flex flex-wrap gap-2">
            {ACCOUNT_NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={n.active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full border px-5 text-xs uppercase tracking-[.12em] transition ${
                  n.active
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-charcoal/15 text-charcoal/60 hover:border-charcoal/40 hover:text-charcoal"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs uppercase tracking-[.16em] text-charcoal/45">Danh sách của bạn</p>
          <h1 className="mt-3 text-[clamp(34px,5vw,56px)] font-medium leading-[1.05] tracking-tight text-charcoal">
            Để dành một <span className="text-purple">khoảng nghỉ.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/55">
            Những lựa chọn bạn muốn giữ lại cho ngày cần một nhịp chậm hơn.
          </p>
        </div>
      </section>
      <WishlistPageClient />
    </>
  );
}
