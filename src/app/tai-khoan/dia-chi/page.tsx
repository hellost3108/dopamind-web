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
    <section className="px-[clamp(20px,4vw,64px)] pb-[clamp(56px,8vw,120px)] pt-[clamp(36px,5vw,72px)]">
      <div className="mx-auto max-w-3xl">
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

        <p className="text-xs uppercase tracking-[.16em] text-charcoal/45">Tài khoản DOPAMIND</p>
        <h1 className="mt-3 text-[clamp(34px,5vw,56px)] font-medium leading-[1.05] tracking-tight text-charcoal">
          Địa chỉ <span className="text-purple">giao hàng.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/55">
          Lưu sẵn địa chỉ để đơn hàng tiếp theo của bạn nhanh hơn.
        </p>

        <div className="mt-10">
          <AddressManager addresses={addresses} />
        </div>
      </div>
    </section>
  );
}
