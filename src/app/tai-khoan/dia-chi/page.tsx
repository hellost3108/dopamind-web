import type { Metadata } from "next";
import Link from "next/link";
import { AddressManager } from "@/components/account/AddressManager";
import { requireUser } from "@/lib/supabase/dal";
import { listMyAddresses } from "@/lib/supabase/addresses";

export const metadata: Metadata = { title: "Địa chỉ | DOPAMIND" };

const ACCOUNT_NAV = [
  { href: "/tai-khoan", label: "Tài khoản" },
  { href: "/tai-khoan/don-hang", label: "Đơn hàng" },
  { href: "/tai-khoan/dia-chi", label: "Địa chỉ", active: true },
  { href: "/yeu-thich", label: "Yêu thích" },
];

export default async function AddressesPage() {
  await requireUser("/tai-khoan/dia-chi");
  const addresses = await listMyAddresses();

  return (
    <>
      {/* Tiêu đề: cùng kiểu với trang Hồ sơ */}
      <section className="relative overflow-hidden px-[clamp(20px,4vw,64px)] pb-[clamp(40px,5vw,72px)] pt-[clamp(48px,6vw,88px)]">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-80 w-[46rem] max-w-full -translate-x-1/2 rounded-full bg-lavender/50 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-charcoal/25" />
            <p className="text-[10px] font-medium uppercase tracking-[.32em] text-charcoal/55">
              Tài khoản DOPAMIND
            </p>
            <span aria-hidden className="h-px w-10 bg-charcoal/25" />
          </div>
          <h1 className="mt-8 font-serif text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.15] tracking-[-.01em] text-charcoal">
            Địa chỉ
            <br />
            <span className="text-purple">giao hàng.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/60">
            Lưu sẵn địa chỉ để đơn hàng tiếp theo của bạn nhanh hơn.
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

      <section className="px-[clamp(16px,4vw,64px)] pb-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-4xl">
          <AddressManager addresses={addresses} />
        </div>
      </section>
    </>
  );
}
