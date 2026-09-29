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
      {/* Tiêu đề: cùng kiểu với các trang tài khoản khác */}
      <section className="relative overflow-hidden px-[clamp(20px,4vw,64px)] pb-[clamp(40px,5vw,72px)] pt-[clamp(48px,6vw,88px)]">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-80 w-[46rem] max-w-full -translate-x-1/2 rounded-full bg-lavender/50 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-charcoal/25" />
            <p className="text-[10px] font-medium uppercase tracking-[.32em] text-charcoal/55">
              Danh sách của bạn
            </p>
            <span aria-hidden className="h-px w-10 bg-charcoal/25" />
          </div>
          <h1 className="mt-8 font-serif text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.15] tracking-[-.01em] text-charcoal">
            Để dành một
            <br />
            <span className="text-purple">khoảng nghỉ.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/60">
            Những lựa chọn bạn muốn giữ lại cho ngày cần một nhịp chậm hơn.
          </p>

          <nav aria-label="Tài khoản" className="mt-10 flex flex-wrap justify-center gap-2">
            {ACCOUNT_NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={n.active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full border px-5 text-xs uppercase tracking-[.12em] transition ${
                  n.active
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-charcoal/15 bg-white/60 text-charcoal/60 hover:border-charcoal/40 hover:text-charcoal"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <WishlistPageClient />
    </>
  );
}
